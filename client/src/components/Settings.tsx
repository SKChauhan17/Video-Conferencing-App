import React, { useState } from 'react';
import { X, Monitor, Mic, Video, Volume2, Moon, Sun, Bell, Shield, Palette } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTheme } from '../contexts/ThemeContext';

interface SettingsProps {
  isOpen: boolean;
  onClose: () => void;
  inMeeting?: boolean;
}

const Settings: React.FC<SettingsProps> = ({ isOpen, onClose, inMeeting = false }) => {
  const { theme, toggleTheme } = useTheme();
  const [activeTab, setActiveTab] = useState('general');
  const [audioDevice, setAudioDevice] = useState('default');
  const [videoDevice, setVideoDevice] = useState('default');
  const [speakerDevice, setSpeakerDevice] = useState('default');
  const [notifications, setNotifications] = useState(true);
  const [autoJoinAudio, setAutoJoinAudio] = useState(true);
  const [autoJoinVideo, setAutoJoinVideo] = useState(true);

  if (!isOpen) return null;

  const tabs = [
    { id: 'general', label: 'General', icon: Monitor },
    { id: 'audio', label: 'Audio', icon: Mic },
    { id: 'video', label: 'Video', icon: Video },
    { id: 'appearance', label: 'Appearance', icon: Palette },
    { id: 'privacy', label: 'Privacy', icon: Shield }
  ];

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Notifications</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Receive meeting notifications</p>
        </div>
        <button
          onClick={() => setNotifications(!notifications)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            notifications ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              notifications ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Auto-join Audio</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Automatically join with audio enabled</p>
        </div>
        <button
          onClick={() => setAutoJoinAudio(!autoJoinAudio)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoJoinAudio ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoJoinAudio ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Auto-join Video</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Automatically join with video enabled</p>
        </div>
        <button
          onClick={() => setAutoJoinVideo(!autoJoinVideo)}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            autoJoinVideo ? 'bg-blue-600' : 'bg-gray-200 dark:bg-gray-700'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              autoJoinVideo ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>
    </div>
  );

  const renderAudioSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Microphone
        </label>
        <select
          value={audioDevice}
          onChange={(e) => setAudioDevice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="default">Default Microphone</option>
          <option value="built-in">Built-in Microphone</option>
          <option value="external">External Microphone</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Speaker
        </label>
        <select
          value={speakerDevice}
          onChange={(e) => setSpeakerDevice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="default">Default Speaker</option>
          <option value="built-in">Built-in Speaker</option>
          <option value="headphones">Headphones</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test Audio
        </label>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          Test Microphone
        </button>
      </div>
    </div>
  );

  const renderVideoSettings = () => (
    <div className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Camera
        </label>
        <select
          value={videoDevice}
          onChange={(e) => setVideoDevice(e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
        >
          <option value="default">Default Camera</option>
          <option value="built-in">Built-in Camera</option>
          <option value="external">External Camera</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Video Quality
        </label>
        <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
          <option value="auto">Auto</option>
          <option value="720p">720p HD</option>
          <option value="1080p">1080p Full HD</option>
        </select>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          Test Camera
        </label>
        <div className="w-full h-32 bg-gray-200 dark:bg-gray-700 rounded-lg flex items-center justify-center">
          <Video className="h-8 w-8 text-gray-400" />
        </div>
      </div>
    </div>
  );

  const renderAppearanceSettings = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Dark Mode</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Switch between light and dark themes</p>
        </div>
        <button
          onClick={toggleTheme}
          className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
            theme === 'dark' ? 'bg-blue-600' : 'bg-gray-200'
          }`}
        >
          <span
            className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
              theme === 'dark' ? 'translate-x-6' : 'translate-x-1'
            }`}
          />
        </button>
      </div>

      <div className="flex items-center space-x-4">
        <div className="flex-1">
          <h3 className="text-lg font-medium text-gray-900 dark:text-white">Theme Preview</h3>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <div className="p-3 bg-white border border-gray-200 rounded-lg">
              <div className="flex items-center space-x-2">
                <Sun className="h-4 w-4 text-yellow-500" />
                <span className="text-sm text-gray-900">Light</span>
              </div>
            </div>
            <div className="p-3 bg-gray-800 border border-gray-700 rounded-lg">
              <div className="flex items-center space-x-2">
                <Moon className="h-4 w-4 text-blue-400" />
                <span className="text-sm text-white">Dark</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderPrivacySettings = () => (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Data & Privacy</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
          Your meetings are protected with end-to-end encryption
        </p>
        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <Shield className="h-5 w-5 text-green-600 dark:text-green-400" />
            <span className="text-sm font-medium text-green-800 dark:text-green-200">
              End-to-end encrypted
            </span>
          </div>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Meeting Data</h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Save chat history</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-gray-700 dark:text-gray-300">Allow recording</span>
            <button className="relative inline-flex h-6 w-11 items-center rounded-full bg-blue-600">
              <span className="inline-block h-4 w-4 transform rounded-full bg-white translate-x-6" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden"
      >
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Settings</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex h-[600px]">
          {/* Sidebar */}
          <div className="w-64 bg-gray-50 dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700 p-4">
            <nav className="space-y-2">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? 'bg-blue-100 dark:bg-blue-900/50 text-blue-700 dark:text-blue-300'
                        : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 overflow-y-auto">
            {activeTab === 'general' && renderGeneralSettings()}
            {activeTab === 'audio' && renderAudioSettings()}
            {activeTab === 'video' && renderVideoSettings()}
            {activeTab === 'appearance' && renderAppearanceSettings()}
            {activeTab === 'privacy' && renderPrivacySettings()}
          </div>
        </div>

        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 dark:border-gray-700">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Save Changes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Settings;