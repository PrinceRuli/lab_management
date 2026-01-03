import React, { useState, useEffect, useRef, useCallback } from 'react';
import { FaBell, FaCalendarCheck, /* FaExclamationTriangle, FaUserPlus, */ FaWrench } from 'react-icons/fa';
import { bookingAPI, labAPI } from '../../services/api';
import { Link, useNavigate } from 'react-router-dom';

const AdminNotifications = ({ trigger, small }) => {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const ref = useRef();
  const navigate = useNavigate();

  const fetchNotifications = useCallback(async () => {
    try {
      setLoading(true);
      
      // 1. Fetch pending bookings
      const bookingsResponse = await bookingAPI.getAll({ status: 'pending' });
      let pendingBookings = [];
      
      if (Array.isArray(bookingsResponse.data)) {
        pendingBookings = bookingsResponse.data;
      } else if (bookingsResponse.data?.data) {
        pendingBookings = bookingsResponse.data.data;
      }
      
      // 2. Format notifications
      const formattedNotifications = pendingBookings.map(booking => ({
        id: booking._id,
        type: 'booking_pending',
        title: 'Booking Baru Menunggu',
        message: `${booking.teacherName || 'Guru'} mengajukan booking ${booking.activityTitle || ''}`,
        timestamp: booking.createdAt,
        priority: 'high',
        data: booking,
        link: `/admin/bookings?highlight=${booking._id}`
      }));
      
      // 3. Add system alerts (contoh: lab maintenance)
      const today = new Date();
      const alertsResponse = await labAPI.getAll();
      let labAlerts = [];
      
      if (Array.isArray(alertsResponse.data)) {
        labAlerts = alertsResponse.data
          .filter(lab => lab.maintenanceSchedule && new Date(lab.maintenanceSchedule) <= new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000))
          .map(lab => ({
            id: `lab-alert-${lab._id}`,
            type: 'system_alert',
            title: 'Jadwal Maintenance',
            message: `Lab ${lab.name} perlu maintenance ${new Date(lab.maintenanceSchedule).toLocaleDateString('id-ID')}`,
            timestamp: new Date().toISOString(),
            priority: 'medium',
            data: lab,
            link: `/admin/labs/${lab._id}`
          }));
      }
      
      // 4. Combine all notifications
      const allNotifications = [...formattedNotifications, ...labAlerts]
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.length);
      
    } catch (error) {
      console.error('Error fetching admin notifications:', error);
    } finally {
      setLoading(false);
    }
  }, []);

  const getNotificationIcon = (type) => {
    switch(type) {
      case 'booking_pending':
        return <FaCalendarCheck className="h-4 w-4 text-yellow-500" />;
      case 'system_alert':
        return <FaWrench className="h-4 w-4 text-orange-500" />;
      /* case 'user_activity':
        return <FaUserPlus className="h-4 w-4 text-blue-500" />;
      case 'system_warning':
        return <FaExclamationTriangle className="h-4 w-4 text-red-500" />; */
      default:
        return <FaBell className="h-4 w-4 text-gray-500" />;
    }
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 60) return `${diffMins}m`;
    if (diffMins < 1440) return `${Math.floor(diffMins / 60)}h`;
    return `${Math.floor(diffMins / 1440)}d`;
  };

  const handleNotificationClick = (notification) => {
    if (notification.link) {
      navigate(notification.link);
    }
    setOpen(false);
  };

  useEffect(() => {
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 60000); // Update setiap 1 menit
    return () => clearInterval(interval);
  }, [fetchNotifications]);

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
        
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center h-4 w-4 rounded-full bg-red-500 text-white text-xs">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-96 bg-white border border-gray-200 rounded-lg shadow-lg z-50">
          <div className="px-4 py-3 border-b bg-gray-50">
            <div className="flex justify-between items-center">
              <div>
                <strong className="text-gray-900">Notifications</strong>
                <span className="ml-2 text-xs text-gray-500">
                  {unreadCount} unread
                </span>
              </div>
              <Link
                to="/admin/bookings?filter=pending"
                className="text-xs text-blue-600 hover:text-blue-800 font-medium"
                onClick={() => setOpen(false)}
              >
                View All
              </Link>
            </div>
          </div>

          <div className="max-h-96 overflow-auto">
            {loading ? (
              <div className="p-4 text-center">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center">
                <FaBell className="h-10 w-10 text-gray-300 mx-auto mb-3" />
                <p className="text-gray-600">No notifications</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-100">
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="p-4 hover:bg-gray-50 cursor-pointer transition-colors border-l-4 border-yellow-400"
                    onClick={() => handleNotificationClick(notification)}
                  >
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start mb-1">
                          <p className="text-sm font-medium text-gray-900">
                            {notification.title}
                          </p>
                          <span className="text-xs text-gray-500">
                            {formatTime(notification.timestamp)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-2">
                          {notification.message}
                        </p>
                        {notification.type === 'booking_pending' && (
                          <div className="flex items-center gap-2 text-xs">
                            <span className="px-2 py-1 bg-yellow-100 text-yellow-800 rounded-full">
                              Lab: {notification.data.lab?.name || 'Unknown'}
                            </span>
                            <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full">
                              {new Date(notification.data.bookingDate).toLocaleDateString('id-ID')}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="px-4 py-3 border-t bg-gray-50">
            <div className="grid grid-cols-2 gap-2">
              <Link
                to="/admin/bookings"
                className="text-xs text-center text-blue-600 hover:text-blue-800 py-1"
                onClick={() => setOpen(false)}
              >
                Manage Bookings
              </Link>
              <Link
                to="/admin/labs"
                className="text-xs text-center text-blue-600 hover:text-blue-800 py-1"
                onClick={() => setOpen(false)}
              >
                Check Labs
              </Link>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminNotifications;