const {
  createUser,
  verifyEmailByToken,
  login,
  logout,
  forgotPassword,
  resetPassword,
  googleLogin,
} = require("../services/authService");

exports.createUser = async (req, res) => {
  await createUser(req.body);
  res.status(204).send();
};
exports.verifyEmail = async (req, res) => {
  await verifyEmailByToken(req.params.token);
  res.status(204).send();
};
exports.login = async (req, res) => {
  const { token } = await login(req.body);
  const isProd = process.env.NODE_ENV === "production" ? true : false;

  res.cookie("access_token", token, {
    httpOnly: true,
    sameSite: isProd ? "None" : "Lax",
    secure: isProd,
  });

  res.status(204).send();
};
exports.logout = async (req, res) => {
  await logout(req.user._id);

  res.clearCookie("access_token", {
    httpOnly: true,
    sameSite: "None",
    secure: true,
  });

  res.status(204).send();
};
exports.forgotPassword = async (req, res) => {
  await forgotPassword(req.query.email);
  res.status(204).send();
};

exports.resetPassword = async (req, res) => {
  await resetPassword(req.params.token, req.body.password);
  res.status(204).send();
};

exports.googleAuth = async (req, res) => {
  try {
    const { token } = req.body;
    const { user, token: jwtToken } = await googleLogin(token);

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
