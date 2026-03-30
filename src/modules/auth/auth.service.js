const crypto = require("crypto");
const createHttpError = require("http-errors");
const { Forbidden } = require("http-errors");
const User = require("../../models/user.model");
const { createToken } = require("../../utils/tokenUtils");
const { OAuth2Client } = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

const { addEmailToQueue } = require("./auth.queue");
const { MAIL_JOBS } = require("./auth.constant");
const { redis } = require("../../database/redis");

const { generateTokens } = require("../../helpers/jwtStore");

class AuthService {
  async createUser({ email, username, name, password }) {
    let user = await User.findOne({ email: email });

    if (user && user.isVerified) {
      throw new createHttpError(409, "User already exist");
    }

    const { token, hashedToken } = createToken();

    if (user) {
      Object.assign(user, { email, username, name, password });
    } else {
      user = await User.create({
        email,
        username,
        name,
        password,
      });
    }

    await redis.set(
      `auth:verify:${hashedToken}`,
      user._id.toString(),
      "EX",
      24 * 60 * 60 * 1000,
    );

    await addEmailToQueue(MAIL_JOBS.VERIFICATION_EMAIL, {
      link: `${process.env.CLIENT_URL}/verify-email/${token}`,
      to: user.email,
      username: user.username,
    });
  }

  async verifyEmailByToken(token) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const userId = await redis.getdel(`auth:verify:${hashedToken}`);
    if (!userId) throw createHttpError(410, "Link is already used or expired");
    const user = await User.findById(userId);
    user.isVerified = true;
    await user.save();
  }

  async login(data) {
    const user = await User.findByCredentials(data);
    const tokens = await generateTokens(user._id);

    await redis.set(
      `sessions:access:${user._id}:${tokens.accessJti}`,
      "active",
      "EX",
      Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    );

    await redis.set(
      `sessions:refresh:${user._id}:${tokens.refreshJti}`,
      "active",
      "EX",
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  }

  async forgotPassword(email) {
    const user = await User.findOne({ email });
    if (!user) return;

    const { token, hashedToken } = createToken();

    await redis.set(
      `auth:forgot_password:${hashedToken}`,
      email,
      "EX",
      15 * 60 * 60 * 1000,
    );

    await addEmailToQueue(MAIL_JOBS.FORGOT_PASSWORD_EMAIL, {
      to: user.email,
      username: user.username,
      link: `${process.env.CLIENT_URL}/reset-password/${token}`,
    });
  }

  async resetPassword(token, password) {
    const hashedToken = crypto.createHash("sha256").update(token).digest("hex");
    const email = await redis.getdel(`auth:forgot_password:${hashedToken}`);

    if (!email) throw createHttpError(410, "This link has expired.");
    const user = await User.findOne({ email });

    user.password = password;
    await user.save();
  }

  googleLogin = async (googleToken) => {
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

    const tokens = await generateTokens(user._id);

    await redis.set(
      `sessions:access:${user._id}:${tokens.accessJti}`,
      "active",
      "EX",
      Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    );

    await redis.set(
      `sessions:refresh:${user._id}:${tokens.refreshJti}`,
      "active",
      "EX",
      Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    );

    return {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    };
  };
}

module.exports = new AuthService();
