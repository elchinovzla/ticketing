import { OrderCreatedListener } from './events/listeners/order-created-listener';
import { natsWrapper } from './nats-wrapper';

const start = async () => {
  console.log('Starting out expiration service...');

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

    new OrderCreatedListener(natsWrapper.client).listen();
  } catch (err) {
    console.error(err);
  }
};

start();
