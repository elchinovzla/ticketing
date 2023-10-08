import mongoose from 'mongoose';
import request from 'supertest';
import { app } from '../../app';
import { Ticket } from '../../models/ticket';

const buildTicket = async (title: string, price: number) => {
  const ticket = Ticket.build({
    id: new mongoose.Types.ObjectId().toHexString(),
    title,
    price,
  });
  ticket.save();

  return ticket;
};
it('fetches orders for a particular user', async () => {
  const ticket1 = await buildTicket('test 1', 100);
  const ticket2 = await buildTicket('test 2', 50);
  const ticket3 = await buildTicket('test 3', 123.45);

  const user1 = global.signin();
  const user2 = global.signin();

  const { body: order1 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user1)
    .send({ ticketId: ticket1.id })
    .expect(201);

  const { body: order2 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket2.id })
    .expect(201);

  const { body: order3 } = await request(app)
    .post('/api/orders')
    .set('Cookie', user2)
    .send({ ticketId: ticket3.id })
    .expect(201);

  const user1Orders = await request(app)
    .get('/api/orders')
    .set('Cookie', user1)
    .expect(200);
  expect(user1Orders.body.length).toEqual(1);
  expect(user1Orders.body[0].id).toEqual(order1.id);
  expect(user1Orders.body[0].ticket.id).toEqual(ticket1.id);

  const user2Orders = await request(app)
    .get('/api/orders')
    .set('Cookie', user2)
    .expect(200);
  expect(user2Orders.body.length).toEqual(2);
  expect(user2Orders.body[0].id).toEqual(order2.id);
  expect(user2Orders.body[1].id).toEqual(order3.id);
});
