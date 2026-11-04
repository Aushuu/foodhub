import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';

const safeObjectId = (id) => {
  if (!id) return null;
  if (typeof id === 'string' && /^[0-9a-fA-F]{24}$/.test(id)) {
    try {
      return new ObjectId(id);
    } catch {
      return id;
    }
  }
  return id;
};

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const user = authenticateRequest(req);
    const email = req.query.email || (user ? user.email : null);

    let queryConditions = [];

    if (user && user.userId) {
      const objId = safeObjectId(user.userId);
      if (objId instanceof ObjectId) {
        queryConditions.push({ userId: objId });
      }
      queryConditions.push({ userId: user.userId });
    }

    if (email) {
      queryConditions.push({ customerEmail: { $regex: new RegExp(`^${email.trim()}$`, 'i') } });
    }

    if (queryConditions.length === 0) {
      return res.status(200).json([]);
    }

    try {
      const { db } = await connectToDatabase();
      const ordersCollection = db.collection('orders');
      const orders = await ordersCollection
        .find({ $or: queryConditions })
        .sort({ createdAt: -1 })
        .toArray();
      return res.status(200).json(orders);
    } catch (dbErr) {
      console.warn('My Orders DB fallback:', dbErr.message);
      return res.status(200).json([]);
    }
  } catch (err) {
    console.warn('My Orders API Error:', err.message);
    return res.status(200).json([]);
  }
}
