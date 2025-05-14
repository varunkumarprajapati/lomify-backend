const { sendMail } = require("../emailService");

async function sendVerificationMail({ to, link, username }) {
  await sendMail({
    to,
    subject: "Email Verification - Please Verify Your Email Address",
    template: "emailVerification",
    data: { link, username },
  });
}

module.exports = sendVerificationMail;
