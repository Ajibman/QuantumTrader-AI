// ===========================================================
// MODULE 08 → 09 RELAY LINKAGE — Quantum to Ethics Compliance
// ===========================================================

/**
 * This relay transmits the interpreted quantum data from QMI (Module08)
 * to the Ethics & Compliance Engine (Module09) for validation and adjustment.
 */

const { interpretQuantumSignal } = require("./module08");
const { evaluateCompliance } = require("./module09");

async function relayQuantumToEthics(quantumPayload) {
  console.log("⚡ Initiating Relay: Quantum → Ethics Validation");

  try {
    // Step 1: Run QMI interpretation
    const interpretation = await interpretQuantumSignal(quantumPayload);

    if (interpretation.status === "failed") {
      throw new Error("Quantum interpretation failed — cannot continue relay.");
    }

    // Step 2: Forward result to Ethics Compliance Engine
    const ethicsResult = await evaluateCompliance(interpretation);

    console.log("✅ Relay Successful: Ethics validation complete.");
    return {
      relayStatus: "ok",
      interpretation,
      ethicsResult,
    };
  } catch (error) {
    console.error("❌ Relay Failure (QMI → Ethics):", error.message);
    return {
      relayStatus: "error",
      error: error.message,
    };
  }
}

module.exports = { relayQuantumToEthics };
