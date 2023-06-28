import mongoose from "mongoose";
import { app } from "./app";

const start = async () => {
  if (!process.env.JWT_KEY) {
    throw new Error("JWT_KEY should be define");
  }

  try {
    await mongoose.connect("mongodb://auth-mongo-srv:27017/auth");
  } catch (err) {
    console.error(err);
  }
  console.log("Connected to mongoDB");
  app.listen(3000, () => {
    console.log("Auth service listening in port 3000.");
  });
};

start();
