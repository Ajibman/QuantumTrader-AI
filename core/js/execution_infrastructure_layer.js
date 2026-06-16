// ======================================================
// STAGE 21 — EXECUTION INFRASTRUCTURE LAYER
// QUEUES + RETRY + BACKPRESSURE + SCALING READY
// ======================================================

export class ExecutionInfrastructureLayer {
  constructor(executionEngine) {
    this.executionEngine = executionEngine;

    // -----------------------------
    // CORE QUEUE SYSTEM
    // -----------------------------
    this.queue = [];
    this.processing = false;

    // -----------------------------
    // RETRY SYSTEM
    // -----------------------------
    this.retryQueue = [];
    this.maxRetries = 3;

    // -----------------------------
    // METRICS
    // -----------------------------
    this.metrics = {
      processed: 0,
      failed: 0,
      retried: 0
    };

    // -----------------------------
    // BACKPRESSURE CONTROL
    // -----------------------------
    this.maxQueueSize = 1000;
  }

  // =====================================================
  // PUBLIC ENTRY POINT
  // =====================================================

  submit(signal, decision, executionPlan) {
    if (this.queue.length >= this.maxQueueSize) {
      return {
        status: "REJECTED_BACKPRESSURE",
        reason: "QUEUE_FULL"
      };
    }

    const job = {
      id: this._uuid(),
      signal,
      decision,
      executionPlan,
      attempts: 0,
      createdAt: Date.now()
    };

    this.queue.push(job);

    this._process();

    return {
      status: "QUEUED",
      jobId: job.id
    };
  }

  // =====================================================
  // QUEUE PROCESSOR (ASYNC PIPELINE)
  // =====================================================

  async _process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const job = this.queue.shift();

      try {
        await this._executeJob(job);
        this.metrics.processed++;

      } catch (err) {
        job.attempts++;

        if (job.attempts <= this.maxRetries) {
          this.retryQueue.push(job);
          this.metrics.retried++;
        } else {
          this.metrics.failed++;
        }
      }
    }

    this.processing = false;

    // process retry queue if needed
    if (this.retryQueue.length > 0) {
      this._handleRetries();
    }
  }

  // =====================================================
  // EXECUTION WRAPPER
  // =====================================================

  async _executeJob(job) {
    const { signal, decision, executionPlan } = job;

    const result = this.executionEngine.process(
      signal,
      decision,
      executionPlan
    );

    // simulate async latency
    await this._delay(5);

    if (!result || Math.random() < 0.02) {
      throw new Error("EXECUTION_FAILURE");
    }

    return result;
  }

  // =====================================================
  // RETRY ENGINE
  // =====================================================

  async _handleRetries() {
    const retryBatch = [...this.retryQueue];
    this.retryQueue = [];

    for (const job of retryBatch) {
      await this._delay(10);
      this.queue.push(job);
    }

    this._process();
  }

  // =====================================================
  // BACKPRESSURE SAFETY
  // =====================================================

  isOverloaded() {
    return this.queue.length > this.maxQueueSize * 0.8;
  }

  // =====================================================
  // METRICS
  // =====================================================

  getMetrics() {
    return {
      ...this.metrics,
      queueSize: this.queue.length,
      retrySize: this.retryQueue.length,
      overload: this.isOverloaded()
    };
  }

  // =====================================================
  // UTILITIES
  // =====================================================

  _uuid() {
    return "job_" + Math.random().toString(36).substring(2, 10);
  }

  _delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
        }
