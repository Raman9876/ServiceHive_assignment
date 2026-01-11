# GigFlow - Specialized Freelance Marketplace

GigFlow is a freelance marketplace built to demonstrate advanced MERN concepts like ACID transactions and real-time sockets.

> **Purpose**: This project was developed solely as part of a technical evaluation assignment for an internship opportunity.

## Core Technical Solutions (Formerly Hard Bonus)

Instead of standard CRUD operations, this project focuses on solving complex state and data integrity challenges common in marketplace platforms:

- **ACID Transactions**: Refactored the core hiring logic to use MongoDB sessions, ensuring atomic operations and preventing race conditions during concurrent hiring.
- **Real-time Synchronization**: Integrated Socket.io for instant "You're Hired" alerts and real-time gig status updates across all connected clients.
- **Premium UX Micro-interactions**: Implemented `canvas-confetti` celebrations and custom high-feedback toasts to validate user actions.
- **System Architecture**: Designed with snapshot isolation to maintain data consistency under load.

## Key Challenges

**Handling Race Conditions in Hiring**
The hardest part of this build was handling the race conditions during the hiring process. In a high-traffic marketplace, multiple clients could theoretically attempt to hire different freelancers for the same gig simultaneously. I implemented MongoDB Sessions with ACID transactions to ensure that if concurrent attempts are made, only one succeeds while others are safely rolled back, keeping the database in a consistent state.

## Features

### Marketplace Core

- **Fluid Role System**: Seamless switching between Client and Freelancer roles.
- **Multi-Role Profile Management**: Comprehensive profile tracking with role-specific statistics, including Success Rate for Freelancers and Engagement metrics for Clients.
- **Gig Management**: Full CRUD for gigs featuring an **Advanced Search Engine** with regex-based search, category filtering, and multi-factor sorting (Deadline, Budget, and Popularity).
- **Bidding System**: Detailed proposal submission with pricing and delivery timelines.
- **Dashboard Notification Center**: Persistent real-time alerts for bids, hiring status, and system updates integrated directly into the user dashboard.
- **Dashboard**: Centralized tracking of posted gigs and active bids.

### Security & Performance

- **Hybrid Authentication System**: Secure user access management using JWT/HttpOnly Cookies and Google OAuth 2.0 integration for a seamless login experience.
- **Data Integrity**: Schema validations and transactional consistency.
- **Optimized UI**: Responsive "Midnight Glass" design with Framer Motion animations and skeleton loading.

## Technical Architecture

### ACID Transactions for Data Integrity

Implemented MongoDB ACID Transactions using Mongoose sessions to ensure atomic hiring operations.

```javascript
// Transaction with snapshot isolation
session.startTransaction({
  readConcern: { level: "snapshot" },
  writeConcern: { w: "majority" },
});
```

- **Atomicity**: All operations succeed or all fail.
- **Consistency**: Database remains in valid state.
- **Isolation**: Concurrent transactions don't interfere.
- **Durability**: Committed changes persist.

### Real-Time Architecture (Socket.io)

The application implements a room-based Socket.io architecture for targeted notifications:

```
┌─────────────────────────────────────────────────────────────┐
│                    Socket.io Server                         │
├─────────────────────────────────────────────────────────────┤
│  Room: user:{userId}     │  Personal notifications          │
│  Room: gig:{gigId}       │  Gig-specific updates            │
├─────────────────────────────────────────────────────────────┤
│  Events:                                                    │
│  • notification:hired    →  Freelancer hired notification   │
│  • gig:status_changed    →  Real-time gig status updates    │
│  • new_bid               →  Client receives new bid alert   │
└─────────────────────────────────────────────────────────────┘
```

### Unified State Management (Redux Toolkit)

The application utilizes Redux Toolkit for centralized state management, enabling seamless UI synchronization across components. This ensures that real-time updates from Socket.io (like new bids or hiring status) are immediately reflected in the user interface without requiring page refreshes.

## Tech Stack

### Backend

- **Node.js** (Express.js)
- **MongoDB** (Mongoose)
- **Socket.io**
- **JWT**

### Frontend

- **React 18** (Vite)
- **Redux Toolkit**
- **Tailwind CSS**
- **Framer Motion**
- **Canvas Confetti**
- **Lucide React**

## Project Structure

```
GigFlow/
├── client/          # React frontend
└── server/          # Node.js backend
```

## Installation & Setup

### Prerequisites

- Node.js 18+
- MongoDB (local or Atlas)

### 1. Setup Backend

```bash
cd GigFlow/server
npm install
cp .env.example .env
```

Ensure your `.env` contains mock/local connection strings. **Do not use production secrets.**

### 2. Setup Frontend

```bash
cd ../client
npm install
```

### 3. Seed Database (Required for Demo)

```bash
cd ../server
npm run seed
```

This populates the system with **mock data** and demo users.

### 4. Run the Application

```bash
# Backend
npm run dev
# Frontend
npm run dev
```

## UI/UX Design: "Midnight Glass"

The application features a custom-built design system called **Midnight Glass**:

- **Surface**: Slate-950 background with subtle glassmorphism.
- **Motion**: Fluid state transitions powered by `framer-motion`.
- **Celebration**: Integrated `canvas-confetti` for high-dopamine feedback.

## Author's Note

Building the 'Midnight Glass' UI was a fun challenge to move away from standard Bootstrap or basic Tailwind styles. I focused on using Framer Motion to give it a 'premium' feel similar to platforms like Linear or Vercel. This project helped me bridge the gap between simple CRUD applications and complex, real-time systems that require strict data integrity.

---

Built with ❤️ for demonstrating full-stack engineering skills.
