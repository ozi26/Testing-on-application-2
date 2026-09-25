// Order Service Tests: verifies the cross-service order workflow with mocked HTTP dependencies.
const request = require("supertest"); // Imports Supertest for HTTP testing.
const { app, orders } = require("../sample_microservices/order_service"); // Imports the order app and state.

beforeEach(() => orders.splice(0)); // Clears orders before each test.

test("order store starts empty", () => { // Defines a unit-style order state test.
  expect(orders).toHaveLength(0); // Confirms no orders exist.
}); // Ends the test.

test("POST order coordinates inventory payment and shipping", async () => { // Defines a cross-service integration-style test.
  const originalFetch = global.fetch; // Saves the real fetch implementation.
  global.fetch = jest.fn(async (url) => { // Replaces fetch with a controlled dependency response.
    if (url.includes("/reserve")) return { ok: true, json: async () => ({ remaining: 9 }) }; // Simulates successful stock reservation.
    if (url.includes("/payments")) return { ok: true, json: async () => ({ id: "pay-1", status: "approved" }) }; // Simulates successful payment.
    return { ok: true, json: async () => ({ id: "ship-1", status: "label_created" }) }; // Simulates successful shipping.
  }); // Ends the fetch mock.
  const response = await request(app).post("/orders").send({ userId: "u1", productId: "p100", quantity: 1, amount: 59.99, address: "1 Test Street" }); // Creates an order through the HTTP API.
  global.fetch = originalFetch; // Restores the real fetch implementation.
  expect(response.status).toBe(201); // Confirms the workflow succeeded.
  expect(response.body.paymentId).toBe("pay-1"); // Confirms payment was linked.
  expect(response.body.shipmentId).toBe("ship-1"); // Confirms shipping was linked.
}); // Ends the integration-style test.

test("POST order rejects invalid input", async () => { // Defines an input-validation test.
  const response = await request(app).post("/orders").send({ userId: "u1" }); // Sends an incomplete order.
  expect(response.status).toBe(400); // Confirms validation failed.
}); // Ends the validation test.
