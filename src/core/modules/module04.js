,,,js
cat > modules/module04.js <<'EOF'
/**
 * QuantumTrader AI — Module04.js
 * Analytics & Behavioral Intelligence Layer
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class BehavioralAnalytics extends EventEmitter {
  constructor() {
    super();
    this.sourcePath = path.join(__dirname, '../logs/observation_log.json');
    this.reportPath = path.join(__dirname, '../logs/behavioral_report.json');
  }

  analyzeRecentObservations() {
    if (!fs.existsSync(this.sourcePath)) return null;

    const lines = fs.readFileSync(this.sourcePath, 'utf8').trim().split('\n');
    const recentEntries = lines.slice(-50).map(l => JSON.parse(l));

    const averageSignal = recentEntries.reduce((acc, e) => acc + (e.data.signalStrength || 0), 0) / recentEntries.length;
    const imbalanceCount = recentEntries.filter(e => !e.data.balanced).length;

    const emotionalIndex = (100 - imbalanceCount * 2) * (averageSignal / 100);
    const equilibriumStatus = emotionalIndex >= 60 ? 'Stable' : 'Unstable';

    const report = {
      timestamp: new Date().toISOString(),
      totalEntries: recentEntries.length,
      averageSignal: averageSignal.toFixed(2),
      imbalanceCount,
      emotionalIndex: emotionalIndex.toFixed(2),
      equilibriumStatus
    };

    fs.writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
    this.emit('analytics_complete', report);

    console.log('📊 Behavioral analytics updated:', report);
    return report;
  }
}

const behavioralAI = new BehavioralAnalytics();

function runBehavioralAnalysis() {
  const result = behavioralAI.analyzeRecentObservations();
  return result;
}

behavioralAI.on('analytics_complete', (report) => {
  try {
    const medusaPath = path.join(__dirname, '../logs/system_diagnostics.json');
    let diagnostics = {};

    if (fs.existsSync(medusaPath)) {
      diagnostics = JSON.parse(fs.readFileSync(medusaPath, 'utf8'));
    }

    diagnostics.behavioralReport = report;
    fs.writeFileSync(medusaPath, JSON.stringify(diagnostics, null, 2));
  } catch (err) {
    console.error('❌ Failed to sync behavioral report with Medusa:', err.message);
  }
});

module.exports = {
  runBehavioralAnalysis,
  behavioralAI
};

// ======== Module Chaining Layer: Auto-trigger Quantum Correlation Engine ========

try {
  const { qce } = require('./module05');
  
  console.log('\n🔗 Module04 → Module05 Chaining Initialized...');
  console.log('🧠 Behavioral Report ready — triggering Quantum Correlation Engine (Module05)...');
  
  setTimeout(() => {
    const correlationResult = qce.run();
    console.log('✅ Module05 completed:', correlationResult.decision, 'with QTCI:', correlationResult.qtci);
  }, 2500); // 2.5 sec delay to allow behavioral data to finalize
} catch (err) {
  console.error('⚠️ Auto-trigger from Module04 to Module05 failed:', err.message);
}
EOF
