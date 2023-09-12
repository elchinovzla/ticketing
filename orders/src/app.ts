import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@elchinovzla-common/auth";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { indexOrderRouter } from "./routes";
import { cancelOrderRouter } from "./routes/cancel-order";
import { createOrderRouter } from "./routes/create-order";
import { getOderByIdRouter } from "./routes/get-order-by-id";

const app = express();
app.set("trust proxy", true);
app.use(json());
app.use(
  cookieSession({
    signed: false,
    secure: process.env.NODE_ENV !== "test",
  })
);
app.use(currentUser);

app.use(createOrderRouter);
app.use(getOderByIdRouter);
app.use(indexOrderRouter);
app.use(cancelOrderRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
