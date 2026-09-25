// Inventory Service Tests: verifies stock lookup and reservation.
const request = require("supertest"); // Imports Supertest for HTTP testing.
const { app, inventory } = require("../sample_microservices/inventory_service"); // Imports the service app and state.

beforeEach(() => inventory.set("p100", 20)); // Resets the main stock item before each test.

test("inventory contains known product stock", () => { // Defines a unit-style inventory test.
  expect(inventory.get("p100")).toBe(20); // Confirms the expected initial quantity.
}); // Ends the unit test.

test("POST reserve reduces stock", async () => { // Defines an HTTP integration test for reservation.
  const response = await request(app).post("/inventory/p100/reserve").send({ quantity: 3 }); // Reserves three units.
  expect(response.status).toBe(200); // Confirms the reservation succeeded.
  expect(response.body.remaining).toBe(17); // Confirms stock was reduced correctly.
}); // Ends the integration test.

test("POST reserve rejects insufficient stock", async () => { // Defines an edge-case integration test.
  const response = await request(app).post("/inventory/p100/reserve").send({ quantity: 99 }); // Requests more stock than available.
  expect(response.status).toBe(409); // Confirms the service rejects the reservation.
}); // Ends the test.
