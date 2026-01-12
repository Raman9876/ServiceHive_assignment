import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Socket.io handler
export const initializeSocket = (io) => {
  // Authentication middleware for socket connections
  io.use(async (socket, next) => {
    try {
      let token = null;

      // Method 1: Get token from socket handshake auth (Bearer token from client)
      if (socket.handshake.auth && socket.handshake.auth.token) {
        token = socket.handshake.auth.token;
      }
      
      // Method 2: Fallback to cookies (for same-origin)
      if (!token) {
        const cookies = socket.handshake.headers.cookie;
        if (cookies) {
          const tokenCookie = cookies.split(';').find((c) => c.trim().startsWith('token='));
          if (tokenCookie) {
            token = tokenCookie.split('=')[1];
          }
        }
      }

      if (!token) {
        console.log('Socket auth: No token provided');
        return next(new Error('Authentication required'));
      }

      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.userId);

      if (!user) {
        return next(new Error('User not found'));
      }

      socket.userId = user._id.toString();
      socket.user = user;
      console.log(`Socket authenticated: ${user.name}`);
      next();
    } catch (error) {
      console.error('Socket auth error:', error.message);
      next(new Error('Authentication failed'));
    }
  });

  // Connection handler
  io.on('connection', async (socket) => {
    console.log(`🔌 User connected: ${socket.user.name} (${socket.userId})`);

    // Update user's socket ID and online status
    await User.findByIdAndUpdate(socket.userId, {
      socketId: socket.id,
      isOnline: true,
    });

    // Join personal room for notifications
    socket.join(`user:${socket.userId}`);

    // Handle joining gig room (for real-time bid updates)
    socket.on('join_gig', (gigId) => {
      socket.join(`gig:${gigId}`);
      console.log(`User ${socket.user.name} joined gig room: ${gigId}`);
    });

    // Handle leaving gig room
    socket.on('leave_gig', (gigId) => {
      socket.leave(`gig:${gigId}`);
      console.log(`User ${socket.user.name} left gig room: ${gigId}`);
    });

    // Handle disconnection
    socket.on('disconnect', async () => {
      console.log(`🔌 User disconnected: ${socket.user.name}`);
      await User.findByIdAndUpdate(socket.userId, {
        socketId: null,
        isOnline: false,
      });
    });
  });

  return io;
};

// Emit hire notification to freelancer - SINGLE EMISSION to prevent duplicates
export const emitHireNotification = (io, notificationData) => {
  const { 
    freelancerId, 
    gigId, 
    gigTitle, 
    clientName,
    amount, 
    message,
    timestamp 
  } = notificationData;

  // Structured notification payload
  const payload = {
    gigId,
    gigTitle,
    clientName,
    amount,
    message,
    timestamp: timestamp || new Date().toISOString(),
  };

  // ONLY emit to user's personal room - single emission prevents duplicates
  io.to(`user:${freelancerId}`).emit('notification:hired', payload);

  // Emit gig status change to gig room for real-time UI update
  io.to(`gig:${gigId}`).emit('gig:status_changed', {
    gigId,
    status: 'assigned',
    assignedTo: freelancerId,
  });

  console.log(`📢 [Socket] Hire notification sent:`);
  console.log(`   └─ Freelancer: ${freelancerId}`);
  console.log(`   └─ Gig: "${gigTitle}"`);
  console.log(`   └─ Client: ${clientName}`);
};

// Emit new bid notification to gig owner
export const emitNewBidNotification = (io, gigId, bidData) => {
  const notification = {
    type: 'new_bid',
    gigId,
    bid: bidData,
    timestamp: new Date().toISOString(),
  };

  io.to(`gig:${gigId}`).emit('new_bid', notification);
  console.log(`📢 New bid notification sent to gig room: ${gigId}`);
};
