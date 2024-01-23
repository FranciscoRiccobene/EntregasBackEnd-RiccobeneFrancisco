class TicketRepository {
  constructor(ticketDAO) {
    this.ticketDAO = ticketDAO;
  }

  async createTicket(ticketInfo) {
    return await this.ticketDAO.createTicket(ticketInfo);
  }
}

export default TicketRepository;
