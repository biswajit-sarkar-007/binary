import React from 'react';
import { Activity, Moon, Monitor, AlertCircle } from 'lucide-react';
import { generateRecommendations } from '../utils/recommendations';

interface RecommendationsProps {
  stressLevel: number;
  sleepHours: number;
  screenTime: number;
}

export const RecommendationsDisplay: React.FC<RecommendationsProps> = ({
  stressLevel,
  sleepHours,
  screenTime,
}) => {
  const recommendations = generateRecommendations(stressLevel, sleepHours, screenTime);

  const getIcon = (type: string) => {
    switch (type) {
      case 'stress':
        return <Activity className="w-5 h-5 text-red-500" />;
      case 'sleep':
        return <Moon className="w-5 h-5 text-indigo-500" />;
      case 'screen':
        return <Monitor className="w-5 h-5 text-blue-500" />;
      default:
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
    }
  };

  if (recommendations.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h2>
        <div className="bg-green-50 border border-green-100 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <div className="mt-1">
              <span className="text-2xl">🌟</span>
            </div>
            <div>
              <p className="text-gray-800">Your current metrics look good! Keep up the healthy habits!</p>
              <p className="text-sm text-gray-500 mt-1">Current Status:</p>
              <ul className="text-sm text-gray-600 mt-1 space-y-1">
                <li>• Stress Level: {stressLevel}/10</li>
                <li>• Sleep: {sleepHours} hours</li>
                <li>• Screen Time: {screenTime} hours</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Recommendations</h2>
      <div className="space-y-4">
        {recommendations.map((rec, index) => (
          <div
            key={index}
            className={`p-4 rounded-lg ${
              rec.priority === 'high'
                ? 'bg-red-50 border border-red-100'
                : rec.priority === 'medium'
                ? 'bg-yellow-50 border border-yellow-100'
                : 'bg-green-50 border border-green-100'
            }`}
          >
            <div className="flex items-start gap-3">
              <div className="mt-1">{getIcon(rec.type)}</div>
              <div>
                <p className="text-gray-800">{rec.message}</p>
                <div className="mt-2">
                  <p className="text-sm text-gray-500">Current Status:</p>
                  <ul className="text-sm text-gray-600 mt-1 space-y-1">
                    {rec.type === 'stress' && <li>• Stress Level: {stressLevel}/10</li>}
                    {rec.type === 'sleep' && <li>• Sleep: {sleepHours} hours</li>}
                    {rec.type === 'screen' && <li>• Screen Time: {screenTime} hours</li>}
                  </ul>
                </div>
                <span className={`inline-block mt-2 text-sm font-medium ${
                  rec.priority === 'high'
                    ? 'text-red-600'
                    : rec.priority === 'medium'
                    ? 'text-yellow-600'
                    : 'text-green-600'
                }`}>
                  {rec.priority === 'high'
                    ? 'High Priority'
                    : rec.priority === 'medium'
                    ? 'Medium Priority'
                    : 'Low Priority'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}; 