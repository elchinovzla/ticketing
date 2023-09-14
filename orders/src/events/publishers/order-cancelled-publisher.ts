import {
  OrderCancelledEvent,
  Publisher,
  Subjects,
} from "@elchinovzla-common/auth";

export class OrderCancelledPublisher extends Publisher<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
}
