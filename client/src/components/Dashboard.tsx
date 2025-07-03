import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Video, 
  Plus, 
  Calendar, 
  Clock, 
  Users, 
  Settings as SettingsIcon, 
  Search,
  Filter,
  MoreVertical,
  Play,
  Copy,
  Share2,
  Trash2,
  Edit3
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMeeting } from '../contexts/MeetingContext';
import { format } from 'date-fns';
import MeetingScheduler from './meeting/MeetingScheduler';
import Settings from './Settings';
import { motion, AnimatePresence } from 'framer-motion';

interface ScheduledMeeting {
  id: string;
  title: string;
  description: string;
  startTime: Date;
  duration: number;
  participants: string[];
  isRecurring: boolean;
  status: 'upcoming' | 'live' | 'ended';
}

const Dashboard: React.FC = () => {
  const { user, logout } = useAuth();
  const { createMeeting } = useMeeting();
  const navigate = useNavigate();
  
  const [showScheduler, setShowScheduler] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'upcoming' | 'live' | 'ended'>('all');
  const [scheduledMeetings, setScheduledMeetings] = useState<ScheduledMeeting[]>([
    {
      id: '1',
      title: 'Team Standup',
      description: 'Daily team synchronization meeting',
      startTime: new Date(Date.now() + 30 * 60 * 1000), // 30 minutes from now
      duration: 30,
      participants: ['team@company.com'],
      isRecurring: true,
      status: 'upcoming'
    },
    {
      id: '2',
      title: 'Project Review',
      description: 'Quarterly project review and planning',
      startTime: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
      duration: 60,
      participants: ['manager@company.com', 'team@company.com'],
      isRecurring: false,
      status: 'upcoming'
    }
  ]);

  const handleQuickMeeting = () => {
    if (!user) return;
    const meeting = createMeeting('Quick Meeting', user.id);
    navigate(`/meeting/${meeting.id}`);
  };

  const handleJoinMeeting = (meetingId: string) => {
    navigate(`/meeting/${meetingId}`);
  };

  const handleCopyMeetingLink = (meetingId: string) => {
    const link = `${window.location.origin}/meeting/${meetingId}`;
    navigator.clipboard.writeText(link);
    // You could add a toast notification here
  };

  const handleScheduleMeeting = (meetingData: any) => {
    const newMeeting: ScheduledMeeting = {
      id: Date.now().toString(),
      ...meetingData,
      status: 'upcoming' as const
    };
    setScheduledMeetings(prev => [...prev, newMeeting]);
    setShowScheduler(false);
  };

  const filteredMeetings = scheduledMeetings.filter(meeting => {
    const matchesSearch = meeting.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         meeting.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || meeting.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'live': return 'bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800';
      case 'upcoming': return 'bg-blue-100 text-blue-800 border-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:border-blue-800';
      case 'ended': return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
      default: return 'bg-gray-100 text-gray-800 border-gray-200 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-700';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50 dark:from-gray-900 dark:via-gray-800 dark:to-gray-900">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Video className="h-8 w-8 text-blue-600" />
                <span className="text-xl font-bold text-gray-900 dark:text-white">VideoConnect</span>
              </div>
              <span className="text-gray-400">|</span>
              <h1 className="text-lg font-semibold text-gray-700 dark:text-gray-300">Dashboard</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigate('/')}
                className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
              >
                Home
              </button>
              <div className="flex items-center space-x-3">
                <img 
                  src={user?.avatar} 
                  alt={user?.name}
                  className="w-8 h-8 rounded-full"
                />
                <div className="hidden sm:block">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">{user?.name}</span>
                </div>
                <button
                  onClick={() => setShowSettings(true)}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
                >
                  <SettingsIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={logout}
                  className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors text-sm"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Actions */}
        <div className="mb-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleQuickMeeting}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200"
            >
              <div className="flex items-center space-x-3">
                <Video className="h-8 w-8" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Start Meeting</h3>
                  <p className="text-blue-100">Begin an instant meeting</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowScheduler(true)}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <div className="flex items-center space-x-3">
                <Calendar className="h-8 w-8 text-blue-600" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Schedule Meeting</h3>
                  <p className="text-gray-500 dark:text-gray-400">Plan for later</p>
                </div>
              </div>
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border border-gray-200 dark:border-gray-700 p-6 rounded-xl shadow-lg hover:shadow-xl transition-all duration-200 text-gray-700 dark:text-gray-300"
            >
              <div className="flex items-center space-x-3">
                <Users className="h-8 w-8 text-purple-600" />
                <div className="text-left">
                  <h3 className="text-lg font-semibold">Join Meeting</h3>
                  <p className="text-gray-500 dark:text-gray-400">Enter meeting ID</p>
                </div>
              </div>
            </motion.button>
          </div>
        </div>

        {/* Meetings Section */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-0">Your Meetings</h2>
            
            <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search meetings..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value as any)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Meetings</option>
                <option value="upcoming">Upcoming</option>
                <option value="live">Live</option>
                <option value="ended">Ended</option>
              </select>
            </div>
          </div>

          {/* Meetings List */}
          <div className="space-y-4">
            <AnimatePresence>
              {filteredMeetings.map((meeting) => (
                <motion.div
                  key={meeting.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow bg-white dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-3 mb-2">
                        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{meeting.title}</h3>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full border ${getStatusColor(meeting.status)}`}>
                          {meeting.status}
                        </span>
                        {meeting.isRecurring && (
                          <span className="text-xs text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded">
                            Recurring
                          </span>
                        )}
                      </div>
                      
                      <p className="text-gray-600 dark:text-gray-400 mb-2">{meeting.description}</p>
                      
                      <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <div className="flex items-center space-x-1">
                          <Clock className="h-4 w-4" />
                          <span>{format(meeting.startTime, 'MMM d, h:mm a')}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Users className="h-4 w-4" />
                          <span>{meeting.participants.length} participants</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2">
                      {meeting.status === 'upcoming' && (
                        <button
                          onClick={() => handleJoinMeeting(meeting.id)}
                          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                        >
                          <Play className="h-4 w-4" />
                        </button>
                      )}
                      
                      <button
                        onClick={() => handleCopyMeetingLink(meeting.id)}
                        className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
                      >
                        <Copy className="h-4 w-4" />
                      </button>
                      
                      <button className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors">
                        <MoreVertical className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
            
            {filteredMeetings.length === 0 && (
              <div className="text-center py-12">
                <Calendar className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">No meetings found</h3>
                <p className="text-gray-500 dark:text-gray-400">
                  {searchTerm ? 'Try adjusting your search criteria' : 'Schedule your first meeting to get started'}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Meeting Scheduler Modal */}
      <AnimatePresence>
        {showScheduler && (
          <MeetingScheduler
            isOpen={showScheduler}
            onClose={() => setShowScheduler(false)}
            onSchedule={handleScheduleMeeting}
          />
        )}
      </AnimatePresence>

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default Dashboard;