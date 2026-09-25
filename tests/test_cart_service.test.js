// Cart Service Tests: verifies cart creation and updates.
const request = require("supertest"); // Imports Supertest for HTTP testing.
const { app, carts } = require("../sample_microservices/cart_service"); // Imports the app and cart store.

beforeEach(() => carts.clear()); // Clears all carts before every test.

test("new user has an empty cart", () => { // Defines a unit-style cart test.
  expect(carts.get("u1")).toBeUndefined(); // Confirms no cart is stored before the first write.
}); // Ends the test.

test("POST cart item creates a cart", async () => { // Defines an HTTP integration test.
  const response = await request(app).post("/carts/u1/items").send({ productId: "p100", quantity: 2 }); // Adds two products to the cart.
  expect(response.status).toBe(201); // Confirms creation succeeded.
  expect(response.body.items[0].quantity).toBe(2); // Confirms the quantity is correct.
}); // Ends the test.

test("DELETE cart clears items", async () => { // Defines a cart clearing integration test.
  await request(app).post("/carts/u1/items").send({ productId: "p100", quantity: 2 }); // Adds an item before clearing.
  const response = await request(app).delete("/carts/u1"); // Clears the cart.
  expect(response.status).toBe(200); // Confirms the clear operation succeeded.
  expect(response.body.items).toEqual([]); // Confirms no items remain.
}); // Ends the test.
