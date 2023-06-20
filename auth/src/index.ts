import { json } from "body-parser";
import express from "express";
import { errorHandler } from "./middlewares/error-handlers";
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";

const app = express();
app.use(json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signupRouter);
app.use(signoutRouter);

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth service listening in port 3000.");
});
