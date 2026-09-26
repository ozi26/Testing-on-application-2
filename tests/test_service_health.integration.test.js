// E-commerce Integration Tests: checks that every service exposes a working health endpoint.
const request = require("supertest"); // Imports Supertest for HTTP-style application tests.
const services = [ // Lists every service that belongs to the prototype.
  require("../ecommerce_services/product_service").app, // Loads the product service app.
  require("../ecommerce_services/inventory_service").app, // Loads the inventory service app.
  require("../ecommerce_services/cart_service").app, // Loads the cart service app.
  require("../ecommerce_services/order_service").app, // Loads the order service app.
  require("../ecommerce_services/payment_service").app, // Loads the payment service app.
  require("../ecommerce_services/shipping_service").app, // Loads the shipping service app.
  require("../ecommerce_services/user_service").app, // Loads the user service app.
]; // Ends the service list.

test("all services expose healthy HTTP endpoints", async () => { // Defines the multi-service health integration test.
  for (const app of services) { // Iterates through every service app.
    const response = await request(app).get("/health"); // Calls its health endpoint.
    expect(response.status).toBe(200); // Confirms the endpoint is healthy.
    expect(response.body.status).toBe("ok"); // Confirms the health payload.
  } // Ends the service loop.
}); // Ends the integration test.
