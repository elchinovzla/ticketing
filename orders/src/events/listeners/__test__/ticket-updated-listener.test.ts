import { TicketUpdatedEvent } from '@elchinovzla-common/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketUpdatedListener } from '../ticket-updated-listener';

const TICKET_TITLE = 'ticket updated listener test';
const NEW_TICKET_PRICE = 150;

const setup = async () => {
  const listener = new TicketUpdatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title: TICKET_TITLE,
    price: 100,
  });
  await ticket.save();

  const data: TicketUpdatedEvent['data'] = {
    id: ticket.id,
    version: ticket.version + 1,
    title: TICKET_TITLE,
    price: NEW_TICKET_PRICE,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('finds, updates, and saves a ticket', async () => {
  const { data, listener, ticket, msg } = await setup();
  await listener.onMessageReceived(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket).toBeDefined();
  expect(updatedTicket!.title).toBe(TICKET_TITLE);
  expect(updatedTicket!.price).toBe(NEW_TICKET_PRICE);
});

it('acknowledges the message', async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessageReceived(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});

it('does not call ack if the event has a skipped version number', async () => {
  const { msg, data, listener, ticket } = await setup();
  data.version = 10;

  await expect(listener.onMessageReceived(data, msg)).rejects.toThrow(
    'Ticket not found in order service'
  );
  expect(msg.ack).not.toHaveBeenCalled();
});
