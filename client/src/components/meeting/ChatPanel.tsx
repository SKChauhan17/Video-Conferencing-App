import React, { useState, useRef, useEffect } from 'react';
import { Send, Paperclip, Smile, X, Download } from 'lucide-react';
import { format } from 'date-fns';
import { useDropzone } from 'react-dropzone';
import { motion, AnimatePresence } from 'framer-motion';

interface Participant {
  id: string;
  name: string;
  avatar: string;
}

interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  content: string;
  timestamp: Date;
  type: 'text' | 'file' | 'emoji';
  fileData?: {
    name: string;
    size: number;
    type: string;
    url: string;
  };
}

interface ChatPanelProps {
  participants: Participant[];
  onSendMessage?: (message: string) => void;
}

const ChatPanel: React.FC<ChatPanelProps> = ({ participants, onSendMessage }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: '1',
      senderId: '2',
      senderName: 'Sarah Wilson',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=sarah',
      content: 'Welcome everyone! Let\'s start with our agenda for today.',
      timestamp: new Date(Date.now() - 5 * 60 * 1000),
      type: 'text'
    },
    {
      id: '2',
      senderId: '3',
      senderName: 'Mike Johnson',
      senderAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=mike',
      content: 'Thanks for organizing this meeting 👍',
      timestamp: new Date(Date.now() - 3 * 60 * 1000),
      type: 'text'
    }
  ]);
  
  const [newMessage, setNewMessage] = useState('');
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Common emojis for quick access
  const quickEmojis = ['😀', '😂', '❤️', '👍', '👎', '😢', '😮', '😡', '🎉', '👏', '🔥', '💯'];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (files) => {
      files.forEach(file => {
        if (file.size <= 100 * 1024 * 1024) { // 100MB limit
          const fileMessage: ChatMessage = {
            id: Date.now().toString(),
            senderId: '1',
            senderName: 'You',
            senderAvatar: participants[0]?.avatar || '',
            content: `Shared a file: ${file.name}`,
            timestamp: new Date(),
            type: 'file',
            fileData: {
              name: file.name,
              size: file.size,
              type: file.type,
              url: URL.createObjectURL(file)
            }
          };
          setMessages(prev => [...prev, fileMessage]);
        }
      });
    },
    maxSize: 100 * 1024 * 1024,
    multiple: true,
    noClick: true
  });

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: ChatMessage = {
      id: Date.now().toString(),
      senderId: '1',
      senderName: 'You',
      senderAvatar: participants[0]?.avatar || '',
      content: newMessage,
      timestamp: new Date(),
      type: 'text'
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setShowEmojiPicker(false);
    
    // Call external handler if provided
    onSendMessage?.(newMessage);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const handleEmojiSelect = (emoji: string) => {
    setNewMessage(prev => prev + emoji);
    setShowEmojiPicker(false);
    inputRef.current?.focus();
  };

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-800">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">Chat</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">{participants.length} participants</p>
      </div>

      {/* Messages */}
      <div 
        className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50 dark:bg-gray-900"
        {...getRootProps()}
      >
        <input {...getInputProps()} />
        
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex space-x-3 ${message.senderId === '1' ? 'flex-row-reverse space-x-reverse' : ''}`}
            >
              <img
                src={message.senderAvatar}
                alt={message.senderName}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
              
              <div className={`flex-1 max-w-xs ${message.senderId === '1' ? 'text-right' : ''}`}>
                <div className="flex items-center space-x-2 mb-1">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {message.senderName}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    {format(message.timestamp, 'HH:mm')}
                  </span>
                </div>
                
                <div className={`inline-block p-3 rounded-lg ${
                  message.senderId === '1' 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-600'
                }`}>
                  {message.type === 'file' && message.fileData ? (
                    <div className="space-y-2">
                      <div className="flex items-center space-x-2">
                        <Paperclip className="h-4 w-4" />
                        <span className="text-sm font-medium">{message.fileData.name}</span>
                      </div>
                      <div className="text-xs opacity-75">
                        {formatFileSize(message.fileData.size)}
                      </div>
                      <button className="flex items-center space-x-1 text-xs hover:underline">
                        <Download className="h-3 w-3" />
                        <span>Download</span>
                      </button>
                    </div>
                  ) : (
                    <p className="text-sm whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {isTyping && (
          <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-400">
            <div className="flex space-x-1">
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
              <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            </div>
            <span className="text-sm">Someone is typing...</span>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* File Drop Zone */}
      {isDragActive && (
        <div className="absolute inset-0 bg-blue-500/20 border-2 border-dashed border-blue-500 flex items-center justify-center z-10">
          <div className="text-center">
            <Paperclip className="h-12 w-12 text-blue-500 mx-auto mb-2" />
            <p className="text-blue-700 dark:text-blue-300 font-medium">Drop files here to share</p>
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        {/* Emoji Picker */}
        <AnimatePresence>
          {showEmojiPicker && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="mb-3 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg"
            >
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Quick Emojis</span>
                <button
                  onClick={() => setShowEmojiPicker(false)}
                  className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {quickEmojis.map((emoji, index) => (
                  <button
                    key={index}
                    onClick={() => handleEmojiSelect(emoji)}
                    className="p-2 text-lg hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex items-end space-x-2">
          <div className="flex-1 relative">
            <textarea
              ref={inputRef}
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Type a message..."
              rows={1}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div className="flex items-center space-x-1">
            <label className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors cursor-pointer">
              <Paperclip className="h-5 w-5" />
              <input
                type="file"
                multiple
                className="hidden"
                onChange={(e) => {
                  const files = Array.from(e.target.files || []);
                  files.forEach(file => {
                    if (file.size <= 100 * 1024 * 1024) {
                      const fileMessage: ChatMessage = {
                        id: Date.now().toString(),
                        senderId: '1',
                        senderName: 'You',
                        senderAvatar: participants[0]?.avatar || '',
                        content: `Shared a file: ${file.name}`,
                        timestamp: new Date(),
                        type: 'file',
                        fileData: {
                          name: file.name,
                          size: file.size,
                          type: file.type,
                          url: URL.createObjectURL(file)
                        }
                      };
                      setMessages(prev => [...prev, fileMessage]);
                    }
                  });
                }}
              />
            </label>
            
            <button
              onClick={() => setShowEmojiPicker(!showEmojiPicker)}
              className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <Smile className="h-5 w-5" />
            </button>
            
            <button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ChatPanel;