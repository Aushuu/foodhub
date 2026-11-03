import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

dotenv.config();

const getSecret = () => process.env.JWT_SECRET || 'foodhub_jwt_super_secret_key_change_in_production';

export function signToken(payload) {
  return jwt.sign(payload, getSecret(), { expiresIn: '7d' });
}

export function verifyToken(token) {
  try {
    return jwt.verify(token, getSecret());
  } catch (err) {
    return null;
  }
}

export async function hashPassword(password) {
  const salt = await bcrypt.genSalt(10);
  return bcrypt.hash(password, salt);
}

export async function comparePassword(password, hashedPassword) {
  return bcrypt.compare(password, hashedPassword);
}

export function authenticateRequest(req) {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }
  const token = authHeader.split(' ')[1];
  return verifyToken(token);
}
