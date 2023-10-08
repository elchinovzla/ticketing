import { OrderCreatedEvent, OrderStatus } from '@elchinovzla-common/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Ticket } from '../../../models/ticket';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const ticket = Ticket.build({
    title: 'test',
    price: 99,
    userId: '1234',
  });
  await ticket.save();

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: '1234',
    expiresAt: 'asfdsag',
    ticket: {
      id: ticket.id,
      price: ticket.price,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, ticket, data, msg };
};

it('sets the userI of the ticket', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessageReceived(data, msg);
  const updatedTicket = await Ticket.findById(ticket.id);

  expect(updatedTicket!.orderId).toEqual(data.id);
});

it('acknowledges the message', async () => {
  const { listener, ticket, data, msg } = await setup();
  await listener.onMessageReceived(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
