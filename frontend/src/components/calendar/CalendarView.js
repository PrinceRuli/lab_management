import React, { useState, useEffect } from 'react';

const CalendarView = ({ laboratory, bookings = [], onDateSelect, onBookingSelect }) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(null);
  const [view, setView] = useState('month'); // 'month' or 'week'

  // Get current month and year
  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();

  // Generate days in month
  const getDaysInMonth = (year, month) => {
    return new Date(year, month + 1, 0).getDate();
  };

  // Get first day of month
  const getFirstDayOfMonth = (year, month) => {
    return new Date(year, month, 1).getDay();
  };

  // Generate calendar days
  const generateCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentYear, currentMonth);
    const firstDay = getFirstDayOfMonth(currentYear, currentMonth);
    const days = [];

    // Add empty cells for days before the first day of month
    for (let i = 0; i < firstDay; i++) {
      days.push(null);
    }

    // Add days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentYear, currentMonth, day);
      days.push(date);
    }

    return days;
  };

  // Navigate to previous month
  const prevMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth - 1, 1));
  };

  // Navigate to next month
  const nextMonth = () => {
    setCurrentDate(new Date(currentYear, currentMonth + 1, 1));
  };

  // Go to today
  const goToToday = () => {
    setCurrentDate(new Date());
    setSelectedDate(new Date());
  };

  // Check if date has bookings
  const getBookingsForDate = (date) => {
    if (!date) return [];
    
    const dateString = date.toISOString().split('T')[0];
    return bookings.filter(booking => booking.date === dateString);
  };

  // Check if date is today
  const isToday = (date) => {
    if (!date) return false;
    const today = new Date();
    return date.toDateString() === today.toDateString();
  };

  // Check if date is selected
  const isSelected = (date) => {
    if (!date || !selectedDate) return false;
    return date.toDateString() === selectedDate.toDateString();
  };

  // Handle date click
  const handleDateClick = (date) => {
    if (!date) return;
    
    setSelectedDate(date);
    if (onDateSelect) {
      onDateSelect(date);
    }
  };

  // Format time for display
  const formatTime = (timeString) => {
    return timeString.replace(/:00$/, '');
  };

  // Get booking status color
  const getBookingStatusColor = (status) => {
    const colors = {
      confirmed: 'bg-green-100 text-green-800 border-green-200',
      pending: 'bg-amber-100 text-amber-800 border-amber-200',
      cancelled: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const calendarDays = generateCalendarDays();
  const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Calendar Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          <h3 className="text-xl font-bold text-gray-900">
            {monthNames[currentMonth]} {currentYear}
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={prevMonth}
              className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors duration-200"
            >
              ←
            </button>
            <button
              onClick={goToToday}
              className="px-3 py-1 text-sm text-cyan-600 bg-cyan-50 rounded-lg hover:bg-cyan-100 transition-colors duration-200"
            >
              Today
            </button>
            <button
              onClick={nextMonth}
              className="p-2 text-gray-600 hover:text-cyan-600 hover:bg-cyan-50 rounded-lg transition-colors duration-200"
            >
              →
            </button>
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={() => setView('month')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              view === 'month' 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setView('week')}
            className={`px-3 py-1 text-sm rounded-lg transition-colors duration-200 ${
              view === 'week' 
                ? 'bg-cyan-600 text-white' 
                : 'text-gray-600 hover:bg-gray-100'
            }`}
          >
            Week
          </button>
        </div>
      </div>

      {/* Day Names Header */}
      <div className="grid grid-cols-7 gap-1 mb-2">
        {dayNames.map(day => (
          <div key={day} className="text-center text-sm font-medium text-gray-500 py-2">
            {day}
          </div>
        ))}
      </div>

      {/* Calendar Grid */}
      <div className="grid grid-cols-7 gap-1">
        {calendarDays.map((date, index) => {
          const dateBookings = getBookingsForDate(date);
          const isCurrentDay = isToday(date);
          const isSelectedDay = isSelected(date);

          return (
            <div
              key={index}
              onClick={() => handleDateClick(date)}
              className={`min-h-24 p-2 border rounded-lg cursor-pointer transition-all duration-200 ${
                !date
                  ? 'border-transparent'
                  : isSelectedDay
                  ? 'border-cyan-500 bg-cyan-50'
                  : isCurrentDay
                  ? 'border-cyan-200 bg-cyan-25'
                  : 'border-gray-200 hover:border-cyan-300 hover:bg-cyan-25'
              }`}
            >
              {date && (
                <>
                  {/* Date Number */}
                  <div className={`text-sm font-medium mb-1 ${
                    isSelectedDay 
                      ? 'text-cyan-700' 
                      : isCurrentDay
                      ? 'text-cyan-600'
                      : 'text-gray-700'
                  }`}>
                    {date.getDate()}
                  </div>

                  {/* Bookings */}
                  <div className="space-y-1">
                    {dateBookings.slice(0, 2).map((booking, bookingIndex) => (
                      <div
                        key={bookingIndex}
                        onClick={(e) => {
                          e.stopPropagation();
                          if (onBookingSelect) {
                            onBookingSelect(booking);
                          }
                        }}
                        className={`text-xs p-1 rounded border ${getBookingStatusColor(booking.status)} cursor-pointer hover:opacity-80 transition-opacity duration-200`}
                        title={`${booking.title} (${formatTime(booking.startTime)} - ${formatTime(booking.endTime)})`}
                      >
                        <div className="font-medium truncate">
                          {booking.title}
                        </div>
                        <div className="truncate">
                          {formatTime(booking.startTime)} - {formatTime(booking.endTime)}
                        </div>
                      </div>
                    ))}
                    
                    {dateBookings.length > 2 && (
                      <div className="text-xs text-gray-500 text-center">
                        +{dateBookings.length - 2} more
                      </div>
                    )}
                  </div>
                </>
              )}
            </div>
          );
        })}
      </div>

      {/* Selected Date Details */}
      {selectedDate && (
        <div className="mt-6 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <h4 className="font-semibold text-gray-900 mb-3">
            Bookings for {selectedDate.toLocaleDateString()}
          </h4>
          
          {getBookingsForDate(selectedDate).length === 0 ? (
            <p className="text-gray-500 text-sm">No bookings for this date</p>
          ) : (
            <div className="space-y-2">
              {getBookingsForDate(selectedDate).map((booking, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg border ${getBookingStatusColor(booking.status)} cursor-pointer hover:shadow-sm transition-shadow duration-200`}
                  onClick={() => onBookingSelect && onBookingSelect(booking)}
                >
                  <div className="flex justify-between items-start mb-1">
                    <h5 className="font-medium text-sm">{booking.title}</h5>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      booking.status === 'confirmed' 
                        ? 'bg-green-200 text-green-800'
                        : booking.status === 'pending'
                        ? 'bg-amber-200 text-amber-800'
                        : 'bg-red-200 text-red-800'
                    }`}>
                      {booking.status}
                    </span>
                  </div>
                  <p className="text-xs text-gray-600 mb-1">{booking.description}</p>
                  <div className="flex justify-between text-xs text-gray-500">
                    <span>🕒 {formatTime(booking.startTime)} - {formatTime(booking.endTime)}</span>
                    <span>👤 {booking.participants} people</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Legend */}
      <div className="mt-6 flex items-center justify-center space-x-4 text-xs">
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-green-100 border border-green-200 rounded"></div>
          <span className="text-gray-600">Confirmed</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-amber-100 border border-amber-200 rounded"></div>
          <span className="text-gray-600">Pending</span>
        </div>
        <div className="flex items-center space-x-1">
          <div className="w-3 h-3 bg-red-100 border border-red-200 rounded"></div>
          <span className="text-gray-600">Cancelled</span>
        </div>
      </div>
    </div>
  );
};

export default CalendarView;