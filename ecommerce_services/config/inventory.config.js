// Configuration for the Inventory Service; this file keeps service settings in one central config folder.

module.exports = { // Starts the exported configuration object.
  // Service name used in logs and health responses.
  serviceName: 'Inventory Service', // Sets the service display name.
  // HTTP port used when the service starts.
  port: Number(process.env.INVENTORY_PORT || 3010), // Sets the service HTTP port.(3002)
  // Service data label used by the simple prototype state store.
  dataFile: 'inventory', // Labels the service data collection.
}; // Ends the exported configuration object.
