import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Bell, X, CheckCircle2, AlertTriangle, Trophy, Receipt, Wallet, Clock } from 'lucide-react';
import { getNotifications, getUnreadCount, markAllNotificationsRead, type AppNotification } from './walletUtils';

const iconMap: Record<string, React.ReactNode> = {
  payment: <CheckCircle2 className="w-5 h-5 text-success-600" />,
  alert: <AlertTriangle className="w-5 h-5 text-accent-500" />,
  quest: <Trophy className="w-5 h-5 text-secondary-600" />,
  bill: <Receipt className="w-5 h-5 text-primary-600" />,
  pocket: <Wallet className="w-5 h-5 text-indigo-600" />,
};

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export function NotificationPanel({ isOpen, onClose }: NotificationPanelProps) {
  const [notifications, setNotifications] = useState<AppNotification[]>([]);

  useEffect(() => {
    if (isOpen) {
      setNotifications(getNotifications());
      // Mark all as read after a delay
      const timer = setTimeout(() => {
        markAllNotificationsRead();
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  useEffect(() => {
    const handleNew = () => setNotifications(getNotifications());
    window.addEventListener('notificationAdded', handleNew);
    return () => window.removeEventListener('notificationAdded', handleNew);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/30 backdrop-blur-sm z-[60]"
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            className="fixed top-0 right-0 h-full w-full max-w-sm bg-white shadow-2xl z-[70] flex flex-col border-l border-surface-200"
          >
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-surface-200 bg-gradient-to-r from-primary-600 to-primary-700">
              <div className="flex items-center gap-3">
                <Bell className="w-5 h-5 text-white" />
                <h2 className="text-lg font-black text-white tracking-tight">Notifications</h2>
              </div>
              <button
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-xl transition-colors text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Notification List */}
            <div className="flex-1 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-surface-400 space-y-3 p-8">
                  <Bell className="w-16 h-16 text-surface-200" />
                  <p className="text-sm font-bold">No notifications yet</p>
                  <p className="text-xs text-center">Complete a payment to see notifications here</p>
                </div>
              ) : (
                <div className="divide-y divide-surface-100">
                  {notifications.map((notif, idx) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: idx * 0.04 }}
                      className={`p-4 hover:bg-surface-50 transition-colors cursor-pointer ${!notif.read ? 'bg-primary-50/40 border-l-4 border-primary-500' : ''}`}
                    >
                      <div className="flex gap-3">
                        <div className="w-10 h-10 rounded-xl bg-surface-100 flex items-center justify-center shrink-0 border border-surface-200">
                          {iconMap[notif.type] || <Bell className="w-5 h-5 text-surface-400" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-black text-surface-900 leading-tight mb-0.5 truncate">
                            {notif.title}
                          </p>
                          <p className="text-xs text-surface-600 font-medium leading-relaxed line-clamp-2">
                            {notif.message}
                          </p>
                          <div className="flex items-center gap-1.5 mt-1.5">
                            <Clock className="w-3 h-3 text-surface-400" />
                            <p className="text-[10px] text-surface-400 font-bold uppercase tracking-wider">
                              {notif.timestamp}
                            </p>
                          </div>
                        </div>
                        {!notif.read && (
                          <div className="w-2.5 h-2.5 bg-primary-500 rounded-full shrink-0 mt-1.5 animate-pulse" />
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {notifications.length > 0 && (
              <div className="p-4 border-t border-surface-200 bg-surface-50">
                <button
                  onClick={() => {
                    markAllNotificationsRead();
                    setNotifications(getNotifications());
                  }}
                  className="w-full text-xs font-black text-primary-600 hover:text-primary-700 uppercase tracking-widest py-2 transition-colors"
                >
                  Mark All as Read
                </button>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

/** Notification Bell Button (for use in AppShell) */
export function NotificationBell() {
  const [isOpen, setIsOpen] = useState(false);
  const [unread, setUnread] = useState(0);

  useEffect(() => {
    setUnread(getUnreadCount());
    const handleUpdate = () => setUnread(getUnreadCount());
    window.addEventListener('notificationAdded', handleUpdate);
    return () => window.removeEventListener('notificationAdded', handleUpdate);
  }, []);

  // Refresh count when panel closes
  useEffect(() => {
    if (!isOpen) {
      const timer = setTimeout(() => setUnread(getUnreadCount()), 200);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="relative p-2 hover:bg-surface-100 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5 text-surface-700" />
        {unread > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-0.5 -right-0.5 w-5 h-5 bg-error-500 text-white text-[9px] font-black rounded-full flex items-center justify-center shadow-md border-2 border-white"
          >
            {unread > 9 ? '9+' : unread}
          </motion.span>
        )}
      </button>
      <NotificationPanel isOpen={isOpen} onClose={() => setIsOpen(false)} />
    </>
  );
}
