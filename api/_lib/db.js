import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

// Ensure reliable SRV resolution on Windows
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  const uri = process.env.MONGODB_URI;
  const dbName = process.env.MONGODB_DB || 'foodhub';

  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable inside .env');
  }

  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
