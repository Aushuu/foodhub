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
    const user = authenticateRequest(req);
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    let filter = {};
    if (user && user.userId) {
      filter = {
        $or: [
          { userId: new ObjectId(user.userId) },
          { customerEmail: user.email }
        ]
      };
    } else {
      // If unauthenticated guest request, return recent orders from same session if email supplied
      const email = req.query.email;
      if (email) {
        filter = { customerEmail: email };
      } else {
        return res.status(200).json([]);
      }
    }

    const orders = await ordersCollection.find(filter).sort({ createdAt: -1 }).toArray();
    return res.status(200).json(orders);
  } catch (err) {
    console.warn('My Orders API Error, returning empty list:', err.message);
    return res.status(200).json([]);
  }
}

