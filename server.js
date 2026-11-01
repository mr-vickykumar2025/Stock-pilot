// Local development server. On Vercel, api/config.js serves the same config.
require('dotenv').config();
const express = require('express');
const path = require('path');
const { getFirebaseConfig } = require('./lib/firebase-config');

const app = express();
const PORT = Number(process.env.PORT) || 3000;
const publicDir = path.join(__dirname, 'public');

app.get('/api/config', (req, res) => {
  res.setHeader('Cache-Control', 'no-store');
  const config = getFirebaseConfig();
  if (config.error) return res.status(500).json({ error: config.error });
  return res.json(config);
});

app.use(express.static(publicDir));
app.get('*', (req, res) => res.sendFile(path.join(publicDir, 'index.html')));

app.listen(PORT, () => {
  console.log(`StockPilot is running at http://localhost:${PORT}`);
});
