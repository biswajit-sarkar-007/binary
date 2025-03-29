import { useState, useEffect } from 'react';
import { Clock, Activity, Flame, Calendar } from 'lucide-react';
import { collection, query, orderBy, onSnapshot, Timestamp, addDoc, getDocs } from 'firebase/firestore';
import { db } from '../../services/firebase2';

interface MeditationSession {
  id: string;
  type: 'guided' | 'breathing' | 'silent';
  duration: number;
  completed: boolean;
  timestamp: Date;
  stressLevel: number;
}

interface MeditationStats {
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
  averageStressLevel: number;
}

type TimeRange = 'week' | 'month' | 'year';

export default function Reports() {
  const [timeRange, setTimeRange] = useState<TimeRange>('week');
  const [stats, setStats] = useState<MeditationStats | null>(null);
  const [recentSessions, setRecentSessions] = useState<MeditationSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Set up real-time listener for recent sessions
    const sessionsQuery = query(
      collection(db, 'meditationSessions'),
      orderBy('timestamp', 'desc')
    );

    const unsubscribeSessions = onSnapshot(sessionsQuery, 
      (snapshot) => {
        const sessions = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
          timestamp: doc.data().timestamp.toDate()
        })) as MeditationSession[];
        setRecentSessions(sessions.slice(0, 5)); // Get last 5 sessions
        setLoading(false);

        // Calculate stats
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

        const filteredSessions = sessions.filter(
          session => session.timestamp >= startDate
        );

        const stats: MeditationStats = {
          totalSessions: filteredSessions.length,
          totalDuration: filteredSessions.reduce((sum, session) => sum + session.duration, 0),
          averageDuration: filteredSessions.length > 0 
            ? filteredSessions.reduce((sum, session) => sum + session.duration, 0) / filteredSessions.length 
            : 0,
          streak: calculateStreak(filteredSessions),
          lastSessionDate: filteredSessions.length > 0 ? filteredSessions[0].timestamp : null,
          sessionTypes: {
            guided: filteredSessions.filter(s => s.type === 'guided').length,
            silent: filteredSessions.filter(s => s.type === 'silent').length,
            breathing: filteredSessions.filter(s => s.type === 'breathing').length
          },
          averageStressLevel: filteredSessions.length > 0
            ? filteredSessions.reduce((sum, session) => sum + session.stressLevel, 0) / filteredSessions.length
            : 0
        };

        setStats(stats);
      },
      (err) => {
        console.error('Error listening to sessions:', err);
        setError('Failed to load meditation data');
        setLoading(false);
      }
    );

    return () => {
      unsubscribeSessions();
    };
  }, [timeRange]);

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
        break;
      }
    }

    return streak;
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">{error}</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Meditation Statistics</h2>
        <div className="flex space-x-4 mb-4">
          <button
            onClick={() => setTimeRange('week')}
            className={`px-4 py-2 rounded ${
              timeRange === 'week' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Week
          </button>
          <button
            onClick={() => setTimeRange('month')}
            className={`px-4 py-2 rounded ${
              timeRange === 'month' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Month
          </button>
          <button
            onClick={() => setTimeRange('year')}
            className={`px-4 py-2 rounded ${
              timeRange === 'year' ? 'bg-indigo-600 text-white' : 'bg-gray-200'
            }`}
          >
            Year
          </button>
        </div>
      </div>

      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Clock className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Time</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(stats.totalDuration)} min
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Activity className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Sessions</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalSessions}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Flame className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Current Streak</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.streak} days
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Calendar className="h-8 w-8 text-indigo-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Avg. Stress Level</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {Math.round(stats.averageStressLevel)}%
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      <div>
        <h3 className="text-xl font-bold text-gray-900 mb-4">Recent Sessions</h3>
        <div className="bg-white shadow overflow-hidden sm:rounded-md">
          <ul className="divide-y divide-gray-200">
            {recentSessions.map((session) => (
              <li key={session.id} className="px-6 py-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {session.type.charAt(0).toUpperCase() + session.type.slice(1)} Meditation
                    </p>
                    <p className="text-sm text-gray-500">
                      {session.timestamp.toLocaleDateString()} - {session.duration} minutes
                    </p>
                  </div>
                  <div className="text-sm text-gray-500">
                    Stress Level: {session.stressLevel}%
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
} 