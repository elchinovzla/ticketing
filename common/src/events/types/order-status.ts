export enum OrderStatus {
  //when order has been created, but the ticket it is trying to order has not been reserved
  Created = "CREATED",

  //the ticket the order is trying to reserve has already been reserved, or when the user
  //has cancelled the order. The order expires before payment
  Cancelled = "CANCELLED",

  //the order has successfully reserved the ticket
  AwaitingPayment = "AWAITING:PAYMENT",

  //the order has reserved the ticket and the user has provided payment successfully
  Complete = "COMEPLETE",
}
