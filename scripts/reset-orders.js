import { MongoClient, ObjectId } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodhub';

async function resetOrder() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const res = await db.collection('orders').updateMany(
    {},
    { $set: { orderStatus: 'Placed' } }
  );
  console.log('Reset all orders to Placed. Count updated:', res.modifiedCount);

  await client.close();
}

resetOrder().catch(console.error);
