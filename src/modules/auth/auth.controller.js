const jwt = require("jsonwebtoken");
const authService = require("./auth.service");

const { redis } = require("../../database/redis");

exports.createUser = async (req, res) => {
  await authService.createUser(req.body);
  return res.status(201).json({ message: "User created successfully" });
};

exports.verifyEmail = async (req, res) => {
  await verifyEmailByToken(req.params.token);
  return res.status(200).json({ message: "Email verified Successfully" });
};

exports.login = async (req, res) => {
  const { accessToken, refreshToken } = await authService.login(req.body);
  const isProd = process.env.NODE_ENV === "production" ? true : false;

  res.cookie("lomify_access_token", accessToken, {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    maxAge: Number(process.env.ACCESS_TOKEN_EXPIRES_IN),
  });

  res.cookie("lomify_refresh_token", refreshToken, {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
    maxAge: Number(process.env.REFRESH_TOKEN_EXPIRES_IN),
  });

  return res.json({ message: "user authenticated successfully" });
};

exports.logout = async (req, res) => {
  const isProd = process.env.NODE_ENV === "production" ? true : false;

  await redis.del(`sessions:access:${req.user._id}:${req.user.jti}`);

  let refreshToken = req.cookies.lomify_refresh_token;

  if (refreshToken) {
    const { sub, jti } = jwt.verify(refreshToken, process.env.JWT_SECRET_KEY);
    await redis.del(`sessions:refresh:${sub}:${jti}`);
  }

  res.clearCookie("lomify_access_token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: true,
  });

  res.clearCookie("lomify_refresh_token", {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: true,
  });

  return res.json({ message: "logout successfully" });
};

exports.forgotPassword = async (req, res) => {
  await authService.forgotPassword(req.query.email);
  return res.json();
};

exports.resetPassword = async (req, res) => {
  await authService.resetPassword(req.params.token, req.body.password);
  return res.json({ message: "password reset successfully" });
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const { user, token: jwtToken } = await authService.googleLogin(token);

    // Send cookie (secure, httpOnly)
    res.cookie("access_token", jwtToken, {
      httpOnly: true,
      secure: true, // true if using https (Vercel/Render)
      sameSite: "none", // for cross-domain
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      success: true,
      message: "Google login successful",
      token: jwtToken,
      user,
    });
  } catch (error) {
    console.error("Google Auth Error:", error);
    res
      .status(401)
      .json({ success: false, message: "Google authentication failed" });
  }
};
