import { connectToDatabase } from '../_lib/db.js';
import { hashPassword, signToken } from '../_lib/auth.js';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Credentials', true);
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ message: 'Method Not Allowed' });

  try {
    const { name, email, password, phone, role, address } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required.' });
    }

    const { db } = await connectToDatabase();
    const usersCollection = db.collection('users');

    const existingUser = await usersCollection.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists.' });
    }

    const hashedPassword = await hashPassword(password);
    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: role === 'admin' ? 'admin' : 'customer',
      phone: phone || '',
      address: address || {},
      createdAt: new Date()
    };

    const result = await usersCollection.insertOne(newUser);
    const token = signToken({
      userId: result.insertedId.toString(),
      email: newUser.email,
      role: newUser.role
    });

    const userResponse = {
      id: result.insertedId,
      name: newUser.name,
      email: newUser.email,
      role: newUser.role,
      phone: newUser.phone,
      address: newUser.address
    };

    return res.status(201).json({ token, user: userResponse });
  } catch (err) {
    console.error('Register API Error:', err);
    return res.status(500).json({ message: err.message || 'Internal Server Error' });
  }
}

