import React, { useRef, useEffect } from 'react';
import { Monitor, X, Settings } from 'lucide-react';

interface ScreenShareProps {
  isSharing: boolean;
  onStopSharing: () => void;
  stream?: MediaStream;
}

const ScreenShare: React.FC<ScreenShareProps> = ({ isSharing, onStopSharing, stream }) => {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (videoRef.current && stream) {
      videoRef.current.srcObject = stream;
    }
  }, [stream]);

  if (!isSharing) return null;

  return (
    <div className="fixed inset-0 bg-black z-40 flex flex-col">
      {/* Header */}
      <div className="bg-gray-900 text-white p-4 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <Monitor className="h-5 w-5 text-green-400" />
          <span className="font-medium">You are sharing your screen</span>
        </div>
        
        <div className="flex items-center space-x-2">
          <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors">
            <Settings className="h-5 w-5" />
          </button>
          <button
            onClick={onStopSharing}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
          >
            Stop Sharing
          </button>
        </div>
      </div>

      {/* Screen Content */}
      <div className="flex-1 flex items-center justify-center bg-gray-100">
        <video
          ref={videoRef}
          autoPlay
          muted
          className="max-w-full max-h-full object-contain"
        />
      </div>

      {/* Annotation Tools */}
      <div className="bg-gray-900 text-white p-4">
        <div className="flex items-center justify-center space-x-4">
          <button className="px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors">
            Pen
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            Highlight
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            Text
          </button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors">
            Clear
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenShare;