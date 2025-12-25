
import React, { useState, useEffect } from 'react';
import {  FaUsers, FaInfoCircle } from 'react-icons/fa';
import Card from '../../components/common/Card';
import Button from '../../components/common/Button';
import Input from '../../components/common/Input';
import Modal from '../../components/common/Modal';
import api from '../../services/api';
import { toast } from 'react-hot-toast';
import { bookingAPI } from '../../services/api';

const BookingLabs = () => {
  const [labs, setLabs] = useState([]);
  const [selectedLab, setSelectedLab] = useState(null);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [loading, setLoading] = useState(false);

  const [bookingData, setBookingData] = useState({
    labId: '',
    teacherName: '',
    subject: '',
    activityTitle: '',
    description: '',
    bookingDate: '',
    day: '',
    startTime: '08:00',
    endTime: '10:00',
    classGroup: '',
    purpose: '',
    participants: [{ studentId: '', name: '' }],
  });

  useEffect(() => {
    fetchLabs();
  }, []);

  /* ================= FETCH LABS ================= */
  const fetchLabs = async () => {
    try {
      const res = await api.get('/labs');

      const data = Array.isArray(res.data.data) ? res.data.data : [];

      // Urutkan: available di atas
      const availableValues = ['available', 'tersedia'];
      const sorted = [...data].sort((a, b) => {
        if (availableValues.includes(a.status) && !availableValues.includes(b.status)) return -1;
        if (!availableValues.includes(a.status) && availableValues.includes(b.status)) return 1;
        return 0;
      });

      setLabs(sorted);
    } catch (err) {
      console.error(err);
      toast.error('Failed to load labs');
    }
  };

  /* ================= BOOKING HANDLER ================= */
  const handleBookClick = (lab) => {
    setSelectedLab(lab);
    setBookingData({
      ...bookingData,
      labId: lab._id,
      bookingDate: new Date().toISOString().split('T')[0],
      startTime: lab.openingTime || '08:00',
      endTime: lab.closingTime
        ? `${parseInt(lab.openingTime || '08') + 1}:00`
        : '09:00',
      participants: bookingData.participants || [{ studentId: '', name: '' }],
    });
    setShowBookingModal(true);
  };

  /* const handleAddParticipant = () => {
    setBookingData({
      ...bookingData,
      participants: [...(bookingData.participants || []), { studentId: '', name: '' }],
    });
  };

  const handleRemoveParticipant = (index) => {
    const updated = [...(bookingData.participants || [])];
    updated.splice(index, 1);
    setBookingData({ ...bookingData, participants: updated });
  };

  const handleParticipantChange = (index, field, value) => {
    const updated = [...(bookingData.participants || [])];
    updated[index] = { ...(updated[index] || {}), [field]: value };
    setBookingData({ ...bookingData, participants: updated });
  }; */

  const resetBookingData = () => {
    setBookingData({
      labId: '',
      bookingDate: '',
      startTime: '08:00',
      endTime: '09:00',
      purpose: '',
      participants: [{ studentId: '', name: '' }],
    });
  };

  const handleSubmitBooking = async () => {
    setLoading(true);
    try {
      const bookingPayload = {
        labId: bookingData.labId,
        teacherName: bookingData.teacherName,
        subject: bookingData.subject,
        activityTitle: bookingData.activityTitle,
        description: bookingData.description,
        classGroup: bookingData.classGroup,
        purpose: bookingData.purpose,
        bookingDate: bookingData.bookingDate,
        day: new Date(bookingData.bookingDate)
          .toLocaleDateString('id-ID', { weekday: 'long' }),
        startTime: bookingData.startTime,
        endTime: bookingData.endTime,
        participants: bookingData.participants || [],
      };

      // ✅ POST KE API
      await bookingAPI.create(bookingPayload);

      toast.success('Booking berhasil dikirim dan menunggu persetujuan admin');
      setShowBookingModal(false);
      resetBookingData();

    } catch (err) {
      toast.error(err.response?.data?.message || 'Booking failed');
    } finally {
      setLoading(false);
    }
  };

  /* ================= UI HELPERS ================= */
  const getStatusBadge = (status) => {
    const colors = {
      available: 'bg-green-100 text-green-800',
      occupied: 'bg-red-100 text-red-800',
      maintenance: 'bg-yellow-100 text-yellow-800',
    };

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${colors[status]}`}>
        {status}
      </span>
    );
  };

  /* ================= RENDER ================= */
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Book Laboratory</h1>
        <p className="text-gray-600">Select an available laboratory to book</p>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labs.map((lab) => (
          <Card key={lab._id} className="p-6">
            <div className="flex justify-between items-start mb-3">
              <div>
                <h3 className="text-lg font-semibold">{lab.name}</h3>
                <p className="text-sm text-gray-500">{lab.location}</p>
                <p className="text-xs text-gray-400">
                  {lab.openingTime} - {lab.closingTime}
                </p>
              </div>
              {getStatusBadge(lab.status)}
            </div>

            <div className="space-y-2 mb-5">
              <div className="flex items-center text-sm text-gray-600">
                <FaUsers className="mr-2" />
                Capacity: {lab.capacity} students
              </div>
              <div className="flex items-center text-sm text-gray-600">
                <FaInfoCircle className="mr-2" />
                {lab.facilities?.join(', ')}
              </div>
            </div>

            <Button
              fullWidth
              disabled={lab.status !== 'available'}
              variant={lab.status === 'available' ? 'primary' : 'secondary'}
              onClick={() => handleBookClick(lab)}
            >
              {lab.status === 'available'
                ? 'Book Now'
                : lab.status === 'maintenance'
                  ? 'Under Maintenance'
                  : 'Unavailable'}
            </Button>
          </Card>
        ))}
      </div>

      {/* Booking Modal */}
      <Modal
        isOpen={showBookingModal}
        onClose={() => {
          setShowBookingModal(false);
          resetBookingData();
        }}
        title={`Book ${selectedLab?.name}`}
        size="lg"
      >
        <div className="space-y-4">
          {selectedLab && (
            <div className="bg-gray-50 p-4 rounded">
              <p className="font-medium">
                {selectedLab.name} • {selectedLab.location}
              </p>
              <p className="text-sm text-gray-600">
                Capacity: {selectedLab.capacity} students
              </p>
            </div>
          )}

          <Input
            label="Nama Dosen"
            value={bookingData.teacherName}
            onChange={(e) =>
              setBookingData({ ...bookingData, teacherName: e.target.value })
            }
          />

          <Input
            label="Mata Kuliah"
            value={bookingData.subject}
            onChange={(e) =>
              setBookingData({ ...bookingData, subject: e.target.value })
            }
          />

          <Input
            label="Judul Kegiatan"
            value={bookingData.activityTitle}
            onChange={(e) =>
              setBookingData({ ...bookingData, activityTitle: e.target.value })
            }
          />

          <textarea
            className="w-full border rounded-lg p-3"
            placeholder="Deskripsi kegiatan"
            value={bookingData.description}
            onChange={(e) =>
              setBookingData({ ...bookingData, description: e.target.value })
            }
          />
          <Input
            label="Kelas Praktikum"
            placeholder="Contoh: TI-3A (30 mahasiswa)"
            value={bookingData.classGroup}
            onChange={(e) =>
              setBookingData({ ...bookingData, classGroup: e.target.value })
            }
          />
          
          <div className="flex justify-end gap-3 pt-4">
            <Button variant="secondary" onClick={() => setShowBookingModal(false)}>
              Cancel
            </Button>
            <Button loading={loading} onClick={handleSubmitBooking}>
              Submit Booking
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default BookingLabs;
