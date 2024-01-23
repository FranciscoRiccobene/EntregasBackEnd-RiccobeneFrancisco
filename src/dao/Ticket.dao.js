import Ticket from "./models/Ticket.model.js";

class TicketDAO {
  constructor() {}

  async createTicket(ticketInfo) {
    try {
      return await Ticket.create(ticketInfo);
    } catch (error) {
      throw error;
    }
  }
}

export default TicketDAO;
