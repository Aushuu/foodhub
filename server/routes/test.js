import express from 'express';
import { testConnection, getDb } from '../db.js';

const router = express.Router();

// General Health Check
router.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    server: 'FoodHub Express Backend',
    timestamp: new Date().toISOString()
  });
});

// Database Connection Test API
router.get('/test-db', async (req, res) => {
  const startTime = Date.now();
  const result = await testConnection();
  const latency = Date.now() - startTime;

  if (result.connected) {
    const db = getDb();
    let foodsCount = 0;
    try {
      foodsCount = await db.collection('foods').countDocuments();
    } catch (e) {
      // ignore
    }

    return res.status(200).json({
      success: true,
      message: '🎉 Successfully connected to MongoDB Atlas!',
      database: result.database,
      latency: `${latency}ms`,
      collections: result.collections,
      foodsCount,
      timestamp: new Date().toISOString()
    });
  } else {
    return res.status(503).json({
      success: false,
      message: '❌ Failed to connect to MongoDB Atlas',
      error: result.error || result.message,
      help: 'Make sure your IP is whitelisted (0.0.0.0/0) in MongoDB Atlas and your password in .env is correct.'
    });
  }
});

export default router;
