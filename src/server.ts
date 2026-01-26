// backend/src/server.ts
import app from './app';
import { env } from './config/env';
import prisma from './config/db';

const PORT = env.PORT || 5000;

// Test database connection
async function startServer() {
  try {
    // Test Prisma connection
    await prisma.$connect();
    console.log('✅ Connected to database');

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
      console.log(`📦 Environment: ${env.NODE_ENV}`);
      console.log(`🌐 Frontend URL: ${env.FRONTEND_URL}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGINT', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
});

startServer();