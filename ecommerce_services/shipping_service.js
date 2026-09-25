// Shipping Service: creates and tracks simple delivery records.

const express = require("express"); // Imports Express for HTTP routing.
const config = require("./config/shipping.config"); // Loads shipping-service configuration.

const app = express(); // Creates the Express application.
app.use(express.json()); // Enables JSON request parsing.

const shipments = new Map(); // Stores shipments by order identifier.

/** Creates a shipment for an order. */ // Documents the shipment creation function.
function createShipment(req, res) { // Defines the shipment creation handler.
  const orderId = req.body.orderId; // Reads the order identifier.
  const address = req.body.address; // Reads the delivery address.
  if (!orderId || !address) return res.status(400).json({ error: "orderId and address are required" }); // Validates required fields.
  const shipment = { id: `ship-${shipments.size + 1}`, orderId, address, status: "label_created" }; // Builds a new shipment record.
  shipments.set(orderId, shipment); // Saves the shipment.
  return res.status(201).json(shipment); // Returns the shipment record.
} // Ends shipment creation.

/** Returns the shipment belonging to an order. */ // Documents the shipment lookup function.
function getShipment(req, res) { // Defines the shipment lookup handler.
  const shipment = shipments.get(req.params.orderId); // Reads the shipment by order ID.
  if (!shipment) return res.status(404).json({ error: "Shipment not found" }); // Handles unknown orders.
  return res.json(shipment); // Returns the shipment.
} // Ends shipment lookup.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a health endpoint.
app.post("/shipments", createShipment); // Registers shipment creation.
app.get("/shipments/:orderId", getShipment); // Registers shipment lookup.

if (require.main === module) { // Starts the server only when run directly.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the HTTP server.
} // Ends the direct-execution check.

module.exports = { app, shipments }; // Exports the app and state for tests.
