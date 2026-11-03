import express from 'express';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';

const router = express.Router();

// GET all foods
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    if (!db) {
      return res.status(503).json({ message: 'Database not connected' });
    }

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

    const foods = await db.collection('foods').find(filter).sort({ createdAt: -1 }).toArray();
    res.json(foods);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// GET food by id
router.get('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    let queryId;
    try {
      queryId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const food = await db.collection('foods').findOne({ _id: queryId });
    if (!food) return res.status(404).json({ message: 'Food item not found' });
    res.json(food);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST add food
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const { name, description, price, category, image, isVegetarian, isAvailable } = req.body;
    if (!name || !price || !category || !image) {
      return res.status(400).json({ message: 'Name, price, category, and image are required' });
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

    const result = await db.collection('foods').insertOne(newFood);
    res.status(201).json({ ...newFood, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// PUT update food
router.put('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    let queryId;
    try {
      queryId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const updates = { ...req.body };
    delete updates._id;
    if (updates.price) updates.price = Number(updates.price);

    const result = await db.collection('foods').findOneAndUpdate(
      { _id: queryId },
      { $set: updates },
      { returnDocument: 'after' }
    );

    if (!result) return res.status(404).json({ message: 'Food item not found' });
    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// DELETE food
router.delete('/:id', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    let queryId;
    try {
      queryId = new ObjectId(req.params.id);
    } catch {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const result = await db.collection('foods').deleteOne({ _id: queryId });
    if (result.deletedCount === 0) {
      return res.status(404).json({ message: 'Food item not found' });
    }
    res.json({ message: 'Food item deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
