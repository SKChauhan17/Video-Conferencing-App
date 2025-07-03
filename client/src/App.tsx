import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { MeetingProvider } from './contexts/MeetingContext';
import { WebRTCProvider } from './contexts/WebRTCContext';
import { ThemeProvider } from './contexts/ThemeContext';
import LandingPage from './components/LandingPage';
import MeetingRoom from './components/MeetingRoom';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <MeetingProvider>
          <WebRTCProvider>
            <Router>
              <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
                <Routes>
                  <Route path="/" element={<LandingPage />} />
                  <Route path="/login" element={<Login />} />
                  <Route 
                    path="/dashboard" 
                    element={
                      <ProtectedRoute>
                        <Dashboard />
                      </ProtectedRoute>
                    } 
                  />
                  <Route 
                    path="/meeting/:roomId" 
                    element={
                      <ProtectedRoute>
                        <MeetingRoom />
                      </ProtectedRoute>
                    } 
                  />
                </Routes>
              </div>
            </Router>
          </WebRTCProvider>
        </MeetingProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;