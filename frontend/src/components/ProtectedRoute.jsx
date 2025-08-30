// components/ProtectedRoute.js
import { useAuth } from '../context/AuthContext'; // Consistent casing
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const { isAuthenticated } = useAuth();
  
  return isAuthenticated ? children : <Navigate to="/login" />;
}

