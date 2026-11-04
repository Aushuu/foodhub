import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';
import { DEFAULT_FOODS } from '../_lib/defaultFoods.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,PATCH,DELETE,POST,PUT');
  res.setHeader('Access-Control-Allow-Headers', 'X-CSRF-Token, X-Requested-With, Accept, Accept-Version, Content-Length, Content-MD5, Content-Type, Date, X-Api-Version, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  // GET: Fetch all foods (with automatic fallback to default foods)
  if (req.method === 'GET') {
    const { category, search } = req.query;

    const filterList = (items) => {
      let result = [...items];
      if (category && category !== 'all') {
        result = result.filter(
          (f) => f.category && f.category.toLowerCase() === category.toLowerCase()
        );
      }
      if (search) {
        const q = search.toLowerCase();
        result = result.filter(
          (f) =>
            (f.name && f.name.toLowerCase().includes(q)) ||
            (f.description && f.description.toLowerCase().includes(q))
        );
      }
      return result;
    };

    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('foods');

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

      let foods = await collection.find(filter).sort({ createdAt: -1 }).toArray();

      // If database collection is empty, auto-seed with default dishes!
      if (foods.length === 0 && (!category || category === 'all') && !search) {
        try {
          await collection.insertMany(DEFAULT_FOODS.map((f) => ({ ...f, createdAt: new Date() })));
          foods = await collection.find({}).sort({ createdAt: -1 }).toArray();
        } catch (seedErr) {
          console.warn('Auto-seed notice:', seedErr.message);
        }
      }

      if (foods.length > 0) {
        return res.status(200).json(foods);
      }

      // If filtered query yielded 0, return empty, but if collection was genuinely empty return defaults
      const allCount = await collection.countDocuments().catch(() => 0);
      if (allCount === 0) {
        return res.status(200).json(filterList(DEFAULT_FOODS));
      }
      return res.status(200).json([]);
    } catch (err) {
      console.warn('MongoDB connection failed in foods API, serving default menu:', err.message);
      return res.status(200).json(filterList(DEFAULT_FOODS));
    }
  }

  // POST: Admin create food
  if (req.method === 'POST') {
    try {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin authorization required.' });
      }

      const { name, description, price, category, image, isVegetarian, isAvailable } = req.body;
      if (!name || !price || !category || !image) {
        return res.status(400).json({ message: 'Name, price, category, and image are required.' });
      }

      const { db } = await connectToDatabase();
      const collection = db.collection('foods');

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
    } catch (err) {
      console.error('Foods POST API Error:', err);
      return res.status(500).json({ message: err.message || 'Internal Server Error' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}

