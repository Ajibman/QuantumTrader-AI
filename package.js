{
  "scripts": {
    "start": "node server.js",
    "dev": "nodemon server.js",
    "fix-deps": "npm install && npm audit fix --force && npm dedupe"
  }
}

"scripts": {
  "start": "node scripts/checkServer.js && react-scripts start",
  "server": "node server/server.js",
  "dev": "concurrently \"npm run server\" \"npm start\""
}

{
  "name": "quantumtrader-ai",
  "version": "1.0.0",
  "type": "module",
  "main": "server.js",
  "scripts": {
    "start": "node server.js",
    "verify-ledger": "node server.js --verify",
    "export-logs": "node server.js --export '{\"visitorId\":null}'"
  },
  "dependencies": {
    "axios": "^1.4.0",
    "cors": "^2.8.5",
    "express": "^4.18.2",
    "socket.io": "^4.8.0",
    "body-parser": "^1.20.2"
  }
}
