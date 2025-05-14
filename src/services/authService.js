const crypto = require("crypto");
const createHttpError = require("http-errors");
const { Forbidden, NotFound } = require("http-errors");
const User = require("../models/User");
const { sendVerificationMail, sendResetPasswordMail } = require("../emails");
const { createToken } = require("../utils/tokenUtils");

exports.createUser = async ({ email, username, name, password }) => {
  const { token, hashedToken } = createToken();
  const user = await User.create({
    email,
    username,
    name,
    password,
    emailVerification: {
      token: hashedToken,
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    },
  });

  const link = this.createVerifyEmailLink(token);
  await sendVerificationMail({ link, to: user.email, username: user.username });

  return user;
};
exports.confirmEmail = async (token) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
  const user = await User.findOne({
    "emailVerification.token": hashedToken,
    "emailVerification.expiry": { $gt: Date.now() },
  });

  if (!user) {
    throw createHttpError(
      410,
      "This link has expired. Please request a new one."
    );
  }

  user.isVerified = true;
  user.emailVerification = undefined;
  await user.save();
};
exports.login = async (data) => {
  const user = await User.findByCredentials(data);
  const loginToken = await user.generateAuthToken();

  if (!user.isVerified) {
    const { hashedToken, token } = createToken();
    const link = this.createVerifyEmailLink(token);

    user.emailVerification = {
      token: hashedToken,
      expiry: new Date(Date.now() + 24 * 60 * 60 * 1000),
    };

    await user.save();

    await sendVerificationMail({
      link,
      to: user.email,
      username: user.username,
    });

    throw Forbidden("Please verify your email.");
  }

  return { user, token: loginToken };
};
exports.logout = async (_id) => {
  const user = await User.findById(_id);
  user.token = undefined;
  await user.save();
};
exports.forgotPassword = async (email) => {
  const user = await User.findOne({ email });
  if (!user) throw new NotFound("User not found with given email");

  const { token, hashedToken } = createToken();

  user.resetPassword = {
    token: hashedToken,
    expiry: new Date(Date.now() + 15 * 60 * 1000),
  };

  await user.save();
  await sendResetPasswordMail({
    to: user.email,
    username: user.username,
    link: `${process.env.CLIENT_URL}/api/auth/reset-password/${token}`,
  });
};
exports.resetPassword = async (token, password) => {
  const hashedToken = crypto.createHash("sha256").update(token).digest("hex");

  const user = await User.findOne({
    "resetPassword.token": hashedToken,
    "resetPassword.expiry": { $gt: Date.now() },
  });

  if (!user) {
    throw createHttpError(
      410,
      "This link has expired. Please request a new one."
    );
  }

  user.password = password;
  user.resetPassword = undefined;
  await user.save();
};

exports.createVerifyEmailLink = (token) => {
  return `${process.env.CLIENT_URL}/api/auth/confirm-email/${token}`;
};
