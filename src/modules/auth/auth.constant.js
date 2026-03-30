const MAIL_JOBS = {
  VERIFICATION_EMAIL: "verify-email",
  WELCOME_EMAIL: "welcome-email",
  FORGOT_PASSWORD_EMAIL: "forgot-password-email",
};

const EXPIRY = {
  VERIFICATION_LINK_EXPIRE_IN: 24 * 60 * 60 * 1000,
  FORGOT_PASSWORD_LINK_EXPIRE_IN: 15 * 60 * 60 * 1000,
};

module.exports = { MAIL_JOBS, EXPIRY };
