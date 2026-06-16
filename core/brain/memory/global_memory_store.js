// ======================================================
// GLOBAL MEMORY STORE — PERSISTENT SYSTEM MEMORY LAYER
// ======================================================

export class GlobalMemoryStore {

  constructor() {
    this.events = [];
    this.snapshots = [];
  }

  // ------------------------------------------------------
  // TRADE MEMORY
  // ------------------------------------------------------

  recordTrade(tradeResult) {
    this.events.push({
      type: "TRADE",
      timestamp: Date.now(),
      data: tradeResult
    });

    this._trim();
  }

  // ------------------------------------------------------
  // DECISION MEMORY (MetaBrain output)
  // ------------------------------------------------------

  recordDecision(decision) {
    this.events.push({
      type: "DECISION",
      timestamp: Date.now(),
      data: decision
    });

    this._trim();
  }

  // ------------------------------------------------------
  // SYSTEM STATE SNAPSHOT
  // ------------------------------------------------------

  snapshot(state) {
    this.snapshots.push({
      timestamp: Date.now(),
      state
    });

    if (this.snapshots.length > 200) {
      this.snapshots.shift();
    }
  }

  // ------------------------------------------------------
  // ANALYTICS
  // ------------------------------------------------------

  getHistory(filterType = null) {
    if (!filterType) return this.events;

    return this.events.filter(e => e.type === filterType);
  }

  getSnapshots() {
    return this.snapshots;
  }

  getRecent(limit = 20) {
    return this.events.slice(-limit);
  }

  // ------------------------------------------------------
  // RECOVERY LAYER (future restart support)
  // ------------------------------------------------------

  getLastState() {
    return this.snapshots[this.snapshots.length - 1] || null;
  }

  // ------------------------------------------------------
  // INTERNAL CONTROL
  // ------------------------------------------------------

  _trim() {
    if (this.events.length > 2000) {
      this.events.splice(0, 500);
    }
  }
}
