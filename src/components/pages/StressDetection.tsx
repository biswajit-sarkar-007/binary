import { useState } from 'react';
import FacialStressDetector from '../../components/stress/FacialStressDetector';
import TypingSpeedDetector from '../../components/stress/TypingSpeedDetector';
import VoiceAnalyzer from '../../components/stress/VoiceAnalyzer';

type DetectionMethod = 'facial' | 'typing' | 'voice';

export default function StressDetection() {
  const [activeMethod, setActiveMethod] = useState<DetectionMethod>('facial');

  const handleStressChange = () => {
    // ... existing code ...
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Stress Detection</h1>
          <p className="mt-2 text-gray-600">
            Choose a method to analyze your stress level
          </p>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <div className="flex justify-center space-x-4 mb-8">
            <button
              onClick={() => setActiveMethod('facial')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeMethod === 'facial'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Facial Analysis
            </button>
            <button
              onClick={() => setActiveMethod('typing')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeMethod === 'typing'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Typing Analysis
            </button>
            <button
              onClick={() => setActiveMethod('voice')}
              className={`px-4 py-2 rounded-md text-sm font-medium ${
                activeMethod === 'voice'
                  ? 'bg-indigo-100 text-indigo-700'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Voice Analysis
            </button>
          </div>

          <div className="mt-8">
            {activeMethod === 'facial' && <FacialStressDetector onStressChange={handleStressChange} />}
            {activeMethod === 'typing' && <TypingSpeedDetector onStressChange={handleStressChange} />}
            {activeMethod === 'voice' && <VoiceAnalyzer onStressChange={handleStressChange} />}
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Tips for Stress Management</h2>
          <ul className="space-y-2 text-gray-600">
            <li>• Take deep breaths and practice mindfulness</li>
            <li>• Take regular breaks from work</li>
            <li>• Exercise regularly</li>
            <li>• Maintain a healthy sleep schedule</li>
            <li>• Practice meditation or yoga</li>
            <li>• Stay hydrated and eat well</li>
            <li>• Connect with friends and family</li>
            <li>• Set realistic goals and boundaries</li>
          </ul>
        </div>
      </div>
    </div>
  );
} 