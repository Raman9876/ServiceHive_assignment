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
import { initializeSocket } from './socket/socketHandler.js';

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// ✅ 1. Define Intelligent CORS Logic
// This allows Localhost + Main Domain + ANY Vercel Preview URL
const corsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // Allow Localhost
    if (origin.startsWith('http://localhost')) {
      return callback(null, true);
    }

    // Allow your specific production domain
    if (origin === "https://service-hive-assignment-five.vercel.app") {
      return callback(null, true);
    }

    // Allow ANY Vercel Preview URL (ends with .vercel.app)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // Block everything else
    console.log("BLOCKED BY CORS:", origin); // Helps debugging
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
};

// ✅ 2. Apply Middleware (ONCE)
app.use(cors(corsOptions));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// ✅ 3. Initialize Socket.io with SAME CORS options
const io = new Server(httpServer, {
  cors: corsOptions
});

// ✅ 4. Initialize Socket Handlers
initializeSocket(io); 
app.set('io', io);

// ✅ 5. Test Route (VERSION CHECK)
// Check this route after deploying to confirm the server updated!
app.get('/api', (req, res) => {
  res.json({ 
    message: "GigFlow API is running!", 
    version: "3.0 - Wildcard CORS Fixed",
    environment: process.env.NODE_ENV
  });
});

// Request logging in development
if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

// ✅ 6. API Routes
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