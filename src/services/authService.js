const crypto = require("crypto");
const createHttpError = require("http-errors");
const { Forbidden } = require("http-errors");
const User = require("../models/User");
const { sendVerificationMail, sendResetPasswordMail } = require("../emails");
const { createToken } = require("../utils/tokenUtils");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

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
exports.verifyEmailByToken = async (token) => {
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

    throw new Forbidden("Please verify your email.");
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
  if (!user) return;

  const { token, hashedToken } = createToken();

  user.resetPassword = {
    token: hashedToken,
    expiry: new Date(Date.now() + 15 * 60 * 1000),
  };

  await user.save();
  await sendResetPasswordMail({
    to: user.email,
    username: user.username,
    link: `${process.env.CLIENT_URL}/reset-password/${token}`,
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
  return `${process.env.CLIENT_URL}/verify-email/${token}`;
};

exports.googleLogin = async (googleToken) => {
  const ticket = await client.verifyIdToken({
    idToken: googleToken.token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });

  const payload = ticket.getPayload();

  let user = await User.findOne({ email: payload.email });

  if (!user) {
    const baseUsername = payload.email.split("@")[0];
    const username = `${baseUsername}_${Math.floor(Math.random() * 10000)}`;

    user = await User.create({
      name: payload.name,
      username,
      email: payload.email,
      isVerified: payload.email_verified || false,
      authType: "google",
    });
  }

  // Use model method
  const jwtToken = await user.generateAuthToken();

  return { user: user.toJSON(), token: jwtToken };
};
