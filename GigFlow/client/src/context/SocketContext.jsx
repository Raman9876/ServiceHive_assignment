import { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";
import { useSelector, useDispatch } from "react-redux";
import toast from "react-hot-toast";
import confetti from "canvas-confetti";
import {
  fetchMyBids,
  fetchBidStats,
  updateBidStatuses,
} from "../store/slices/bidSlice";
import { fetchMyPostedGigs } from "../store/slices/gigSlice";

const SocketContext = createContext(null);

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};

// 🎉 Confetti celebration effect for hire notifications
const triggerHireConfetti = () => {
  // First burst - center
  confetti({
    particleCount: 100,
    spread: 70,
    origin: { y: 0.6 },
    colors: ["#10b981", "#fbbf24", "#6366f1", "#8b5cf6"],
  });

  // Second burst - from left
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 60,
      spread: 55,
      origin: { x: 0 },
      colors: ["#10b981", "#34d399", "#6ee7b7"],
    });
  }, 200);

  // Third burst - from right
  setTimeout(() => {
    confetti({
      particleCount: 50,
      angle: 120,
      spread: 55,
      origin: { x: 1 },
      colors: ["#6366f1", "#8b5cf6", "#a855f7"],
    });
  }, 400);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    if (isAuthenticated && user) {
      // Create socket connection
      const SOCKET_URL =
        (import.meta.env.VITE_API_URL &&
          import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "")) ||
        window.location.protocol + "//" + window.location.hostname + ":5000";

      const newSocket = io(SOCKET_URL, {
        withCredentials: true,
        autoConnect: true,
        reconnection: true,
        reconnectionAttempts: 5,
        reconnectionDelay: 1000,
      });

      newSocket.on("connect", () => {
        console.log("🔌 Socket connected");
        setIsConnected(true);
      });

      newSocket.on("disconnect", () => {
        console.log("🔌 Socket disconnected");
        setIsConnected(false);
      });

      newSocket.on("connect_error", (error) => {
        console.error("Socket connection error:", error.message);
        setIsConnected(false);
      });

      // Centralized hire notification handler
      const handleHireNotification = (data) => {
        console.log("📢 Hire notification received:", data);

        // Trigger confetti celebration
        triggerHireConfetti();

        // Refresh bids data in Redux store to update statuses
        dispatch(fetchMyBids({ status: "all" }));
        dispatch(fetchBidStats());

        // Show premium toast notification
        toast.custom(
          (t) => (
            <div
              className={`${
                t.visible ? "animate-slide-down" : "opacity-0"
              } max-w-md w-full bg-gradient-to-r from-emerald-500 to-teal-500 shadow-2xl rounded-2xl pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
            >
              <div className="flex-1 w-0 p-4">
                <div className="flex items-start">
                  <div className="flex-shrink-0 pt-0.5">
                    <div className="h-12 w-12 rounded-full bg-white/20 flex items-center justify-center">
                      <svg
                        className="h-6 w-6 text-white"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                    </div>
                  </div>
                  <div className="ml-3 flex-1">
                    <p className="text-sm font-bold text-white">
                      🎉 You&apos;re Hired!
                    </p>
                    <p className="mt-1 text-sm text-white/90">
                      {data.gigTitle || data.message}
                    </p>
                    {data.clientName && (
                      <p className="mt-0.5 text-xs text-white/70">
                        Client: {data.clientName}
                      </p>
                    )}
                    {data.amount && (
                      <p className="mt-1 text-xs font-medium text-white/80">
                        💰 Budget: ${data.amount?.toLocaleString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
              <div className="flex border-l border-white/20">
                <button
                  onClick={() => toast.dismiss(t.id)}
                  className="w-full border border-transparent rounded-none rounded-r-2xl p-4 flex items-center justify-center text-sm font-medium text-white hover:bg-white/10 focus:outline-none transition-colors"
                >
                  ✕
                </button>
              </div>
            </div>
          ),
          {
            duration: 12000,
            position: "top-center",
          }
        );
      };

      // Listen for hire notifications - single handler to prevent duplicates
      newSocket.on("notification:hired", handleHireNotification);

      // Handle gig status changes (real-time UI updates)
      newSocket.on("gig:status_changed", (data) => {
        console.log("📢 Gig status changed:", data);
        // Can dispatch Redux action here to update gig status in store
      });

      // Handle new bid notification (for gig owners)
      newSocket.on("new_bid", (data) => {
        console.log("📢 New bid received:", data);
        // Refresh posted gigs to update bid count
        dispatch(fetchMyPostedGigs({ status: "all" }));
        toast.success(`New bid received: $${data.amount || data.bid?.amount}`, {
          icon: "💼",
          duration: 5000,
          style: {
            background: "#1e293b",
            color: "#f8fafc",
            borderRadius: "12px",
          },
        });
      });

      setSocket(newSocket);

      return () => {
        newSocket.close();
        setSocket(null);
        setIsConnected(false);
      };
    } else {
      // Cleanup socket if user logs out
      if (socket) {
        socket.close();
        setSocket(null);
        setIsConnected(false);
      }
    }
  }, [isAuthenticated, user]);

  // Join a gig room for real-time updates
  const joinGigRoom = (gigId) => {
    if (socket && isConnected) {
      socket.emit("join_gig", gigId);
      console.log(`Joined gig room: ${gigId}`);
    }
  };

  // Leave a gig room
  const leaveGigRoom = (gigId) => {
    if (socket && isConnected) {
      socket.emit("leave_gig", gigId);
      console.log(`Left gig room: ${gigId}`);
    }
  };

  const value = {
    socket,
    isConnected,
    joinGigRoom,
    leaveGigRoom,
  };

  return (
    <SocketContext.Provider value={value}>{children}</SocketContext.Provider>
  );
};

export default SocketContext;
