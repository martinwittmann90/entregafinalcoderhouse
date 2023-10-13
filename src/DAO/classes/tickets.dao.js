import TicketModel from '../models/tickets.model.js';
class TicketsDAO {
  async createTicketDao(newTicket) {
    try {
      const ticket = await TicketModel.create(newTicket);
      ticket.code = ticket._id.toString();
      await TicketModel.findByIdAndUpdate(ticket._id, { code: ticket.code });
      return ticket;
    } catch (error) {
      throw `Something gone wrong with the ticket`;
    }
  }
}

export default TicketsDAO;
