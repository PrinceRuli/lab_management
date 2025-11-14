import React from 'react';

const StatsCard = ({ title, value, icon, change, changeType = 'positive', description, loading = false }) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  const changeBg = changeType === 'positive' ? 'bg-green-100' : 'bg-red-100';
  
  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2 flex-1">
            <div className="h-4 bg-gray-200 rounded w-1/2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            <div className="h-3 bg-gray-200 rounded w-2/3"></div>
          </div>
          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
  }
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200 group">
      <div className="flex items-center justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mb-2">{value}</p>
          {change && (
            <div className="flex items-center">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeBg} ${changeColor}`}>
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-2">{description}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center group-hover:scale-110 transition-transform duration-200">
          <span className="text-xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;