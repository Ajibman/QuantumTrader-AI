// QuantumTrader-AI — Pipeline Stress Runner
// Load simulation layer (NO architecture changes)

export class PipelineStressRunner {

  constructor({ runtime }) {
    this.runtime = runtime;
    this.results = [];
  }

  // =====================================
  // RUN STRESS TEST
  // =====================================

  async run({
    events = [],
    concurrency = 1,
    delay = 0
  }) {

    const batches = this._chunk(events, concurrency);

    for (const batch of batches) {

      const promises = batch.map(event =>
        this._execute(event, delay)
      );

      const results = await Promise.all(promises);

      this.results.push(...results);
    }

    return this._summary();
  }

  // =====================================
  // SINGLE EXECUTION WRAPPER
  // =====================================

  async _execute(event, delay) {

    if (delay > 0) {
      await this._sleep(delay);
    }

    const result =
      await this.runtime.run(event);

    return {
      event,
      result,
      timestamp: Date.now()
    };
  }

  // =====================================
  // UTILITIES
  // =====================================

  _chunk(array, size) {

    const chunks = [];

    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }

    return chunks;
  }

  _sleep(ms) {
    return new Promise(resolve =>
      setTimeout(resolve, ms)
    );
  }

  // =====================================
  // STRESS SUMMARY
  // =====================================

  _summary() {

    const total = this.results.length;

    let success = 0;
    let failure = 0;
    let suppressed = 0;

    for (const r of this.results) {

      if (r.result?.success) success++;

      else failure++;

      if (r.result?.status === "suppressed_by_cclm") {
        suppressed++;
      }
    }

    return {
      totalRuns: total,

      successRate: total ? success / total : 0,
      failureRate: total ? failure / total : 0,
      suppressionRate: total ? suppressed / total : 0,

      concurrencyUsed: true,
      rawResults: this.results
    };
  }

  // =====================================
  // RESET
  // =====================================

  reset() {
    this.results = [];
  }
}
