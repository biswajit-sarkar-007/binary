import React, { useState } from 'react';
import { Camera, Mic, Keyboard, AlertCircle } from 'lucide-react';

const StressDetection = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const startAnalysis = () => {
    setIsAnalyzing(true);
    // Here we would implement the actual stress detection logic
    setTimeout(() => setIsAnalyzing(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">AI Stress Detection</h2>
        <p className="text-gray-600">
          Our AI system analyzes multiple factors to detect your stress levels and provide personalized recommendations.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Facial Analysis</h3>
            <Camera className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 mb-4">Detects stress indicators through facial expressions</p>
          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Camera preview</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Voice Analysis</h3>
            <Mic className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 mb-4">Analyzes voice patterns for stress indicators</p>
          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Voice visualization</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Typing Analysis</h3>
            <Keyboard className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-gray-600 mb-4">Measures typing patterns and pressure</p>
          <div className="relative h-40 bg-gray-100 rounded-lg overflow-hidden">
            <div className="absolute inset-0 flex items-center justify-center">
              <p className="text-gray-500">Typing metrics</p>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-lg font-medium text-gray-900">Start Analysis</h3>
            <p className="text-gray-600">Click to begin a comprehensive stress analysis</p>
          </div>
          <button
            onClick={startAnalysis}
            disabled={isAnalyzing}
            className={`px-6 py-3 rounded-lg transition-colors ${
              isAnalyzing
                ? 'bg-gray-200 text-gray-500'
                : 'bg-indigo-600 text-white hover:bg-indigo-700'
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Begin Analysis'}
          </button>
        </div>

        {isAnalyzing && (
          <div className="flex items-center p-4 bg-blue-50 rounded-lg">
            <AlertCircle className="h-5 w-5 text-blue-600 mr-2" />
            <p className="text-blue-600">Analyzing your stress levels... Please maintain your position.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default StressDetection;