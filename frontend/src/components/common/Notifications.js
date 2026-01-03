import React, { useEffect, useState, useRef, useCallback } from 'react';
import { FaBell, FaCheck, FaExclamationCircle, FaCalendarCheck, FaTrash } from 'react-icons/fa';
import { toast } from 'react-hot-toast';
import { notificationAPI } from '../../services/api';
import { Link } from 'react-router-dom';

const Notifications = ({ trigger, small }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef();

  // Fetch notifications dari database
  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      const response = await notificationAPI.getMyNotifications();
      
      if (response.data.success) {
        setNotifications(response.data.notifications || []);
        setUnreadCount(response.data.unreadCount || 0);
      }
    } catch (error) {
      console.error('Error fetching notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  // Mark as read
  const markAsRead = async (notificationId) => {
    try {
      await notificationAPI.markAsRead(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => 
          n._id === notificationId ? { ...n, read: true } : n
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
      
      toast.success('Notification marked as read');
    } catch (error) {
      toast.error('Failed to mark as read');
    }
  };

  // Mark all as read
  const markAllAsRead = async () => {
    try {
      await notificationAPI.markAllAsRead();
      
      // Update local state
      setNotifications(prev => 
        prev.map(n => ({ ...n, read: true }))
      );
      setUnreadCount(0);
      
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark all as read');
    }
  };

  // Delete notification
  const deleteNotification = async (notificationId) => {
    try {
      await notificationAPI.deleteNotification(notificationId);
      
      // Update local state
      setNotifications(prev => 
        prev.filter(n => n._id !== notificationId)
      );
      
      toast.success('Notification deleted');
    } catch (error) {
      toast.error('Failed to delete notification');
    }
  };

  // Clear all
  const clearAllNotifications = async () => {
    try {
      await notificationAPI.clearAllNotifications();
      
      // Clear local state
      setNotifications([]);
      setUnreadCount(0);
      
      toast.success('All notifications cleared');
    } catch (error) {
      toast.error('Failed to clear notifications');
    }
  };

  // Get icon berdasarkan booking status
  const getNotificationIcon = (notification) => {
    const message = notification.message.toLowerCase();
    
    if (message.includes('disetujui') || message.includes('approved')) {
      return <FaCalendarCheck className="h-4 w-4 text-green-500" />;
    }
    if (message.includes('ditolak') || message.includes('rejected')) {
      return <FaExclamationCircle className="h-4 w-4 text-red-500" />;
    }
    if (message.includes('pengingat') || message.includes('reminder')) {
      return <FaBell className="h-4 w-4 text-blue-500" />;
    }
    return <FaBell className="h-4 w-4 text-gray-500" />;
  };

  // Format date
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  // Initial fetch
  useEffect(() => {
    fetchNotifications();
    
    // Polling setiap 30 detik untuk real-time updates
    const interval = setInterval(fetchNotifications, 30000);
    
    return () => clearInterval(interval);
  }, [fetchNotifications]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={ref}>
      {/* Bell Button */}
      <button 
        onClick={(e) => { 
          e.stopPropagation(); 
          setOpen(!open);
          if (!open) fetchNotifications();
        }} 
        className={`relative ${small ? 'p-1' : 'p-2'} text-gray-600 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors`}
      >
        {trigger || <FaBell className={small ? "h-4 w-4" : "h-5 w-5"} />}
        
        {/* Unread Badge */}
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          {/* Header */}
          <div className="px-4 py-3 border-b flex items-center justify-between bg-gray-50">
            <div>
              <strong className="text-gray-900">Notifications</strong>
              <span className="ml-2 text-xs text-gray-500">
                {unreadCount} unread
              </span>
            </div>
            {notifications.length > 0 && (
              <button
                onClick={markAllAsRead}
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
              >
                Mark all read
              </button>
            )}
          </div>

          {/* Notifications List */}
          <div className="max-h-80 overflow-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="inline-block animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600"></div>
                <p className="mt-2 text-sm text-gray-600">Loading notifications...</p>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <FaBell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No notifications</p>
                <p className="text-sm text-gray-500 mt-1">You're all caught up!</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification._id}
                    className={`p-3 hover:bg-gray-50 transition-colors ${notification.read ? 'bg-gray-50 opacity-75' : ''}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3 flex-1">
                        <div className="flex-shrink-0 mt-1">
                          {getNotificationIcon(notification)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-800">
                            {notification.message}
                          </p>
                          <div className="flex items-center justify-between mt-1">
                            <span className="text-xs text-gray-500">
                              {formatDate(notification.createdAt)}
                            </span>
                            {notification.link && (
                              <Link
                                to={notification.link}
                                className="text-xs text-blue-600 hover:text-blue-800"
                                onClick={() => setOpen(false)}
                              >
                                View
                              </Link>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="flex space-x-1 ml-2">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification._id)}
                            className="text-gray-400 hover:text-gray-600 p-1"
                            title="Mark as read"
                          >
                            <FaCheck className="h-3 w-3" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification._id)}
                          className="text-gray-400 hover:text-red-600 p-1"
                          title="Delete"
                        >
                          <FaTrash className="h-3 w-3" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="px-3 py-2 border-t flex items-center justify-between">
              <button
                onClick={clearAllNotifications}
                className="text-xs text-red-600 hover:text-red-800"
              >
                Clear all
              </button>
              <Link
                to="/teacher/notifications"
                className="text-xs text-blue-600 hover:text-blue-800"
                onClick={() => setOpen(false)}
              >
                View all
              </Link>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Notifications;