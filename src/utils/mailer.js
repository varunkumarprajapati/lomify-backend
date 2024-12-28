require("dotenv").config();
const { createTransport } = require("nodemailer");

const transporter = createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USERNAME,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const mailer = async (to, subject, html, text) => {
  const info = await transporter.sendMail({
    from: "testrobber@gmail.com",
    to,
    subject,
    html,
    text,
  });

  console.log("Email Sent Successfully:", info.envelope);
};

module.exports = mailer;
