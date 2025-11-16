import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const { user } = useAuth();

  // Simple polling for new queries (every 30 seconds)
  useEffect(() => {
    if (!user) return;

    const pollForUpdates = async () => {
      try {
        // You can implement this later if needed
        // For now, we'll keep it empty
      } catch (error) {
        console.error("Error polling for updates:", error);
      }
    };

    const interval = setInterval(pollForUpdates, 30000);
    pollForUpdates(); // Initial call

    return () => clearInterval(interval);
  }, [user]);

  const addNotification = (notification) => {
    setNotifications((prev) => [...prev, { ...notification, id: Date.now() }]);
  };

  const removeNotification = (id) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  };

  const clearAllNotifications = () => {
    setNotifications([]);
  };

  return {
    notifications,
    addNotification,
    removeNotification,
    clearAllNotifications,
  };
};
