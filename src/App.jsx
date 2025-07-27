import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './hooks/useAuth';
import { initializeSampleData } from './hooks/useFirebase';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import TierView from './pages/TierView';
import StatsPage from './pages/StatsPage';
import './App.css';

function App() {
  const { user, loading } = useAuth();

  // Initialize sample data when app starts
  useEffect(() => {
    const initData = async () => {
      try {
        await initializeSampleData();
        console.log('Sample data initialized');
      } catch (error) {
        console.log('Sample data already exists or error:', error.message);
      }
    };

    initData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="flex items-center space-x-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <Login />} 
          />
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/tiers" 
            element={user ? <TierView /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/stats" 
            element={user ? <StatsPage /> : <Navigate to="/login" replace />} 
          />
          <Route 
            path="/" 
            element={<Navigate to="/dashboard" replace />} 
          />
          <Route 
            path="*" 
            element={<Navigate to={user ? "/dashboard" : "/login"} replace />} 
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
