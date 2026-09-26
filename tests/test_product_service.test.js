// Product Service Tests: verifies catalog logic and HTTP behavior.
const request = require("supertest"); // Imports Supertest for HTTP-level testing.
const { app, products } = require("../ecommerce_services/product_service"); // Imports the service app and catalog.

test("product list contains sample products", async () => { // Defines a unit-style catalog test.
  expect(products.length).toBeGreaterThanOrEqual(3); // Confirms the catalog has enough sample data.
}); // Ends the test.

test("GET /products returns products", async () => { // Defines an HTTP integration test for the product route.
  const response = await request(app).get("/products"); // Calls the product endpoint.
  expect(response.status).toBe(200); // Confirms a successful response.
  expect(response.body.products.length).toBeGreaterThanOrEqual(3); // Confirms the response contains products.
}); // Ends the test.
