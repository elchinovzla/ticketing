import mongoose from 'mongoose';
import { app } from './app';

const start = async () => {
  console.log('Starting out auth service...');

  if (!process.env.JWT_KEY) {
    throw new Error('JWT_KEY should be define');
  }

  if (!process.env.MONGO_URI) {
    throw new Error('MONGO_URI should be define');
  }

  try {
    await mongoose.connect(process.env.MONGO_URI);
  } catch (err) {
    console.error(err);
  }
  console.log('Connected to mongoDB');
  app.listen(3000, () => {
    console.log('Auth service listening in port 3000.');
  });
};

start();
