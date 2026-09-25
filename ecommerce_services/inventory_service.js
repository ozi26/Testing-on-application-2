// Inventory Service: tracks available stock for products in the e-commerce prototype.
const express = require("express"); // Imports Express for HTTP endpoints.
const config = require("./config/inventory.config"); // Loads inventory-service configuration.

const app = express(); // Creates the Express application.
app.use(express.json()); // Enables JSON request parsing.

const inventory = new Map([ // Creates an in-memory stock table.
  ["p100", 20], // Gives the headphones twenty units.
  ["p101", 15], // Gives the keyboard fifteen units.
  ["p102", 40], // Gives the USB-C hub forty units.
]); // Ends the initial stock table.

/** Returns stock for one product. */ // Documents the lookup function.
function getStock(req, res) { // Defines the stock lookup handler.
  const stock = inventory.get(req.params.productId); // Reads the requested product stock.
  if (stock === undefined) return res.status(404).json({ error: "Product inventory not found" }); // Handles an unknown product.
  return res.json({ productId: req.params.productId, quantity: stock }); // Returns the current quantity.
} // Ends the stock lookup handler.

/** Reserves stock when an order is created. */ // Documents the reservation function.
function reserveStock(req, res) { // Defines the stock reservation handler.
  const quantity = Number(req.body.quantity); // Converts the requested quantity to a number.
  const current = inventory.get(req.params.productId); // Reads the current quantity.
  if (!Number.isInteger(quantity) || quantity <= 0) return res.status(400).json({ error: "Quantity must be a positive integer" }); // Validates the requested amount.
  if (current === undefined) return res.status(404).json({ error: "Product inventory not found" }); // Rejects unknown products.
  if (current < quantity) return res.status(409).json({ error: "Insufficient stock", available: current }); // Rejects a reservation larger than stock.
  inventory.set(req.params.productId, current - quantity); // Reduces stock by the reserved amount.
  return res.json({ productId: req.params.productId, reserved: quantity, remaining: current - quantity }); // Confirms the reservation.
} // Ends the reservation handler.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a deployment health endpoint.
app.get("/inventory/:productId", getStock); // Registers the stock lookup endpoint.
app.post("/inventory/:productId/reserve", reserveStock); // Registers the stock reservation endpoint.

if (require.main === module) { // Runs the server only for direct execution.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the HTTP server.
} // Ends the direct-execution check.

module.exports = { app, inventory }; // Exports the app and state for tests.
