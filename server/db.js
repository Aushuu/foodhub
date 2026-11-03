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

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodhub';

let client = null;
let db = null;

export async function connectDB() {
  if (db) return db;

  if (!uri || uri.includes('<db_password>')) {
    console.warn('⚠️ [MongoDB]: MONGODB_URI is not configured yet or still contains <db_password> placeholder.');
    return null;
  }

  try {
    console.log('⏳ Connecting to MongoDB Atlas...');
    client = new MongoClient(uri, {
      serverSelectionTimeoutMS: 5000,
    });
    await client.connect();
    db = client.db(dbName);
    console.log(`✅ Connected successfully to MongoDB Atlas database: "${dbName}"`);
    return db;
  } catch (error) {
    console.error('❌ MongoDB Atlas connection error:', error.message);
    throw error;
  }
}

export function getDb() {
  return db;
}

export async function testConnection() {
  try {
    const database = await connectDB();
    if (!database) {
      return {
        connected: false,
        message: 'MONGODB_URI contains <db_password> placeholder. Please replace it with your actual Atlas password in .env'
      };
    }
    const pingResult = await database.command({ ping: 1 });
    const collections = await database.listCollections().toArray();
    return {
      connected: true,
      database: dbName,
      ping: pingResult,
      collections: collections.map(c => c.name)
    };
  } catch (error) {
    return {
      connected: false,
      error: error.message
    };
  }
}
