require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;
const backendUrl = process.env.BACKEND_API_URL || 'http://localhost:8080';

// Serve environment variables to the frontend
app.get('/js/config.js', (req, res) => {
  res.type('application/javascript');
  res.send(`window.ENV = { BACKEND_API_URL: '${backendUrl}' };`);
});

// Serve static files from the 'public' directory
app.use(express.static(path.join(__dirname, 'public')));

// Fallback for SPA (if needed) or simple hello
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'VibeApp Frontend Server is running' });
});

app.listen(port, () => {
  console.log(`VibeApp Frontend is running at http://localhost:${port}`);
});
