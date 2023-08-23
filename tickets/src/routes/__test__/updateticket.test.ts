import mongoose from "mongoose";
import request from "supertest";
import { app } from "../../app";

it("returns a 404 if the provided id does not exist", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .set("Cookie", global.signin())
    .send({
      title: "testing",
      price: 20,
    })
    .expect(404);
});

it("returns a 401 if the user is not authenticated", async () => {
  const id = new mongoose.Types.ObjectId().toHexString();

  await request(app)
    .put(`/api/tickets/${id}`)
    .send({
      title: "testing",
      price: 20,
    })
    .expect(401);
});

it("returns a 401 if the user does not own the ticket", async () => {
  const createdTicket = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", global.signin())
    .send({
      title: "testing",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set("Cookie", global.signin())
    .send({
      title: "testing",
      price: 200,
    })
    .expect(401);
});

it("returns a 400 if the user provides an invalid title or price", async () => {
  const signedInUserCookie = global.signin();

  const createdTicket = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", signedInUserCookie)
    .send({
      title: "testing",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set("Cookie", signedInUserCookie)
    .send({
      title: "",
      price: 20,
    })
    .expect(400);

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set("Cookie", signedInUserCookie)
    .send({
      title: "testing",
      price: -20,
    })
    .expect(400);
});

it("updates the ticket provided valid input", async () => {
  const signedInUserCookie = global.signin();

  const createdTicket = await request(app)
    .post(`/api/tickets`)
    .set("Cookie", signedInUserCookie)
    .send({
      title: "testing",
      price: 20,
    });

  await request(app)
    .put(`/api/tickets/${createdTicket.body.id}`)
    .set("Cookie", signedInUserCookie)
    .send({
      title: "testing 2.0",
      price: 200,
    })
    .expect(200);

  const updatedTicket = await request(app)
    .get(`/api/tickets/${createdTicket.body.id}`)
    .send();
  expect(updatedTicket.body.title).toEqual("testing 2.0");
  expect(updatedTicket.body.price).toEqual(200);
});
