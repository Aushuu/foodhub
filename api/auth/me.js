import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const payload = authenticateRequest(req);
    if (!payload || !payload.userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const { db } = await connectToDatabase();
    const user = await db.collection('users').findOne(
      { _id: new ObjectId(payload.userId) },
      { projection: { password: 0 } }
    );

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    return res.status(200).json({ user });
  } catch (err) {
    console.error('Me API Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

