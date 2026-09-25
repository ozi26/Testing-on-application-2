// Configuration for the Cart Service; this file keeps service settings in one central config folder.

module.exports = { // Starts the exported configuration object.
  // Service name used in logs and health responses.
  serviceName: 'Cart Service', // Sets the service display name.
  // HTTP port used when the service starts.
  port: Number(process.env.CART_PORT || 3003), // Sets the service HTTP port.
  // Service data label used by the simple prototype state store.
  dataFile: 'carts', // Labels the service data collection.
}; // Ends the exported configuration object.
