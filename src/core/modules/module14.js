,,,js
// ==========================================================
// MODULE 14 — System Integration & Propagation Layer
// ==========================================================
// Purpose: Integrate validated outputs from Module13 across
// active trading, intelligence, and quantum harmonics modules.
// Ensures real-time propagation of validated updates.
// ==========================================================

const path = require("path");
const fs = require("fs");

const integrationLog = path.join(__dirname, "../logs/integration_log.json");

// ----------------------------------------------------------
// Initialize Integration Layer
// ----------------------------------------------------------
async function initialize(feedbackState) {
    console.log("🧩 Module14 initializing — Integration & Propagation Layer...");

    if (!feedbackState || !feedbackState.validationScore) {
        console.warn("⚠️ Missing feedbackState from Module13. Running fallback...");
        return runFallbackIntegration();
    }

    console.log("📥 Received feedbackState from Module13:");
    console.table(feedbackState);

    const integrationResult = integrateValidatedData(feedbackState);
    logIntegration(integrationResult);

    console.log("✅ Module14 integration complete.");
    console.table(integrationResult);

    return integrationResult;
}

// ----------------------------------------------------------
// Integrate Validated Data
// ----------------------------------------------------------
function integrateValidatedData(feedbackState) {
    const systemUpdate = {
        timestamp: new Date(),
        status: feedbackState.quantumIntegrity ? "Propagated" : "Suspended",
        propagatedScore: feedbackState.validationScore,
        notes: feedbackState.feedbackMessages.join("; "),
    };

    return systemUpdate;
}

// ----------------------------------------------------------
// Log Integration
// ----------------------------------------------------------
function logIntegration(data) {
    try {
        let logs = [];
        if (fs.existsSync(integrationLog)) {
            logs = JSON.parse(fs.readFileSync(integrationLog, "utf8"));
        }
        logs.push(data);
        fs.writeFileSync(integrationLog, JSON.stringify(logs, null, 2));
    } catch (err) {
        console.error("❌ Integration logging error:", err.message);
    }
}

// ----------------------------------------------------------
// Fallback Integration
// ----------------------------------------------------------
function runFallbackIntegration() {
    const result = {
        timestamp: new Date(),
        status: "Fallback Mode Activated",
        message: "Operating with last known stable state.",
    };
    console.table(result);
    return result;
}
const module15 = require('./module15');

function module14Bridge() {
  console.log("🧩 Module14 completing verification...");
  module15.initBridge();
}

const module15 = require('./module15');

function module14Bridge() {
  console.log("🧩 Module14 completing verification...");
  module15.initBridge();
}

module.exports = {
  module14Bridge
};
module.exports = { initialize };
