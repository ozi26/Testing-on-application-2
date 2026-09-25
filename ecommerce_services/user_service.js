// User Service: registers customers and provides basic customer lookup.

const express = require("express"); // Imports Express for HTTP endpoints.
const config = require("./config/user.config"); // Loads user-service configuration.

const app = express(); // Creates the Express application.
app.use(express.json()); // Enables JSON request parsing.

const users = new Map(); // Stores customer records in memory.

/** Registers a new customer. */ // Documents the user registration function.
function createUser(req, res) { // Defines the registration handler.
  const { id, name, email } = req.body; // Reads the customer fields from the request.
  if (!id || !name || !email) return res.status(400).json({ error: "id, name and email are required" }); // Validates required fields.
  if (users.has(id)) return res.status(409).json({ error: "User already exists" }); // Rejects duplicate identifiers.
  const user = { id, name, email }; // Creates the customer record.
  users.set(id, user); // Saves the customer.
  return res.status(201).json(user); // Returns the new customer.
} // Ends user creation.

/** Finds a customer by identifier. */ // Documents the user lookup function.
function getUser(req, res) { // Defines the lookup handler.
  const user = users.get(req.params.id); // Reads the customer record.
  if (!user) return res.status(404).json({ error: "User not found" }); // Handles an unknown user.
  return res.json(user); // Returns the customer.
} // Ends user lookup.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a health endpoint.
app.post("/users", createUser); // Registers user creation.
app.get("/users/:id", getUser); // Registers user lookup.

if (require.main === module) { // Starts the service only for direct execution.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the HTTP server.
} // Ends the direct-execution condition.

module.exports = { app, users }; // Exports the app and state for tests.
