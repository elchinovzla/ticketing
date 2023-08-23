import {
  currentUser,
  errorHandler,
  NotFoundError,
} from "@elchinovzla-common/auth";
import { json } from "body-parser";
import cookieSession from "cookie-session";
import express from "express";
import "express-async-errors";
import { indexTicketRouter } from "./routes";
import { createTicketRouter } from "./routes/createticket";
import { retrieveTicketRouter } from "./routes/retrieveticket";
import { updateTicketRouter } from "./routes/updateticket";

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

app.use(createTicketRouter);
app.use(retrieveTicketRouter);
app.use(indexTicketRouter);
app.use(updateTicketRouter);

app.all("*", async (req, res) => {
  throw new NotFoundError();
});
app.use(errorHandler);

export { app };
