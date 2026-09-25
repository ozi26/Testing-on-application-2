// Payment Service: simulates payment authorization without connecting to a real bank.

const express = require("express"); // Imports Express for HTTP endpoints.
const config = require("./config/payment.config"); // Loads payment-service configuration.

const app = express(); // Creates the Express application.
app.use(express.json()); // Enables JSON request parsing.

const payments = []; // Stores successful simulated payments in memory.

/** Processes a simulated card payment. */ // Documents the payment function.
function processPayment(req, res) { // Defines the payment handler.
  const amount = Number(req.body.amount); // Converts the amount to a number.
  const currency = req.body.currency || "USD"; // Uses USD when no currency is supplied.
  if (!Number.isFinite(amount) || amount <= 0) return res.status(400).json({ error: "A positive amount is required" }); // Validates the payment amount.
  const payment = { id: `pay-${payments.length + 1}`, amount, currency, status: "approved" }; // Creates a simulated approved payment record.
  payments.push(payment); // Stores the payment.
  return res.status(201).json(payment); // Returns the payment result.
} // Ends the payment handler.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a health endpoint.
app.post("/payments", processPayment); // Registers the payment endpoint.

if (require.main === module) { // Starts the server only for direct execution.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the HTTP server.
} // Ends the direct-execution condition.

module.exports = { app, payments }; // Exports the app and state for tests.
