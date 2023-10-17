import {
  Listener,
  OrderCancelledEvent,
  OrderStatus,
  Subjects,
} from '@elchinovzla-common/auth';
import { Message } from 'node-nats-streaming';
import { Order } from '../../models/order';
import { queuGroupName } from './queue-group-name';

export class OrderCancelledListener extends Listener<OrderCancelledEvent> {
  subject: Subjects.OrderCancelled = Subjects.OrderCancelled;
  queueGroupName = queuGroupName;

  async onMessageReceived(
    data: OrderCancelledEvent['data'],
    msg: Message
  ): Promise<void> {
    const order = await Order.findOne({
      _id: data.id,
      version: data.version - 1,
    });

    if (!order) {
      throw new Error('Order not found');
    }

    await order!.set({ status: OrderStatus.Cancelled }).save();

    msg.ack();
  }
}
