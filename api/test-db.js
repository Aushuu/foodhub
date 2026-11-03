import { connectToDatabase } from './_lib/db.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { db } = await connectToDatabase();
    const collections = await db.listCollections().toArray();
    return res.status(200).json({
      connected: true,
      database: db.databaseName,
      collections: collections.map((c) => c.name),
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    console.error('Test DB API Error:', err);
    return res.status(500).json({
      connected: false,
      error: err.message || 'Failed to connect to MongoDB Atlas'
    });
  }
}
