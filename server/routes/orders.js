import express from 'express';
import { ObjectId } from 'mongodb';
import jwt from 'jsonwebtoken';
import { getDb } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'foodhub_super_secret_jwt_key_2026';

const getUserFromHeader = (req) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) return null;
  try {
    return jwt.verify(authHeader.split(' ')[1], JWT_SECRET);
  } catch {
    return null;
  }
};

// Create Order
router.post('/', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const user = getUserFromHeader(req);
    const { items, deliveryAddress, customerName, customerEmail, subtotal, deliveryFee, tax, discount, totalAmount, paymentMethod } = req.body;

    if (!items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ message: 'Items and delivery address are required' });
    }

    const calculatedSubtotal = Number(subtotal);
    const calculatedDeliveryFee = Number(deliveryFee);
    const calculatedTax = tax !== undefined ? Number(tax) : Number((calculatedSubtotal * 0.08).toFixed(2));
    const calculatedDiscount = discount !== undefined ? Number(discount) : 0;
    const calculatedTotal = totalAmount !== undefined ? Number(totalAmount) : Number((calculatedSubtotal + calculatedDeliveryFee + calculatedTax - calculatedDiscount).toFixed(2));

    const newOrder = {
      userId: user ? new ObjectId(user.userId) : null,
      customerName: customerName || (user ? user.email : 'Guest Customer'),
      customerEmail: customerEmail || (user ? user.email : ''),
      items: items.map(item => ({
        foodId: item.foodId ? new ObjectId(item.foodId) : null,
        name: item.name,
        price: Number(item.price),
        quantity: Number(item.quantity),
        image: item.image
      })),
      deliveryAddress,
      subtotal: calculatedSubtotal,
      deliveryFee: calculatedDeliveryFee,
      tax: calculatedTax,
      discount: calculatedDiscount,
      totalAmount: calculatedTotal,
      paymentMethod: paymentMethod || 'COD',
      orderStatus: 'Placed',
      estimatedDeliveryMinutes: 28,
      createdAt: new Date()
    };

    const result = await db.collection('orders').insertOne(newOrder);
    res.status(201).json({ ...newOrder, _id: result.insertedId });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get customer orders
router.get('/my', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const user = getUserFromHeader(req);
    let filter = {};

    if (user && user.userId) {
      filter = {
        $or: [
          { userId: new ObjectId(user.userId) },
          { customerEmail: user.email }
        ]
      };
    } else if (req.query.email) {
      filter = { customerEmail: req.query.email };
    } else {
      return res.json([]);
    }

    const orders = await db.collection('orders').find(filter).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Get all orders
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Admin: Update order status
router.patch('/', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const { orderId, orderStatus } = req.body;
    if (!orderId || !orderStatus) {
      return res.status(400).json({ message: 'orderId and orderStatus are required' });
    }

    let queryId;
    try {
      queryId = new ObjectId(orderId);
    } catch {
      return res.status(400).json({ message: 'Invalid ID format' });
    }

    const result = await db.collection('orders').findOneAndUpdate(
      { _id: queryId },
      { $set: { orderStatus } },
      { returnDocument: 'after' }
    );

    res.json(result);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
