const tp = require("../utils/mailer");
const renderTemplate = require("./renderTemplate");

exports.sendMail = async ({ to, subject, template, data }) => {
  const html = await renderTemplate(template, data);
  const info = await tp.sendMail({
    from: process.env.EMAIL_ID,
    to,
    subject,
    html,
  });

  return info;
};
