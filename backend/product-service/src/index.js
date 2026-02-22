const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const client = require('prom-client');
require('dotenv').config();

const productRoutes = require('./routes/products');

const app = express();
const PORT = process.env.PORT || 3003;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://mongodb:27017/productdb';

const collectDefaultMetrics = client.collectDefaultMetrics;
collectDefaultMetrics({ register: client.register });

const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  registers: [client.register],
});

app.use(cors());
app.use(express.json());

app.use((req, res, next) => {
  const end = httpRequestDuration.startTimer();
  res.on('finish', () => {
    end({ method: req.method, route: req.path, status_code: res.statusCode });
  });
  next();
});

app.get('/health', (req, res) => res.json({ status: 'ok', service: 'product-service' }));

app.get('/metrics', async (req, res) => {
  res.set('Content-Type', client.register.contentType);
  res.end(await client.register.metrics());
});

app.use('/api/products', productRoutes);

const startServer = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');
    app.listen(PORT, () => console.log(`Product service running on port ${PORT}`));
  } catch (err) {
    console.error('Failed to connect to MongoDB:', err.message);
    process.exit(1);
  }
};

if (require.main === module) {
  startServer();
}

module.exports = app;
