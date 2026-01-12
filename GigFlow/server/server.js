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

console.log("----------------------------------------");
console.log("🚀 STARTING SERVER - VERSION 6.0 DEBUG");
console.log("----------------------------------------");

const app = express();
// Trust Proxy is REQUIRED for secure cookies on Render/Vercel
app.set('trust proxy', 1);

const httpServer = createServer(app);

// ✅ 0. NUCLEAR DEBUGGING MIDDLEWARE
// If this runs, the logs will show it, and headers will be forced.
app.use((req, res, next) => {
  console.log(`[REQUEST] ${req.method} ${req.url} | Origin: ${req.headers.origin}`);
  res.header("X-Debug-Version", "7.0-NUCLEAR");
  next();
});

// ✅ 1. Define Intelligent CORS Logic
const corsOptions = {
  origin: (origin, callback) => {
    // 1. Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);

    // 2. Define allowed origins explicitly for clarity
    const allowed = [
      "http://localhost:5173",
      "http://localhost:4173", 
      "https://service-hive-assignment-five.vercel.app"
    ];

    // 3. Check exact matches
    if (allowed.includes(origin)) {
      return callback(null, true);
    }

    // 4. Check dynamic matches (All Vercel Previews)
    if (origin.endsWith(".vercel.app")) {
      return callback(null, true);
    }

    // 5. Check Render Internal URLs (Optional)
    if (origin.includes("onrender.com")) {
      return callback(null, true);
    }

    // 6. Check our specific new Frontend if using custom domain
    if (origin === "https://servicehive-assignment.onrender.com") {
       return callback(null, true);
    }

    console.log("🚫 BLOCKED BY CORS:", origin); 
    return callback(null, false); // Return false instead of Error to avoid crashing some clients
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin']
};

// ✅ 2. Apply Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes

// ✅ 2.5 ADD DEBUG HEADER (To prove this code is running)
app.use((req, res, next) => {
  res.header("X-Server-Version", "6.0-DEBUG");
  next();
});

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
    version: "11.0 - BEARER TOKEN AUTH",
    environment: process.env.NODE_ENV,
    suggested_url: "https://servicehive-assignment.onrender.com/api"
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