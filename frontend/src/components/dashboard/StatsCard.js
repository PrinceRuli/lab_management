import React from 'react';

const StatsCard = ({ title, value, icon, change, changeType = 'positive', description }) => {
  const changeColor = changeType === 'positive' ? 'text-green-600' : 'text-red-600';
  const changeBg = changeType === 'positive' ? 'bg-green-100' : 'bg-red-100';
  
  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow duration-200">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl font-bold text-gray-900">{value}</p>
          {change && (
            <div className="flex items-center mt-2">
              <span className={`text-xs font-medium px-2 py-1 rounded-full ${changeBg} ${changeColor}`}>
                {change}
              </span>
              <span className="text-xs text-gray-500 ml-2">{description}</span>
            </div>
          )}
        </div>
        <div className="w-12 h-12 bg-gradient-to-br from-cyan-500 to-cyan-600 rounded-lg flex items-center justify-center">
          <span className="text-xl text-white">{icon}</span>
        </div>
      </div>
    </div>
  );
};

export default StatsCard;