import TicketsDAO from '../DAO/classes/tickets.dao.js';
import ServiceCarts from '../services/carts.service.js';
const ticketsDAO = new TicketsDAO();
const serviceCarts = new ServiceCarts();

class ServiceTickets {
  async addTicketService(purchaser, ticket, totalCart) {
    try {
      const ticketData = {
        code: '',
        purchase_datetime: new Date(),
        amount: totalCart,
        purchaser: purchaser,
        products: ticket,
      };
      const savedTicket = await ticketsDAO.addTicketDao(ticketData);
      return savedTicket;
    } catch (error) {
      throw `Service tickets failure. ${error}`;
    }
  }
  async stockCartProductsForTicketService(cid) {
    try {
      const cartProductsTicket = await serviceCarts.getCartByIdService(cid);
      let cartWithStock = [];
      let cartWithOutStock = [];
      let totalPriceTicket = 0;
      cartProductsTicket.cartProducts.forEach((item) => {
        const product = item.product;
        const quantityInCart = parseInt(item.quantity);
        const availableStock = parseInt(product.stock);
        const ticketAmount = parseInt(product.price);
        if (quantityInCart <= availableStock) {
          const totalPriceProduct = ticketAmount * quantityInCart;
          cartWithStock.push({ product, quantity: quantityInCart, totalPrice: totalPriceProduct });
          totalPriceTicket += totalPriceProduct;
        } else {
          cartWithOutStock.push({ product, quantity: quantityInCart });
        }
      });
      return { cartWithStock, cartWithOutStock, totalPriceTicket };
    } catch (err) {
      throw new Error('Error with ticket service');
    }
  }
}

export default ServiceTickets;
