import React, { useState, useEffect } from 'react';
import { FaUsers, FaInfoCircle } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../../services/api';

const BookingLabs = () => {
  // ================= STATE =================
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formErrors, setFormErrors] = useState({});
  const [formData, setFormData] = useState({
    bookingDate: '',
    startTime: '',
    endTime: '',
    teacherName: '',
    subject: '',
    activityTitle: '',
    description: '',
    classGroup: '',
    labId: '',
  });

  // ================= EFFECTS =================
  useEffect(() => {
    fetchLabs();
  }, []);

  // Debug hanya di development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && showBookingModal) {
      console.log('[DEBUG] Modal state:', { selectedLab, formData });
    }
  }, [showBookingModal, selectedLab, formData]);

  // ================= API FUNCTIONS =================
  const fetchLabs = async () => {
    try {
      const response = await api.get('/labs');
      const labsData = Array.isArray(response.data.data) ? response.data.data : [];
      
      // Sort: available first
      const sortedLabs = [...labsData].sort((a, b) => {
        if (a.status === 'available' && b.status !== 'available') return -1;
        if (a.status !== 'available' && b.status === 'available') return 1;
        return 0;
      });

      setLabs(sortedLabs);
    } catch (error) {
      console.error('Fetch labs error:', error);
      toast.error('Gagal memuat data laboratorium');
    }
  };

  // ================= HANDLERS =================
  const handleBookClick = (lab) => {
    const today = new Date().toISOString().split('T')[0];
    
    setSelectedLab(lab);
    setFormData({
      teacherName: '',
      subject: '',
      activityTitle: '',
      description: '',
      bookingDate: today,
      startTime: lab.openingTime || '08:00',
      endTime: lab.closingTime || '10:00',
      classGroup: '',
      labId: lab._id || lab.id
    });
    setFormErrors({});
    setShowBookingModal(true);
  };

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (formErrors[field]) {
      setFormErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  // ================= VALIDATION =================
  const validateForm = () => {
    const errors = {};
    const labId = formData.labId || selectedLab?._id || selectedLab?.id;

    if (!labId) errors.lab = 'Lab belum dipilih';
    if (!formData.bookingDate) errors.bookingDate = 'Tanggal wajib diisi';
    if (!formData.startTime) errors.startTime = 'Jam mulai wajib diisi';
    if (!formData.endTime) errors.endTime = 'Jam selesai wajib diisi';
    if (!formData.classGroup?.trim()) errors.classGroup = 'Kelas praktikum wajib diisi';
    if (!formData.teacherName?.trim()) errors.teacherName = 'Nama pengajar wajib diisi';
    if (!formData.subject?.trim()) errors.subject = 'Mata pelajaran wajib diisi';
    if (!formData.activityTitle?.trim()) errors.activityTitle = 'Judul kegiatan wajib diisi';

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ================= SUBMIT BOOKING =================
  const handleSubmitBooking = async () => {
    if (!validateForm()) {
      toast.error('Lengkapi data yang wajib diisi');
      return;
    }

    setLoading(true);

    try {
      const currentUser = JSON.parse(localStorage.getItem('user'));
      const userId = currentUser?._id || currentUser?.id;
      
      if (!userId) {
        toast.error('User tidak ditemukan. Silakan login ulang.');
        return;
      }

      const labId = formData.labId || selectedLab?._id || selectedLab?.id;
      if (!labId) {
        toast.error('Laboratorium tidak valid.');
        return;
      }

      // Calculate day from date
      const bookingDateObj = new Date(formData.bookingDate);
      const dayNames = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
      const dayName = dayNames[bookingDateObj.getDay()];

      const payload = {
        lab: labId,
        user: userId,
        teacherName: formData.teacherName.trim(),
        subject: formData.subject.trim(),
        activityTitle: formData.activityTitle.trim(),
        description: formData.description?.trim() || '',
        classGroup: formData.classGroup.trim(),
        bookingDate: formData.bookingDate,
        startTime: formData.startTime,
        endTime: formData.endTime,
        status: 'pending',
        day: dayName
      };

      if (process.env.NODE_ENV === 'development') {
        console.log('[DEBUG] Booking payload:', payload);
      }

      await bookingAPI.createBooking(payload);

      toast.success('Booking berhasil diajukan!');
      setShowBookingModal(false);
      handleCloseModal();
      fetchLabs();

    } catch (error) {
      console.error('Booking error:', error);
      const errorMsg = error.response?.data?.message || 'Gagal membuat booking';
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleCloseModal = () => {
    setShowBookingModal(false);
    setSelectedLab(null);
    setFormData({
      teacherName: '',
      subject: '',
      activityTitle: '',
      description: '',
      bookingDate: '',
      startTime: '08:00',
      endTime: '10:00',
      classGroup: '',
      labId: '',
    });
    setFormErrors({});
  };

  // ================= UI HELPERS =================
  const getStatusBadge = (status) => {
    const config = {
      available: { bg: 'bg-green-100', text: 'text-green-800', label: 'Tersedia' },
      occupied: { bg: 'bg-red-100', text: 'text-red-800', label: 'Terisi' },
      maintenance: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Perawatan' }
    };
    const style = config[status] || config.available;
    return (
      <span className={`px-3 py-1 rounded-full text-xs font-medium ${style.bg} ${style.text}`}>
        {style.label}
      </span>
    );
  };

  const formatTimeRange = (openingTime, closingTime) => {
    if (!openingTime || !closingTime) return '08:00 - 17:00';
    return `${openingTime} - ${closingTime}`;
  };

  // ================= RENDER =================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold text-gray-900">Booking Laboratorium</h1>
        <p className="text-gray-600 mt-1">
          Pilih laboratorium yang tersedia untuk melakukan booking
        </p>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.length === 0 ? (
          <div className="col-span-full text-center py-10">
            <p className="text-gray-500">Tidak ada laboratorium tersedia</p>
          </div>
        ) : (
          labs.map((lab) => (
            <Card key={lab._id} className="p-6 hover:shadow-md transition-shadow duration-200">
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900">{lab.name}</h3>
                  <p className="text-sm text-gray-600 mt-1">{lab.location}</p>
                  <p className="text-xs text-gray-500 mt-1">
                    ⏰ {formatTimeRange(lab.openingTime, lab.closingTime)}
                  </p>
                </div>
                <div className="ml-2">{getStatusBadge(lab.status)}</div>
              </div>

              <div className="space-y-3 mb-6">
                <div className="flex items-center text-sm text-gray-700">
                  <FaUsers className="mr-2 text-gray-500" />
                  <span>Kapasitas: <strong>{lab.capacity}</strong> siswa</span>
                </div>
                {lab.facilities && lab.facilities.length > 0 && (
                  <div className="flex items-start text-sm text-gray-700">
                    <FaInfoCircle className="mr-2 text-gray-500 mt-0.5" />
                    <div>
                      <span className="font-medium">Fasilitas:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {lab.facilities.map((facility, index) => (
                          <span
                            key={`${lab._id}-facility-${index}`}
                            className="px-2 py-1 bg-blue-50 text-blue-700 text-xs rounded"
                          >
                            {facility}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <Button
                fullWidth
                disabled={lab.status !== 'available'}
                variant={lab.status === 'available' ? 'primary' : 'secondary'}
                onClick={() => handleBookClick(lab)}
              >
                {lab.status === 'available' ? 'Booking Sekarang' :
                 lab.status === 'maintenance' ? 'Dalam Perawatan' : 'Tidak Tersedia'}
              </Button>
            </Card>
          ))
        )}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={handleCloseModal}
        title={
          <div>
            <span>Booking Laboratorium</span>
            {selectedLab && (
              <span className="text-sm font-normal text-gray-600 block mt-1">
                {selectedLab.name} • {selectedLab.location}
              </span>
            )}
          </div>
        }
        size="lg"
      >
        <div className="space-y-6">
          {/* Lab Info */}
          {selectedLab && (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h4 className="font-medium text-blue-900">{selectedLab.name}</h4>
              <div className="grid grid-cols-2 gap-2 mt-2 text-sm">
                <div><span className="text-blue-700">Lokasi:</span> {selectedLab.location}</div>
                <div><span className="text-blue-700">Kapasitas:</span> {selectedLab.capacity} siswa</div>
                <div><span className="text-blue-700">Jam Operasi:</span> {formatTimeRange(selectedLab.openingTime, selectedLab.closingTime)}</div>
                <div><span className="text-blue-700">Status:</span> {selectedLab.status}</div>
              </div>
            </div>
          )}

          {/* Form */}
          <div className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Nama Pengajar *"
                value={formData.teacherName}
                onChange={(e) => handleFormChange('teacherName', e.target.value)}
                error={formErrors.teacherName}
                required
              />
              <Input
                label="Mata Pelajaran *"
                value={formData.subject}
                onChange={(e) => handleFormChange('subject', e.target.value)}
                error={formErrors.subject}
                required
              />
            </div>

            <Input
              label="Judul Kegiatan *"
              value={formData.activityTitle}
              onChange={(e) => handleFormChange('activityTitle', e.target.value)}
              error={formErrors.activityTitle}
              required
            />

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Deskripsi Kegiatan
              </label>
              <textarea
                className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                value={formData.description}
                onChange={(e) => handleFormChange('description', e.target.value)}
                rows={3}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tanggal Booking *
                </label>
                <input
                  type="date"
                  value={formData.bookingDate}
                  onChange={(e) => handleFormChange('bookingDate', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.bookingDate ? 'border-red-500' : 'border-gray-300'}`}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
                {formErrors.bookingDate && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.bookingDate}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Mulai *
                </label>
                <input
                  type="time"
                  value={formData.startTime}
                  onChange={(e) => handleFormChange('startTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.startTime ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.startTime && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.startTime}</p>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Waktu Selesai *
                </label>
                <input
                  type="time"
                  value={formData.endTime}
                  onChange={(e) => handleFormChange('endTime', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg ${formErrors.endTime ? 'border-red-500' : 'border-gray-300'}`}
                  required
                />
                {formErrors.endTime && (
                  <p className="text-red-500 text-xs mt-1">{formErrors.endTime}</p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Input
                label="Kelas Praktikum *"
                value={formData.classGroup}
                onChange={(e) => handleFormChange('classGroup', e.target.value)}
                error={formErrors.classGroup}
                required
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-6 border-t">
              <Button
                variant="secondary"
                onClick={handleCloseModal}
                disabled={loading}
              >
                Batal
              </Button>
              <Button
                onClick={handleSubmitBooking}
                loading={loading}
                disabled={loading}
              >
                {loading ? 'Membuat Booking...' : 'Buat Booking'}
              </Button>
            </div>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingLabs;