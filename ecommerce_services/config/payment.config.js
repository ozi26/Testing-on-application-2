// Configuration for the Payment Service; this file keeps service settings in one central config folder.

module.exports = { // Starts the exported configuration object.
  // Service name used in logs and health responses.
  serviceName: 'Payment Service', // Sets the service display name.
  // HTTP port used when the service starts.
  port: Number(process.env.PAYMENT_PORT || 3009), // Sets the service HTTP port.(3005)
  // Service data label used by the simple prototype state store.
  dataFile: 'payments', // Labels the service data collection.
}; // Ends the exported configuration object.
