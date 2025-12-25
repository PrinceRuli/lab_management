import React, { useState } from 'react';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, 
  PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer 
} from 'recharts';

const ReportAnalytics = () => {
  const labUsageData = [
    { name: 'Lab Komputer A', digunakan: 12, tersedia: 18, maintenance: 2 },
    { name: 'Lab Kimia', digunakan: 8, tersedia: 10, maintenance: 2 },
    { name: 'Lab Fisika', digunakan: 10, tersedia: 12, maintenance: 3 },
    { name: 'Lab Biologi', digunakan: 6, tersedia: 7, maintenance: 2 },
  ];
  
  const monthlyBookingData = [
    { month: 'Jan', pemesanan: 15, dikonfirmasi: 12, ditolak: 3 },
    { month: 'Feb', pemesanan: 18, dikonfirmasi: 15, ditolak: 3 },
    { month: 'Mar', pemesanan: 22, dikonfirmasi: 18, ditolak: 4 },
    { month: 'Apr', pemesanan: 20, dikonfirmasi: 16, ditolak: 4 },
    { month: 'Mei', pemesanan: 25, dikonfirmasi: 22, ditolak: 3 },
    { month: 'Jun', pemesanan: 30, dikonfirmasi: 27, ditolak: 3 },
  ];
  
  const bookingStatusData = [
    { name: 'Dikonfirmasi', value: 65 },
    { name: 'Menunggu', value: 20 },
    { name: 'Ditolak', value: 15 },
  ];
  
  const mostUsedLabs = [
    { name: 'Lab Komputer A', penggunaan: 45 },
    { name: 'Lab Fisika', penggunaan: 32 },
    { name: 'Lab Kimia', penggunaan: 28 },
    { name: 'Lab Biologi', penggunaan: 18 },
  ];
  
  const [reportType, setReportType] = useState('bulanan');
  const [dateRange, setDateRange] = useState({
    start: '2023-01-01',
    end: '2023-06-30'
  });
  
  const summaryStats = {
    totalLabs: 4,
    totalBookings: 110,
    confirmedBookings: 85,
    pendingBookings: 22,
    rejectedBookings: 13,
    avgUsageRate: 72.5,
  };
  
  const COLORS = ['#4CAF50', '#FF9800', '#F44336', '#2196F3', '#9C27B0'];
  
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };
  
  const generateReport = () => {
    alert(`Laporan akan dibuat untuk periode ${dateRange.start} hingga ${dateRange.end}`);
  };
  
  const exportReport = (format) => {
    alert(`Laporan akan diekspor dalam format ${format.toUpperCase()}`);
  };
  
  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Laporan dan Analitik</h2>
      
      {/* Report Controls */}
      <div className="bg-gray-50 p-6 rounded-lg mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Rentang Waktu Laporan</h3>
        
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Dari Tanggal</label>
              <input 
                type="date" 
                name="start" 
                value={dateRange.start} 
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Sampai Tanggal</label>
              <input 
                type="date" 
                name="end" 
                value={dateRange.end} 
                onChange={handleDateChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tipe Laporan</label>
              <select 
                value={reportType} 
                onChange={(e) => setReportType(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="bulanan">Bulanan</option>
                <option value="mingguan">Mingguan</option>
                <option value="harian">Harian</option>
              </select>
            </div>
            
            <div className="flex items-end">
              <button 
                onClick={generateReport}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                Buat Laporan
              </button>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-2">
            <button 
              onClick={() => exportReport('pdf')}
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              Export PDF
            </button>
            <button 
              onClick={() => exportReport('excel')}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              Export Excel
            </button>
            <button 
              onClick={() => exportReport('csv')}
              className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              Export CSV
            </button>
          </div>
        </div>
      </div>
      
      {/* Summary Stats */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Ringkasan Statistik</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-blue-600">Total Lab</h4>
            <p className="text-3xl font-bold text-blue-800 mt-2">{summaryStats.totalLabs}</p>
            <p className="text-xs text-gray-500 mt-1">Lab tersedia di sistem</p>
          </div>
          
          <div className="bg-green-50 p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-green-600">Total Pemesanan</h4>
            <p className="text-3xl font-bold text-green-800 mt-2">{summaryStats.totalBookings}</p>
            <p className="text-xs text-gray-500 mt-1">Pemesanan dalam periode</p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-purple-600">Pemesanan Dikonfirmasi</h4>
            <p className="text-3xl font-bold text-purple-800 mt-2">{summaryStats.confirmedBookings}</p>
            <p className="text-xs text-gray-500 mt-1">
              {((summaryStats.confirmedBookings / summaryStats.totalBookings) * 100).toFixed(1)}% dari total
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg shadow">
            <h4 className="text-sm font-medium text-yellow-600">Tingkat Penggunaan</h4>
            <p className="text-3xl font-bold text-yellow-800 mt-2">{summaryStats.avgUsageRate}%</p>
            <p className="text-xs text-gray-500 mt-1">Rata-rata penggunaan lab</p>
          </div>
        </div>
      </div>
      
      {/* Charts Section */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Visualisasi Data</h3>
        
        {/* First Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Lab Usage Chart */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Penggunaan Lab</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={labUsageData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="digunakan" fill="#4CAF50" name="Digunakan" />
                  <Bar dataKey="tersedia" fill="#2196F3" name="Tersedia" />
                  <Bar dataKey="maintenance" fill="#FF9800" name="Maintenance" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Booking Status Pie Chart */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Status Pemesanan</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bookingStatusData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bookingStatusData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
        
        {/* Second Row of Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Monthly Trend Chart */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Trend Pemesanan Per Bulan</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyBookingData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="pemesanan" stroke="#2196F3" name="Total Pemesanan" />
                  <Line type="monotone" dataKey="dikonfirmasi" stroke="#4CAF50" name="Dikonfirmasi" />
                  <Line type="monotone" dataKey="ditolak" stroke="#F44336" name="Ditolak" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Most Used Labs Chart */}
          <div className="bg-white p-4 border border-gray-200 rounded-lg shadow">
            <h4 className="text-lg font-medium text-gray-700 mb-4">Lab Paling Banyak Digunakan</h4>
            <div className="h-64">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={mostUsedLabs}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="penggunaan" fill="#9C27B0" name="Jumlah Penggunaan" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>
      </div>
      
      {/* Detailed Report Table */}
      <div className="mb-8">
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Laporan Detail Pemesanan</h3>
        
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white border border-gray-200">
            <thead>
              <tr className="bg-gray-50">
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">Bulan</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">Total Pemesanan</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">Dikonfirmasi</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">Ditolak</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">Persentase Dikonfirmasi</th>
                <th className="py-3 px-4 border-b text-left text-sm font-medium text-gray-700">Rata-rata Penggunaan/Hari</th>
              </tr>
            </thead>
            <tbody>
              {monthlyBookingData.map((data, index) => (
                <tr key={index} className="hover:bg-gray-50">
                  <td className="py-3 px-4 border-b font-medium">{data.month}</td>
                  <td className="py-3 px-4 border-b">{data.pemesanan}</td>
                  <td className="py-3 px-4 border-b">{data.dikonfirmasi}</td>
                  <td className="py-3 px-4 border-b">{data.ditolak}</td>
                  <td className="py-3 px-4 border-b">{((data.dikonfirmasi / data.pemesanan) * 100).toFixed(1)}%</td>
                  <td className="py-3 px-4 border-b">{(data.dikonfirmasi / 30).toFixed(1)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      
      {/* Insights Section */}
      <div>
        <h3 className="text-xl font-semibold text-gray-700 mb-4">Wawasan dan Rekomendasi</h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-green-50 p-4 rounded-lg border border-green-100">
            <h4 className="text-lg font-medium text-green-700 mb-2 flex items-center">
              <span className="mr-2">📈</span> Trend Positif
            </h4>
            <p className="text-gray-700">
              Pemesanan lab meningkat sebesar 25% pada semester ini dibandingkan semester sebelumnya.
            </p>
          </div>
          
          <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
            <h4 className="text-lg font-medium text-yellow-700 mb-2 flex items-center">
              <span className="mr-2">⚠️</span> Perhatian
            </h4>
            <p className="text-gray-700">
              Lab Komputer A memiliki tingkat penggunaan tertinggi (92%). Pertimbangkan penambahan jadwal maintenance.
            </p>
          </div>
          
          <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
            <h4 className="text-lg font-medium text-blue-700 mb-2 flex items-center">
              <span className="mr-2">🎯</span> Rekomendasi
            </h4>
            <p className="text-gray-700">
              Optimalkan penggunaan lab dengan kapasitas rendah seperti Lab Biologi yang hanya digunakan 45%.
            </p>
          </div>
          
          <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
            <h4 className="text-lg font-medium text-purple-700 mb-2 flex items-center">
              <span className="mr-2">📊</span> Efisiensi
            </h4>
            <p className="text-gray-700">
              Rata-rata waktu respon konfirmasi pemesanan adalah 1.2 hari. Target: kurang dari 1 hari.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportAnalytics;