import {
  Publisher,
  Subjects,
  TicketCreatedEvent,
} from "@elchinovzla-common/auth";

export class TicketCreatedPublisher extends Publisher<TicketCreatedEvent> {
  subject: Subjects.TicketCreated = Subjects.TicketCreated;
}
