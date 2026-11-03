import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodhub';

async function listUsers() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const users = await db.collection('users').find({}).toArray();
  console.log('USERS:', users.map(u => ({ email: u.email, role: u.role, name: u.name })));

  await client.close();
}

listUsers().catch(console.error);
