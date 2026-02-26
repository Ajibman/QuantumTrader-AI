// docs/server.mjs
import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const app = express();
const PORT = process.env.PORT || 3000;

// ES module fix for __dirname
const __filename = fileURLToPath(import.meta.url);
const _dirname = path.dirname(_filename);

// Serve static files from current directory (docs)
app.use(express.static(__dirname));

// Fallback to index.html for SPA routing
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

// Start server
app.listen(PORT, () => {
  console.log(`📦 Static server running at http://localhost:${PORT}`);
});
