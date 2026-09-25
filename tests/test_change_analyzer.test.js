// Analyzer Tests: verifies that changed configuration files are classified correctly.
const { classifyChanges } = require("../analyzer/change_analyzer"); // Imports the analyzer function.

test("classifies config files as configuration", () => { // Defines the analyzer unit test.
  const result = classifyChanges(["sample_microservices/config/product.config.js", "sample_microservices/product_service.js"]); // Classifies two representative paths.
  expect(result[0].type).toBe("configuration"); // Confirms the config file is detected.
  expect(result[1].type).toBe("source"); // Confirms the source file is detected.
}); // Ends the analyzer test.
