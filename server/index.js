
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 3001;

// Enable CORS with all origins
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Origin', 'X-Requested-With', 'Content-Type', 'Accept']
}));

// Handle preflight OPTIONS requests
app.options('*', cors());

// Log all requests
app.use((req, res, next) => {
  console.log(`📥 Incoming request: ${req.method} ${req.url}`);
  next();
});

// Test endpoint
app.get('/test', (req, res) => {
  res.json({ status: 'ok', message: 'Proxy server is running!' });
});

// Generic proxy middleware - handles ANY stream URL!
const genericProxy = createProxyMiddleware({
  target: 'http://localhost', // Will be replaced dynamically
  changeOrigin: true,
  logLevel: 'debug',
  router: (req) => {
    // Extract target URL from the request path
    const urlMatch = req.url.match(/^\/proxy\/(https?:\/\/.+)$/);
    if (urlMatch) {
      const targetUrl = new URL(urlMatch[1]);
      return `${targetUrl.protocol}//${targetUrl.host}`;
    }
    return null;
  },
  pathRewrite: (path, req) => {
    // Remove /proxy/ prefix and use the full target path
    const urlMatch = path.match(/^\/proxy\/(https?:\/\/.+)$/);
    if (urlMatch) {
      const targetUrl = new URL(urlMatch[1]);
      return targetUrl.pathname + targetUrl.search;
    }
    return path;
  },
  onProxyReq: (proxyReq, req, res) => {
    // Remove Origin header to avoid CORS issues
    proxyReq.removeHeader('Origin');
    // Set a real User-Agent
    proxyReq.setHeader('User-Agent', 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/125.0.0.0 Safari/537.36');
    console.log(`🔀 Proxying request to: ${proxyReq.protocol}//${proxyReq.host}${proxyReq.path}`);
  },
  onProxyRes: (proxyRes, req, res) => {
    // Add CORS headers
    proxyRes.headers['Access-Control-Allow-Origin'] = '*';
    proxyRes.headers['Access-Control-Allow-Methods'] = 'GET, POST, PUT, DELETE, OPTIONS';
    proxyRes.headers['Access-Control-Allow-Headers'] = 'Origin, X-Requested-With, Content-Type, Accept';
    proxyRes.headers['Access-Control-Expose-Headers'] = 'Content-Length, Content-Type';
    console.log(`📤 Response status: ${proxyRes.statusCode} for ${req.url}`);
  },
  onError: (err, req, res) => {
    console.error('❌ Proxy error:', err);
    res.writeHead(500, {
      'Access-Control-Allow-Origin': '*',
      'Content-Type': 'application/json'
    });
    res.end(JSON.stringify({ error: 'Proxy error', details: err.message }));
  },
  timeout: 30000, // 30 second timeout
  proxyTimeout: 30000,
});

// Apply proxy route
app.use('/proxy', genericProxy);

// Serve static files from dist in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static(path.join(__dirname, '../dist')));
  app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, '../dist/index.html'));
  });
}

app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on http://localhost:${PORT}`);
  console.log(`📺 Generic proxy available at /proxy/{stream-url}`);
  console.log(`Example: /proxy/http://ugeen.live:8080/live/...`);
});
