import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { ObjectId } from 'mongodb';
import { getDb } from '../db.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'foodhub_super_secret_jwt_key_2026';

// Register
router.post('/register', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const { name, email, password, phone, role, address } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ message: 'Name, email, and password are required' });
    }

    const existingUser = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(409).json({ message: 'An account with this email already exists' });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = {
      name,
      email: email.toLowerCase(),
      password: hashedPassword,
      role: 'customer', // strictly enforce customer role; admin account is unique and seeded
      phone: phone || '',
      address: address || {},
      createdAt: new Date()
    };

    const result = await db.collection('users').insertOne(newUser);
    const token = jwt.sign(
      { userId: result.insertedId.toString(), email: newUser.email, role: newUser.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.status(201).json({
      token,
      user: {
        id: result.insertedId,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        phone: newUser.phone,
        address: newUser.address
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = await db.collection('users').findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    const token = jwt.sign(
      { userId: user._id.toString(), email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        address: user.address
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Me (Check session)
router.get('/me', async (req, res) => {
  try {
    const db = getDb();
    if (!db) return res.status(503).json({ message: 'Database not connected' });

    const authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const token = authHeader.split(' ')[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const user = await db.collection('users').findOne(
      { _id: new ObjectId(decoded.userId) },
      { projection: { password: 0 } }
    );

    if (!user) return res.status(404).json({ message: 'User not found' });
    res.json({ user });
  } catch (err) {
    res.status(401).json({ message: 'Invalid or expired token' });
  }
});

export default router;
