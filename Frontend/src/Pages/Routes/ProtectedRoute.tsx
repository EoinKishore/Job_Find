import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
  const token = localStorage.getItem('token');
  console.log('the protected route token',token);
  return token ? <Outlet /> : <Navigate to="/signin" />;
};

export default ProtectedRoute;
