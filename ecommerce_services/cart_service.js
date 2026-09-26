// Cart Service: creates and manages simple shopping carts.

const express = require("express"); // Imports Express for HTTP routing.
const config = require("./config/cart.config"); // Loads cart-service configuration.

const app = express(); // Creates the Express application.
app.use(express.json()); // Enables JSON request bodies.

const carts = new Map(); // Stores carts by user identifier in memory.

/** Returns the cart belonging to a user. */ 
// Documents the cart lookup function.
// This is just a random comment to test the anayzer..

function getCart(req, res) { // Defines the cart lookup handler.
  const cart = carts.get(req.params.userId) || []; // Reads the cart or returns an empty list.
  return res.json({ userId: req.params.userId, items: cart }); // Sends the cart contents.
} // Ends the cart lookup handler.

/** Adds a product and quantity to a user's cart. */ // Documents the add-to-cart function.
function addItem(req, res) { // Defines the add item handler.
  const quantity = Number(req.body.quantity); // Converts quantity to a number.
  const productId = req.body.productId; // Reads the product identifier.
  if (!productId || !Number.isInteger(quantity) || quantity <= 0) return res.status(400).json({ error: "productId and positive integer quantity are required" }); // Validates input.
  const cart = carts.get(req.params.userId) || []; // Loads or creates the user's cart.
  const existing = cart.find((item) => item.productId === productId); // Searches for an existing product line.
  if (existing) existing.quantity += quantity; // Increases the existing quantity when the product is already present.
  else cart.push({ productId, quantity }); // Adds a new product line when necessary.
  carts.set(req.params.userId, cart); // Saves the updated cart.
  return res.status(201).json({ userId: req.params.userId, items: cart }); // Returns the updated cart.
} // Ends the add item handler.

/** Removes every item from a user's cart. */ // Documents the clear-cart function.
function clearCart(req, res) { // Defines the cart clearing handler.
  carts.set(req.params.userId, []); // Replaces the cart with an empty list.
  return res.json({ userId: req.params.userId, items: [] }); // Confirms that the cart is empty.
} // Ends the clear handler.

app.get("/health", (req, res) => res.json({ status: "ok", service: config.serviceName })); // Provides a health endpoint.
app.get("/carts/:userId", getCart); // Registers cart lookup.
app.post("/carts/:userId/items", addItem); // Registers item creation.
app.delete("/carts/:userId", clearCart); // Registers cart clearing.

if (require.main === module) { // Starts the server only when this file is run directly.
  app.listen(config.port, () => console.log(`${config.serviceName} listening on ${config.port}`)); // Starts the HTTP server.
} // Ends the direct-execution check.

module.exports = { app, carts }; // Exports the app and state for tests.
