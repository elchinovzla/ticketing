import {
  OrderCreatedEvent,
  Publisher,
  Subjects,
} from "@elchinovzla-common/auth";

export class OrderCreatedPublisher extends Publisher<OrderCreatedEvent> {
  subject: Subjects.OrderCreated = Subjects.OrderCreated;
}
