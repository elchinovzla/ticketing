import { TicketCreatedEvent } from '@elchinovzla-common/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { TicketCreatedListener } from '../ticket-created-listener';

const TICKET_TITLE = 'ticket created listener test';
const TICKET_PRICE = 100;

const setup = async () => {
  const listener = new TicketCreatedListener(natsWrapper.client);
  const data: TicketCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    title: TICKET_TITLE,
    price: TICKET_PRICE,
    userId: new mongoose.Types.ObjectId().toHexString(),
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('creates and saves a ticket', async () => {
  const { listener, data, msg } = await setup();
  await listener.onMessageReceived(data, msg);
  const ticket = await Ticket.findById(data.id);

  expect(ticket).toBeDefined();
  expect(ticket!.title).toBe(TICKET_TITLE);
  expect(ticket!.price).toBe(TICKET_PRICE);
});

it('acknowledges the message', async () => {
  const { data, listener, msg } = await setup();
  await listener.onMessageReceived(data, msg);
  expect(msg.ack).toHaveBeenCalled();
});
