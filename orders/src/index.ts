import mongoose from 'mongoose';
import { app } from './app';
import { TicketCreatedListener } from './events/listeners/ticket-created-listener';
import { TicketUpdatedListener } from './events/listeners/ticket-updated-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY should be define');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI should be define');
  }

  if (!process.env.NATS_CLUSTER) {
    throw new Error('NATS cluster should be define');
  }

  if (!process.env.NATS_CLIENT_ID) {
    throw new Error('NATS client id should be define');
  }

  if (!process.env.NATS_URL) {
    throw new Error('NATS url should be define');
  }

  try {
    await natsWrapper.connect(
      process.env.NATS_CLUSTER,
      process.env.NATS_CLIENT_ID,
      process.env.NATS_URL
    );
    natsWrapper.client.on('close', () => {
      console.log('NATS connection closed!');
      process.exit();
    });
    process.on('SIGINT', () => {
      console.log('SIGINT process shutting down process');
      natsWrapper.client.close();
    });
    process.on('SIGTERM', () => {
      console.log('SIGTERM process shutting down process');
      natsWrapper.client.close();
    });

    new TicketCreatedListener(natsWrapper.client).listen();
    new TicketUpdatedListener(natsWrapper.client).listen();

    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }
  console.log('Connected to mongoDB');
  app.listen(3000, () => {
    console.log('Orders service listening in port 3000.');
  });
};

start();
