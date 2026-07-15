const express = require('express');
const cors = require('cors');
const connectDatabase = require('./db');

require('./models/Admin');
require('./models/RoadReading');
require('./models/Feedback');
const { ensureDemoData } = require('./seed');

const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes');
const requireToken = require('./middleware/AuthTokenRequired');

const app = express();
const port = Number(process.env.PORT) || 5050;
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:3000,http://localhost:3001')
  .split(',')
  .map((origin) => origin.trim());

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '1mb' }));

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'Road Health Map API' });
});
app.use('/api/auth', authRoutes);
app.use('/api/dashboard', requireToken, dashboardRoutes);

// Backwards-compatible endpoints used by the original frontend.
app.use(authRoutes);
app.get('/', requireToken, (req, res) => res.json(req.admin));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server.' });
});

async function start() {
  try {
    await connectDatabase();
    await ensureDemoData();
    app.listen(port, () => console.log(`Road Health Map API running at http://localhost:${port}`));
  } catch (error) {
    console.error(`Unable to start API: ${error.message}`);
    process.exit(1);
  }
}

start();
