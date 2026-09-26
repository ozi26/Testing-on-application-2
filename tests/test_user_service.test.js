// User Service Tests: verifies registration and customer lookup.
const request = require("supertest"); // Imports Supertest for HTTP tests.
const { app, users } = require("../ecommerce_services/user_service"); // Imports the service app and user state.

beforeEach(() => users.clear()); // Clears customer state before each test.

test("user store starts empty", () => { // Defines a unit-style user test.
  expect(users.size).toBe(0); // Confirms the state is empty.
}); // Ends the test.

test("POST user registers a customer", async () => { // Defines a user registration integration test.
  const response = await request(app).post("/users").send({ id: "u1", name: "Ada", email: "ada@example.com" }); // Registers a customer.
  expect(response.status).toBe(201); // Confirms registration succeeded.
  expect(response.body.email).toBe("ada@example.com"); // Confirms the stored email.
}); // Ends the test.

test("GET user returns a registered customer", async () => { // Defines customer lookup integration test.
  await request(app).post("/users").send({ id: "u1", name: "Ada", email: "ada@example.com" }); // Creates the customer.
  const response = await request(app).get("/users/u1"); // Looks up the customer.
  expect(response.status).toBe(200); // Confirms lookup succeeded.
  expect(response.body.name).toBe("Ada"); // Confirms the customer name.
}); // Ends the test.
