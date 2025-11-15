import React, { useState } from 'react';

const BookingForm = ({ isOpen, onClose, onBookingSubmit }) => {
  const [formData, setFormData] = useState({
    lab: '',
    date: '',
    startTime: '',
    endTime: '',
    subject: '',
    class: '',
    participants: '',
    equipment: '',
    notes: ''
  });

  const labs = [
    { id: 'computer-lab-1', name: 'Computer Lab 1', capacity: 30 },
    { id: 'computer-lab-2', name: 'Computer Lab 2', capacity: 30 },
    { id: 'multimedia-lab', name: 'Multimedia Lab', capacity: 20 },
    { id: 'physics-lab', name: 'Physics Lab', capacity: 25 },
    { id: 'chemistry-lab', name: 'Chemistry Lab', capacity: 25 },
    { id: 'biology-lab', name: 'Biology Lab', capacity: 20 }
  ];

  const subjects = [
    'Mathematics',
    'Physics',
    'Chemistry',
    'Biology',
    'Computer Science',
    'Programming',
    'Database',
    'Network',
    'Multimedia',
    'Research'
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Simpan data booking
    onBookingSubmit(formData);
    // Reset form
    setFormData({
      lab: '',
      date: '',
      startTime: '',
      endTime: '',
      subject: '',
      class: '',
      participants: '',
      equipment: '',
      notes: ''
    });
    // Tutup modal
    onClose();
  };

  const handleCancel = () => {
    setFormData({
      lab: '',
      date: '',
      startTime: '',
      endTime: '',
      subject: '',
      class: '',
      participants: '',
      equipment: '',
      notes: ''
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-t-2xl p-6 text-white">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold">New Laboratory Booking</h2>
              <p className="text-cyan-100 mt-1">Book a laboratory for your teaching session</p>
            </div>
            <button
              onClick={onClose}
              className="text-cyan-100 hover:text-white transition-colors duration-200"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Lab Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Laboratory *
            </label>
            <select
              name="lab"
              value={formData.lab}
              onChange={handleChange}
              required
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
            >
              <option value="">Choose a laboratory</option>
              {labs.map(lab => (
                <option key={lab.id} value={lab.id}>
                  {lab.name} (Capacity: {lab.capacity} students)
                </option>
              ))}
            </select>
          </div>

          {/* Date and Time */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Date *
              </label>
              <input
                type="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                min={new Date().toISOString().split('T')[0]}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Start Time *
              </label>
              <input
                type="time"
                name="startTime"
                value={formData.startTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                End Time *
              </label>
              <input
                type="time"
                name="endTime"
                value={formData.endTime}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Subject and Class */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Subject *
              </label>
              <select
                name="subject"
                value={formData.subject}
                onChange={handleChange}
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              >
                <option value="">Select subject</option>
                {subjects.map(subject => (
                  <option key={subject} value={subject}>{subject}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Class/Group *
              </label>
              <input
                type="text"
                name="class"
                value={formData.class}
                onChange={handleChange}
                placeholder="e.g., Grade 10-A, CS-101"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Participants and Equipment */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Participants *
              </label>
              <input
                type="number"
                name="participants"
                value={formData.participants}
                onChange={handleChange}
                min="1"
                max="50"
                required
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Special Equipment Needed
              </label>
              <input
                type="text"
                name="equipment"
                value={formData.equipment}
                onChange={handleChange}
                placeholder="e.g., Projector, Microscopes"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200"
              />
            </div>
          </div>

          {/* Additional Notes */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Additional Notes
            </label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleChange}
              rows="3"
              placeholder="Any special requirements or notes for the lab staff..."
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 focus:border-transparent transition-all duration-200 resize-none"
            />
          </div>

          {/* Form Actions */}
          <div className="flex items-center justify-end space-x-4 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={handleCancel}
              className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors duration-200 font-medium"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white rounded-lg hover:from-cyan-600 hover:to-cyan-700 transition-all duration-200 font-medium shadow-lg shadow-cyan-500/25"
            >
              Submit Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingForm;