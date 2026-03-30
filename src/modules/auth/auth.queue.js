const { Queue, Worker } = require("bullmq");
const { redis } = require("../../database/redis");
const { MAIL_JOBS } = require("./auth.constant");
const { sendVerificationMail, sendResetPasswordMail } = require("../../emails");

const emailQueue = new Queue("email-queue", { connection: redis });

const addEmailToQueue = async (jobName, data, delay = undefined) => {
  return await emailQueue.add(jobName, data, { delay: delay });
};

const emailWorker = new Worker(
  "email-queue",
  async (job) => {
    switch (job.name) {
      case MAIL_JOBS.VERIFICATION_EMAIL: {
        const data = job.data;
        await sendVerificationMail(data);
        break;
      }

      // case MAIL_JOBS.WELCOME_EMAIL: {
      //   const data = job.data;
      //   await sendWelcomeMail(data);
      //   break;
      // }

      case MAIL_JOBS.FORGOT_PASSWORD_EMAIL: {
        const data = job.data;
        await sendResetPasswordMail(data);
        break;
      }

      default: {
        console.error(`No Job with this ${job.name} name`);
        break;
      }
    }
  },
  { connection: redis },
);

// emailWorker.on("error", (e) => console.error(e));
// emailWorker.on("drained", (e) => console.error(e));
// emailWorker.on("stalled", (e) => console.error(e));
// emailWorker.on("completed", (e) => console.log(e));

module.exports = {
  addEmailToQueue,
};
