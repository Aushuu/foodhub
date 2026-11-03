import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('foods');

    if (req.method === 'GET') {
      const { category, search } = req.query;
      let filter = {};

      if (category && category !== 'all') {
        filter.category = { $regex: new RegExp(`^${category}$`, 'i') };
      }

      if (search) {
        filter.$or = [
          { name: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } }
        ];
      }

      const foods = await collection.find(filter).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(foods);
    }

    if (req.method === 'POST') {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin authorization required.' });
      }

      const { name, description, price, category, image, isVegetarian, isAvailable } = req.body;
      if (!name || !price || !category || !image) {
        return res.status(400).json({ message: 'Name, price, category, and image are required.' });
      }

      const newFood = {
        name,
        description: description || '',
        price: Number(price),
        category,
        image,
        isVegetarian: Boolean(isVegetarian),
        isAvailable: isAvailable !== false,
        createdAt: new Date()
      };

      const result = await collection.insertOne(newFood);
      return res.status(201).json({ ...newFood, _id: result.insertedId });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Foods API Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

