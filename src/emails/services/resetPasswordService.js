const { sendMail } = require("../emailService");

async function sendResetPasswordMail({ to, link, username }) {
  return await sendMail({
    to,
    subject: "Reset Your Password",
    template: "resetPassword",
    data: {
      link,
      username,
    },
  });
}

module.exports = sendResetPasswordMail;
