// ======================================================
// STAGE 23B — STREAMING ORCHESTRATION GATEWAY
// REAL-TIME DUAL-ROUTE EXECUTION PIPELINE
// ======================================================

export class StreamingGateway {
  constructor({ cutoverController, wsServer }) {
    this.cutover = cutoverController;
    this.wss = wsServer;

    this.connections = new Set();

    // -----------------------------
    // STREAM CONFIG
    // -----------------------------
    this.config = {
      broadcastEnabled: true,
      includePathInfo: true
    };
  }

  // =====================================================
  // INIT WEBSOCKET HANDLERS
  // =====================================================

  init() {
    this.wss.on("connection", (ws) => {
      this.connections.add(ws);

      ws.send(JSON.stringify({
        type: "connection",
        status: "STREAM_ACTIVE",
        mode: "STAGE_23B"
      }));

      ws.on("message", async (msg) => {
        try {
          const signal = JSON.parse(msg.toString());

          // ---------------------------------
          // MAIN STREAM EVALUATION
          // ---------------------------------
          const result = await this.cutover.evaluate(signal);

          const payload = {
            type: "evaluation",
            data: result
          };

          ws.send(JSON.stringify(payload));

          // ---------------------------------
          // OPTIONAL BROADCAST (MULTI-CLIENT)
          // ---------------------------------
          if (this.config.broadcastEnabled) {
            this.broadcast(payload, ws);
          }

        } catch (err) {
          ws.send(JSON.stringify({
            type: "error",
            error: "STREAM_EVAL_FAILED",
            message: err.message
          }));
        }
      });

      ws.on("close", () => {
        this.connections.delete(ws);
      });
    });
  }

  // =====================================================
  // BROADCAST ENGINE
  // =====================================================

  broadcast(payload, sender) {
    for (const client of this.connections) {
      if (client !== sender && client.readyState === 1) {
        client.send(JSON.stringify(payload));
      }
    }
  }

  // =====================================================
  // STREAM CONFIG CONTROL
  // =====================================================

  setBroadcast(state) {
    this.config.broadcastEnabled = state;
  }

  getActiveConnections() {
    return this.connections.size;
  }
}
