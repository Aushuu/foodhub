import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';

// Global memory cache to retain orders across serverless invocations if MongoDB Atlas is firewalled
let memoryOrders = [];

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
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    // POST: Create Customer Order
    if (req.method === 'POST') {
      const user = authenticateRequest(req);
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
        return res.status(400).json({ message: 'Items and delivery address are required.' });
      }

      const calculatedSubtotal = Number(subtotal) || 0;
      const calculatedDeliveryFee = deliveryFee !== undefined ? Number(deliveryFee) : 3.99;
      const calculatedTax = tax !== undefined ? Number(tax) : Number((calculatedSubtotal * 0.08).toFixed(2));
      const calculatedDiscount = discount !== undefined ? Number(discount) : 0;
      const calculatedTotal = totalAmount !== undefined 
        ? Number(totalAmount) 
        : Number((calculatedSubtotal + calculatedDeliveryFee + calculatedTax - calculatedDiscount).toFixed(2));

      // Generate a valid 24-character hex ID compatible with MongoDB ObjectId standard
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
        createdAt: new Date().toISOString()
      };

      // Attempt to save to MongoDB Atlas
      try {
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const dbDoc = {
          ...newOrder,
          createdAt: new Date()
        };
        const result = await ordersCollection.insertOne(dbDoc);
        if (result && result.insertedId) {
          orderId = result.insertedId.toString();
        }
      } catch (dbErr) {
        console.warn('MongoDB Atlas order insert fallback (saving in memory):', dbErr.message);
      }

      const finalOrder = { ...newOrder, _id: orderId };
      memoryOrders.unshift(finalOrder);
      if (memoryOrders.length > 100) memoryOrders.pop();

      return res.status(201).json(finalOrder);
    }

    // GET: Admin Fetch All Orders
    if (req.method === 'GET') {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
      }

      try {
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');
        const dbOrders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray();

        // Merge DB orders with any in-memory orders
        const dbIds = new Set(dbOrders.map((o) => o._id?.toString()));
        const combined = [...dbOrders];
        for (const mo of memoryOrders) {
          if (!dbIds.has(mo._id?.toString())) {
            combined.unshift(mo);
          }
        }
        return res.status(200).json(combined);
      } catch (dbErr) {
        console.warn('Admin orders DB fallback:', dbErr.message);
        return res.status(200).json(memoryOrders);
      }
    }

    // PATCH: Update Order Status
    if (req.method === 'PATCH') {
      const { orderId, orderStatus } = req.body || {};
      if (!orderId || !orderStatus) {
        return res.status(400).json({ message: 'orderId and orderStatus are required.' });
      }

      // Update in memory cache
      const memOrder = memoryOrders.find((o) => o._id?.toString() === orderId?.toString());
      if (memOrder) memOrder.orderStatus = orderStatus;

      try {
        const { db } = await connectToDatabase();
        const ordersCollection = db.collection('orders');

        const filter = /^[0-9a-fA-F]{24}$/.test(orderId)
          ? { $or: [{ _id: new ObjectId(orderId) }, { _id: orderId }] }
          : { _id: orderId };

        const result = await ordersCollection.findOneAndUpdate(
          filter,
          { $set: { orderStatus } },
          { returnDocument: 'after' }
        );
        return res.status(200).json(result || { _id: orderId, orderStatus });
      } catch (dbErr) {
        return res.status(200).json({ _id: orderId, orderStatus });
      }
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Orders API Critical Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}
