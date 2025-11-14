import React, { useState } from 'react';

const AnalyticsView = () => {
  const [timeRange, setTimeRange] = useState('week');
  const [metric, setMetric] = useState('bookings');

  const analyticsData = {
    bookings: [65, 78, 90, 81, 56, 55, 40],
    usage: [45, 52, 38, 24, 33, 26, 21],
    revenue: [120, 190, 300, 500, 200, 300, 450],
    users: [25, 30, 45, 50, 35, 40, 55]
  };

  const metrics = [
    { id: 'bookings', label: 'Total Bookings', color: 'blue', icon: '📅' },
    { id: 'usage', label: 'Lab Usage %', color: 'green', icon: '⚡' },
    { id: 'revenue', label: 'Revenue', color: 'purple', icon: '💰' },
    { id: 'users', label: 'Active Users', color: 'orange', icon: '👥' }
  ];

  const timeRanges = [
    { value: 'day', label: 'Daily' },
    { value: 'week', label: 'Weekly' },
    { value: 'month', label: 'Monthly' },
    { value: 'year', label: 'Yearly' }
  ];

  const getMetricColor = (metricId) => {
    const metricObj = metrics.find(m => m.id === metricId);
    return metricObj ? metricObj.color : 'blue';
  };

  const getTotal = (metricId) => {
    return analyticsData[metricId].reduce((a, b) => a + b, 0);
  };

  const getAverage = (metricId) => {
    return Math.round(getTotal(metricId) / analyticsData[metricId].length);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold text-gray-800">Advanced Analytics</h3>
          <p className="text-gray-600 text-sm">Deep insights into your lab booking performance</p>
        </div>
        
        <div className="flex space-x-4 mt-4 lg:mt-0">
          {/* Metric Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Metric</label>
            <select
              value={metric}
              onChange={(e) => setMetric(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-40"
            >
              {metrics.map((m) => (
                <option key={m.id} value={m.id}>{m.label}</option>
              ))}
            </select>
          </div>

          {/* Time Range Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Range</label>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="border border-gray-300 rounded-lg p-2 text-sm focus:ring-blue-500 focus:border-blue-500 w-32"
            >
              {timeRanges.map((range) => (
                <option key={range.value} value={range.value}>{range.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Analytics Chart */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h4 className="font-medium text-gray-700">
            {metrics.find(m => m.id === metric)?.label} - {timeRanges.find(t => t.value === timeRange)?.label} View
          </h4>
          <div className="text-sm text-gray-500">
            Total: <span className="font-semibold text-gray-800">{getTotal(metric)}</span> | 
            Avg: <span className="font-semibold text-gray-800">{getAverage(metric)}</span>
          </div>
        </div>
        
        <div className="h-64 bg-gradient-to-b from-gray-50 to-white rounded-lg border p-4">
          <div className="flex items-end justify-between h-full space-x-2">
            {analyticsData[metric].map((value, index) => {
              const maxValue = Math.max(...analyticsData[metric]);
              const height = (value / maxValue) * 180;
              return (
                <div key={index} className="flex flex-col items-center flex-1">
                  <div
                    className={`w-full bg-${getMetricColor(metric)}-500 rounded-t transition-all duration-500 ease-out hover:bg-${getMetricColor(metric)}-600`}
                    style={{ height: `${height}px` }}
                    title={`Value: ${value}`}
                  ></div>
                  <span className="text-xs text-gray-500 mt-2">
                    {timeRange === 'day' ? `H${index + 1}` : 
                     timeRange === 'week' ? `Day ${index + 1}` :
                     timeRange === 'month' ? `W${index + 1}` : `M${index + 1}`}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {metrics.map((m) => (
          <div 
            key={m.id} 
            className={`text-center p-4 rounded-lg border-2 transition-all cursor-pointer ${
              metric === m.id 
                ? `border-${m.color}-500 bg-${m.color}-50` 
                : 'border-gray-200 bg-white hover:border-gray-300'
            }`}
            onClick={() => setMetric(m.id)}
          >
            <div className="text-2xl mb-2">{m.icon}</div>
            <div className={`text-2xl font-bold text-${m.color}-600 mb-1`}>
              {getTotal(m.id)}
            </div>
            <div className="text-sm text-gray-600">{m.label}</div>
            <div className="text-xs text-gray-500 mt-1">
              Avg: {getAverage(m.id)}
            </div>
          </div>
        ))}
      </div>

      {/* Insights Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-200">
        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
          <span className="mr-2">💡</span>
          Analytics Insights
        </h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
                Peak booking hours: 10:00 AM - 12:00 PM
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
                Most utilized lab: Lab A (85% usage)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
                Booking growth: +15% compared to last week
              </li>
            </ul>
          </div>
          <div>
            <ul className="text-sm text-blue-700 space-y-2">
              <li className="flex items-center">
                <span className="w-2 h-2 bg-orange-500 rounded-full mr-3"></span>
                User engagement: 45% increase in active users
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-red-500 rounded-full mr-3"></span>
                Low usage detected: Lab E (25% utilization)
              </li>
              <li className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-3"></span>
                Revenue trend: Steady 8% weekly growth
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsView;