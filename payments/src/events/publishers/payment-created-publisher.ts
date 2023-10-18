import {
  PaymentCreatedEvent,
  Publisher,
  Subjects,
} from '@elchinovzla-common/auth';

export class PaymentCreatedPublisher extends Publisher<PaymentCreatedEvent> {
  subject: Subjects.PaymentCreated = Subjects.PaymentCreated;
}
