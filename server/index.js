require('dotenv').config();
const app = require('./src/app');
const http = require('http');
const cluster = require('cluster');
const os = require('os');
const { Server } = require('socket.io');
const { connectDB } = require('./src/config/db');

// --- Enterprise Scaling: Clustering ---
const numCPUs = os.cpus().length;

if (cluster.isPrimary && process.env.NODE_ENV === 'production') {
  console.log(`🚀 Primary ${process.pid} is running`);

  // Fork workers.
  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();
  }

  cluster.on('exit', (worker, code, signal) => {
    console.log(`⚠️ Worker ${worker.process.pid} died. Restarting...`);
    cluster.fork();
  });
} else {
  // --- Worker Process ---
  
  // Connect to Database
  connectDB();

  const server = http.createServer(app);
  const io = new Server(server, {
    cors: {
      origin: "*",
      methods: ["GET", "POST"]
    }
  });

  // Attach io to app
  app.set('io', io);

  const { handleNotifications } = require('./src/sockets/notification.handler');
  const { handleDashboardEvents } = require('./src/sockets/dashboard.handler');

  // Socket.IO Logic
  io.on('connection', (socket) => {
    handleNotifications(io, socket);
    handleDashboardEvents(io, socket);
    socket.on('disconnect', () => {
    });
  });

  const INITIAL_PORT = process.env.PORT || 5000;
  server.listen(INITIAL_PORT, () => {
    console.log(`🚀 Worker ${process.pid} started on port ${INITIAL_PORT}`);
  });

  server.on('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.error(`❌ Port ${INITIAL_PORT} is already in use. Please kill the process or change the PORT.`);
      process.exit(1);
    } else {
      console.error('❌ Server Error:', err);
    }
  });

  // --- Graceful Shutdown ---
  process.on('SIGTERM', () => {
    console.log('SIGTERM received. Shutting down gracefully...');
    server.close(() => {
      console.log('Process terminated');
      process.exit(0);
    });
  });
}

