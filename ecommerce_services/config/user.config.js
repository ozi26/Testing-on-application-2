// Configuration for the User Service; this file keeps service settings in one central config folder.

module.exports = { // Starts the exported configuration object.
  // Service name used in logs and health responses.
  serviceName: 'User Service', // Sets the service display name.
  // HTTP port used when the service starts.
  port: Number(process.env.USER_PORT || 3007), // Sets the service HTTP port.
  // Service data label used by the simple prototype state store.
  dataFile: 'users', // Labels the service data collection.
}; // Ends the exported configuration object.
