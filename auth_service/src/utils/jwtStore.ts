import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";
import crypto from "node:crypto";

class JWTStore {
  generateAccessToken({ sub }: { sub: string }) {
    const accessJTI = uuidv4();
    const accessToken = jwt.sign(
      { sub, jti: accessJTI },
      process.env.JWT_SECRET_KEY,
      {
        expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
      },
    );
    return { accessJTI, accessToken };
  }

  generateRefreshToken() {
    const refreshToken = crypto.randomBytes(32).toString("hex");
    return refreshToken;
  }
}
export default new JWTStore();
