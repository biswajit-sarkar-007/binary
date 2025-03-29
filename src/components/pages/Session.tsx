import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import BreathingExercise from '../medi/BreathingExercise';
import SilentMeditation from '../../components/meditation/SilentMeditation';
import GuidedSession from '../../components/guided/GuidedSession';
import { Recommendation } from '../../services/recommendations';
import { saveSession } from '../../services/meditationService';
import { auth } from '../../services/firebase2';

type SessionType = 'guided' | 'silent' | 'breathing';

export default function Session() {
  const [selectedType, setSelectedType] = useState<SessionType | null>(null);
  const [duration, setDuration] = useState(5); // minutes
  const [isSessionActive, setIsSessionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleStartSession = () => {
    if (selectedType) {
      setIsSessionActive(true);
      setError(null);
    }
  };

  const handleSessionComplete = async () => {
    try {
      const userId = auth.currentUser?.uid;
      if (!userId) {
        throw new Error('User not authenticated');
      }

      await saveSession({
        userId,
        type: selectedType!,
        duration,
        completed: true,
        timestamp: new Date()
      });

      setIsSessionActive(false);
      navigate('/reports');
    } catch (error) {
      console.error('Error saving session:', error);
      setError(error instanceof Error ? error.message : 'Failed to save session');
    }
  };

  const getSessionComponent = () => {
    if (!isSessionActive) return null;

    switch (selectedType) {
      case 'guided':
        const guidedRecommendation: Recommendation = {
          type: 'meditation',
          title: 'Guided Meditation',
          description: 'Follow along with guided instructions for a mindful meditation session.',
          duration: duration,
          intensity: 'low'
        };
        return (
          <GuidedSession
            recommendation={guidedRecommendation}
            onComplete={handleSessionComplete}
          />
        );
      case 'silent':
        return (
          <SilentMeditation
            duration={duration}
            onComplete={handleSessionComplete}
          />
        );
      case 'breathing':
        return <BreathingExercise />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Meditation Session</h1>
          <p className="mt-2 text-gray-600">Choose your session type and duration</p>
        </div>

        {error && (
          <div className="mb-4 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative">
            <span className="block sm:inline">{error}</span>
            <button
              onClick={() => setError(null)}
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
            >
              <span className="sr-only">Dismiss</span>
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        )}

        {!isSessionActive ? (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-medium text-gray-900 mb-4">Session Type</h2>
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                  <button
                    onClick={() => setSelectedType('guided')}
                    className={`p-4 rounded-lg border ${
                      selectedType === 'guided'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    Guided Meditation
                  </button>
                  <button
                    onClick={() => setSelectedType('silent')}
                    className={`p-4 rounded-lg border ${
                      selectedType === 'silent'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    Silent Meditation
                  </button>
                  <button
                    onClick={() => setSelectedType('breathing')}
                    className={`p-4 rounded-lg border ${
                      selectedType === 'breathing'
                        ? 'border-indigo-500 bg-indigo-50'
                        : 'border-gray-200 hover:border-indigo-300'
                    }`}
                  >
                    Breathing Exercise
                  </button>
                </div>
              </div>

              {selectedType !== 'breathing' && (
                <div>
                  <h2 className="text-lg font-medium text-gray-900 mb-4">Duration (minutes)</h2>
                  <select
                    value={duration}
                    onChange={(e) => setDuration(Number(e.target.value))}
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                  >
                    {[5, 10, 15, 20, 30].map((time) => (
                      <option key={time} value={time}>
                        {time} minutes
                      </option>
                    ))}
                  </select>
                </div>
              )}

              <div className="flex justify-end space-x-4">
                <Link
                  to="/"
                  className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50"
                >
                  Cancel
                </Link>
                <button
                  onClick={handleStartSession}
                  disabled={!selectedType}
                  className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Start Session
                </button>
              </div>
            </div>
          </div>
        ) : (
          getSessionComponent()
        )}
      </div>
    </div>
  );
} 