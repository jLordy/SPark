// components/Sidebar.jsx
import { useAuth } from '../context/AuthContext';
import { Link, useLocation } from 'react-router-dom';

export default function Sidebar() {
  const { user, logout } = useAuth();
  const location = useLocation();

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <div className="w-64 bg-gray-800 text-white min-h-screen fixed left-0 top-0">
      {/* User Profile Section */}
      <div className="p-6 border-b border-gray-700">
        {user ? (
          <div className="text-center">
            <div className="w-16 h-16 bg-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl font-bold">
                {user.first_name?.[0]?.toUpperCase() || user.username?.[0]?.toUpperCase()}
              </span>
            </div>
            <h3 className="font-semibold text-lg">
              {user.first_name} {user.last_name}
            </h3>
            <p className="text-gray-400 text-sm">@{user.username}</p>
            <p className="text-xs bg-blue-600 px-2 py-1 rounded-full mt-2 inline-block">
              {user.role}
            </p>
            {!user.is_approved && (
              <p className="text-xs bg-yellow-600 px-2 py-1 rounded-full mt-1 inline-block">
                Pending Approval
              </p>
            )}
          </div>
        ) : (
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-600 rounded-full flex items-center justify-center mx-auto mb-3">
              <span className="text-2xl">👤</span>
            </div>
            <p className="text-gray-400">Not logged in</p>
            <Link 
              to="/login" 
              className="text-blue-400 hover:text-blue-300 text-sm mt-2 inline-block"
            >
              Login
            </Link>
          </div>
        )}
      </div>

      {/* Navigation Links */}
      <nav className="p-4">
        <ul className="space-y-2">
          {/* Public Links */}
          <li>
            <Link 
              to="/" 
              className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                isActive('/') ? 'bg-gray-700' : ''
              }`}
            >
              <span>🏠</span>
              <span className="ml-3">Home</span>
            </Link>
          </li>

          {/* Protected Links - Only show when logged in */}
          {user && (
            <>
              <li>
                <Link 
                  to="/dashboard" 
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive('/dashboard') ? 'bg-gray-700' : ''
                  }`}
                >
                  <span>📊</span>
                  <span className="ml-3">Dashboard</span>
                </Link>
              </li>

              {/* Admin Links - Only show for admin users */}
              {user.role === 'admin' && (
                <li>
                  <Link 
                    to="/admin" 
                    className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                      isActive('/admin') ? 'bg-gray-700' : ''
                    }`}
                  >
                    <span>⚙️</span>
                    <span className="ml-3">Admin Panel</span>
                  </Link>
                </li>
              )}
            </>
          )}

          {/* Auth Links */}
          {user ? (
            <li>
              <button
                onClick={logout}
                className="flex items-center p-3 rounded-lg hover:bg-red-700 transition-colors w-full text-left"
              >
                <span>🚪</span>
                <span className="ml-3">Logout</span>
              </button>
            </li>
          ) : (
            <>
              <li>
                <Link 
                  to="/login" 
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive('/login') ? 'bg-gray-700' : ''
                  }`}
                >
                  <span>🔑</span>
                  <span className="ml-3">Login</span>
                </Link>
              </li>
              <li>
                <Link 
                  to="/register" 
                  className={`flex items-center p-3 rounded-lg hover:bg-gray-700 transition-colors ${
                    isActive('/register') ? 'bg-gray-700' : ''
                  }`}
                >
                  <span>📝</span>
                  <span className="ml-3">Register</span>
                </Link>
              </li>
            </>
          )}
        </ul>
      </nav>
    </div>
  );
}