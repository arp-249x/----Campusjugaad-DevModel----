import { X, CheckCircle, Clock, AlertCircle, Trash2 } from "lucide-react";
import { motion } from "motion/react";

interface Notification {
  id: string;
  type: "success" | "info" | "warning";
  title: string;
  message: string;
  timestamp: string;
  read: boolean;
}

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const notifications: Notification[] = [
    {
      id: "1",
      type: "success",
      title: "Task Accepted",
      message: "Task Master accepted your bid for 'Print Assignment'",
      timestamp: "2 mins ago",
      read: false,
    },
    {
      id: "2",
      type: "success",
      title: "Money Credited",
      message: "₹100 has been credited to your wallet",
      timestamp: "1 hour ago",
      read: false,
    },
    {
      id: "3",
      type: "info",
      title: "New Quest Available",
      message: "A new high-paying quest is available near you",
      timestamp: "3 hours ago",
      read: true,
    },
    {
      id: "4",
      type: "warning",
      title: "Quest Deadline Approaching",
      message: "Deliver Lab Coat quest expires in 15 minutes",
      timestamp: "5 hours ago",
      read: true,
    },
    {
      id: "5",
      type: "success",
      title: "Level Up!",
      message: "Congratulations! You've reached Level 5",
      timestamp: "1 day ago",
      read: true,
    },
  ];

  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleClearAll = () => {
    // In a real app, this would clear notifications
    console.log("Clear all notifications");
  };

  if (!isOpen) return null;

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-[#00F5D4]" />;
      case "info":
        return <Clock className="w-5 h-5 text-[#2D7FF9]" />;
      case "warning":
        return <AlertCircle className="w-5 h-5 text-[#FF4800]" />;
    }
  };

  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50"
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        initial={{ x: "100%" }}
        animate={{ x: 0 }}
        exit={{ x: "100%" }}
        transition={{ type: "spring", damping: 25, stiffness: 200 }}
        className="fixed top-0 right-0 h-full w-full md:w-[420px] bg-[var(--campus-bg)] border-l border-[var(--campus-border)] z-50 overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 bg-[var(--campus-bg)] border-b border-[var(--campus-border)] px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <h2 className="text-[var(--campus-text-primary)]">Notifications</h2>
            {unreadCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {unreadCount}
              </span>
            )}
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleClearAll}
              className="text-sm text-[var(--campus-text-secondary)] hover:text-[var(--campus-text-primary)] transition-colors"
            >
              Clear All
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-[var(--campus-border)] rounded-full transition-colors"
            >
              <X className="w-5 h-5 text-[var(--campus-text-secondary)]" />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="divide-y divide-[var(--campus-border)]">
          {notifications.map((notification) => (
            <div
              key={notification.id}
              className={`px-6 py-4 hover:bg-[var(--campus-border)] transition-colors cursor-pointer group ${
                !notification.read ? "bg-[var(--campus-border)]/30" : ""
              }`}
            >
              <div className="flex items-start gap-3">
                {/* Icon */}
                <div className="mt-1">{getIcon(notification.type)}</div>

                {/* Content */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="text-[var(--campus-text-primary)] text-sm">
                      {notification.title}
                    </h3>
                    {!notification.read && (
                      <div className="w-2 h-2 bg-[#2D7FF9] rounded-full shrink-0 mt-1.5" />
                    )}
                  </div>
                  <p className="text-sm text-[var(--campus-text-secondary)] mb-2">
                    {notification.message}
                  </p>
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-[var(--campus-text-secondary)]">
                      {notification.timestamp}
                    </p>
                    <button className="opacity-0 group-hover:opacity-100 p-1 hover:bg-red-500/10 rounded transition-all">
                      <Trash2 className="w-4 h-4 text-red-500" />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Empty State (if no notifications) */}
        {notifications.length === 0 && (
          <div className="flex flex-col items-center justify-center h-64 px-6 text-center">
            <div className="w-16 h-16 bg-[var(--campus-border)] rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-8 h-8 text-[var(--campus-text-secondary)]" />
            </div>
            <p className="text-[var(--campus-text-primary)] mb-2">All caught up!</p>
            <p className="text-sm text-[var(--campus-text-secondary)]">
              No new notifications at the moment
            </p>
          </div>
        )}
      </motion.div>
    </>
  );
}
