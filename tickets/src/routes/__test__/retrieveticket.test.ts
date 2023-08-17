import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the ticket is not found", async () => {
  await request(app).get("/api/tickets/somerandomid").send().expect(404);
});

it("returns the ticket if the ticket is found", async () => {
  const title = "ticket title";
  const price = 100;

  const newTicketResponse = await request(app)
    .post("/api/tickets")
    .set("Cookie", global.signin())
    .send({
      title,
      price,
    })
    .expect(201);

  const searchedTicket = await request(app)
    .get(`/api/tickets/${newTicketResponse.body.id}`)
    .send()
    .expect(200);

  expect(searchedTicket.body.title).toEqual(title);
  expect(searchedTicket.body.price).toEqual(price);
});
