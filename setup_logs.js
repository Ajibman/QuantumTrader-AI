,,,js
// ==========================================================
// LOG DIRECTORY INITIALIZATION SCRIPT
// ==========================================================

const fs = require("fs");
const path = require("path");

const logDir = path.join(__dirname, "logs");
const files = [
  "feedback_log.json",
  "diagnostics_log.json",
  "trade_activity_log.json",
  "ethics_audit_log.json",
  "quantum_memory_log.json",
  "relay_activity_log.json"
];

function initializeLogs() {
  if (!fs.existsSync(logDir)) {
    fs.mkdirSync(logDir);
    console.log("📁 Logs directory created.");
  }

  files.forEach(file => {
    const filePath = path.join(logDir, file);
    if (!fs.existsSync(filePath)) {
      fs.writeFileSync(filePath, "[]");
      console.log(`📝 Created ${file}`);
    }
  });

  console.log("✅ All log files ready.");
}

initializeLogs();
