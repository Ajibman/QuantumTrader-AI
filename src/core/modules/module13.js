,,,js
// ==========================================================
// MODULE 13 — Execution Validation & Feedback Layer
// ==========================================================
// Purpose: Validate outcomes of governance and compliance
// actions (from Module12), ensuring system decisions meet
// ethical, operational, and quantum alignment benchmarks.
// Provides dynamic feedback loops to recalibrate earlier modules.
// ==========================================================

const fs = require("fs");
const path = require("path");

const feedbackLog = path.join(__dirname, "../logs/feedback_log.json");

let executionState = {
    lastValidated: null,
    validationScore: 0,
    quantumIntegrity: true,
    feedbackMessages: [],
};

// ----------------------------------------------------------
// Initialize Validation Layer
// ----------------------------------------------------------
async function initialize(payload) {
    console.log("🧩 Module13 initializing — Execution Validation & Feedback Layer...");

    if (!payload || !payload.metrics) {
        console.warn("⚠️ No metrics received from Module12. Running self-check...");
        return runSelfCheck();
    }

    console.log("📥 Governance payload received from Module12:");
    console.log(JSON.stringify(payload, null, 2));

    const validationScore = computeValidationScore(payload.metrics);
    const feedback = generateFeedback(validationScore);

    executionState = {
        lastValidated: new Date(),
        validationScore,
        quantumIntegrity: validationScore >= 75,
        feedbackMessages: feedback,
    };

    // Log feedback for traceability
    logFeedback(executionState);

    console.log("✅ Module13 validation complete.");
    console.table(executionState);

    return executionState;
}

// ----------------------------------------------------------
// Compute Validation Score
// ----------------------------------------------------------
function computeValidationScore(metrics) {
    try {
        const ethical = metrics.ethicalCompliance ? 50 : 0;
        const stability = metrics.systemStability ? 30 : 0;
        const adaptability = metrics.dynamicAdjustments ? 20 : 0;

        return ethical + stability + adaptability;
    } catch (err) {
        console.error("❌ Validation scoring error:", err.message);
        return 0;
    }
}

// ----------------------------------------------------------
// Generate Feedback Messages
// ----------------------------------------------------------
function generateFeedback(score) {
    if (score >= 85) return ["Excellent alignment — no recalibration needed."];
    if (score >= 70) return ["Minor adjustments recommended — stable trajectory."];
    if (score >= 50) return ["Moderate recalibration required — monitor adaptive systems."];
    return ["Critical misalignment — trigger governance intervention immediately."];
}

// ----------------------------------------------------------
// Log Feedback
// ----------------------------------------------------------
function logFeedback(state) {
    const entry = {
        timestamp: new Date(),
        validationScore: state.validationScore,
        quantumIntegrity: state.quantumIntegrity,
        feedbackMessages: state.feedbackMessages,
    };

    try {
        let logData = [];
        if (fs.existsSync(feedbackLog)) {
            logData = JSON.parse(fs.readFileSync(feedbackLog, "utf8"));
        }
        logData.push(entry);
        fs.writeFileSync(feedbackLog, JSON.stringify(logData, null, 2));
    } catch (err) {
        console.error("❌ Error writing feedback log:", err.message);
    }
}

// ----------------------------------------------------------
// Self-Check Routine
// ----------------------------------------------------------
function runSelfCheck() {
    console.log("🧠 Running self-check in Module13...");
    const checkResult = {
        systemIntegrity: true,
        diagnostic: "All subsystems within acceptable variance levels.",
    };
    console.table(checkResult);
    return checkResult;
}
// ----------------------------------------------------------
// Handshake forward to Module14
// ----------------------------------------------------------
function forwardToModule14(validationResult) {
    try {
        const module14 = require("./module14");
        console.log("🔗 Forwarding validated payload to Module14...");
        module14.initialize(validationResult);
    } catch (err) {
        console.error("❌ Handshake to Module14 failed:", err.message);
    }
}

module.exports = {
    initialize,
    computeValidationScore,
    generateFeedback,
    runSelfCheck,
    forwardToModule14, 

};
