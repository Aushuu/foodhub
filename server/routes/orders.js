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

// Create Order
router.post('/', async (req, res) => {
  try {
    const user = getUserFromHeader(req);
    const { 
      items, 
      deliveryAddress, 
      customerName, 
      customerEmail, 
      subtotal, 
      deliveryFee, 
      tax, 
      discount, 
      totalAmount, 
      paymentMethod 
    } = req.body || {};

    if (!items || items.length === 0 || !deliveryAddress) {
      return res.status(400).json({ message: 'Items and delivery address are required' });
    }

    const calculatedSubtotal = Number(subtotal) || 0;
    const calculatedDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : 3.99;
    const calculatedTax = tax !== undefined ? Number(tax) : Number((calculatedSubtotal * 0.08).toFixed(2));
    const calculatedDiscount = discount !== undefined ? Number(discount) : 0;
    const calculatedTotal = totalAmount !== undefined 
      ? Number(totalAmount) 
      : Number((calculatedSubtotal + calculatedDeliveryFee + calculatedTax - calculatedDiscount).toFixed(2));

    const randomHex = Array.from({ length: 24 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
    let orderId = randomHex;

    const newOrder = {
      userId: user ? safeObjectId(user.userId) : null,
      customerName: customerName || (user ? (user.name || user.email) : 'Guest Customer'),
      customerEmail: customerEmail || (user ? user.email : ''),
      items: items.map((item) => ({
        foodId: safeObjectId(item.foodId),
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

    const db = getDb();
    if (db) {
      const result = await db.collection('orders').insertOne(newOrder);
      if (result && result.insertedId) {
        orderId = result.insertedId.toString();
      }
    }

    return res.status(201).json({ ...newOrder, _id: orderId });
  } catch (err) {
    console.error('Local Orders POST Error:', err);
    return res.status(500).json({ message: err.message });
  }
});

// Get customer orders
router.get('/my', async (req, res) => {
  try {
    const user = getUserFromHeader(req);
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
      return res.json([]);
    }

    const db = getDb();
    if (!db) return res.json([]);

    const orders = await db.collection('orders').find({ $or: queryConditions }).sort({ createdAt: -1 }).toArray();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Admin: Get all orders
router.get('/', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.json([]);

    const orders = await db.collection('orders').find({}).sort({ createdAt: -1 }).toArray();
    return res.json(orders);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

// Admin / Live: Update order status
router.patch('/', async (req, res) => {
  try {
    const { orderId, orderStatus } = req.body || {};
    if (!orderId || !orderStatus) {
      return res.status(400).json({ message: 'orderId and orderStatus are required' });
    }

    const db = getDb();
    if (db) {
      const filter = /^[0-9a-fA-F]{24}$/.test(orderId)
        ? { $or: [{ _id: new ObjectId(orderId) }, { _id: orderId }] }
        : { _id: orderId };

      await db.collection('orders').updateOne(
        filter,
        { $set: { orderStatus } }
      );
    }

    return res.json({ _id: orderId, orderStatus });
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
});

export default router;
