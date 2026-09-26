// Shipping Service Tests: verifies shipment creation and tracking.
const request = require("supertest"); // Imports Supertest for HTTP tests.
const { app, shipments } = require("../ecommerce_services/shipping_service"); // Imports the service app and state.

beforeEach(() => shipments.clear()); // Clears shipment state before each test.

test("shipment store starts empty", () => { // Defines a unit-style shipment test.
  expect(shipments.size).toBe(0); // Confirms there are no shipments initially.
}); // Ends the test.

test("POST shipment creates a label", async () => { // Defines shipment creation integration test.
  const response = await request(app).post("/shipments").send({ orderId: "ord-1", address: "1 Test Street" }); // Creates a shipment.
  expect(response.status).toBe(201); // Confirms creation succeeded.
  expect(response.body.status).toBe("label_created"); // Confirms initial shipment state.
}); // Ends the test.

test("GET shipment returns a created shipment", async () => { // Defines shipment tracking integration test.
  await request(app).post("/shipments").send({ orderId: "ord-1", address: "1 Test Street" }); // Creates a shipment first.
  const response = await request(app).get("/shipments/ord-1"); // Reads the shipment.
  expect(response.status).toBe(200); // Confirms lookup succeeded.
  expect(response.body.orderId).toBe("ord-1"); // Confirms the order link.
}); // Ends the test.
