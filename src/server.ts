import app from './app';
import { env } from './config/env';
import prisma from './config/db';

const PORT = process.env.PORT || 5000; // مهم للRailway

// Retry DB connection (Neon serverless prone to disconnects)
async function connectDB(retries = 5, delayMs = 2000) {
  for (let i = 0; i < retries; i++) {
    try {
      await prisma.$connect();
      console.log('✅ Connected to database');
      return;
    } catch (err) {
      console.error(`❌ DB connect failed (attempt ${i + 1}/${retries}):`, err);
      await new Promise((res) => setTimeout(res, delayMs));
    }
  }
  throw new Error('DB connection failed after retries');
}

async function startServer() {
  try {
    await connectDB();

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

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n🛑 Shutting down gracefully...');
  await prisma.$disconnect();
  process.exit(0);
};

process.on('SIGINT', gracefulShutdown);
process.on('SIGTERM', gracefulShutdown);

startServer();
