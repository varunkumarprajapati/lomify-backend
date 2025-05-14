const ejs = require("ejs");
const path = require("path");

async function renderTemplate(template, data) {
  const templatePath = path.join(__dirname, "templates", template + ".ejs");
  const html = await ejs.renderFile(templatePath, data);
  return html;
}

module.exports = renderTemplate;
