import { 
  collection, 
  addDoc, 
  query, 
  where, 
  getDocs, 
  orderBy, 
  limit,
  Timestamp
} from 'firebase/firestore';
import { db } from './firebase';

export interface MeditationSession {
  id?: string;
  userId: string;
  type: 'guided' | 'silent' | 'breathing';
  duration: number;
  completed: boolean;
  timestamp: Date;
  stressLevel?: number;
}

export interface MeditationStats {
  totalSessions: number;
  totalDuration: number;
  averageDuration: number;
  streak: number;
  lastSessionDate: Date | null;
  sessionTypes: {
    guided: number;
    silent: number;
    breathing: number;
  };
}

export const saveSession = async (session: Omit<MeditationSession, 'id'>) => {
  try {
    const docRef = await addDoc(collection(db, 'meditationSessions'), {
      ...session,
      timestamp: Timestamp.fromDate(session.timestamp)
    });
    return docRef.id;
  } catch (error) {
    console.error('Error saving session:', error);
    throw error;
  }
};

export const getRecentSessions = async (userId: string, limitCount: number = 5) => {
  try {
    const q = query(
      collection(db, 'meditationSessions'),
      where('userId', '==', userId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );
    
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as MeditationSession[];
  } catch (error) {
    console.error('Error getting recent sessions:', error);
    throw error;
  }
};

export const getStats = async (userId: string, timeRange: 'week' | 'month' | 'year' = 'week') => {
  try {
    const now = new Date();
    let startDate = new Date();
    
    switch (timeRange) {
      case 'week':
        startDate.setDate(now.getDate() - 7);
        break;
      case 'month':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'year':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
    }

    const q = query(
      collection(db, 'meditationSessions'),
      where('userId', '==', userId),
      where('timestamp', '>=', Timestamp.fromDate(startDate)),
      orderBy('timestamp', 'desc')
    );

    const querySnapshot = await getDocs(q);
    const sessions = querySnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      timestamp: doc.data().timestamp.toDate()
    })) as MeditationSession[];

    // Calculate statistics
    const stats: MeditationStats = {
      totalSessions: sessions.length,
      totalDuration: sessions.reduce((sum, session) => sum + session.duration, 0),
      averageDuration: sessions.length > 0 
        ? sessions.reduce((sum, session) => sum + session.duration, 0) / sessions.length 
        : 0,
      streak: calculateStreak(sessions),
      lastSessionDate: sessions.length > 0 ? sessions[0].timestamp : null,
      sessionTypes: {
        guided: sessions.filter(s => s.type === 'guided').length,
        silent: sessions.filter(s => s.type === 'silent').length,
        breathing: sessions.filter(s => s.type === 'breathing').length
      }
    };

    return stats;
  } catch (error) {
    console.error('Error getting stats:', error);
    throw error;
  }
};

const calculateStreak = (sessions: MeditationSession[]): number => {
  if (sessions.length === 0) return 0;

  let streak = 1;
  let currentDate = new Date(sessions[0].timestamp);
  currentDate.setHours(0, 0, 0, 0);

  for (let i = 1; i < sessions.length; i++) {
    const sessionDate = new Date(sessions[i].timestamp);
    sessionDate.setHours(0, 0, 0, 0);

    const diffDays = Math.floor((currentDate.getTime() - sessionDate.getTime()) / (1000 * 60 * 60 * 24));
    
    if (diffDays === 1) {
      streak++;
      currentDate = sessionDate;
    } else if (diffDays > 1) {
      break; // Streak broken
    }
  }

  return streak;
}; 