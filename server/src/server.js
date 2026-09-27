require('dotenv').config();
const http = require('http');
const { Server } = require('socket.io');
const app = require('./app');
const { connectDB } = require('./config/db');
const { initSocket } = require('./sockets/chatSocket');
const { autoSeedIfEmpty } = require('./utils/seed');

const PORT = process.env.PORT || 5000;

const server = http.createServer(app);

// Initialize Socket.IO
const io = new Server(server, {
  cors: {
    origin: [
      process.env.CLIENT_URL || 'http://localhost:5173',
      'http://localhost:3000',
      'http://localhost:5174',
      'http://127.0.0.1:5173',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true,
  },
});

initSocket(io);

// Connect to Database and start server
const startServer = async () => {
  try {
    await connectDB();

    // Auto-seed pre-provisioned Admin and baseline test accounts if empty
    await autoSeedIfEmpty();

    server.listen(PORT, () => {
      console.log(`======================================================`);
      console.log(`  🎓 SMART MINDS TUITIONS SERVER RUNNING ON PORT ${PORT} `);
      console.log(`  🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
      console.log(`  🔌 Client URL: ${process.env.CLIENT_URL || 'http://localhost:5173'}`);
      console.log(`  ⚡ Real-Time WebSockets: Active`);
      console.log(`======================================================`);
    });
  } catch (error) {
    console.error('Failed to start server:', error.message);
    process.exit(1);
  }
};

startServer();
