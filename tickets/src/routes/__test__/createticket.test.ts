import request from "supertest";
import { app } from "../../app";
import { Ticket } from "../../models/ticket";
import { natsWrapper } from "../../nats-wrapper";

it("has a route handler listening to /api/tickets/ for post requests", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).not.toEqual(404);
});

it("can only be accessed if the user is signed in", async () => {
  const response = await request(app).post("/api/tickets").send({});
  expect(response.status).toEqual(401);
});

it("returns no 401 if user is signed in", async () => {
  const response = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({});
  expect(response.status).not.toEqual(401);
});

it("returns an error if an invalid title is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "",
      price: 10,
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      price: 10,
    })
    .expect(400);
});

it("returns an error if an invalid price is provided", async () => {
  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "I am a ticket's title",
    })
    .expect(400);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: "I am a ticket's title",
      price: -100,
    })
    .expect(400);
});

it("creates a ticket with valid inputs", async () => {
  const expectingPrice = 100;
  const expectingTitle = "I am a ticket's title";

  const initialTickets = await Ticket.find({});
  expect(initialTickets.length).toEqual(0);

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: expectingTitle,
      price: expectingPrice,
    })
    .expect(201);

  const afterCreateTickets = await Ticket.find({});
  expect(afterCreateTickets.length).toEqual(1);

  const ticketCreated = afterCreateTickets[0];
  expect(ticketCreated.price).toEqual(expectingPrice);
  expect(ticketCreated.title).toEqual(expectingTitle);
});

it("publishes an event", async () => {
  const expectingPrice = 100;
  const expectingTitle = "I am a ticket's title";

  await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title: expectingTitle,
      price: expectingPrice,
    })
    .expect(201);

  expect(natsWrapper.client.publish).toHaveBeenCalled();
});
