import { Navigate, useLocation } from 'react-router-dom';

import { useAuth } from '@components/AuthProvider';

const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
  const { token } = useAuth()
  const location = useLocation()

  if (!token) {
    return <Navigate to="/login" state={{ from: location }} />;
  }

  return children;
};

export default ProtectedRoute;