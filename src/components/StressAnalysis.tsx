import React from 'react';
import { Activity, TrendingUp, TrendingDown } from 'lucide-react';
import { StressAnalysis } from '../utils/stressAnalysis';

interface StressAnalysisProps {
  analysis: StressAnalysis;
}

export const StressAnalysisDisplay: React.FC<StressAnalysisProps> = ({ analysis }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">Stress Analysis</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Activity className="w-5 h-5 text-indigo-600" />
            <h3 className="font-medium text-gray-700">Average Stress Level</h3>
          </div>
          <p className="text-3xl font-bold text-indigo-600">
            {analysis.avgStress.toFixed(1)}
          </p>
          <p className="text-sm text-gray-500">out of 10</p>
        </div>

        <div className="bg-indigo-50 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            {analysis.isIncreasing ? (
              <TrendingUp className="w-5 h-5 text-red-500" />
            ) : (
              <TrendingDown className="w-5 h-5 text-green-500" />
            )}
            <h3 className="font-medium text-gray-700">Trend</h3>
          </div>
          <p className={`text-lg font-medium ${
            analysis.isIncreasing ? 'text-red-500' : 'text-green-500'
          }`}>
            {analysis.trend}
          </p>
        </div>
      </div>

      <div className="mt-6">
        <h3 className="font-medium text-gray-700 mb-3">Last Week's Data</h3>
        <div className="space-y-2">
          {analysis.lastWeekData.map((entry, index) => (
            <div key={index} className="flex justify-between items-center py-2 border-b border-gray-100">
              <div>
                <p className="text-sm text-gray-600">
                  {entry.date.toLocaleDateString()}
                </p>
                <p className="text-sm text-gray-500">
                  Sleep: {entry.sleep}h | Screen Time: {entry.screenTime}h
                </p>
              </div>
              <div className="flex items-center gap-2">
                <Activity className="w-4 h-4 text-indigo-600" />
                <span className="font-medium text-indigo-600">{entry.stress}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}; 