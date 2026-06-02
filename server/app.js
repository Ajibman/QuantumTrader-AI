import express from "express";
import cors from "cors";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Health Check
app.get("/", (req, res) => {
    res.json({
        application: "QuantumTrader-AI",
        version: "0.1.0",
        status: "online",
        engine: "QONEXAI Core"
    });
});

// API Status
app.get("/api/status", (req, res) => {
    res.json({
        success: true,
        message: "QuantumTrader-AI API operational"
    });
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(
        `QuantumTrader-AI API running on port ${PORT}`
    );
});
