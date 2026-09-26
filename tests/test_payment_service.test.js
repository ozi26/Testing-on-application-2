// Payment Service Tests: verifies successful and invalid simulated payments.
const request = require("supertest"); // Imports Supertest for HTTP tests.
const { app, payments } = require("../ecommerce_services/payment_service"); // Imports the app and payment state.

beforeEach(() => payments.splice(0)); // Clears payment state before each test.

test("payment store starts empty", () => { // Defines a unit-style payment test.
  expect(payments).toHaveLength(0); // Confirms the state is clean.
}); // Ends the test.

test("POST payment approves a positive amount", async () => { // Defines a successful payment integration test.
  const response = await request(app).post("/payments").send({ amount: 50 }); // Sends a valid payment.
  expect(response.status).toBe(201); // Confirms payment creation succeeded.
  expect(response.body.status).toBe("approved"); // Confirms the payment status.
}); // Ends the test.

test("POST payment rejects zero amount", async () => { // Defines an invalid payment integration test.
  const response = await request(app).post("/payments").send({ amount: 0 }); // Sends an invalid amount.
  expect(response.status).toBe(400); // Confirms validation rejects the request.
}); // Ends the test.
