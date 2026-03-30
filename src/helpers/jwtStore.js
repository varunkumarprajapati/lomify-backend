import jwt from "jsonwebtoken";
import { v4 as uuid4 } from "uuid";

export const generateTokens = async (userId) => {
  const accessJti = uuid4();
  const refreshJti = uuid4();

  const accessToken = jwt.sign(
    { sub: userId, jti: accessJti },
    process.env.JWT_SECRET_KEY,
    { expiresIn: Number(process.env.ACCESS_TOKEN_EXPIRES_IN) },
  );

  const refreshToken = jwt.sign(
    { sub: userId, jti: refreshJti },
    process.env.JWT_SECRET_KEY,
    { expiresIn: Number(process.env.REFRESH_TOKEN_EXPIRES_IN) },
  );

  return { accessToken, refreshToken, accessJti, refreshJti };
};
