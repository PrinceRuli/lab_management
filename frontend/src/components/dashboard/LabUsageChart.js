import React from 'react';

const LabUsageChart = () => {
  const usageData = [
    { lab: 'Computer Lab 1', usage: 85, bookings: 45 },
    { lab: 'Multimedia Lab', usage: 70, bookings: 32 },
    { lab: 'Physics Lab', usage: 60, bookings: 28 },
    { lab: 'Chemistry Lab', usage: 45, bookings: 20 },
    { lab: 'Biology Lab', usage: 55, bookings: 25 },
  ];

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">
        Laboratory Usage Analytics
      </h3>

      <div className="space-y-4">
        {usageData.map((item, index) => (
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
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="grid grid-cols-2 gap-4 text-center">
          <div>
            <p className="text-2xl font-bold text-gray-900">182</p>
            <p className="text-sm text-gray-600">Total Bookings</p>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900">73%</p>
            <p className="text-sm text-gray-600">Average Usage</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabUsageChart;