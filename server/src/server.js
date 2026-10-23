import http from 'http';
import dotenv from 'dotenv';
import app from './app.js';
import { connectMongoDB, testPostGIS, pgPool } from './config/db.js';

dotenv.config();

const PORT = process.env.PORT || 5000;
const server = http.createServer(app);

const startServer = async () => {
  try {
    console.log('🚀 Initializing FloraScan Agri-Tech Backend Service...');

    // Initialize Database Connections
    await connectMongoDB();
    await testPostGIS();

    server.listen(PORT, () => {
      console.log(`=======================================================`);
      console.log(`🌿 FloraScan API Server running on port ${PORT}`);
      console.log(`📡 Health Check: http://localhost:${PORT}/health`);
      console.log(`🌿 Base API:     http://localhost:${PORT}/api/v1`);
      console.log(`=======================================================`);
    });
  } catch (error) {
    console.error('Fatal error starting server:', error);
    process.exit(1);
  }
};

// Graceful Shutdown
const handleShutdown = async (signal) => {
  console.log(`\nReceived ${signal}. Gracefully closing HTTP server and database pools...`);
  server.close(async () => {
    try {
      await pgPool.end();
      console.log('PostgreSQL connection pool drained.');
      process.exit(0);
    } catch (e) {
      process.exit(1);
    }
  });
};

process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

startServer();
