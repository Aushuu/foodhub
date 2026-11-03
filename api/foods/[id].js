import { ObjectId } from 'mongodb';
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

  const { id } = req.query;

  try {
    const { db } = await connectToDatabase();
    const collection = db.collection('foods');

    let queryId;
    try {
      queryId = new ObjectId(id);
    } catch (e) {
      return res.status(400).json({ message: 'Invalid food ID format' });
    }

    if (req.method === 'GET') {
      const food = await collection.findOne({ _id: queryId });
      if (!food) {
        return res.status(404).json({ message: 'Food item not found' });
      }
      return res.status(200).json(food);
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

