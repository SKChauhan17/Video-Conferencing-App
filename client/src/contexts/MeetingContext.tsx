import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { v4 as uuidv4 } from 'uuid';

interface Meeting {
  id: string;
  title: string;
  hostId: string;
  participants: string[];
  createdAt: Date;
  isActive: boolean;
}

interface MeetingContextType {
  meetings: Meeting[];
  createMeeting: (title: string, hostId: string) => Meeting;
  joinMeeting: (meetingId: string, userId: string) => void;
  leaveMeeting: (meetingId: string, userId: string) => void;
  currentMeeting: Meeting | null;
  setCurrentMeeting: (meeting: Meeting | null) => void;
}

const MeetingContext = createContext<MeetingContextType | undefined>(undefined);

export const useMeeting = () => {
  const context = useContext(MeetingContext);
  if (!context) {
    throw new Error('useMeeting must be used within a MeetingProvider');
  }
  return context;
};

interface MeetingProviderProps {
  children: ReactNode;
}

export const MeetingProvider: React.FC<MeetingProviderProps> = ({ children }) => {
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const [currentMeeting, setCurrentMeeting] = useState<Meeting | null>(null);

  const createMeeting = (title: string, hostId: string): Meeting => {
    const newMeeting: Meeting = {
      id: uuidv4(),
      title,
      hostId,
      participants: [hostId],
      createdAt: new Date(),
      isActive: true
    };

    setMeetings(prev => [...prev, newMeeting]);
    return newMeeting;
  };

  const joinMeeting = (meetingId: string, userId: string) => {
    setMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, participants: [...meeting.participants, userId] }
          : meeting
      )
    );
  };

  const leaveMeeting = (meetingId: string, userId: string) => {
    setMeetings(prev => 
      prev.map(meeting => 
        meeting.id === meetingId 
          ? { ...meeting, participants: meeting.participants.filter(id => id !== userId) }
          : meeting
      )
    );
  };

  return (
    <MeetingContext.Provider value={{
      meetings,
      createMeeting,
      joinMeeting,
      leaveMeeting,
      currentMeeting,
      setCurrentMeeting
    }}>
      {children}
    </MeetingContext.Provider>
  );
};