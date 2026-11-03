import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import dns from 'dns';

dotenv.config();

try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodhub';

async function inspect() {
  const client = new MongoClient(uri);
  await client.connect();
  const db = client.db(dbName);

  const latestOrder = await db.collection('orders').findOne({}, { sort: { _id: -1 } });
  console.log('LATEST_ORDER_JSON:' + JSON.stringify(latestOrder, null, 2));

  await client.close();
}

inspect().catch(err => {
  console.error(err);
  process.exit(1);
});
