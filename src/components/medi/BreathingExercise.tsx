import { useState, useEffect, useRef } from 'react';
import { Play, Pause, RefreshCw } from 'lucide-react';

const BreathingExercise = () => {
  const [isActive, setIsActive] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentPhase, setCurrentPhase] = useState('inhale');
  const [progress, setProgress] = useState(0);
  const [cycleCount, setCycleCount] = useState(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const animationRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
    };
  }, []);

  const startAnimation = (duration: number) => {
    const startTime = performance.now();
    const animate = (currentTime: number) => {
      const elapsed = currentTime - startTime;
      const newProgress = (elapsed / duration) * 100;
      setProgress(Math.min(newProgress, 100));

      if (elapsed < duration) {
        animationRef.current = requestAnimationFrame(animate);
      }
    };
    animationRef.current = requestAnimationFrame(animate);
  };

  const cycle = () => {
    setIsActive(true);
    setIsPlaying(true);
    setCycleCount(prev => prev + 1);

    // Inhale phase (4 seconds)
    setCurrentPhase('inhale');
    startAnimation(4000);
    timerRef.current = setTimeout(() => {
      // Hold phase (7 seconds)
      setCurrentPhase('hold');
      startAnimation(7000);
      timerRef.current = setTimeout(() => {
        // Exhale phase (8 seconds)
        setCurrentPhase('exhale');
        startAnimation(8000);
        timerRef.current = setTimeout(() => {
          // Reset for next cycle
          setProgress(0);
          if (isPlaying) {
            cycle();
          } else {
            setIsActive(false);
          }
        }, 8000);
      }, 7000);
    }, 4000);
  };

  const stopCycle = () => {
    setIsPlaying(false);
    setIsActive(false);
    if (timerRef.current) {
      clearTimeout(timerRef.current);
    }
    if (animationRef.current) {
      cancelAnimationFrame(animationRef.current);
    }
    setProgress(0);
  };

  const resetExercise = () => {
    stopCycle();
    setCycleCount(0);
    setCurrentPhase('inhale');
  };

  const getPhaseDetails = () => {
    switch (currentPhase) {
      case 'inhale':
        return {
          duration: 4,
          text: 'Inhale',
          color: 'text-blue-600',
          bgColor: 'bg-blue-600',
          instruction: 'Breathe in slowly through your nose'
        };
      case 'hold':
        return {
          duration: 7,
          text: 'Hold',
          color: 'text-green-600',
          bgColor: 'bg-green-600',
          instruction: 'Hold your breath'
        };
      case 'exhale':
        return {
          duration: 8,
          text: 'Exhale',
          color: 'text-purple-600',
          bgColor: 'bg-purple-600',
          instruction: 'Breathe out slowly through your mouth'
        };
      default:
        return {
          duration: 4,
          text: 'Inhale',
          color: 'text-blue-600',
          bgColor: 'bg-blue-600',
          instruction: 'Breathe in slowly through your nose'
        };
    }
  };

  const phaseDetails = getPhaseDetails();

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">4-7-8 Breathing Technique</h2>
        <p className="text-gray-600 mb-4">
          This breathing pattern can help reduce anxiety and help you sleep better. Inhale for 4 seconds,
          hold for 7 seconds, and exhale for 8 seconds.
        </p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="relative w-48 h-48 mx-auto mb-8">
          <div className="absolute inset-0 rounded-full border-4 border-gray-200"></div>
          <div
            className={`absolute inset-0 rounded-full border-4 ${phaseDetails.bgColor} transition-all duration-300`}
            style={{
              clipPath: `polygon(50% 50%, 50% 0%, ${progress}% 0%, ${progress}% 100%, 50% 100%, 50% 50%)`,
              transform: `rotate(${progress * 3.6}deg)`,
            }}
          ></div>
          <div className="absolute inset-0 flex items-center justify-center">
            <div>
              <p className={`text-3xl font-bold ${phaseDetails.color}`}>{phaseDetails.text}</p>
              <p className="text-gray-500 text-sm mt-2">{phaseDetails.duration} seconds</p>
              <p className="text-sm text-gray-600 mt-1">{phaseDetails.instruction}</p>
            </div>
          </div>
        </div>

        <div className="flex justify-center space-x-4">
          {!isActive ? (
            <button
              onClick={cycle}
              className="flex items-center px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <Play className="h-5 w-5 mr-2" /> Start Breathing
            </button>
          ) : (
            <button
              onClick={stopCycle}
              className="flex items-center px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
            >
              <Pause className="h-5 w-5 mr-2" /> Stop
            </button>
          )}
          <button
            onClick={resetExercise}
            className="flex items-center px-6 py-3 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
          >
            <RefreshCw className="h-5 w-5 mr-2" /> Reset
          </button>
        </div>

        {cycleCount > 0 && (
          <div className="mt-4 text-sm text-gray-600">
            Completed cycles: {cycleCount}
          </div>
        )}
      </div>
    </div>
  );
};

export default BreathingExercise;