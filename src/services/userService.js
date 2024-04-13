import transport from "../utils/email.utils.js";
import emailConfig from "../config/email.config.js";

class UserService {
  constructor(userDAO) {
    this.userDAO = userDAO;
  }

  async sendEmail(userEmail,subject, message) {
    transport.sendMail({
      from: emailConfig.EMAIL_USER,
      to: userEmail,
      subject: subject,
      text: message,
    });
  }
}

export default UserService;
