import express from 'express';
import { createServer } from 'http';
import { Server } from 'socket.io';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import dotenv from 'dotenv';
import connectDB from './config/db.js';
import authRoutes from './routes/auth.js';
import gigRoutes from './routes/gigs.js';
import bidRoutes from './routes/bids.js';
import { initializeSocket, emitHireNotification } from './socket/socketHandler.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// 1. Define allowed origins FIRST
const allowedOrigins = [
  "http://localhost:5173",
  "https://service-hive-assignment-five.vercel.app",
  "https://service-hive-assignment-9ops9qnwd-ramans-projects-32c978d7.vercel.app" // Your specific preview URL
];

app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// 2. Initialize Socket.io SECOND (Create 'io')
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// 3. Initialize socket handlers THIRD (Use 'io')
initializeSocket(io); 

// Make io accessible in routes
app.set('io', io);

// 4. Configure Express CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Test Route to verify server is running
app.get('/api', (req, res) => {
  res.json({ message: "GigFlow API is running successfully!" });
});

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

// Health check route
app.get('/api/health', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'GigFlow API is running',
    timestamp: new Date().toISOString(),
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
  });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

// Start server
const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`
🚀 GigFlow Server running on port ${PORT}
📊 Environment: ${process.env.NODE_ENV || 'development'}
🔗 API: http://localhost:${PORT}/api
⚡ Socket.io: enabled
  `);
});

export { io };
