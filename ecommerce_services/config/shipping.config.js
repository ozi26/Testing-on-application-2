// Configuration for the Shipping Service; this file keeps service settings in one central config folder.
module.exports = { // Starts the exported configuration object.
  // Service name used in logs and health responses.
  serviceName: 'Shipping Service', // Sets the service display name.
  // HTTP port used when the service starts.
  port: Number(process.env.SHIPPING_PORT || 3006), // Sets the service HTTP port.
  // Service data label used by the simple prototype state store.
  dataFile: 'shipments', // Labels the service data collection.
}; // Ends the exported configuration object.
