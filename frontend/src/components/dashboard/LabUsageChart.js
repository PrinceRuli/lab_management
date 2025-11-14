import React from 'react';

const LabUsageChart = ({ data = [], loading = false }) => {
  const defaultData = [
    { lab: 'Computer Lab 1', usage: 85, bookings: 45, capacity: 30 },
    { lab: 'Multimedia Lab', usage: 70, bookings: 32, capacity: 20 },
    { lab: 'Physics Lab', usage: 60, bookings: 28, capacity: 25 },
    { lab: 'Chemistry Lab', usage: 45, bookings: 20, capacity: 15 },
    { lab: 'Biology Lab', usage: 55, bookings: 25, capacity: 20 },
  ];

  const displayData = data.length > 0 ? data : defaultData;

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="h-6 bg-gray-200 rounded w-1/3 mb-6"></div>
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((item) => (
            <div key={item} className="space-y-2">
              <div className="flex justify-between">
                <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/6"></div>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  const totalBookings = displayData.reduce((sum, item) => sum + item.bookings, 0);
  const averageUsage = Math.round(displayData.reduce((sum, item) => sum + item.usage, 0) / displayData.length);

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Laboratory Usage Analytics
      </h3>

      <div className="space-y-4 mb-6">
        {displayData.map((item, index) => (
          <div key={index} className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="font-medium text-gray-700">{item.lab}</span>
              <span className="text-gray-600">{item.usage}% ({item.bookings} bookings)</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-cyan-500 to-cyan-600 h-2 rounded-full transition-all duration-1000 ease-out"
                style={{ width: `${item.usage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-500">
              <span>Capacity: {item.capacity} students</span>
              <span>{Math.round((item.bookings / 30) * 100)}% monthly utilization</span>
            </div>
          </div>
        ))}
      </div>

      <div className="pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">{totalBookings}</p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">{averageUsage}%</p>
            <p className="text-sm text-gray-600">Average Usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabUsageChart;