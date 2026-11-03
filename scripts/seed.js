import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import dns from 'dns';
import { INITIAL_FOODS } from '../src/services/foodData.js';

dotenv.config();

// Fix Windows DNS querySrv ECONNREFUSED on local router resolvers
try {
  dns.setServers(['8.8.8.8', '1.1.1.1']);
} catch (e) {
  // ignore
}

const uri = process.env.MONGODB_URI;
const dbName = process.env.MONGODB_DB || 'foodhub';

if (!uri) {
  console.error("❌ Error: MONGODB_URI is not set in .env file.");
  console.error("Please add your MongoDB Atlas connection string to .env and retry.");
  process.exit(1);
}

async function seed() {
  const client = new MongoClient(uri);

  try {
    console.log(`⏳ Connecting to MongoDB Atlas (${dbName})...`);
    await client.connect();
    console.log("✅ Connected successfully!");

    const db = client.db(dbName);
    const foodsCollection = db.collection('foods');
    const usersCollection = db.collection('users');

    // 1. Seed Foods
    console.log("🍕 Seeding foods collection...");
    const existingFoodsCount = await foodsCollection.countDocuments();
    if (existingFoodsCount > 0) {
      console.log(`ℹ️ Clearing ${existingFoodsCount} existing food items...`);
      await foodsCollection.deleteMany({});
    }

    const foodDocs = INITIAL_FOODS.map((item) => ({
      ...item,
      createdAt: new Date()
    }));

    const foodResult = await foodsCollection.insertMany(foodDocs);
    console.log(`✅ Inserted ${foodResult.insertedCount} delicious food items!`);

    // 2. Seed Admin & Customer Users
    console.log("👤 Seeding default users (Admin & Customer)...");
    const salt = await bcrypt.genSalt(10);
    const adminPasswordHash = await bcrypt.hash('admin123', salt);
    const customerPasswordHash = await bcrypt.hash('customer123', salt);

    const users = [
      {
        name: 'FoodHub Admin',
        email: 'admin@foodhub.com',
        password: adminPasswordHash,
        role: 'admin',
        phone: '+1 (800) 555-0199',
        address: {
          street: '100 FoodHub HQ Way',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94105'
        },
        createdAt: new Date()
      },
      {
        name: 'Alex Johnson',
        email: 'customer@foodhub.com',
        password: customerPasswordHash,
        role: 'customer',
        phone: '+1 (555) 234-5678',
        address: {
          street: '456 Market St, Apt 12',
          city: 'San Francisco',
          state: 'CA',
          postalCode: '94103'
        },
        createdAt: new Date()
      }
    ];

    for (const u of users) {
      await usersCollection.updateOne(
        { email: u.email },
        { $set: u },
        { upsert: true }
      );
    }
    console.log("✅ Seeded default accounts:");
    console.log("   👑 Admin: admin@foodhub.com | Password: admin123");
    console.log("   👤 Customer: customer@foodhub.com | Password: customer123");

    console.log("\n🎉 Database seeding finished successfully!");
  } catch (err) {
    console.error("❌ Seeding failed:", err);
  } finally {
    await client.close();
  }
}

seed();

