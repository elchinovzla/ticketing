import { OrderCreatedEvent, OrderStatus } from '@elchinovzla-common/auth';
import mongoose from 'mongoose';
import { Message } from 'node-nats-streaming';
import { Order } from '../../../models/order';
import { natsWrapper } from '../../../nats-wrapper';
import { OrderCreatedListener } from '../order-created-listener';

const setup = async () => {
  const listener = new OrderCreatedListener(natsWrapper.client);

  const data: OrderCreatedEvent['data'] = {
    id: new mongoose.Types.ObjectId().toHexString(),
    version: 0,
    status: OrderStatus.Created,
    userId: 'asdf',
    expiresAt: 'asdf',
    ticket: {
      id: 'sdf',
      price: 100,
    },
  };

  //@ts-ignore
  const msg: Message = {
    ack: jest.fn(),
  };

  return { listener, data, msg };
};

it('replicates the order info', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessageReceived(data, msg);

  const order = await Order.findById(data.id);

  expect(order!.price).toEqual(100);
});

it('acknowledges message', async () => {
  const { listener, data, msg } = await setup();

  await listener.onMessageReceived(data, msg);

  expect(msg.ack).toHaveBeenCalled();
});
