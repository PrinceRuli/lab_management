import React, { useState } from 'react';

const ReportsGenerator = () => {
  const [reportType, setReportType] = useState('usage');
  const [dateRange, setDateRange] = useState({
    start: '',
    end: ''
  });
  const [selectedLab, setSelectedLab] = useState('all');

  const labs = ['All Labs', 'Lab A', 'Lab B', 'Lab C', 'Lab D'];
  const reportTypes = [
    { value: 'usage', label: 'Lab Usage Report' },
    { value: 'booking', label: 'Booking Statistics' },
    { value: 'user', label: 'User Activity' },
    { value: 'revenue', label: 'Revenue Report' }
  ];

  const generateReport = () => {
    // Logic untuk generate report
    console.log('Generating report:', { reportType, dateRange, selectedLab });
    alert('Report generated successfully!');
  };

  const exportReport = (format) => {
    // Logic untuk export report
    console.log(`Exporting report as ${format}`);
    alert(`Report exported as ${format.toUpperCase()}!`);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 border">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Generate Reports</h3>
      
      <div className="space-y-6">
        {/* Report Type Selection */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Report Type
          </label>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
            {reportTypes.map((type) => (
              <button
                key={type.value}
                onClick={() => setReportType(type.value)}
                className={`p-3 rounded-lg border text-sm font-medium ${
                  reportType === type.value
                    ? 'bg-blue-500 text-white border-blue-500'
                    : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
                }`}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Lab Selection
            </label>
            <select
              value={selectedLab}
              onChange={(e) => setSelectedLab(e.target.value)}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            >
              {labs.map((lab) => (
                <option key={lab} value={lab.toLowerCase()}>
                  {lab}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Start Date
            </label>
            <input
              type="date"
              value={dateRange.start}
              onChange={(e) => setDateRange({...dateRange, start: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              End Date
            </label>
            <input
              type="date"
              value={dateRange.end}
              onChange={(e) => setDateRange({...dateRange, end: e.target.value})}
              className="w-full border border-gray-300 rounded-lg p-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3">
          <button
            onClick={generateReport}
            className="bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 font-medium"
          >
            Generate Report
          </button>
          <button
            onClick={() => exportReport('pdf')}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 font-medium"
          >
            Export PDF
          </button>
          <button
            onClick={() => exportReport('excel')}
            className="bg-green-500 text-white px-6 py-2 rounded-lg hover:bg-green-600 font-medium"
          >
            Export Excel
          </button>
          <button
            onClick={() => exportReport('csv')}
            className="bg-purple-500 text-white px-6 py-2 rounded-lg hover:bg-purple-600 font-medium"
          >
            Export CSV
          </button>
        </div>

        {/* Preview Section */}
        <div className="border-t pt-4">
          <h4 className="font-medium text-gray-700 mb-3">Report Preview</h4>
          <div className="bg-gray-50 rounded-lg p-4 text-center text-gray-500">
            Report preview will be shown here after generation
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportsGenerator;