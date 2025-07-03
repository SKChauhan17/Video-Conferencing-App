import React, { createContext, useContext, useState, useEffect, ReactNode, useRef } from 'react';
import Peer from 'simple-peer';

interface PeerConnection {
  id: string;
  peer: Peer.Instance;
  stream?: MediaStream;
}

interface WebRTCContextType {
  localStream: MediaStream | null;
  remoteStreams: Map<string, MediaStream>;
  screenStream: MediaStream | null;
  isScreenSharing: boolean;
  initializeMedia: () => Promise<void>;
  startScreenShare: () => Promise<void>;
  stopScreenShare: () => void;
  connectToPeer: (peerId: string, initiator: boolean) => void;
  disconnectFromPeer: (peerId: string) => void;
}

const WebRTCContext = createContext<WebRTCContextType | undefined>(undefined);

export const useWebRTC = () => {
  const context = useContext(WebRTCContext);
  if (!context) {
    throw new Error('useWebRTC must be used within a WebRTCProvider');
  }
  return context;
};

interface WebRTCProviderProps {
  children: ReactNode;
}

export const WebRTCProvider: React.FC<WebRTCProviderProps> = ({ children }) => {
  const [localStream, setLocalStream] = useState<MediaStream | null>(null);
  const [remoteStreams, setRemoteStreams] = useState<Map<string, MediaStream>>(new Map());
  const [screenStream, setScreenStream] = useState<MediaStream | null>(null);
  const [isScreenSharing, setIsScreenSharing] = useState(false);
  const peersRef = useRef<Map<string, PeerConnection>>(new Map());

  const initializeMedia = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { width: 1280, height: 720 },
        audio: { echoCancellation: true, noiseSuppression: true }
      });
      setLocalStream(stream);
      return stream;
    } catch (error) {
      console.error('Error accessing media devices:', error);
      throw error;
    }
  };

  const startScreenShare = async () => {
    try {
      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: { cursor: 'always' },
        audio: true
      });
      
      setScreenStream(stream);
      setIsScreenSharing(true);

      // Handle screen share end
      stream.getVideoTracks()[0].onended = () => {
        stopScreenShare();
      };

      // Replace video track for all peer connections
      peersRef.current.forEach(({ peer }) => {
        const videoTrack = stream.getVideoTracks()[0];
        const sender = peer._pc?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });

      return stream;
    } catch (error) {
      console.error('Error sharing screen:', error);
      throw error;
    }
  };

  const stopScreenShare = () => {
    if (screenStream) {
      screenStream.getTracks().forEach(track => track.stop());
      setScreenStream(null);
    }
    setIsScreenSharing(false);

    // Restore camera video for all peer connections
    if (localStream) {
      peersRef.current.forEach(({ peer }) => {
        const videoTrack = localStream.getVideoTracks()[0];
        const sender = peer._pc?.getSenders().find(s => 
          s.track && s.track.kind === 'video'
        );
        if (sender && videoTrack) {
          sender.replaceTrack(videoTrack);
        }
      });
    }
  };

  const connectToPeer = (peerId: string, initiator: boolean) => {
    const peer = new Peer({
      initiator,
      trickle: false,
      stream: localStream || undefined
    });

    peer.on('signal', (signal) => {
      // In a real app, send this signal to the remote peer via signaling server
      console.log('Signal for peer', peerId, signal);
    });

    peer.on('stream', (stream) => {
      setRemoteStreams(prev => new Map(prev.set(peerId, stream)));
    });

    peer.on('error', (error) => {
      console.error('Peer connection error:', error);
    });

    peersRef.current.set(peerId, { id: peerId, peer });
  };

  const disconnectFromPeer = (peerId: string) => {
    const peerConnection = peersRef.current.get(peerId);
    if (peerConnection) {
      peerConnection.peer.destroy();
      peersRef.current.delete(peerId);
      setRemoteStreams(prev => {
        const newMap = new Map(prev);
        newMap.delete(peerId);
        return newMap;
      });
    }
  };

  useEffect(() => {
    return () => {
      // Cleanup on unmount
      if (localStream) {
        localStream.getTracks().forEach(track => track.stop());
      }
      if (screenStream) {
        screenStream.getTracks().forEach(track => track.stop());
      }
      peersRef.current.forEach(({ peer }) => peer.destroy());
    };
  }, []);

  return (
    <WebRTCContext.Provider value={{
      localStream,
      remoteStreams,
      screenStream,
      isScreenSharing,
      initializeMedia,
      startScreenShare,
      stopScreenShare,
      connectToPeer,
      disconnectFromPeer
    }}>
      {children}
    </WebRTCContext.Provider>
  );
};