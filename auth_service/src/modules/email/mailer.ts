import path from "node:path";
import transporter from "./transporter.js";
import ejs from "ejs";
import { TEMPLATE_DIR } from "@/utils/constants.js";

interface ISendMail {
  to: string;
  subject: string;
  template: string;
  data: object;
}

class MailerService {
  private from = process.env.EMAIL_ID;

  async sendMail({ to, subject, template, data }: ISendMail) {
    try {
      const templatePath = path.join(TEMPLATE_DIR, `${template}.ejs`);
      const html = await ejs.renderFile(templatePath, data, {
        cache: true,
        async: true,
      });

      const info = await transporter.sendMail({
        from: this.from,
        subject: subject,
        to: to,
        html,
      });

      return info;
    } catch (error) {
      console.error(`[MAIL SERVICE ERROR]: ${error}`);
      throw error;
    }
  }
}

export default new MailerService();
