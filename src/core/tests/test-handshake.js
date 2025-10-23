// ==========================================================
// HANDSHAKE TEST — Module13 → Module14
// ==========================================================

const Module13 = require("../modules/module13");
const Module14 = require("../modules/module14");

(async () => {
  console.log("\n🤝 Testing handshake between Module13 and Module14...\n");

  // Simulate a payload from Module12
  const payloadFromModule12 = {
    metrics: {
      ethicalCompliance: true,
      systemStability: true,
      dynamicAdjustments: true
    }
  };

  // Run Module13 validation
  const result13 = await Module13.initialize(payloadFromModule12);

  // Forward the result to Module14
  const result14 = await Module13.forwardToModule14(result13);

  console.log("\n✅ Handshake completed successfully.\n");
  console.log("Module14 received the following from Module13:");
  console.log(result14);
})();
