import dotenv from "dotenv";

dotenv.config();

export default {
  SERVICE_MAIL: process.env.SERVICE_MAIL,
  SERVICE_MAIL_PORT: process.env.SERVICE_MAIL_PORT,
  EMAIL_USER: process.env.EMAIL_USER,
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD,
};
