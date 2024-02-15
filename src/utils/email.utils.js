import nodemailer from "nodemailer";
import emailConfig from "../config/email.config.js";

const transport = nodemailer.createTransport({
  service: emailConfig.SERVICE_MAIL,
  port: emailConfig.SERVICE_MAIL_PORT,
  auth: {
    user: emailConfig.EMAIL_USER,
    pass: emailConfig.EMAIL_PASSWORD,
  },
});

export default transport;
