import React, { useState } from 'react';
import { 
  Mic, 
  MicOff, 
  VideoOff, 
  Hand, 
  Crown, 
  MoreVertical, 
  UserX, 
  Volume2, 
  VolumeX,
  Shield,
  UserPlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
  id: string;
  name: string;
  email: string;
  avatar: string;
  isAudioEnabled: boolean;
  isVideoEnabled: boolean;
  isHandRaised: boolean;
  isHost: boolean;
  isPresenting: boolean;
}

interface ParticipantsListProps {
  participants: Participant[];
}

const ParticipantsList: React.FC<ParticipantsListProps> = ({ participants }) => {
  const [selectedParticipant, setSelectedParticipant] = useState<string | null>(null);
  const [mutedParticipants, setMutedParticipants] = useState<string[]>([]);

  const handleMuteParticipant = (participantId: string) => {
    setMutedParticipants(prev => 
      prev.includes(participantId) 
        ? prev.filter(id => id !== participantId)
        : [...prev, participantId]
    );
  };

  const handleRemoveParticipant = (participantId: string) => {
    // In a real app, this would remove the participant from the meeting
    console.log('Remove participant:', participantId);
  };

  const handleMakeHost = (participantId: string) => {
    // In a real app, this would change host permissions
    console.log('Make host:', participantId);
  };

  const inviteLink = `${window.location.origin}/meeting/${window.location.pathname.split('/')[2]}`;

  const copyInviteLink = () => {
    navigator.clipboard.writeText(inviteLink);
  };

  return (
    <div className="h-full flex flex-col bg-white">
      {/* Header */}
      <div className="p-4 border-b border-gray-200">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-lg font-semibold text-gray-900">
            Participants ({participants.length})
          </h3>
          <button
            onClick={copyInviteLink}
            className="flex items-center space-x-1 text-blue-600 hover:text-blue-700 transition-colors"
          >
            <UserPlus className="h-4 w-4" />
            <span className="text-sm">Invite</span>
          </button>
        </div>
        
        {/* Invite Link */}
        <div className="bg-gray-50 rounded-lg p-3">
          <p className="text-xs text-gray-600 mb-1">Meeting Link</p>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              value={inviteLink}
              readOnly
              className="flex-1 text-xs bg-transparent border-none focus:outline-none"
            />
            <button
              onClick={copyInviteLink}
              className="text-blue-600 hover:text-blue-700 text-xs"
            >
              Copy
            </button>
          </div>
        </div>
      </div>

      {/* Participants List */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-2 space-y-1">
          <AnimatePresence>
            {participants.map((participant) => (
              <motion.div
                key={participant.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 20 }}
                className="group relative"
              >
                <div className="flex items-center space-x-3 p-2 rounded-lg hover:bg-gray-50 transition-colors">
                  {/* Avatar */}
                  <div className="relative flex-shrink-0">
                    <img
                      src={participant.avatar}
                      alt={participant.name}
                      className="w-10 h-10 rounded-full"
                    />
                    
                    {/* Status indicators */}
                    <div className="absolute -bottom-1 -right-1 flex space-x-1">
                      {participant.isHost && (
                        <div className="bg-yellow-500 text-white p-1 rounded-full">
                          <Crown className="h-2 w-2" />
                        </div>
                      )}
                      {participant.isHandRaised && (
                        <motion.div
                          animate={{ scale: [1, 1.1, 1] }}
                          transition={{ repeat: Infinity, duration: 1 }}
                          className="bg-yellow-500 text-white p-1 rounded-full"
                        >
                          <Hand className="h-2 w-2" />
                        </motion.div>
                      )}
                    </div>
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {participant.name}
                        {participant.id === '1' && ' (You)'}
                      </p>
                      {participant.isPresenting && (
                        <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Presenting
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-gray-500 truncate">{participant.email}</p>
                  </div>

                  {/* Audio/Video Status */}
                  <div className="flex items-center space-x-1">
                    {participant.isAudioEnabled ? (
                      <div className="p-1 text-gray-400">
                        <Mic className="h-4 w-4" />
                      </div>
                    ) : (
                      <div className="p-1 text-red-500">
                        <MicOff className="h-4 w-4" />
                      </div>
                    )}
                    
                    {!participant.isVideoEnabled && (
                      <div className="p-1 text-red-500">
                        <VideoOff className="h-4 w-4" />
                      </div>
                    )}

                    {mutedParticipants.includes(participant.id) && (
                      <div className="p-1 text-red-500">
                        <VolumeX className="h-4 w-4" />
                      </div>
                    )}
                  </div>

                  {/* Actions Menu */}
                  {participant.id !== '1' && (
                    <div className="relative">
                      <button
                        onClick={() => setSelectedParticipant(
                          selectedParticipant === participant.id ? null : participant.id
                        )}
                        className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        <MoreVertical className="h-4 w-4" />
                      </button>

                      {/* Dropdown Menu */}
                      <AnimatePresence>
                        {selectedParticipant === participant.id && (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            exit={{ opacity: 0, scale: 0.95 }}
                            className="absolute right-0 mt-1 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-10"
                          >
                            <div className="py-1">
                              <button
                                onClick={() => handleMuteParticipant(participant.id)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                              >
                                {mutedParticipants.includes(participant.id) ? (
                                  <>
                                    <Volume2 className="h-4 w-4" />
                                    <span>Unmute for me</span>
                                  </>
                                ) : (
                                  <>
                                    <VolumeX className="h-4 w-4" />
                                    <span>Mute for me</span>
                                  </>
                                )}
                              </button>
                              
                              {!participant.isHost && (
                                <button
                                  onClick={() => handleMakeHost(participant.id)}
                                  className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                                >
                                  <Shield className="h-4 w-4" />
                                  <span>Make host</span>
                                </button>
                              )}
                              
                              <button
                                onClick={() => handleRemoveParticipant(participant.id)}
                                className="flex items-center space-x-2 w-full px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                              >
                                <UserX className="h-4 w-4" />
                                <span>Remove</span>
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      {/* Meeting Info */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <div className="text-xs text-gray-600 space-y-1">
          <p>Meeting ID: {window.location.pathname.split('/')[2]}</p>
          <p>Started: {new Date().toLocaleTimeString()}</p>
          <p>Security: End-to-end encrypted</p>
        </div>
      </div>
    </div>
  );
};

export default ParticipantsList;