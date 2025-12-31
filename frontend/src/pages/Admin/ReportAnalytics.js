import React, { useState, useEffect } from 'react';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import { bookingAPI, labAPI } from '../../services/api';

const ReportAnalytics = () => {
  // ================= STATE =================
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [reportType, setReportType] = useState('bulanan');
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setMonth(new Date().getMonth() - 5)).toISOString().split('T')[0], // 6 bulan terakhir
    end: new Date().toISOString().split('T')[0]
  });
  
  // Data states
  const [summaryStats, setSummaryStats] = useState({
    totalLabs: 0,
    totalBookings: 0,
    confirmedBookings: 0,
    pendingBookings: 0,
    rejectedBookings: 0,
    avgUsageRate: 0,
  });
  
  const [labUsageData, setLabUsageData] = useState([]);
  const [bookingTrendData, setBookingTrendData] = useState([]);
  const [statusDistribution, setStatusDistribution] = useState([]);
  const [mostActiveLabs, setMostActiveLabs] = useState([]);
  const [insights, setInsights] = useState([]);

  // ================= FETCH DATA =================
  useEffect(() => {
    const fetchReportData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        console.log('📊 Fetching report data...');
        
        // Fetch labs data
        const labsResponse = await labAPI.getAll();
        const labsData = Array.isArray(labsResponse.data) 
          ? labsResponse.data 
          : (labsResponse.data?.data || []);
        
        // Fetch bookings data
        const bookingsResponse = await bookingAPI.getAll();
        let bookingsData = [];
        
        if (Array.isArray(bookingsResponse.data)) {
          bookingsData = bookingsResponse.data;
        } else if (bookingsResponse.data?.data && Array.isArray(bookingsResponse.data.data)) {
          bookingsData = bookingsResponse.data.data;
        }
        
        // Process data for reports
        processReportData(labsData, bookingsData);
        
        console.log('✅ Report data loaded successfully');
        
      } catch (err) {
        console.error('❌ Error fetching report data:', err);
        setError('Gagal memuat data laporan. Silakan coba lagi.');
      } finally {
        setLoading(false);
      }
    };

    fetchReportData();
  }, []);

  // ================= DATA PROCESSING =================
  const processReportData = (labs, bookings) => {
    // 1. Calculate summary stats
    const totalLabs = labs.length;
    const totalBookings = bookings.length;
    const confirmedBookings = bookings.filter(b => b.status === 'approved').length;
    const pendingBookings = bookings.filter(b => b.status === 'pending').length;
    const rejectedBookings = bookings.filter(b => b.status === 'rejected').length;
    
    setSummaryStats({
      totalLabs,
      totalBookings,
      confirmedBookings,
      pendingBookings,
      rejectedBookings,
      avgUsageRate: totalBookings > 0 ? Math.round((confirmedBookings / totalBookings) * 100) : 0,
    });

    // 2. Lab usage data
    const labUsage = labs.map(lab => {
      const labBookings = bookings.filter(b => b.lab === lab._id || b.lab === lab.id);
      const confirmed = labBookings.filter(b => b.status === 'approved').length;
      
      return {
        name: lab.name,
        digunakan: confirmed,
        tersedia: Math.max(0, 20 - confirmed),
        maintenance: lab.status === 'maintenance' ? 1 : 0
      };
    });
    setLabUsageData(labUsage);

    // 3. Booking trend
    const last6Months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - (5 - i));
      return {
        month: date.toLocaleDateString('id-ID', { month: 'short' }),
        monthFull: date.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' }),
        pemesanan: 0,
        dikonfirmasi: 0,
        ditolak: 0
      };
    });

    bookings.forEach(booking => {
      if (booking.bookingDate) {
        const bookingDate = new Date(booking.bookingDate);
        const monthIndex = last6Months.findIndex(m => 
          m.month === bookingDate.toLocaleDateString('id-ID', { month: 'short' })
        );
        
        if (monthIndex !== -1) {
          last6Months[monthIndex].pemesanan++;
          if (booking.status === 'approved') last6Months[monthIndex].dikonfirmasi++;
          if (booking.status === 'rejected') last6Months[monthIndex].ditolak++;
        }
      }
    });
    
    setBookingTrendData(last6Months);

    // 4. Status distribution
    const statusData = [
      { name: 'Disetujui', value: confirmedBookings, color: '#10B981' },
      { name: 'Menunggu', value: pendingBookings, color: '#F59E0B' },
      { name: 'Ditolak', value: rejectedBookings, color: '#EF4444' }
    ].filter(item => item.value > 0);
    
    setStatusDistribution(statusData);

    // 5. Most active labs
    const labActivity = labs.map(lab => {
      const labBookings = bookings.filter(b => b.lab === lab._id || b.lab === lab.id);
      const confirmed = labBookings.filter(b => b.status === 'approved').length;
      
      return {
        name: lab.name,
        penggunaan: confirmed,
        persentase: totalBookings > 0 ? Math.round((confirmed / totalBookings) * 100) : 0
      };
    }).sort((a, b) => b.penggunaan - a.penggunaan).slice(0, 5);
    
    setMostActiveLabs(labActivity);

    // 6. Generate insights
    const newInsights = [];
    
    // Positive trend insight
    if (confirmedBookings > 0) {
      newInsights.push({
        type: 'positive',
        title: '📈 Trend Positif',
        message: `Terdapat ${confirmedBookings} booking yang telah disetujui (${Math.round((confirmedBookings / totalBookings) * 100)}% dari total).`
      });
    }
    
    // High usage labs insight
    const highUsageLabs = labActivity.filter(lab => lab.persentase > 20);
    if (highUsageLabs.length > 0) {
      newInsights.push({
        type: 'warning',
        title: '⚠️ Lab Padat',
        message: `${highUsageLabs[0].name} memiliki tingkat penggunaan tertinggi (${highUsageLabs[0].persentase}%).`
      });
    }
    
    // Pending bookings insight
    if (pendingBookings > 0) {
      newInsights.push({
        type: 'info',
        title: '⏳ Menunggu Persetujuan',
        message: `Ada ${pendingBookings} booking yang masih menunggu persetujuan.`
      });
    }
    
    // Efficiency insight
    if (totalBookings > 0) {
      const approvalRate = Math.round((confirmedBookings / totalBookings) * 100);
      newInsights.push({
        type: 'efficiency',
        title: '🎯 Efisiensi Sistem',
        message: `Tingkat persetujuan booking: ${approvalRate}% dari total permintaan.`
      });
    }
    
    setInsights(newInsights);
  };

  // ================= HANDLERS =================
  const handleDateChange = (e) => {
    const { name, value } = e.target;
    setDateRange({
      ...dateRange,
      [name]: value
    });
  };

  const generateReport = () => {
    toast.success(`Laporan untuk periode ${dateRange.start} hingga ${dateRange.end} sedang diproses`);
    // In real implementation, this would call API to generate report
  };

  const exportReport = (format) => {
    toast.success(`Laporan akan diekspor dalam format ${format.toUpperCase()}`);
    // In real implementation, this would export the report
  };

  const formatNumber = (num) => {
    return num.toLocaleString('id-ID');
  };

  const getInsightColor = (type) => {
    const colors = {
      positive: 'bg-green-50 border-green-200',
      warning: 'bg-yellow-50 border-yellow-200',
      info: 'bg-blue-50 border-blue-200',
      efficiency: 'bg-purple-50 border-purple-200',
    };
    return colors[type] || 'bg-gray-50 border-gray-200';
  };

  const getInsightIcon = (type) => {
    const icons = {
      positive: '📈',
      warning: '⚠️',
      info: 'ℹ️',
      efficiency: '🎯',
    };
    return icons[type] || '📊';
  };

  // ================= RENDER LOADING =================
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Laporan & Analitik</h1>
          <p className="text-gray-600 mt-1">Memuat data laporan...</p>
        </div>
        <div className="flex flex-col justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mb-4"></div>
          <p className="text-gray-600">Memproses data laporan...</p>
        </div>
      </div>
    );
  }

  // ================= RENDER ERROR =================
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-4 md:p-6">
        <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
          <h1 className="text-2xl font-bold text-gray-800">Laporan & Analitik</h1>
          <p className="text-gray-600 mt-1">Terjadi kesalahan</p>
        </div>
        <div className="max-w-2xl mx-auto">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6">
            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-red-800 mb-2">Gagal Memuat Data</h3>
              <p className="text-red-700 mb-6">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="px-6 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                Muat Ulang
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ================= RENDER =================
  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
        <div className="flex flex-col md:flex-row md:items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Laporan & Analitik</h1>
            <p className="text-gray-600 mt-1">
              Analisis data pemakaian laboratorium
            </p>
          </div>
        </div>

        {/* Date Range Controls */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Dari Tanggal
            </label>
            <input
              type="date"
              name="start"
              value={dateRange.start}
              onChange={handleDateChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Sampai Tanggal
            </label>
            <input
              type="date"
              name="end"
              value={dateRange.end}
              onChange={handleDateChange}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipe Laporan
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="bulanan">Bulanan</option>
              <option value="mingguan">Mingguan</option>
              <option value="harian">Harian</option>
            </select>
          </div>
          
          <div className="flex items-end">
            <Button
              onClick={generateReport}
              className="w-full"
            >
              Buat Laporan
            </Button>
          </div>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        <Card className="bg-blue-50 border-blue-100">
          <div className="p-4">
            <p className="text-sm text-blue-600 font-medium">Total Lab</p>
            <p className="text-2xl font-bold text-blue-700 mt-1">{summaryStats.totalLabs}</p>
          </div>
        </Card>
        
        <Card className="bg-green-50 border-green-100">
          <div className="p-4">
            <p className="text-sm text-green-600 font-medium">Total Booking</p>
            <p className="text-2xl font-bold text-green-700 mt-1">{formatNumber(summaryStats.totalBookings)}</p>
          </div>
        </Card>
        
        <Card className="bg-yellow-50 border-yellow-100">
          <div className="p-4">
            <p className="text-sm text-yellow-600 font-medium">Menunggu</p>
            <p className="text-2xl font-bold text-yellow-700 mt-1">{formatNumber(summaryStats.pendingBookings)}</p>
          </div>
        </Card>
        
        <Card className="bg-red-50 border-red-100">
          <div className="p-4">
            <p className="text-sm text-red-600 font-medium">Ditolak</p>
            <p className="text-2xl font-bold text-red-700 mt-1">{formatNumber(summaryStats.rejectedBookings)}</p>
          </div>
        </Card>
        
        <Card className="bg-purple-50 border-purple-100">
          <div className="p-4">
            <p className="text-sm text-purple-600 font-medium">Disetujui</p>
            <p className="text-2xl font-bold text-purple-700 mt-1">{formatNumber(summaryStats.confirmedBookings)}</p>
          </div>
        </Card>
      </div>

      {/* Export Buttons */}
      <div className="flex flex-wrap gap-2 mb-6">
        <Button
          variant="outline"
          onClick={() => exportReport('pdf')}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
          Export PDF
        </Button>
        <Button
          variant="outline"
          onClick={() => exportReport('excel')}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          Export Excel
        </Button>
        <Button
          variant="outline"
          onClick={() => exportReport('csv')}
          className="flex items-center gap-2"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
          Export CSV
        </Button>
      </div>

      {/* Status Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <Card>
          <div className="p-5">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Distribusi Status Booking</h3>
            <div className="space-y-3">
              {statusDistribution.map((status, index) => (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: status.color }}
                    ></div>
                    <span className="text-sm text-gray-700">{status.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-gray-900">{formatNumber(status.value)}</span>
                    <span className="text-xs text-gray-500">
                      ({summaryStats.totalBookings > 0 
                        ? Math.round((status.value / summaryStats.totalBookings) * 100) 
                        : 0}%)
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card>

        <Card>
          <div className="p-5">
            <h3 className="font-bold text-lg text-gray-800 mb-4">Statistik Kinerja</h3>
            <div className="space-y-4">
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Tingkat Persetujuan</span>
                  <span className="text-sm font-medium text-gray-900">{summaryStats.avgUsageRate}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-green-500 h-2 rounded-full" 
                    style={{ width: `${summaryStats.avgUsageRate}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Booking Menunggu</span>
                  <span className="text-sm font-medium text-gray-900">
                    {formatNumber(summaryStats.pendingBookings)}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-yellow-500 h-2 rounded-full" 
                    style={{ width: `${(summaryStats.pendingBookings / Math.max(summaryStats.totalBookings, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
              
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-sm text-gray-600">Lab Terpakai</span>
                  <span className="text-sm font-medium text-gray-900">
                    {labUsageData.filter(lab => lab.digunakan > 0).length} / {summaryStats.totalLabs}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full" 
                    style={{ width: `${(labUsageData.filter(lab => lab.digunakan > 0).length / Math.max(summaryStats.totalLabs, 1)) * 100}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>

      {/* Most Active Labs */}
      <Card className="mb-6">
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Lab Paling Aktif</h3>
          <div className="space-y-3">
            {mostActiveLabs.map((lab, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                    <span className="text-blue-600 font-medium">{lab.name.charAt(0)}</span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{lab.name}</p>
                    <p className="text-xs text-gray-500">{lab.penggunaan} kali digunakan</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-bold text-gray-900">{lab.persentase}%</p>
                  <p className="text-xs text-gray-500">dari total booking</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* Booking Trend */}
      <Card className="mb-6">
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Trend Booking 6 Bulan Terakhir</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr className="bg-gray-50">
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Bulan</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Disetujui</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ditolak</th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Persentase</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {bookingTrendData.map((data, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{data.monthFull}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{data.pemesanan}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-green-600 font-medium">{data.dikonfirmasi}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-red-600">{data.ditolak}</div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap">
                      <div className="text-sm text-gray-900">
                        {data.pemesanan > 0 
                          ? `${Math.round((data.dikonfirmasi / data.pemesanan) * 100)}%`
                          : '0%'
                        }
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Card>

      {/* Insights */}
      <div className="mb-6">
        <h3 className="text-lg font-bold text-gray-800 mb-4">Wawasan & Rekomendasi</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {insights.map((insight, index) => (
            <Card key={index} className={getInsightColor(insight.type)}>
              <div className="p-4">
                <div className="flex items-start gap-3">
                  <span className="text-xl">{getInsightIcon(insight.type)}</span>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-1">{insight.title}</h4>
                    <p className="text-sm text-gray-700">{insight.message}</p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>
      </div>

      {/* Summary */}
      <Card>
        <div className="p-5">
          <h3 className="font-bold text-lg text-gray-800 mb-4">Ringkasan Analisis</h3>
          <div className="space-y-3">
            <p className="text-gray-700">
              Berdasarkan data dari {summaryStats.totalBookings} booking dan {summaryStats.totalLabs} laboratorium:
            </p>
            <ul className="list-disc pl-5 space-y-2 text-gray-700">
              <li>Tingkat persetujuan booking mencapai <span className="font-semibold">{summaryStats.avgUsageRate}%</span></li>
              <li>Rata-rata <span className="font-semibold">{Math.round(summaryStats.totalBookings / Math.max(labUsageData.length, 1))}</span> booking per lab</li>
              <li>Masih ada <span className="font-semibold">{summaryStats.pendingBookings}</span> booking yang menunggu persetujuan</li>
              {mostActiveLabs.length > 0 && (
                <li>Lab paling aktif: <span className="font-semibold">{mostActiveLabs[0].name}</span> ({mostActiveLabs[0].penggunaan} penggunaan)</li>
              )}
            </ul>
          </div>
        </div>
      </Card>
    </div>
  );
};

// Helper function for toast notifications
const toast = {
  success: (message) => {
    // In real implementation, use react-hot-toast or similar
    alert(`✅ ${message}`);
  },
  error: (message) => {
    alert(`❌ ${message}`);
  }
};

export default ReportAnalytics;