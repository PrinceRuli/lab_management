import { Navigate } from 'react-router-dom';

const GuestOnlyRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  const user = JSON.parse(localStorage.getItem('user') || 'null');

  // 🔴 JIKA SUDAH LOGIN
  if (token && user) {
   
     const redirectPath =
      user.role === 'admin'
        ? '/admin/dashboard'
        : '/teacher/dashboard';

    return <Navigate to={redirectPath} replace />;
  }

  // 🟢 BELUM LOGIN → boleh lanjut
  return children;
};

export default GuestOnlyRoute;
