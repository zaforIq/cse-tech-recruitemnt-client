const { MongoClient } = require('mongodb');
const bcrypt = require('bcryptjs');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env.local
dotenv.config({ path: path.resolve(process.cwd(), '.env.local') });

async function seedAdmin() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not defined in .env.local');
    process.exit(1);
  }

  const client = new MongoClient(uri);

  try {
    await client.connect();
    const db = client.db();

    const email = 'admin@cse-tech.com';
    const plainPassword = 'admin'; // Setup initial password

    const existingAdmin = await db.collection('users').findOne({ email });

    if (existingAdmin) {
      console.log('Admin user already exists.');
    } else {
      const hashedPassword = await bcrypt.hash(plainPassword, 10);
      await db.collection('users').insertOne({
        email,
        password: hashedPassword,
        role: 'admin',
        name: 'Super Admin',
        createdAt: new Date(),
      });
      console.log('Admin user seeded successfully. Email: admin@cse-tech.com, Password: admin');
    }
  } catch (error) {
    console.error('Error seeding admin user:', error);
  } finally {
    await client.close();
  }
}

seedAdmin();
