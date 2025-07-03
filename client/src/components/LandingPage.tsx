import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Video, Users, Shield, Smartphone, Calendar, Share2 } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMeeting } from '../contexts/MeetingContext';

const LandingPage: React.FC = () => {
  const [meetingId, setMeetingId] = useState('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const { createMeeting } = useMeeting();

  const handleCreateMeeting = () => {
    if (!user) {
      navigate('/login');
      return;
    }

    const meeting = createMeeting('Quick Meeting', user.id);
    navigate(`/meeting/${meeting.id}`);
  };

  const handleJoinMeeting = () => {
    if (!meetingId.trim()) return;
    
    if (!user) {
      navigate('/login');
      return;
    }

    navigate(`/meeting/${meetingId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="bg-white/80 backdrop-blur-sm border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-2">
              <Video className="h-8 w-8 text-blue-600" />
              <span className="text-xl font-bold text-gray-900">VideoConnect</span>
            </div>
            <div className="flex items-center space-x-4">
              {user ? (
                <>
                  <button
                    onClick={() => navigate('/dashboard')}
                    className="text-gray-700 hover:text-gray-900 transition-colors"
                  >
                    Dashboard
                  </button>
                  <div className="flex items-center space-x-2">
                    <img 
                      src={user.avatar} 
                      alt={user.name}
                      className="w-8 h-8 rounded-full"
                    />
                    <span className="text-sm font-medium text-gray-700">{user.name}</span>
                  </div>
                </>
              ) : (
                <button
                  onClick={() => navigate('/login')}
                  className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Sign In
                </button>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
              Connect, Collaborate,
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600"> Create</span>
            </h1>
            <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
              Secure, high-quality video conferencing that brings teams together. 
              Join millions who trust VideoConnect for their most important conversations.
            </p>

            {/* Meeting Controls */}
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 max-w-md mx-auto mb-12">
              <div className="space-y-4">
                <button
                  onClick={handleCreateMeeting}
                  className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all duration-200 transform hover:scale-105 shadow-lg"
                >
                  Start New Meeting
                </button>
                
                <div className="flex items-center">
                  <div className="flex-1 border-t border-gray-200"></div>
                  <span className="px-4 text-gray-500 text-sm">or</span>
                  <div className="flex-1 border-t border-gray-200"></div>
                </div>

                <div className="flex space-x-2">
                  <input
                    type="text"
                    placeholder="Enter meeting ID"
                    value={meetingId}
                    onChange={(e) => setMeetingId(e.target.value)}
                    className="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    onKeyPress={(e) => e.key === 'Enter' && handleJoinMeeting()}
                  />
                  <button
                    onClick={handleJoinMeeting}
                    disabled={!meetingId.trim()}
                    className="px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    Join
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything you need for productive meetings
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Professional-grade video conferencing with enterprise security and consumer simplicity.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <Video className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">HD Video & Audio</h3>
              <p className="text-gray-600">Crystal clear video up to 1080p and studio-quality audio for the best meeting experience.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <Users className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Up to 25 Participants</h3>
              <p className="text-gray-600">Host large meetings with up to 25 participants without compromising quality.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <Shield className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">End-to-End Encryption</h3>
              <p className="text-gray-600">Bank-level security with end-to-end encryption for all your conversations.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <Smartphone className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Cross-Platform</h3>
              <p className="text-gray-600">Works seamlessly on desktop, mobile, and tablet across all major browsers.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-4">
                <Calendar className="h-6 w-6 text-indigo-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Meeting Scheduling</h3>
              <p className="text-gray-600">Schedule meetings in advance with calendar integration and automatic reminders.</p>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow">
              <div className="w-12 h-12 bg-pink-100 rounded-lg flex items-center justify-center mb-4">
                <Share2 className="h-6 w-6 text-pink-600" />
              </div>
              <h3 className="text-xl font-semibold mb-2">Screen Sharing</h3>
              <p className="text-gray-600">Share your screen with annotation tools for effective presentations and collaboration.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="flex items-center justify-center space-x-2 mb-4">
              <Video className="h-8 w-8" />
              <span className="text-xl font-bold">VideoConnect</span>
            </div>
            <p className="text-gray-400 mb-4">Secure video conferencing for everyone.</p>
            <p className="text-sm text-gray-500">
              © 2024 VideoConnect. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;