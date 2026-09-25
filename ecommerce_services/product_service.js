// Product Service: exposes a small product catalog for the e-commerce prototype.
const express = require("express"); // Imports Express so the service can expose HTTP endpoints.
const config = require("./config/product.config"); // Loads product-service configuration from the shared config folder.

const app = express(); // Creates the Express application instance.
app.use(express.json()); // Enables JSON request-body parsing.

const products = [ // Stores sample catalog data in memory for this deployable prototype.
  { id: "p100", name: "Wireless Headphones", price: 59.99, currency: "USD" }, // Defines the first product.
  { id: "p101", name: "Mechanical Keyboard", price: 89.99, currency: "USD" }, // Defines the second product.
  { id: "p102", name: "USB-C Hub", price: 29.99, currency: "USD" }, // Defines the third product.
]; // Ends the sample product list.

/** Returns all products in the catalog. */ // Documents the purpose of the route handler.
function listProducts(req, res) { // Defines the catalog listing handler.
  return res.json({ service: config.serviceName, products }); // Sends the service name and product list as JSON.
} // Ends the list handler.

/** Returns one product by its identifier. */ // Documents the purpose of the route handler.
function getProduct(req, res) { // Defines the product lookup handler.
  const product = products.find((item) => item.id === req.params.id); // Searches the catalog for the requested identifier.
  if (!product) return res.status(404).json({ error: "Product not found" }); // Returns a clear error when the product does not exist.
  return res.json(product); // Sends the matching product.
} // Ends the lookup handler.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a health endpoint for deployment checks.
app.get("/products", listProducts); // Registers the catalog endpoint.
app.get("/products/:id", getProduct); // Registers the single-product endpoint.

if (require.main === module) { // Starts the HTTP server only when this file is executed directly.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the service on the configured port.
} // Ends the direct-execution check.

module.exports = { app, products }; // Exports the app and data so unit and integration tests can reuse them.
