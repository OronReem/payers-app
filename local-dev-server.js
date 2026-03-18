require('dotenv').config({ path: './frontend/.env.local' });
const http = require('http');
const handler = require('./api/extract.js');

const server = http.createServer((req, res) => {
  // Add Express-like helpers that Vercel provides
  res.status = function(code) {
    this.statusCode = code;
    return this;
  };
  res.json = function(data) {
    this.setHeader('Content-Type', 'application/json');
    this.end(JSON.stringify(data));
  };

  // Add CORS headers for local dev via proxy or direct
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    return res.end();
  }

  if (req.url === '/api/extract') {
    return handler(req, res);
  }

  res.statusCode = 404;
  res.end('Not found');
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log(`Local API dev server running on port ${PORT}`);
  console.log(`Loaded GEMINI_API_KEY from .env.local: ${!!process.env.VITE_FIREBASE_API_KEY}`);
});
