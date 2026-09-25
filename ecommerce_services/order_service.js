// Order Service: coordinates product, inventory, payment and shipping operations.
const express = require("express"); // Imports Express for HTTP routing.
const config = require("./config/order.config"); // Loads order-service configuration.

const app = express(); // Creates the Express application.
app.use(express.json()); // Enables JSON request parsing.

const orders = []; // Stores created orders in memory.

/** Calls another service and returns its JSON response. */ // Documents the shared HTTP helper.
async function callService(url, options = {}) { // Defines the asynchronous service-to-service helper.
  const response = await fetch(url, options); // Sends the HTTP request using Node's built-in fetch.
  const body = await response.json(); // Parses the JSON response.
  if (!response.ok) throw new Error(body.error || `Service call failed: ${response.status}`); // Converts failed dependency calls into errors.
  return body; // Returns the successful response body.
} // Ends the service-call helper.

/** Creates an order and coordinates its dependent services. */ // Documents the order creation function.
async function createOrder(req, res) { // Defines the order creation handler.
  try { // Starts error handling for dependency calls.
    const { userId, productId, quantity, amount, address } = req.body; // Reads order information.
    if (!userId || !productId || !Number.isInteger(quantity) || quantity <= 0 || !amount || !address) return res.status(400).json({ error: "userId, productId, positive integer quantity, amount and address are required" }); // Validates the order input.
    const inventoryUrl = `${process.env.INVENTORY_URL || "http://localhost:3002"}/inventory/${productId}/reserve`; // Builds the inventory dependency URL.
    await callService(inventoryUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ quantity }) }); // Reserves the requested stock.
    const paymentUrl = `${process.env.PAYMENT_URL || "http://localhost:3005"}/payments`; // Builds the payment dependency URL.
    const payment = await callService(paymentUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ amount, currency: "USD" }) }); // Processes the payment.
    const order = { id: `ord-${orders.length + 1}`, userId, productId, quantity, amount, paymentId: payment.id, status: "paid" }; // Creates the order record.
    const shippingUrl = `${process.env.SHIPPING_URL || "http://localhost:3006"}/shipments`; // Builds the shipping dependency URL.
    const shipment = await callService(shippingUrl, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ orderId: order.id, address }) }); // Creates the shipment.
    order.shipmentId = shipment.id; // Links the shipment to the order.
    orders.push(order); // Saves the completed order.
    return res.status(201).json(order); // Returns the completed order.
  } catch (error) { // Handles dependency or validation failures.
    return res.status(502).json({ error: error.message }); // Returns a dependency failure response.
  } // Ends the error handler.
} // Ends order creation.

/** Returns all orders created by this prototype. */ // Documents the order listing function.
function listOrders(req, res) { // Defines the order listing handler.
  return res.json({ orders }); // Returns the current order list.
} // Ends order listing.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a health endpoint.
app.post("/orders", createOrder); // Registers order creation.
app.get("/orders", listOrders); // Registers order listing.

if (require.main === module) { // Starts the server only when this file runs directly.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the HTTP server.
} // Ends the direct-execution condition.

module.exports = { app, orders, callService }; // Exports the app and helpers for tests.
