import { useEffect, useRef } from "react";
import { io } from "socket.io-client";
import { useAuth } from "./useAuth";

let socket = null;

export const useSocket = () => {
  const { user, isAuthenticated } = useAuth();
  const socketRef = useRef(null);

  useEffect(() => {
    if (!isAuthenticated || !user?.id) return;

    if (!socket) {
      socket = io("http://localhost:3600", {
        reconnection: true,
        reconnectionDelay: 1000,
        reconnectionAttempts: 5,
      });
    }

    socketRef.current = socket;

    socket.on("connect", () => {
      socket.emit("join_user", user.id);
    });

    // If already connected, join immediately
    if (socket.connected) {
      socket.emit("join_user", user.id);
    }

    return () => {
      // Don't disconnect on component unmount — keep global connection alive
    };
  }, [isAuthenticated, user?.id]);

  return socketRef.current;
};
