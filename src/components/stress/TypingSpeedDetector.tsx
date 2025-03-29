import { useState, useRef, useEffect } from 'react';

interface TypingMetrics {
  speed: number;
  errors: number;
  stressScore: number;
}

interface TypingSpeedDetectorProps {
  onStressChange: (stress: number) => void;
}

export default function TypingSpeedDetector({ onStressChange }: TypingSpeedDetectorProps) {
  const [text, setText] = useState('');
  const [metrics, setMetrics] = useState<TypingMetrics>({
    speed: 0,
    errors: 0,
    stressScore: 0
  });
  const startTimeRef = useRef<number | null>(null);
  const previousTextRef = useRef('');

  useEffect(() => {
    if (text.length > 0 && !startTimeRef.current) {
      startTimeRef.current = Date.now();
    }
  }, [text]);

  const calculateMetrics = (currentText: string) => {
    if (!startTimeRef.current) return;

    const timeElapsed = (Date.now() - startTimeRef.current) / 1000; // in seconds
    const speed = currentText.length / timeElapsed; // characters per second

    // Calculate errors by comparing with previous text
    const errors = calculateErrors(previousTextRef.current, currentText);

    // Calculate stress score based on typing patterns
    const stressScore = calculateStressScore(speed, errors);

    setMetrics({
      speed,
      errors,
      stressScore
    });

    onStressChange(stressScore);
    previousTextRef.current = currentText;
  };

  const calculateErrors = (previous: string, current: string): number => {
    // Simple error calculation - can be improved with more sophisticated algorithms
    return Math.abs(previous.length - current.length);
  };

  const calculateStressScore = (speed: number, errors: number): number => {
    // Simplified stress score calculation
    // In reality, you would use more sophisticated analysis
    const baseScore = 50;
    const speedFactor = Math.min(1, speed / 10); // Normalize speed
    const errorFactor = Math.min(1, errors / 5); // Normalize errors

    return Math.min(100, baseScore + (speedFactor * 20) + (errorFactor * 30));
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Type your thoughts...</h3>
        <textarea
          value={text}
          onChange={(e) => {
            setText(e.target.value);
            calculateMetrics(e.target.value);
          }}
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          placeholder="Start typing to analyze your stress level..."
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Typing Speed</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {metrics.speed.toFixed(1)} cps
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Errors</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">{metrics.errors}</p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Stress Level</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {metrics.stressScore.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${metrics.stressScore}%` }}
        ></div>
      </div>
    </div>
  );
} 