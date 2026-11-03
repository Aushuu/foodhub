import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import { connectDB } from './db.js';
import testRouter from './routes/test.js';
import foodsRouter from './routes/foods.js';
import authRouter from './routes/auth.js';
import ordersRouter from './routes/orders.js';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const distPath = path.join(__dirname, '../dist');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors({
  origin: '*',
  credentials: true
}));
app.use(express.json());

// API Routes
app.use('/api', testRouter);
app.use('/api/foods', foodsRouter);
app.use('/api/auth', authRouter);
app.use('/api/orders', ordersRouter);

// Serve static frontend build if present (Production deployment on Render, Railway, etc.)
if (fs.existsSync(distPath)) {
  app.use(express.static(distPath));

  app.get('*', (req, res, next) => {
    if (req.path.startsWith('/api')) return next();
    res.sendFile(path.join(distPath, 'index.html'));
  });
} else {
  // Dev root route
  app.get('/', (req, res) => {
    res.send(`
      <html>
        <body style="font-family: system-ui; padding: 40px; line-height: 1.6; max-width: 600px; margin: auto;">
          <h2>🍔 FoodHub Express Backend</h2>
          <p>Backend API is active and ready.</p>
          <ul>
            <li><a href="/api/health">/api/health</a> - Server health check</li>
            <li><a href="/api/test-db">/api/test-db</a> - Verify MongoDB Atlas connection</li>
            <li><a href="/api/foods">/api/foods</a> - Food dishes</li>
          </ul>
        </body>
      </html>
    `);
  });
}

// Start Server and Connect DB
async function startServer() {
  try {
    await connectDB();
  } catch (err) {
    console.warn('⚠️ Starting Express server with pending MongoDB connection...');
  }

  app.listen(PORT, () => {
    console.log(`\n🚀 FoodHub Express server running on: http://localhost:${PORT}`);
    console.log(`🧪 Test MongoDB connection at: http://localhost:${PORT}/api/test-db`);
    console.log(`❤️ Health check endpoint at: http://localhost:${PORT}/api/health\n`);
  });
}

startServer();

export default app;
