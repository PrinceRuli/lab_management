import React, { useState, useEffect } from 'react';

const SystemReports = () => {
  const [reports, setReports] = useState({});
  const [loading, setLoading] = useState(true);
  const [dateRange, setDateRange] = useState('month');
  const [selectedReport, setSelectedReport] = useState('overview');

  // Sample report data
  const sampleReports = {
    overview: {
      title: "System Overview",
      description: "Comprehensive system performance and usage statistics",
      data: {
        totalBookings: 156,
        totalUsers: 89,
        totalLabs: 12,
        utilizationRate: 78,
        approvalRate: 92,
        cancellationRate: 8,
        peakUsage: "Monday, 10:00 AM",
        mostBookedLab: "Computer Lab 1",
        revenue: 12500000
      },
      charts: ['usageTrend', 'bookingDistribution']
    },
    bookings: {
      title: "Booking Analytics",
      description: "Detailed analysis of booking patterns and trends",
      data: {
        monthlyBookings: [45, 52, 48, 65, 72, 68, 75, 82, 78, 85, 90, 95],
        bookingTypes: {
          academic: 65,
          research: 20,
          event: 10,
          other: 5
        },
        statusDistribution: {
          approved: 72,
          pending: 15,
          rejected: 8,
          cancelled: 5
        },
        topTeachers: [
          { name: "Dr. Sarah Smith", bookings: 24 },
          { name: "Prof. John Davis", bookings: 18 },
          { name: "Dr. Maria Garcia", bookings: 15 }
        ]
      }
    },
    labs: {
      title: "Laboratory Utilization",
      description: "Laboratory usage and performance metrics",
      data: {
        labUtilization: [
          { name: "Computer Lab 1", usage: 85, bookings: 45 },
          { name: "Physics Lab", usage: 72, bookings: 32 },
          { name: "Chemistry Lab", usage: 68, bookings: 28 },
          { name: "Biology Lab", usage: 61, bookings: 25 },
          { name: "Robotics Lab", usage: 45, bookings: 18 }
        ],
        equipmentUsage: {
          computers: 82,
          projectors: 75,
          microscopes: 68,
          labEquipment: 59
        },
        maintenanceLogs: [
          { lab: "Computer Lab 1", date: "2024-01-15", type: "Routine", duration: "2 hours" },
          { lab: "Physics Lab", date: "2024-01-10", type: "Repair", duration: "4 hours" }
        ]
      }
    },
    financial: {
      title: "Financial Reports",
      description: "Revenue and financial performance analysis",
      data: {
        monthlyRevenue: [8500000, 9200000, 7800000, 10500000, 9800000, 11200000],
        revenueByLab: [
          { lab: "Computer Lab 1", revenue: 4500000 },
          { lab: "Physics Lab", revenue: 2800000 },
          { lab: "Chemistry Lab", revenue: 2200000 },
          { lab: "Biology Lab", revenue: 1800000 },
          { lab: "Other Labs", revenue: 1200000 }
        ],
        expenses: 8500000,
        profit: 4000000,
        growthRate: 15.8
      }
    }
  };

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setReports(sampleReports);
      setLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const handleExportReport = (format) => {
    console.log(`Exporting ${selectedReport} report as ${format}`);
    // Implement export functionality here
    alert(`Exporting ${sampleReports[selectedReport].title} as ${format.toUpperCase()}`);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const renderReportContent = () => {
    const report = reports[selectedReport];
    if (!report) return null;

    switch (selectedReport) {
      case 'overview':
        return (
          <div className="space-y-6">
            {/* Key Metrics */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Total Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{report.data.totalBookings}</p>
                <p className="text-green-500 text-sm">↑ 12% from last month</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Utilization Rate</p>
                <p className="text-2xl font-bold text-green-600">{report.data.utilizationRate}%</p>
                <p className="text-green-500 text-sm">↑ 5% from last month</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Approval Rate</p>
                <p className="text-2xl font-bold text-blue-600">{report.data.approvalRate}%</p>
                <p className="text-gray-500 text-sm">Stable</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Revenue</p>
                <p className="text-2xl font-bold text-purple-600">{formatCurrency(report.data.revenue)}</p>
                <p className="text-green-500 text-sm">↑ 8% from last month</p>
              </div>
            </div>

            {/* Additional Overview Data */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">System Performance</h4>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span>Peak Usage Time:</span>
                    <span className="font-semibold">{report.data.peakUsage}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Most Booked Lab:</span>
                    <span className="font-semibold">{report.data.mostBookedLab}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Active Users:</span>
                    <span className="font-semibold">{report.data.totalUsers}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Available Labs:</span>
                    <span className="font-semibold">{report.data.totalLabs}</span>
                  </div>
                </div>
              </div>

              <div className="bg-white p-6 rounded-lg border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-4">Quick Insights</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex items-center space-x-2 text-green-600">
                    <span>✅</span>
                    <span>System utilization is above target (78% vs 70% target)</span>
                  </div>
                  <div className="flex items-center space-x-2 text-blue-600">
                    <span>📈</span>
                    <span>15% growth in bookings compared to last month</span>
                  </div>
                  <div className="flex items-center space-x-2 text-orange-600">
                    <span>⚠️</span>
                    <span>Computer Lab 1 reaching maximum capacity</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case 'bookings':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Academic Bookings</p>
                <p className="text-2xl font-bold text-blue-600">{report.data.bookingTypes.academic}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Research Bookings</p>
                <p className="text-2xl font-bold text-green-600">{report.data.bookingTypes.research}%</p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Approved Rate</p>
                <p className="text-2xl font-bold text-purple-600">{report.data.statusDistribution.approved}%</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Top Teachers by Bookings</h4>
              <div className="space-y-3">
                {report.data.topTeachers.map((teacher, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
                        {index + 1}
                      </div>
                      <span className="font-medium">{teacher.name}</span>
                    </div>
                    <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                      {teacher.bookings} bookings
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'labs':
        return (
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Laboratory Utilization</h4>
              <div className="space-y-4">
                {report.data.labUtilization.map((lab, index) => (
                  <div key={index} className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span className="font-medium">{lab.name}</span>
                      <span>{lab.usage}% ({lab.bookings} bookings)</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className={`h-2 rounded-full ${
                          lab.usage >= 80 ? 'bg-red-500' : 
                          lab.usage >= 60 ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                        style={{ width: `${lab.usage}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Equipment Usage</h4>
              <div className="grid grid-cols-2 gap-4">
                {Object.entries(report.data.equipmentUsage).map(([equipment, usage]) => (
                  <div key={equipment} className="text-center p-4 border border-gray-200 rounded-lg">
                    <p className="text-gray-600 capitalize">{equipment}</p>
                    <p className="text-2xl font-bold text-blue-600">{usage}%</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'financial':
        return (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Total Revenue</p>
                <p className="text-2xl font-bold text-green-600">
                  {formatCurrency(report.data.monthlyRevenue.reduce((a, b) => a + b, 0))}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Total Expenses</p>
                <p className="text-2xl font-bold text-red-600">
                  {formatCurrency(report.data.expenses)}
                </p>
              </div>
              <div className="bg-white p-4 rounded-lg border border-gray-200">
                <p className="text-gray-600 text-sm">Net Profit</p>
                <p className="text-2xl font-bold text-purple-600">
                  {formatCurrency(report.data.profit)}
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg border border-gray-200">
              <h4 className="font-semibold text-gray-900 mb-4">Revenue by Laboratory</h4>
              <div className="space-y-3">
                {report.data.revenueByLab.map((lab, index) => (
                  <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                    <span className="font-medium">{lab.lab}</span>
                    <span className="font-semibold text-green-600">{formatCurrency(lab.revenue)}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">System Reports</h2>
          <p className="text-gray-600 mt-1">Comprehensive analytics and system performance reports</p>
        </div>
        <div className="flex items-center space-x-4 mt-4 lg:mt-0">
          <select 
            className="border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value)}
          >
            <option value="week">Last 7 Days</option>
            <option value="month">Last 30 Days</option>
            <option value="quarter">Last Quarter</option>
            <option value="year">Last Year</option>
          </select>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleExportReport('pdf')}
              className="flex items-center space-x-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <span>📄</span>
              <span>PDF</span>
            </button>
            <button 
              onClick={() => handleExportReport('excel')}
              className="flex items-center space-x-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600 transition-colors"
            >
              <span>📊</span>
              <span>Excel</span>
            </button>
          </div>
        </div>
      </div>

      {/* Report Navigation */}
      <div className="flex space-x-1 bg-gray-100 p-1 rounded-lg mb-6 overflow-x-auto">
        {Object.entries(reports).map(([key, report]) => (
          <button
            key={key}
            onClick={() => setSelectedReport(key)}
            className={`px-4 py-2 rounded-md text-sm font-medium whitespace-nowrap transition-colors ${
              selectedReport === key
                ? 'bg-white text-blue-600 shadow-sm'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            {report.title}
          </button>
        ))}
      </div>

      {/* Current Report Header */}
      <div className="mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          {reports[selectedReport]?.title}
        </h3>
        <p className="text-gray-600 mt-1">
          {reports[selectedReport]?.description}
        </p>
      </div>

      {/* Report Content */}
      {renderReportContent()}

      {/* Report Summary */}
      <div className="mt-8 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <div className="flex items-center space-x-3">
          <span className="text-blue-500 text-lg">💡</span>
          <div>
            <p className="font-semibold text-blue-800">Report Generated</p>
            <p className="text-blue-700 text-sm">
              {new Date().toLocaleDateString('id-ID', { 
                weekday: 'long', 
                year: 'numeric', 
                month: 'long', 
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              })}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SystemReports;