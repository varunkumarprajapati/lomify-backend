import redisClient from "@/config/redis.js";
import mailer from "../email/mailer.js";
import createHttpError from "http-errors";

import userService from "../user/user.service.js";

import jwtStore from "@/utils/jwtStore.js";

class AuthService {
  async register(payload: AuthRegisterDTO) {
    const { email } = await userService.create(payload as UserCreateDTO);

    let otp = "123456";
    if (process.env.NODE_ENV == "production") {
      otp = Math.floor(100000 + Math.random() * 900000).toString();
    }

    await redisClient.set(`auth:otp:${email}`, otp, "PX", 600000);
    await mailer.sendMail({
      data: { email: email, otp: otp },
      subject: "OTP Verification",
      template: "otp",
      to: email,
    });
  }

  async verifyOtp(payload: AuthVerifyOtpDTO) {
    const { email, otp } = payload;
    const otpKey = `auth:otp:${email}`;
    const attemptKey = `auth:otp:attempts:${email}`;

    const storedOtp = await redisClient.get(otpKey);
    if (!storedOtp) {
      throw createHttpError(410, "OTP Expired or invalid");
    }

    if (otp !== Number(storedOtp)) {
      const attempts = await redisClient.incr(attemptKey);

      if (attempts === 1) {
        await redisClient.expire(attemptKey, 300);
      }

      if (attempts >= 5) {
        await redisClient.del(otpKey);
        await redisClient.del(attemptKey);
        throw createHttpError(
          429,
          "Too many failed attempts. This OTP has been permanently invalidated.",
        );
      }

      throw createHttpError(
        400,
        `Incorrect OTP. ${5 - attempts} attempts remaining.`,
      );
    }

    await redisClient.del(otpKey);
    await redisClient.del(attemptKey);

    await userService.markedAsVerified(email);
  }

  async #createSession(userId: string) {
    const accessExpiry = Number(process.env.ACCESS_TOKEN_EXPIRES_IN);
    const refreshExpiry = Number(process.env.REFRESH_TOKEN_EXPIRES_IN);

    const access = jwtStore.generateAccessToken({
      sub: userId,
    });
    const refreshToken = jwtStore.generateRefreshToken();

    const accessRedisKey = `auth:session:access:${access.accessJTI}`;
    const refreshRedisKey = `auth:session:refresh:${refreshToken}`;
    const userSetKey = `user:${userId}:sessions`;

    await redisClient.set(accessRedisKey, userId, "PX", accessExpiry);
    await redisClient.set(refreshRedisKey, userId, "PX", refreshExpiry);
    await redisClient.sadd(userSetKey, [accessRedisKey, refreshRedisKey]);
    await redisClient.expire(userSetKey, refreshExpiry);

    return { accessToken: access.accessToken, refreshToken };
  }

  async login(email: string, password: string) {
    const user = await userService.findUserByCred(email, password);
    return await this.#createSession(user._id.toString());
  }

  async refresh(refreshToken: string) {
    const refreshRedisKey = `auth:session:refresh:${refreshToken}`;
    try {
      const userId = await redisClient.getdel(refreshRedisKey);
      if (!userId) {
        throw createHttpError(401, "Refresh token expired");
      }

      return await this.#createSession(userId);
    } catch (error) {
      await redisClient.del(refreshRedisKey);
      throw createHttpError(401, "Refresh token expired");
    }
  }

  async logout(payload: LogoutPayload) {
    const accessRedisKey = `auth:session:access:${payload.accessJTI}`;
    const refreshRedisKey = `auth:session:refresh:${payload.refreshToken}`;
    const userSetKey = `user:${payload.userId}:sessions`;

    await redisClient.del(accessRedisKey);
    await redisClient.del(refreshRedisKey);

    await redisClient.srem(userSetKey, [accessRedisKey, refreshRedisKey]);
  }
}

export default new AuthService();
