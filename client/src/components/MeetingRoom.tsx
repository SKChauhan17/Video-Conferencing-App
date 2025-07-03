import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useMeeting } from '../contexts/MeetingContext';
import { useWebRTC } from '../contexts/WebRTCContext';
import VideoGrid from './meeting/VideoGrid';
import ChatPanel from './meeting/ChatPanel';
import ParticipantsList from './meeting/ParticipantsList';
import ScreenShare from './meeting/ScreenShare';
import MeetingControls from './meeting/MeetingControls';
import Settings from './Settings';
import { motion, AnimatePresence } from 'framer-motion';

const MeetingRoom: React.FC = () => {
  const { roomId } = useParams<{ roomId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { currentMeeting, setCurrentMeeting } = useMeeting();
  const { 
    localStream, 
    remoteStreams, 
    screenStream, 
    isScreenSharing, 
    initializeMedia, 
    startScreenShare, 
    stopScreenShare 
  } = useWebRTC();
  
  // Meeting state
  const [isAudioEnabled, setIsAudioEnabled] = useState(true);
  const [isVideoEnabled, setIsVideoEnabled] = useState(true);
  const [isRecording, setIsRecording] = useState(false);
  const [showChat, setShowChat] = useState(false);
  const [showParticipants, setShowParticipants] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [isHandRaised, setIsHandRaised] = useState(false);
  const [layoutView, setLayoutView] = useState<'grid' | 'speaker' | 'gallery'>('grid');
  
  // Participants state
  const [participants, setParticipants] = useState([
    {
      id: user?.id || '1',
      name: user?.name || 'You',
      email: user?.email || '',
      avatar: user?.avatar || '',
      isAudioEnabled: true,
      isVideoEnabled: true,
      isHandRaised: false,
      isHost: true,
      isPresenting: false
    },
    {
      id: '2',
      name: 'Sarah Wilson',
      email: 'sarah@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      isAudioEnabled: true,
      isVideoEnabled: true,
      isHandRaised: false,
      isHost: false,
      isPresenting: false
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@company.com',
      avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      isAudioEnabled: false,
      isVideoEnabled: true,
      isHandRaised: true,
      isHost: false,
      isPresenting: false
    }
  ]);

  useEffect(() => {
    if (!roomId || !user) {
      navigate('/dashboard');
      return;
    }

    // Initialize media stream
    initializeMedia().catch(console.error);

    // Set current meeting
    setCurrentMeeting({
      id: roomId,
      title: 'Meeting Room',
      hostId: user.id,
      participants: participants.map(p => p.id),
      createdAt: new Date(),
      isActive: true
    });

    return () => {
      // Cleanup handled by WebRTC context
    };
  }, [roomId, user]);

  const toggleAudio = () => {
    if (localStream) {
      const audioTrack = localStream.getAudioTracks()[0];
      if (audioTrack) {
        audioTrack.enabled = !isAudioEnabled;
        setIsAudioEnabled(!isAudioEnabled);
        
        // Update participant state
        setParticipants(prev => 
          prev.map(p => 
            p.id === user?.id 
              ? { ...p, isAudioEnabled: !isAudioEnabled }
              : p
          )
        );
      }
    }
  };

  const toggleVideo = () => {
    if (localStream) {
      const videoTrack = localStream.getVideoTracks()[0];
      if (videoTrack) {
        videoTrack.enabled = !isVideoEnabled;
        setIsVideoEnabled(!isVideoEnabled);
        
        // Update participant state
        setParticipants(prev => 
          prev.map(p => 
            p.id === user?.id 
              ? { ...p, isVideoEnabled: !isVideoEnabled }
              : p
          )
        );
      }
    }
  };

  const toggleScreenShare = async () => {
    try {
      if (!isScreenSharing) {
        await startScreenShare();
        // Update participant state to show presenting
        setParticipants(prev => 
          prev.map(p => 
            p.id === user?.id 
              ? { ...p, isPresenting: true }
              : { ...p, isPresenting: false }
          )
        );
      } else {
        stopScreenShare();
        // Remove presenting state
        setParticipants(prev => 
          prev.map(p => ({ ...p, isPresenting: false }))
        );
      }
    } catch (error) {
      console.error('Error toggling screen share:', error);
    }
  };

  const toggleRecording = () => {
    setIsRecording(!isRecording);
  };

  const toggleHandRaise = () => {
    setIsHandRaised(!isHandRaised);
    // Update participant state
    setParticipants(prev => 
      prev.map(p => 
        p.id === user?.id 
          ? { ...p, isHandRaised: !isHandRaised }
          : p
      )
    );
  };

  const leaveMeeting = () => {
    setCurrentMeeting(null);
    navigate('/dashboard');
  };

  const handleSendMessage = (message: string) => {
    // In a real app, this would send the message via WebSocket
    console.log('Sending message:', message);
  };

  return (
    <div className="h-screen bg-gray-900 flex flex-col overflow-hidden">
      {/* Header */}
      <div className="bg-gray-800 text-white px-4 py-3 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <h1 className="text-lg font-semibold">Meeting Room</h1>
          {isRecording && (
            <div className="flex items-center space-x-2 text-red-400">
              <div className="w-2 h-2 bg-red-500 rounded-full animate-pulse"></div>
              <span className="text-sm">Recording</span>
            </div>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          <span className="text-sm text-gray-300">
            {participants.length} participant{participants.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={() => setShowSettings(!showSettings)}
            className="p-2 hover:bg-gray-700 rounded-lg transition-colors"
          >
            <SettingsIcon className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Video Area */}
        <div className="flex-1 relative">
          <VideoGrid
            participants={participants}
            localStream={localStream}
            screenStream={screenStream}
            remoteStreams={remoteStreams}
            layoutView={layoutView}
            isScreenSharing={isScreenSharing}
          />
        </div>

        {/* Side Panels */}
        <AnimatePresence>
          {showChat && (
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
            >
              <ChatPanel 
                participants={participants} 
                onSendMessage={handleSendMessage}
              />
            </motion.div>
          )}
          
          {showParticipants && (
            <motion.div
              initial={{ x: 320 }}
              animate={{ x: 0 }}
              exit={{ x: 320 }}
              className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700"
            >
              <ParticipantsList participants={participants} />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Controls */}
      <MeetingControls
        isAudioEnabled={isAudioEnabled}
        isVideoEnabled={isVideoEnabled}
        isScreenSharing={isScreenSharing}
        isRecording={isRecording}
        isHandRaised={isHandRaised}
        showChat={showChat}
        showParticipants={showParticipants}
        layoutView={layoutView}
        onToggleAudio={toggleAudio}
        onToggleVideo={toggleVideo}
        onToggleScreenShare={toggleScreenShare}
        onToggleRecording={toggleRecording}
        onToggleHandRaise={toggleHandRaise}
        onToggleChat={() => setShowChat(!showChat)}
        onToggleParticipants={() => setShowParticipants(!showParticipants)}
        onChangeLayout={setLayoutView}
        onLeaveMeeting={leaveMeeting}
      />

      {/* Settings Modal */}
      <AnimatePresence>
        {showSettings && (
          <Settings
            isOpen={showSettings}
            onClose={() => setShowSettings(false)}
            inMeeting={true}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default MeetingRoom;