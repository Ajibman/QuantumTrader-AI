import fs from "fs";
import path from "path";

export class PersistentMemoryStore {

  constructor(filePath = "core/memory/meta_memory.json") {
    this.filePath = filePath;

    this.state = this._load() || {
      totalTrades: 0,
      wins: 0,
      losses: 0,
      cumulativeDrift: 0,
      learningBias: {
        trend: 0,
        risk: 0,
        volatility: 0
      },
      history: []
    };
  }

  // --------------------------------------------------
  // LOAD MEMORY FROM DISK
  // --------------------------------------------------

  _load() {
    try {
      if (fs.existsSync(this.filePath)) {
        const raw = fs.readFileSync(this.filePath, "utf-8");
        return JSON.parse(raw);
      }
    } catch (err) {
      console.error("[MEMORY] Load failed:", err.message);
    }
    return null;
  }

  // --------------------------------------------------
  // SAVE MEMORY TO DISK
  // --------------------------------------------------

  _save() {
    try {
      const dir = path.dirname(this.filePath);

      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }

      fs.writeFileSync(this.filePath, JSON.stringify(this.state, null, 2));
    } catch (err) {
      console.error("[MEMORY] Save failed:", err.message);
    }
  }

  // --------------------------------------------------
  // RECORD TRADE RESULT
  // --------------------------------------------------

  recordTrade(result = {}) {

    this.state.totalTrades++;

    if (result.success) {
      this.state.wins++;
    } else {
      this.state.losses++;
    }

    this.state.history.push({
      timestamp: Date.now(),
      success: result.success,
      pnl: result.pnl || 0
    });

    if (this.state.history.length > 200) {
      this.state.history.shift();
    }

    this._save();
  }

  // --------------------------------------------------
  // RECORD DRIFT UPDATE
  // --------------------------------------------------

  recordDrift(driftValue) {
    this.state.cumulativeDrift += driftValue;
    this._save();
  }

  // --------------------------------------------------
  // UPDATE LEARNING BIAS
  // --------------------------------------------------

  updateLearningBias(bias) {
    this.state.learningBias = {
      ...this.state.learningBias,
      ...bias
    };

    this._save();
  }

  // --------------------------------------------------
  // GETTERS
  // --------------------------------------------------

  getStats() {
    return this.state;
  }

  getWinRate() {
    if (this.state.totalTrades === 0) return 0;
    return this.state.wins / this.state.totalTrades;
  }
}
