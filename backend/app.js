const express = require('express');
const cors = require('cors');
const { getPool } = require('./db/pool');
const { notFound, errorHandler } = require('./middleware/errorHandler');
const authRoutes = require('./routes/auth');
const generateRoutes = require('./routes/generate');
const paymentRoutes = require('./routes/payment');
const dashboardRoutes = require('./routes/dashboard');
const adminRoutes = require('./routes/admin');

const app = express();

getPool(); // initialize Postgres connection pool (Supabase)

const allowedOrigins = [
  'http://localhost:5173',
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) return callback(null, true);
      callback(new Error('Not allowed by CORS'));
    },
    credentials: true
  })
);
app.use(express.json());

// simple request logger
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    console.log(`${new Date().toISOString()} ${req.method} ${req.originalUrl} ${res.statusCode} ${Date.now() - start}ms`);
  });
  next();
});

app.get('/api/health', (req, res) => res.json({ success: true, message: 'SiteBazar API is running' }));

app.use('/api/auth', authRoutes);
app.use('/api', generateRoutes);
app.use('/api', paymentRoutes);
app.use('/api', dashboardRoutes);
app.use('/api', adminRoutes);

app.use(notFound);
app.use(errorHandler);

module.exports = app;
