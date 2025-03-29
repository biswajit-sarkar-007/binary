import { useEffect, useState } from 'react';

interface TypingStressDetectorProps {
  onStressChange: (stress: number) => void;
}

export default function TypingStressDetector({ onStressChange }: TypingStressDetectorProps) {
  const [typingSpeed, setTypingSpeed] = useState<number>(0);
  const [keyPressTimes, setKeyPressTimes] = useState<number[]>([]);

  useEffect(() => {
    const handleKeyPress = (event: KeyboardEvent) => {
      const currentTime = Date.now();
      setKeyPressTimes(prev => {
        const newTimes = [...prev, currentTime];
        // Keep only last 10 keypresses
        return newTimes.slice(-10);
      });
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, []);

  useEffect(() => {
    if (keyPressTimes.length >= 2) {
      const intervals = [];
      for (let i = 1; i < keyPressTimes.length; i++) {
        intervals.push(keyPressTimes[i] - keyPressTimes[i - 1]);
      }
      const avgInterval = intervals.reduce((a, b) => a + b, 0) / intervals.length;
      const speed = 1000 / avgInterval; // keys per second
      setTypingSpeed(speed);

      // Calculate stress based on typing speed
      // Normalize speed to stress level (0-100)
      const normalizedSpeed = Math.min(1, speed / 10); // Assuming 10 keys per second is max
      const stress = normalizedSpeed * 100;
      onStressChange(stress);
    }
  }, [keyPressTimes, onStressChange]);

  return (
    <div className="text-center">
      <p className="text-lg font-medium text-gray-900">
        Typing Speed: {typingSpeed.toFixed(1)} keys/s
      </p>
      <div className="w-full bg-gray-200 rounded-full h-2.5 mt-2">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${typingSpeed * 10}%` }}
        ></div>
      </div>
    </div>
  );
} 