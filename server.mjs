 // server.mjs
// QuantumTrader AI™ Node Server (Full PWA Build)
// Architect & Builder: Olagoke Ajibulu
// Updated: December 2025
// ---------------------------------------------------

// 1. Core imports
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import helmet from "helmet";
import compression from "compression";
import cors from "cors";

// 2. Directory setup
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 3. App setup
const app = express();
const PORT = process.env.PORT || 3000;

// 4. Middleware
app.use(
  helmet({
    crossOriginEmbedderPolicy: false,
    contentSecurityPolicy: false,
  })
);
app.use(compression());
app.use(cors());
app.use(express.json());

// 5. Static files (front-end assets)
app.use(express.static(path.join(__dirname, "public"), { extensions: ["html", "htm"], maxAge: "1y" }));

// Cache control for assets
app.use((req, res, next) => {
  if (req.url.match(/\.(js|css|png|jpg|jpeg|svg|gif|ico|json)$/)) {
    res.setHeader("Cache-Control", "public, max-age=31536000");
  }
  next();
});

// 6. Module registry (status tracking)
const modules = {
  traderLab: false,
  cPilot: false,
  currencyPairs: false,
  tradingFloor: false,
  marketAnalytics: false,
  riskManagement: false,
  portfolioManager: false,
  signalsHub: false,
  alertSystem: false,
  aiInsights: false,
  historicalDataExplorer: false,
  strategyBuilder: false,
  agricCoop: false,
  ngos: false,
  philanthropy: false
};

// 7. Handshake route (front-end ↔ server)
app.post("/handshake", (req, res) => {
  const { userId } = req.body;
  console.log(`🔗 Handshake requested by user: ${userId}`);
  res.json({
    status: "success",
    message: "QuantumTrader-AI™ handshake established successfully.",
    modulesUnlocked: modules,
    timestamp: new Date().toISOString()
  });
});

// 8. Activation endpoint (QR Code triggered)
app.post("/activate", (req, res) => {
  const { userId, moduleKeys } = req.body;
  if (!userId || !moduleKeys || !Array.isArray(moduleKeys)) {
    return res.status(400).json({ success: false, message: "Invalid activation request" });
  }

  moduleKeys.forEach((key) => {
    if (modules.hasOwnProperty(key)) {
      modules[key] = true;
      console.log(`✅ Module activated: ${key} for user: ${userId}`);
    }
  });

  res.json({
    success: true,
    userId,
    activatedModules: moduleKeys,
    message: "Activation confirmed. Modules unlocked successfully."
  });
});

// 9. Module status endpoint
app.get("/module-status", (req, res) => {
  res.json({ modules });
});

// 10. Social Impact Tray info
app.get("/social-tray", (req, res) => {
  res.json({
    modules: {
      agricCoop: "Agricultural Cooperatives",
      ngos: "NGOs",
      philanthropy: "Philanthropy"
    }
  });
});

// 11. Left tray (Global Markets) info
app.get("/global-tray", (req, res) => {
  res.json({
    modules: {
      traderLab: "TraderLab",
      cPilot: "CPilot",
      currencyPairs: "Currency Pairs",
      tradingFloor: "Trading Floor",
      marketAnalytics: "Market Analytics",
      riskManagement: "Risk Management",
      portfolioManager: "Portfolio Manager",
      signalsHub: "Signals Hub",
      alertSystem: "Alert System",
      aiInsights: "AI Insights",
      historicalDataExplorer: "Historical Data Explorer",
      strategyBuilder: "Strategy Builder"
    }
  });
});

// 12. Fallback route: serve index.html for all other requests
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "index.html"));
});

// 13. Start server
app.listen(PORT, () => {
  console.log(`🚀 QuantumTrader-AI™ server running at http://localhost:${PORT}`);
});
