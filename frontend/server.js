const http = require('http');
const fs = require('fs');
const path = require('path');

const port = process.env.PORT || 3002;

const mimeTypes = {
  '.html': 'text/html',
  '.css': 'text/css',
  '.js': 'application/javascript',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.ico': 'image/x-icon'
};

const server = http.createServer((req, res) => {
  // Handle favicon requests
  if (req.url === '/favicon.ico') {
    res.statusCode = 204; // No Content
    res.end();
    return;
  }

  // Parse URL to handle query parameters
  const url = new URL(req.url, `http://localhost:${port}`);
  let filePath = '.' + url.pathname;
  
  if (filePath === './') {
    filePath = './index.html';
  }

  const extname = String(path.extname(filePath)).toLowerCase();
  const mimeType = mimeTypes[extname] || 'application/octet-stream';

  fs.readFile(filePath, (error, content) => {
    if (error) {
      if (error.code === 'ENOENT') {
        // File not found
        res.statusCode = 404;
        res.setHeader('Content-Type', 'text/html');
        res.end('<h1>404 - File Not Found</h1>', 'utf-8');
      } else {
        // Server error
        res.statusCode = 500;
        res.setHeader('Content-Type', 'text/plain');
        res.end(`Server Error: ${error.code}`, 'utf-8');
      }
    } else {
      // Success
      res.statusCode = 200;
      res.setHeader('Content-Type', mimeType);
      res.setHeader('Cache-Control', 'no-cache');
      res.end(content, 'utf-8');
    }
  });
});

server.listen(port, () => {
  console.log(`🚀 AI Economic Advisor running at http://localhost:${port}`);
  console.log(`📊 Dashboard: http://localhost:${port}`);
  console.log(`💼 Portfolio: http://localhost:${port}#portfolio`);
  console.log(`🤖 AI Chat: http://localhost:${port}#chat`);
});