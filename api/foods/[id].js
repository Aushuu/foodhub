import { ObjectId } from 'mongodb';
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

  const { id } = req.query;

  // GET: Single dish (with resilient fallback)
  if (req.method === 'GET') {
    try {
      const { db } = await connectToDatabase();
      const collection = db.collection('foods');

      let queryId;
      try {
        queryId = new ObjectId(id);
      } catch (e) {
        // Not a standard ObjectId, search by string or default fallback
      }

      const food = queryId 
        ? await collection.findOne({ _id: queryId })
        : await collection.findOne({ $or: [{ _id: id }, { name: id }] });

      if (food) {
        return res.status(200).json(food);
      }
    } catch (dbErr) {
      console.warn('DB lookup failed for food item:', dbErr.message);
    }

    // Fallback to default catalog
    const fallbackFood = DEFAULT_FOODS.find((f) => f._id === id || f.name.toLowerCase() === id.toLowerCase());
    if (fallbackFood) {
      return res.status(200).json(fallbackFood);
    }
    return res.status(404).json({ message: 'Food item not found' });
  }

    if (req.method === 'PUT') {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin authorization required.' });
      }

      const updates = { ...req.body };
      delete updates._id;
      if (updates.price) updates.price = Number(updates.price);

      const result = await collection.findOneAndUpdate(
        { _id: queryId },
        { $set: updates },
        { returnDocument: 'after' }
      );

      if (!result) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      return res.status(200).json(result);
    }

    if (req.method === 'DELETE') {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin authorization required.' });
      }

      const result = await collection.deleteOne({ _id: queryId });
      if (result.deletedCount === 0) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      return res.status(200).json({ message: 'Food deleted successfully' });
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Food Detail API Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

