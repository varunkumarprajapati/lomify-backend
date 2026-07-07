import type { Request, Response } from "express";
import authService from "./auth.service.js";

import jwt, { type JwtPayload } from "jsonwebtoken";
import createHttpError from "http-errors";
import redisClient from "@/config/redis.js";
import { loginSchema, registerSchema, verifyOtpSchema } from "./auth.schema.js";

class AuthController {
  private isProd = process.env.NODE_ENV === "production";

  constructor() {
    this.login = this.login.bind(this);
  }

  async register(req: Request, res: Response) {
    const validatedData = await registerSchema.parseAsync(req.body);
    await authService.register(validatedData);
    return res.status(201).json({ message: "User created successfully" });
  }

  async verifyOtp(req: Request, res: Response) {
    const validatedData = await verifyOtpSchema.parseAsync(req.body);
    await authService.verifyOtp(validatedData);
    return res.json({
      message: "User verified successfully",
    });
  }

  async login(req: Request, res: Response) {
    const validatedData = await loginSchema.parseAsync(req.body);
    const { accessToken, refreshToken } = await authService.login(
      validatedData.email,
      validatedData.password,
    );

    return res.json({
      data: { accessToken, refreshToken },
      message: "User authenticated successfully",
    });

    // const clientPlatform = req.headers["x-platform"];

    // switch (clientPlatform) {
    //   case "android":
    //     return res.json({
    //       data: { accessToken, refreshToken },
    //       message: "User authenticated successfully",
    //     });

    //   case "ios":
    //     return res.json({
    //       data: { accessToken, refreshToken },
    //       message: "User authenticated successfully",
    //     });

    //   default:
    //     res.cookie("void_access_token", accessToken, {
    //       maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
    //       secure: this.isProd,
    //       sameSite: this.isProd ? "strict" : "lax",
    //       path: "/",
    //       httpOnly: true,
    //     });

    //     res.cookie("void_refresh_token", refreshToken, {
    //       maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
    //       secure: this.isProd,
    //       sameSite: this.isProd ? "strict" : "lax",
    //       path: "/",
    //       httpOnly: true,
    //     });

    //     return res.json({ message: "User authenticated successfully" });
    // }
  }

  async validate(req: Request, res: Response) {
    const token = req.headers["authorization"]?.replace("Bearer ", "");
    if (!token) throw createHttpError(401);

    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY) as JwtPayload;

    const sessionKey = `auth:session:access:${decoded?.jti}`;
    const isValidSession = await redisClient.get(sessionKey);

    if (!isValidSession) throw createHttpError(401);

    res.setHeader("X-User-Id", decoded.sub as string);
    res.setHeader("X-JTI", decoded.jti as string);
    return res.sendStatus(200);
  }

  async refresh(req: Request, res: Response) {
    const refreshToken = req.headers["x-refresh"] as string;
    if (!refreshToken) {
      throw createHttpError(400, "Refresh token not provided");
    }
    const tokens = await authService.refresh(refreshToken);
    return res
      .status(201)
      .json({ message: "new session created", data: { ...tokens } });
  }

  async logout(req: Request, res: Response) {
    const accessJTI = req.headers["x-jti"] as string;
    const userId = req.headers["x-user-id"] as string;
    const refreshToken = req.headers["x-refresh"] as string;

    await authService.logout({ userId, accessJTI, refreshToken });
    return res.json({ message: "logout successfully" });
  }
}

export default AuthController;
