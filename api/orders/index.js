import { ObjectId } from 'mongodb';
import { connectToDatabase } from '../_lib/db.js';
import { authenticateRequest } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST,PATCH');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();

  try {
    const { db } = await connectToDatabase();
    const ordersCollection = db.collection('orders');

    // Create Order
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
      } = req.body;

      if (!items || items.length === 0 || !deliveryAddress) {
        return res.status(400).json({ message: 'Items and delivery address are required.' });
      }

      const calculatedSubtotal = Number(subtotal);
      const calculatedDeliveryFee = Number(deliveryFee);
      const calculatedTax = tax !== undefined ? Number(tax) : Number((calculatedSubtotal * 0.08).toFixed(2));
      const calculatedDiscount = discount !== undefined ? Number(discount) : 0;
      const calculatedTotal = totalAmount !== undefined ? Number(totalAmount) : Number((calculatedSubtotal + calculatedDeliveryFee + calculatedTax - calculatedDiscount).toFixed(2));

      const newOrder = {
        userId: user ? new ObjectId(user.userId) : null,
        customerName: customerName || (user ? user.email : 'Guest'),
        customerEmail: customerEmail || (user ? user.email : ''),
        items: items.map((item) => ({
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

      const result = await ordersCollection.insertOne(newOrder);
      return res.status(201).json({ ...newOrder, _id: result.insertedId });
    }

    // Admin: Get all orders
    if (req.method === 'GET') {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
      }

      const orders = await ordersCollection.find({}).sort({ createdAt: -1 }).toArray();
      return res.status(200).json(orders);
    }

    // Admin: Update order status
    if (req.method === 'PATCH') {
      const user = authenticateRequest(req);
      if (!user || user.role !== 'admin') {
        return res.status(403).json({ message: 'Forbidden. Admin access required.' });
      }

      const { orderId, orderStatus } = req.body;
      if (!orderId || !orderStatus) {
        return res.status(400).json({ message: 'orderId and orderStatus are required' });
      }

      const result = await ordersCollection.findOneAndUpdate(
        { _id: new ObjectId(orderId) },
        { $set: { orderStatus } },
        { returnDocument: 'after' }
      );

      return res.status(200).json(result);
    }

    return res.status(405).json({ message: 'Method Not Allowed' });
  } catch (err) {
    console.error('Orders API Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

