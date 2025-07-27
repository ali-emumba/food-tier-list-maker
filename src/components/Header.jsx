import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveView = () => {
    if (location.pathname === '/dashboard') return 'dashboard';
    if (location.pathname === '/tiers') return 'tiers';
    if (location.pathname === '/stats') return 'stats';
    return 'dashboard';
  };

  const activeView = getActiveView();

  return (
    <header className="bg-white shadow">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">
              🍕 Food Tier List Maker
            </h1>
          </div>
            <div className="flex items-center space-x-4">
            <nav className="flex space-x-1">
              <button
                onClick={() => navigate('/dashboard')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                📊 Dashboard
              </button>              <button
                onClick={() => navigate('/tiers')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'tiers'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                🏆 Tier View
              </button>
              <button
                onClick={() => navigate('/stats')}
                className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                  activeView === 'stats'
                    ? 'bg-primary-100 text-primary-700'
                    : 'text-gray-500 hover:text-gray-700 hover:bg-gray-100'
                }`}
              >
                📈 Stats
              </button>
            </nav>            
            <span className="text-sm text-gray-700">
              Hello, <span className="font-medium">{user?.displayName || user?.email}</span>
            </span>            <button
              onClick={logout}
              className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-primary-600 hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
