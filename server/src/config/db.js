import mongoose from 'mongoose';
import pg from 'pg';
import dotenv from 'dotenv';

dotenv.config();

const { Pool } = pg;

// PostgreSQL Connection Pool (supports PostGIS queries)
export const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL || 'postgresql://postgres:postgres@localhost:5432/florascan_db',
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 1500,
});

pgPool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client:', err);
});

// MongoDB Connection
export const connectMongoDB = async () => {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/florascan_db';
    await mongoose.connect(mongoUri, { serverSelectionTimeoutMS: 2500 });
    console.log('🌱 Connected to MongoDB successfully.');
  } catch (err) {
    console.warn('⚠️ MongoDB connection skipped or failed:', err.message);
  }
};

// Test PostGIS capability
export const testPostGIS = async () => {
  try {
    const client = await pgPool.connect();
    const res = await client.query('SELECT PostGIS_Version();');
    console.log(`🌍 PostGIS spatial engine initialized: ${res.rows[0].postgis_version}`);
    client.release();
  } catch (err) {
    console.warn('⚠️ PostgreSQL / PostGIS connection test warning:', err.message);
  }
};
