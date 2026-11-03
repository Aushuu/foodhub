import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodhub';

async function testAdmin() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const admin = await db.collection('users').findOne({ email: 'admin@foodhub.com' });
  console.log('Admin user in DB:', admin ? { email: admin.email, role: admin.role, hasPassword: !!admin.password } : 'NOT FOUND');

  if (admin) {
    const isMatch = await bcrypt.compare('admin123', admin.password);
    console.log('Password "admin123" match:', isMatch);
  }

  await client.close();
}

testAdmin().catch(console.error);
