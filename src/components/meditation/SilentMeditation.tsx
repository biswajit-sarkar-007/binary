import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

interface SilentMeditationProps {
  duration: number;
  onComplete: () => void;
}

const SilentMeditation: React.FC<SilentMeditationProps> = ({ duration, onComplete }) => {
  const [timeRemaining, setTimeRemaining] = useState(duration * 60);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const startTimeRef = useRef<number | null>(null);
  const pausedTimeRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, []);

  const startSession = () => {
    setIsPlaying(true);
    setIsPaused(false);
    startTimeRef.current = Date.now();
    pausedTimeRef.current = null;

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseSession = () => {
    setIsPaused(true);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    pausedTimeRef.current = Date.now();
  };

  const resumeSession = () => {
    setIsPaused(false);
    if (startTimeRef.current && pausedTimeRef.current) {
      const pauseDuration = pausedTimeRef.current - startTimeRef.current;
      startTimeRef.current = Date.now() - pauseDuration;
    }

    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const resetSession = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setIsPlaying(false);
    setIsPaused(false);
    setTimeRemaining(duration * 60);
    startTimeRef.current = null;
    pausedTimeRef.current = null;
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Silent Meditation</h2>
        <p className="text-gray-600 mb-4">
          Find a quiet space and focus on your breath. Let thoughts come and go without judgment.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div
            className="absolute inset-0 rounded-full border-4 border-indigo-600 transition-all duration-300"
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${((duration * 60 - timeRemaining) / (duration * 60)) * 100}% 0%, ${((duration * 60 - timeRemaining) / (duration * 60)) * 100}% 100%, 50% 100%, 50% 50%)`,
              transform: `rotate(${((duration * 60 - timeRemaining) / (duration * 60)) * 360}deg)`,
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className="text-3xl font-bold text-indigo-600">{formatTime(timeRemaining)}</p>
              <p className="text-gray-500 text-sm mt-2">Time Remaining</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isPlaying ? (
            <button
              onClick={startSession}
              className="flex items-center px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" /> Start Meditation
            </button>
          ) : isPaused ? (
            <button
              onClick={resumeSession}
              className="flex items-center px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" /> Resume
            </button>
          ) : (
            <button
              onClick={pauseSession}
              className="flex items-center px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
            >
              <Pause className="h-5 w-5 mr-2" /> Pause
            </button>
          )}
          <button
            onClick={resetSession}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" /> Reset
          </button>
        </div>

        <div className="mt-4">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
              style={{
                width: `${((duration * 60 - timeRemaining) / (duration * 60)) * 100}%`
              }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SilentMeditation; 