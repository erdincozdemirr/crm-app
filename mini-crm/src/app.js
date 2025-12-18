const express = require('express');
const customerRoutes = require('./routes/customers');
const productRoutes = require('./routes/products');

const orderRoutes = require('./routes/orders');
const etlRoutes = require('./routes/etl');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Trace ID Middleware
const { randomUUID } = require('crypto');
const context = require('./lib/asyncContext');

app.use((req, res, next) => {
  const traceId = req.headers['x-trace-id'] || randomUUID();
  const store = new Map();
  store.set('traceId', traceId);

  // Add trace ID to response header
  res.setHeader('X-Trace-ID', traceId);

  context.run(store, () => {
    next();
  });
});

app.use('/api/customers', customerRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/etl', etlRoutes);

// Swagger UI
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');
const swaggerDocument = YAML.load('./docs/openapi.yaml');
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));


app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date() });
});

app.use((req, res, next) => {
  res.status(404).json({ error: 'Endpoint not found' });
});

app.use(require('./utils/errorHandler'));

module.exports = app;
