import React, { useRef, useEffect } from 'react';
import { Mic, MicOff, VideoOff, Hand, Crown, Monitor } from 'lucide-react';
import { motion } from 'framer-motion';

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
  stream?: MediaStream;
}

interface VideoGridProps {
  participants: Participant[];
  localStream: MediaStream | null;
  screenStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  layoutView: 'grid' | 'speaker' | 'gallery';
  isScreenSharing: boolean;
}

const VideoGrid: React.FC<VideoGridProps> = ({ 
  participants, 
  localStream, 
  screenStream,
  remoteStreams,
  layoutView, 
  isScreenSharing 
}) => {
  const getGridClasses = () => {
    const count = participants.length;
    if (layoutView === 'speaker') {
      return 'grid-cols-1';
    }
    if (count <= 1) return 'grid-cols-1';
    if (count <= 4) return 'grid-cols-2';
    if (count <= 9) return 'grid-cols-3';
    return 'grid-cols-4';
  };

  const getSpeakerView = () => {
    const presenter = participants.find(p => p.isPresenting);
    const speaker = presenter || participants.find(p => p.isHost) || participants[0];
    return speaker;
  };

  const speaker = getSpeakerView();

  // If someone is screen sharing, show screen share prominently
  if (isScreenSharing && screenStream) {
    return (
      <div className="h-full flex flex-col">
        {/* Screen Share */}
        <div className="flex-1 relative bg-gray-900">
          <ScreenShareVideo stream={screenStream} />
          <div className="absolute top-4 left-4 bg-black/70 text-white px-3 py-1 rounded-lg flex items-center space-x-2">
            <Monitor className="h-4 w-4" />
            <span className="text-sm">Screen Sharing</span>
          </div>
        </div>
        
        {/* Participant Thumbnails */}
        <div className="h-24 bg-gray-900 flex space-x-2 p-2 overflow-x-auto">
          {participants.map((participant) => (
            <div key={participant.id} className="w-32 h-20 flex-shrink-0">
              <ParticipantVideo 
                participant={participant} 
                stream={participant.id === '1' ? localStream : remoteStreams.get(participant.id)}
                isMain={false} 
              />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (layoutView === 'speaker' && speaker) {
    return (
      <div className="h-full flex flex-col">
        {/* Main Speaker */}
        <div className="flex-1 relative bg-gray-800">
          <ParticipantVideo 
            participant={speaker} 
            stream={speaker.id === '1' ? localStream : remoteStreams.get(speaker.id)}
            isMain={true} 
          />
        </div>
        
        {/* Thumbnail Strip */}
        {participants.length > 1 && (
          <div className="h-24 bg-gray-900 flex space-x-2 p-2 overflow-x-auto">
            {participants
              .filter(p => p.id !== speaker.id)
              .map((participant) => (
                <div key={participant.id} className="w-32 h-20 flex-shrink-0">
                  <ParticipantVideo 
                    participant={participant} 
                    stream={participant.id === '1' ? localStream : remoteStreams.get(participant.id)}
                    isMain={false} 
                  />
                </div>
              ))}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className={`h-full p-4 grid ${getGridClasses()} gap-4 auto-rows-fr`}>
      {participants.map((participant, index) => (
        <motion.div
          key={participant.id}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          className="relative bg-gray-800 rounded-lg overflow-hidden"
        >
          <ParticipantVideo 
            participant={participant} 
            stream={participant.id === '1' ? localStream : remoteStreams.get(participant.id)}
            isMain={false} 
          />
        </motion.div>
      ))}
    </div>
  );
};

interface ParticipantVideoProps {
  participant: Participant;
  stream?: MediaStream;
  isMain: boolean;
}

const ParticipantVideo: React.FC<ParticipantVideoProps> = ({ participant, stream, isMain }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream && participant.isVideoEnabled) {
      videoRef.current.srcObject = stream;
    }
  }, [stream, participant.isVideoEnabled]);

  return (
    <div className="w-full h-full relative">
      {participant.isVideoEnabled && stream ? (
        <video
          ref={videoRef}
          autoPlay
          muted={participant.id === '1'} // Mute local video to prevent feedback
          playsInline
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-800 flex flex-col items-center justify-center">
          <img
            src={participant.avatar}
            alt={participant.name}
            className={`${isMain ? 'w-24 h-24' : 'w-16 h-16'} rounded-full mb-2`}
          />
          <VideoOff className={`${isMain ? 'h-8 w-8' : 'h-6 w-6'} text-gray-400`} />
        </div>
      )}
      
      {/* Overlay Info */}
      <div className="absolute inset-0 pointer-events-none">
        {/* Top indicators */}
        <div className="absolute top-2 left-2 flex items-center space-x-1">
          {participant.isHost && (
            <div className="bg-yellow-500 text-white p-1 rounded-full">
              <Crown className="h-3 w-3" />
            </div>
          )}
          {participant.isHandRaised && (
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 1 }}
              className="bg-yellow-500 text-white p-1 rounded-full"
            >
              <Hand className="h-3 w-3" />
            </motion.div>
          )}
          {participant.isPresenting && (
            <div className="bg-green-500 text-white p-1 rounded-full">
              <Monitor className="h-3 w-3" />
            </div>
          )}
        </div>
        
        {/* Bottom info */}
        <div className="absolute bottom-2 left-2 right-2 flex items-center justify-between">
          <div className="bg-black/70 text-white px-2 py-1 rounded text-sm max-w-[70%] truncate">
            {participant.name}
            {participant.id === '1' && ' (You)'}
          </div>
          
          <div className="flex items-center space-x-1">
            {!participant.isAudioEnabled && (
              <div className="bg-red-500 text-white p-1 rounded-full">
                <MicOff className="h-3 w-3" />
              </div>
            )}
          </div>
        </div>
      </div>
      
      {/* Speaking indicator */}
      {participant.isAudioEnabled && stream && (
        <div className="absolute inset-0 border-2 border-green-500 rounded-lg animate-pulse opacity-75"></div>
      )}
    </div>
  );
};

interface ScreenShareVideoProps {
  stream: MediaStream;
}

const ScreenShareVideo: React.FC<ScreenShareVideoProps> = ({ stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      className="w-full h-full object-contain"
    />
  );
};

export default VideoGrid;