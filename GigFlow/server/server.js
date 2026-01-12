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
import { initializeSocket } from './socket/socketHandler.js'; // Removed emitHireNotification if not used here

dotenv.config();
connectDB();

const app = express();
const httpServer = createServer(app);

// 1. Define allowed origins (Includes both your Vercel URL and Localhost)
const allowedOrigins = [
  "http://localhost:5173",
  "https://service-hive-assignment-five.vercel.app",
  "https://service-hive-assignment-9ops9qnwd-ramans-projects-32c978d7.vercel.app" // Your specific preview URL
];

// 2. Configure Express CORS
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// 3. Initialize Socket.io (MUST be done before using it)
const io = new Server(httpServer, {
  cors: {
    origin: allowedOrigins,
    credentials: true,
  },
});

// 4. Initialize socket handlers
initializeSocket(io); 

// Make io accessible in routes
app.set('io', io);

// ... Rest of your routes ...
// Test Route
app.get('/api', (req, res) => {
  res.json({ message: "GigFlow API is running successfully!" });
});

if (process.env.NODE_ENV === 'development') {
  app.use((req, res, next) => {
    console.log(`${req.method} ${req.path}`);
    next();
  });
}

app.use('/api/auth', authRoutes);
app.use('/api/gigs', gigRoutes);
app.use('/api/bids', bidRoutes);

app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'GigFlow API is running' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: 'Route not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(err.statusCode || 500).json({
    success: false,
    message: err.message || 'Internal server error',
  });
});

const PORT = process.env.PORT || 5000;
httpServer.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});

export { io };