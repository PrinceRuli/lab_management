import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

const BookingModal = ({ isOpen, onClose, laboratory, onBookingSuccess }) => {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    startTime: '09:00',
    endTime: '10:00',
    participants: 1,
    equipment: []
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Reset form when modal opens/closes or lab changes
  useEffect(() => {
    if (isOpen && laboratory) {
      setFormData({
        title: '',
        description: '',
        date: new Date().toISOString().split('T')[0],
        startTime: '09:00',
        endTime: '10:00',
        participants: 1,
        equipment: []
      });
      setError('');
    }
  }, [isOpen, laboratory]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleEquipmentToggle = (equipmentName) => {
    setFormData(prev => ({
      ...prev,
      equipment: prev.equipment.includes(equipmentName)
        ? prev.equipment.filter(item => item !== equipmentName)
        : [...prev.equipment, equipmentName]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      // Validate form
      if (!formData.title.trim()) {
        throw new Error('Booking title is required');
      }

      if (!formData.date) {
        throw new Error('Date is required');
      }

      if (formData.startTime >= formData.endTime) {
        throw new Error('End time must be after start time');
      }

      if (formData.participants > laboratory.capacity) {
        throw new Error(`Participants cannot exceed laboratory capacity (${laboratory.capacity})`);
      }

      // Simulate API call - replace with actual API
      const bookingData = {
        laboratoryId: laboratory._id,
        laboratoryName: laboratory.name,
        title: formData.title,
        description: formData.description,
        date: formData.date,
        startTime: formData.startTime,
        endTime: formData.endTime,
        participants: formData.participants,
        equipment: formData.equipment,
        bookedBy: user.id,
        status: 'pending'
      };

      console.log('Booking data:', bookingData);

      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // Call success callback
      if (onBookingSuccess) {
        onBookingSuccess(bookingData);
      }

      // Close modal
      onClose();

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const generateTimeOptions = () => {
    const options = [];
    for (let hour = 8; hour <= 20; hour++) {
      for (let minute = 0; minute < 60; minute += 30) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        options.push(timeString);
      }
    }
    return options;
  };

  const timeOptions = generateTimeOptions();

  if (!isOpen || !laboratory) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75" 
          onClick={onClose}
        ></div>

        {/* Modal panel */}
        <div className="relative inline-block w-full max-w-2xl px-4 pt-5 pb-4 overflow-hidden text-left align-bottom transition-all transform bg-white rounded-lg shadow-xl sm:my-8 sm:align-middle sm:p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-2xl font-bold text-gray-900">
                Book Laboratory
              </h3>
              <p className="text-lg text-cyan-600 font-semibold mt-1">
                {laboratory.name} ({laboratory.code})
              </p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <span className="text-2xl">×</span>
            </button>
          </div>

          {/* Laboratory Info */}
          <div className="mb-6 p-4 bg-cyan-50 rounded-lg">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium text-gray-700">Location:</span>
                <p className="text-gray-600">{laboratory.location}</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Capacity:</span>
                <p className="text-gray-600">{laboratory.capacity} people</p>
              </div>
              <div>
                <span className="font-medium text-gray-700">Status:</span>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  laboratory.status === 'available' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-amber-100 text-amber-800'
                }`}>
                  {laboratory.status}
                </span>
              </div>
              <div>
                <span className="font-medium text-gray-700">Facilities:</span>
                <p className="text-gray-600">{laboratory.facilities?.join(', ') || 'None'}</p>
              </div>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-600 rounded-lg text-sm">
              {error}
            </div>
          )}

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Title */}
              <div className="md:col-span-2">
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Booking Title *
                </label>
                <input
                  type="text"
                  id="title"
                  name="title"
                  required
                  value={formData.title}
                  onChange={handleChange}
                  placeholder="e.g., Programming Class, Research Meeting"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Description */}
              <div className="md:col-span-2">
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  placeholder="Brief description of your booking purpose..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Date */}
              <div>
                <label htmlFor="date" className="block text-sm font-medium text-gray-700 mb-2">
                  Date *
                </label>
                <input
                  type="date"
                  id="date"
                  name="date"
                  required
                  value={formData.date}
                  onChange={handleChange}
                  min={new Date().toISOString().split('T')[0]}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
              </div>

              {/* Participants */}
              <div>
                <label htmlFor="participants" className="block text-sm font-medium text-gray-700 mb-2">
                  Number of Participants *
                </label>
                <input
                  type="number"
                  id="participants"
                  name="participants"
                  required
                  min="1"
                  max={laboratory.capacity}
                  value={formData.participants}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Max: {laboratory.capacity} participants
                </p>
              </div>

              {/* Start Time */}
              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time *
                </label>
                <select
                  id="startTime"
                  name="startTime"
                  required
                  value={formData.startTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* End Time */}
              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time *
                </label>
                <select
                  id="endTime"
                  name="endTime"
                  required
                  value={formData.endTime}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-cyan-500"
                >
                  {timeOptions.map(time => (
                    <option key={time} value={time}>{time}</option>
                  ))}
                </select>
              </div>

              {/* Equipment Selection */}
              {laboratory.equipment && laboratory.equipment.length > 0 && (
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Additional Equipment Needed
                  </label>
                  <div className="grid grid-cols-2 gap-2">
                    {laboratory.equipment.map((item, index) => (
                      <label key={index} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={formData.equipment.includes(item.name)}
                          onChange={() => handleEquipmentToggle(item.name)}
                          className="rounded border-gray-300 text-cyan-600 focus:ring-cyan-500"
                        />
                        <span className="text-sm text-gray-700">
                          {item.name} ({item.quantity} available)
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors duration-200"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-cyan-600 text-white rounded-lg hover:bg-cyan-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    Booking...
                  </>
                ) : (
                  'Confirm Booking'
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default BookingModal;