import {
  ExpirationCompleteEvent,
  Publisher,
  Subjects,
} from '@elchinovzla-common/auth';

export class ExpirationCompletePublisher extends Publisher<ExpirationCompleteEvent> {
  subject: Subjects.ExpirationComplete = Subjects.ExpirationComplete;
}
