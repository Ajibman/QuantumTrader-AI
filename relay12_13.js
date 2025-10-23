// ========================================
// RELAY LINK: Module12 → Module13
// ========================================
// Function: Transfers adaptive governance metrics and compliance feedback
// into the Execution Validation & Feedback Layer (Module13).
// Ensures continuity in ethical and operational integrity across stages.

const module12 = require("./modules/module12");
const module13 = require("./modules/module13");

async function relay12_13() {
    try {
        console.log("🔗 Relay12_13 engaged: Passing governance feedback to Module13...");

        if (!module12.metrics || Object.keys(module12.metrics).length === 0) {
            console.warn("⚠️ No metrics found in Module12. Running governance cycle...");
            module12.runGovernanceCycle();
        }

        const governancePayload = {
            source: "Module12",
            timestamp: new Date(),
            metrics: module12.metrics,
            complianceStatus: module12.metrics.ethicalCompliance,
            feedback: module12.metrics.moduleFeedback,
        };

        // Trigger Module13 initialization with adaptive feedback
        await module13.initialize(governancePayload);

        console.log("✅ Relay12_13 complete — Governance → Execution Validation synced.");
    } catch (err) {
        console.error("❌ Relay12_13 error:", err.message);
    }
}

module.exports = { relay12_13 };
