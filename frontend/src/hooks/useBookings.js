import { useState, useEffect } from 'react';
import { bookingAPI } from '../services/api';

export const useBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Panggil API untuk mengambil booking history guru
      const response = await bookingAPI.getTeacherBookings();
      
      // Transform data jika diperlukan
      const transformedBookings = response.data.data.map(booking => ({
        ...booking,
        // Format date jika perlu
        bookingDate: new Date(booking.bookingDate).toISOString().split('T')[0]
      }));
      
      setBookings(transformedBookings);
    } catch (err) {
      console.error('Error fetching bookings:', err);
      setError(err.response?.data?.message || 'Gagal mengambil data booking');
    } finally {
      setLoading(false);
    }
  };

  // Fetch data saat komponen mount
  useEffect(() => {
    fetchBookings();
  }, []);

  return {
    bookings,
    loading,
    error,
    refetch: fetchBookings // Untuk refresh data
  };
};