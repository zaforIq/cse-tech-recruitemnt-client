import { MongoClient } from 'mongodb';

// global is used to maintain a cached connection across hot reloads in development
let cachedClient = null;
let cachedDb = null;

export async function connectToDatabase() {
  if (cachedClient && cachedDb) {
    return { client: cachedClient, db: cachedDb };
  }

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Please define the MONGODB_URI environment variable');
  }

  const client = new MongoClient(uri);

  await client.connect();
  const db = client.db(); // default database from URI

  cachedClient = client;
  cachedDb = db;

  return { client, db };
}
