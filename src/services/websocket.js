class SignalWebSocket {

  constructor(url) {
    this.socket = new WebSocket(url);
    this.listeners = [];
  }

  connect() {
    this.socket.onmessage = (event) => {
      const message = JSON.parse(event.data);

      if (message.type === "AI_SIGNAL") {
        this.listeners.forEach(cb => cb(message.payload));
      }
    };
  }

  subscribe(callback) {
    this.listeners.push(callback);
  }
}

export const signalSocket = new SignalWebSocket("ws://localhost:8080");
