import React, { useState } from 'react';
import { Mic, MicOff, Video, VideoOff, Phone, Monitor, MessageSquare, Users, Hand, Grid, Maximize, Settings, SwordIcon as Record, StopCircle, MoreVertical } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface MeetingControlsProps {
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isScreenSharing: boolean;
  isRecording: boolean;
  isHandRaised: boolean;
  showChat: boolean;
  showParticipants: boolean;
  layoutView: 'grid' | 'speaker' | 'gallery';
  onToggleAudio: () => void;
  onToggleVideo: () => void;
  onToggleScreenShare: () => void;
  onToggleRecording: () => void;
  onToggleHandRaise: () => void;
  onToggleChat: () => void;
  onToggleParticipants: () => void;
  onChangeLayout: (layout: 'grid' | 'speaker' | 'gallery') => void;
  onLeaveMeeting: () => void;
}

const MeetingControls: React.FC<MeetingControlsProps> = ({
  isAudioEnabled,
  isVideoEnabled,
  isScreenSharing,
  isRecording,
  isHandRaised,
  showChat,
  showParticipants,
  layoutView,
  onToggleAudio,
  onToggleVideo,
  onToggleScreenShare,
  onToggleRecording,
  onToggleHandRaise,
  onToggleChat,
  onToggleParticipants,
  onChangeLayout,
  onLeaveMeeting
}) => {
  const [showMoreOptions, setShowMoreOptions] = useState(false);
  const [showLayoutOptions, setShowLayoutOptions] = useState(false);

  const controlButton = (
    icon: React.ReactNode,
    isActive: boolean,
    onClick: () => void,
    isDestructive = false,
    className = ''
  ) => (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      onClick={onClick}
      className={`
        p-3 rounded-full transition-all duration-200 ${className}
        ${isActive 
          ? isDestructive 
            ? 'bg-red-600 text-white shadow-lg' 
            : 'bg-white text-gray-700 shadow-lg'
          : isDestructive
            ? 'bg-red-600 text-white shadow-lg'
            : 'bg-gray-800/70 backdrop-blur-sm text-white hover:bg-gray-700/70'
        }
      `}
    >
      {icon}
    </motion.button>
  );

  return (
    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/50 to-transparent p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-center space-x-4">
          {/* Audio Control */}
          {controlButton(
            isAudioEnabled ? <Mic className="h-5 w-5" /> : <MicOff className="h-5 w-5" />,
            !isAudioEnabled,
            onToggleAudio,
            !isAudioEnabled
          )}

          {/* Video Control */}
          {controlButton(
            isVideoEnabled ? <Video className="h-5 w-5" /> : <VideoOff className="h-5 w-5" />,
            !isVideoEnabled,
            onToggleVideo,
            !isVideoEnabled
          )}

          {/* Screen Share */}
          {controlButton(
            <Monitor className="h-5 w-5" />,
            isScreenSharing,
            onToggleScreenShare
          )}

          {/* Recording */}
          {controlButton(
            isRecording ? <StopCircle className="h-5 w-5" /> : <Record className="h-5 w-5" />,
            isRecording,
            onToggleRecording,
            false,
            isRecording ? 'animate-pulse' : ''
          )}

          {/* Hand Raise */}
          {controlButton(
            <Hand className="h-5 w-5" />,
            isHandRaised,
            onToggleHandRaise,
            false,
            isHandRaised ? 'bg-yellow-500 text-white animate-pulse' : ''
          )}

          {/* Layout Options */}
          <div className="relative">
            {controlButton(
              <Grid className="h-5 w-5" />,
              showLayoutOptions,
              () => setShowLayoutOptions(!showLayoutOptions)
            )}
            
            <AnimatePresence>
              {showLayoutOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-max"
                >
                  <div className="flex space-x-2">
                    <button
                      onClick={() => {
                        onChangeLayout('grid');
                        setShowLayoutOptions(false);
                      }}
                      className={`p-2 rounded ${layoutView === 'grid' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                      <Grid className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => {
                        onChangeLayout('speaker');
                        setShowLayoutOptions(false);
                      }}
                      className={`p-2 rounded ${layoutView === 'speaker' ? 'bg-blue-100 text-blue-600' : 'hover:bg-gray-100'}`}
                    >
                      <Maximize className="h-4 w-4" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Chat */}
          {controlButton(
            <MessageSquare className="h-5 w-5" />,
            showChat,
            onToggleChat
          )}

          {/* Participants */}
          {controlButton(
            <Users className="h-5 w-5" />,
            showParticipants,
            onToggleParticipants
          )}

          {/* More Options */}
          <div className="relative">
            {controlButton(
              <MoreVertical className="h-5 w-5" />,
              showMoreOptions,
              () => setShowMoreOptions(!showMoreOptions)
            )}
            
            <AnimatePresence>
              {showMoreOptions && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-white rounded-lg shadow-lg border border-gray-200 p-2 min-w-max"
                >
                  <div className="space-y-1">
                    <button className="flex items-center space-x-2 w-full px-3 py-2 text-left hover:bg-gray-100 rounded">
                      <Settings className="h-4 w-4" />
                      <span className="text-sm">Settings</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Leave Meeting */}
          <div className="ml-4">
            {controlButton(
              <Phone className="h-5 w-5 rotate-[135deg]" />,
              false,
              onLeaveMeeting,
              true
            )}
          </div>
        </div>

        {/* Meeting Timer */}
        <div className="text-center mt-4">
          <span className="text-white text-sm bg-black/30 backdrop-blur-sm px-3 py-1 rounded-full">
            {new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
};

export default MeetingControls;