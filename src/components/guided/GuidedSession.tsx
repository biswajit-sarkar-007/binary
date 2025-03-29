import { useState, useEffect, useRef } from 'react';
import { Recommendation } from '../../services/recommendations';

interface GuidedSessionProps {
  recommendation: Recommendation;
  onComplete: () => void;
}

export default function GuidedSession({ recommendation, onComplete }: GuidedSessionProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(recommendation.duration * 60);
  const speechSynthesisRef = useRef<SpeechSynthesis | null>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    speechSynthesisRef.current = window.speechSynthesis;
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
      speechSynthesisRef.current?.cancel();
    };
  }, []);

  const speak = (text: string) => {
    if (!speechSynthesisRef.current) return;

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.8; // Slow, calm voice
    utterance.pitch = 1.0;
    utterance.volume = 1.0;
    speechSynthesisRef.current.speak(utterance);
  };

  const startSession = () => {
    setIsPlaying(true);
    speak(`Let's begin ${recommendation.title}. ${recommendation.description}`);
    
    // Start timer
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          speak('Session complete. Great job!');
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const pauseSession = () => {
    setIsPlaying(false);
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    speechSynthesisRef.current?.pause();
  };

  const resumeSession = () => {
    setIsPlaying(true);
    timerRef.current = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          if (timerRef.current) {
            clearInterval(timerRef.current);
          }
          setIsPlaying(false);
          speak('Session complete. Great job!');
          onComplete();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    speechSynthesisRef.current?.resume();
  };

  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900">{recommendation.title}</h2>
        <p className="mt-2 text-gray-600">{recommendation.description}</p>
        <div className="mt-4 text-4xl font-mono text-indigo-600">
          {formatTime(timeRemaining)}
        </div>
      </div>

      <div className="flex justify-center space-x-4">
        {!isPlaying ? (
          timeRemaining === recommendation.duration * 60 ? (
            <button
              onClick={startSession}
              className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
            >
              Start Session
            </button>
          ) : (
            <button
              onClick={resumeSession}
              className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
            >
              Resume Session
            </button>
          )
        ) : (
          <button
            onClick={pauseSession}
            className="px-6 py-3 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
          >
            Pause Session
          </button>
        )}
      </div>

      <div className="mt-4">
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
            style={{
              width: `${((recommendation.duration * 60 - timeRemaining) / (recommendation.duration * 60)) * 100}%`
            }}
          ></div>
        </div>
      </div>
    </div>
  );
} 