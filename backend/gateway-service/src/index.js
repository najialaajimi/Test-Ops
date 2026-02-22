const express = require('express');
const cors = require('cors');
const { createProxyMiddleware } = require('http-proxy-middleware');
const client = require('prom-client');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const USER_SERVICE_URL = process.env.USER_SERVICE_URL || 'http://user-service:3001';
const CATEGORY_SERVICE_URL = process.env.CATEGORY_SERVICE_URL || 'http://category-service:3002';
const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL || 'http://product-service:3003';

// Metrics
const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics();

const httpRequestDuration = new client.Histogram({
  name: 'gateway_http_request_duration_seconds',
  help: 'Duration of HTTP requests through gateway in seconds',
  labelNames: ['method', 'route', 'status_code'],
});

app.use(cors());

// Metrics middleware
app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

// Health check
app.get('/health', (req, res) => res.json({ status: 'ok', service: 'gateway-service' }));

// Metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

// Proxy routes
app.use('/api/users', createProxyMiddleware({ target: USER_SERVICE_URL, changeOrigin: true }));
app.use('/api/categories', createProxyMiddleware({ target: CATEGORY_SERVICE_URL, changeOrigin: true }));
app.use('/api/products', createProxyMiddleware({ target: PRODUCT_SERVICE_URL, changeOrigin: true }));

// 404 handler
app.use((req, res) => res.status(404).json({ message: 'Route not found' }));

if (require.main === module) {
  app.listen(PORT, () => console.log(`Gateway service running on port ${PORT}`));
}

module.exports = app;
