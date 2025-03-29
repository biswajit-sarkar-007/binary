import { useState } from 'react';
import FacialStressDetector from './FacialStressDetector';
import TypingStressDetector from './TypingSpeedDetector';
import VoiceStressDetector from './VoiceStressDetector';

interface StressData {
  facial: number;
  typing: number;
  voice: number;
  timestamp: number;
}

export default function StressDetection() {
  const [stressHistory, setStressHistory] = useState<StressData[]>([]);
  const [currentStress, setCurrentStress] = useState<StressData>({
    facial: 0,
    typing: 0,
    voice: 0,
    timestamp: Date.now()
  });

  const handleStressChange = (type: 'facial' | 'typing' | 'voice', value: number) => {
    setCurrentStress(prev => {
      const newStress = {
        ...prev,
        [type]: value,
        timestamp: Date.now()
      };
      
      // Update stress history
      setStressHistory(prevHistory => {
        const newHistory = [...prevHistory, newStress];
        // Keep only last 24 hours of data
        const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
        return newHistory.filter(data => data.timestamp > oneDayAgo);
      });
      
      return newStress;
    });
  };

  const calculateOverallStress = (): number => {
    const { facial, typing, voice } = currentStress;
    // Weight the different stress indicators
    return (facial * 0.4 + typing * 0.3 + voice * 0.3);
  };

  const getStressLevel = (stress: number): string => {
    if (stress < 30) return 'Low';
    if (stress < 60) return 'Medium';
    if (stress < 80) return 'High';
    return 'Very High';
  };

  const getStressColor = (stress: number): string => {
    if (stress < 30) return 'bg-green-500';
    if (stress < 60) return 'bg-yellow-500';
    if (stress < 80) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Stress Detection</h2>
        <p className="text-gray-600">
          Monitor your stress levels through facial expressions, typing patterns, and voice analysis
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Facial Analysis</h3>
          <FacialStressDetector onStressChange={(value) => handleStressChange('facial', value)} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Typing Analysis</h3>
          <TypingStressDetector onStressChange={(value: number) => handleStressChange('typing', value)} />
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Voice Analysis</h3>
          <VoiceStressDetector onStressChange={(value: number) => handleStressChange('voice', value)} />
        </div>
      </div>

      <div className="bg-white p-6 rounded-lg shadow-md">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Overall Stress Level</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-gray-700">Current Stress Level:</span>
            <span className={`px-3 py-1 rounded-full text-white ${getStressColor(calculateOverallStress())}`}>
              {getStressLevel(calculateOverallStress())}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div
              className={`${getStressColor(calculateOverallStress())} h-2.5 rounded-full transition-all duration-300`}
              style={{ width: `${calculateOverallStress()}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-sm text-gray-600">
            <div>
              <p>Facial: {currentStress.facial.toFixed(1)}%</p>
            </div>
            <div>
              <p>Typing: {currentStress.typing.toFixed(1)}%</p>
            </div>
            <div>
              <p>Voice: {currentStress.voice.toFixed(1)}%</p>
            </div>
          </div>
        </div>
      </div>

      {stressHistory.length > 0 && (
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Stress History</h3>
          <div className="space-y-2">
            {stressHistory.slice(-5).map((data) => {
              const historicalStress = (data.facial * 0.4 + data.typing * 0.3 + data.voice * 0.3);
              return (
                <div key={data.timestamp} className="flex items-center justify-between">
                  <span className="text-gray-600">
                    {new Date(data.timestamp).toLocaleTimeString()}
                  </span>
                  <span className={`px-2 py-1 rounded-full text-white ${getStressColor(historicalStress)}`}>
                    {getStressLevel(historicalStress)}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
} 