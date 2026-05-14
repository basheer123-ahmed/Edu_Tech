const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient({
  log: [
    { level: 'query', emit: 'event' },
    { level: 'info', emit: 'stdout' },
    { level: 'warn', emit: 'stdout' },
    { level: 'error', emit: 'stdout' },
  ],
});

// Log queries in development
if (process.env.NODE_ENV === 'development') {
  prisma.$on('query', (e) => {
    console.log('Query: ' + e.query);
    console.log('Params: ' + e.params);
    console.log('Duration: ' + e.duration + 'ms');
  });
}

const connectDB = async () => {
  try {
    console.log('⏳ Initializing Prisma...');
    await prisma.$connect();
    console.log('🚀 Prisma initialized');
    console.log('✅ Database connected successfully to MySQL');
  } catch (error) {
    console.error('❌ MySQL connection failed');
    console.error('🔴 Connection Error Details:', error.message);
    
    if (error.message.includes('Access denied')) {
      console.error('👉 Suggestion: Check your database credentials (username/password) in .env');
    } else if (error.message.includes('Can\'t reach database server')) {
      console.error('👉 Suggestion: Ensure MySQL is running on localhost:3306 (XAMPP/MySQL Service)');
    }
    
    // In production, we might want to exit, but in dev we keep it alive for nodemon
    if (process.env.NODE_ENV === 'production') {
      process.exit(1);
    }
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  await prisma.$disconnect();
  console.log('👋 Database connection closed');
  process.exit(0);
});

module.exports = { prisma, connectDB };
