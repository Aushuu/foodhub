import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  const user = authenticateRequest(req);
  if (!user || !user.userId) {
    return res.status(401).json({ message: 'Unauthorized. Please log in.' });
  }

  try {
    const { db } = await connectToDatabase();
    const cartsCollection = db.collection('carts');
    const userId = new ObjectId(user.userId);

    if (req.method === 'GET') {
      const cart = await cartsCollection.findOne({ userId });
      return res.status(200).json(cart || { userId, items: [] });
    }

    if (req.method === 'POST') {
      const { foodId, quantity } = req.body;
      if (!foodId) return res.status(400).json({ message: 'foodId is required' });

      let cart = await cartsCollection.findOne({ userId });
      if (!cart) {
        cart = {
          userId,
          items: [{ foodId: new ObjectId(foodId), quantity: Number(quantity) || 1 }],
          updatedAt: new Date()
        };
        await cartsCollection.insertOne(cart);
      } else {
        const itemIdx = cart.items.findIndex(i => i.foodId.toString() === foodId);
        if (itemIdx > -1) {
          cart.items[itemIdx].quantity += (Number(quantity) || 1);
        } else {
          cart.items.push({ foodId: new ObjectId(foodId), quantity: Number(quantity) || 1 });
        }
        await cartsCollection.updateOne(
          { userId },
          { $set: { items: cart.items, updatedAt: new Date() } }
        );
      }
      return res.status(200).json(cart);
    }

    if (req.method === 'DELETE') {
      const { foodId } = req.query;
      if (foodId) {
        await cartsCollection.updateOne(
          { userId },
          { $pull: { items: { foodId: new ObjectId(foodId) } }, $set: { updatedAt: new Date() } }
        );
      } else {
        await cartsCollection.deleteOne({ userId });
      }
      return res.status(200).json({ message: 'Cart updated' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Cart API Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

