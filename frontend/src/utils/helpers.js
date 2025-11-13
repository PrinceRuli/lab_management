export const formatDate = (dateString) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

export const formatTime = (timeString) => {
  return timeString.replace(/:00$/, '');
};

export const getStatusColor = (status) => {
  const colors = {
    available: 'bg-green-100 text-green-800',
    maintenance: 'bg-amber-100 text-amber-800',
    occupied: 'bg-blue-100 text-blue-800',
    unavailable: 'bg-red-100 text-red-800',
    pending: 'bg-amber-100 text-amber-800',
    confirmed: 'bg-green-100 text-green-800',
    cancelled: 'bg-red-100 text-red-800',
    completed: 'bg-blue-100 text-blue-800'
  };
  return colors[status] || 'bg-gray-100 text-gray-800';
};

export const generateLabIcon = (labName) => {
  if (labName.includes('Computer')) return '💻';
  if (labName.includes('Multimedia')) return '🎬';
  if (labName.includes('Physics')) return '🔬';
  if (labName.includes('Chemistry')) return '🧪';
  if (labName.includes('Biology')) return '🔬';
  return '🏢';
};