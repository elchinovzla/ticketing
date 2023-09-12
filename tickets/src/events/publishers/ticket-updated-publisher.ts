import {
  Publisher,
  Subjects,
  TicketUpdatedEvent,
} from "@elchinovzla-common/auth";

export class TicketUpdatedPublisher extends Publisher<TicketUpdatedEvent> {
  subject: Subjects.TicketUpdated = Subjects.TicketUpdated;
}
