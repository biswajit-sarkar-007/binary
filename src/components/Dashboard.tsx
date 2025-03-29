import React, { useEffect, useState } from 'react';
import { Activity, Moon, Monitor, TrendingUp, ArrowUp, ArrowDown, Minus } from 'lucide-react';
import { StressChart } from './StressChart';
import { RecommendationsDisplay } from './Recommendations';
import { StressData } from '../services/firebaseService';

interface DashboardProps {
  data: StressData[];
}

export const Dashboard: React.FC<DashboardProps> = ({ data }) => {
  const [analysis, setAnalysis] = useState<{
    averageStress: number;
    averageSleep: number;
    averageScreenTime: number;
    trend: 'increasing' | 'decreasing' | 'stable';
    stressChange: number;
    sleepChange: number;
  }>({
    averageStress: 0,
    averageSleep: 0,
    averageScreenTime: 0,
    trend: 'stable',
    stressChange: 0,
    sleepChange: 0,
  });

  useEffect(() => {
    if (data.length === 0) return;

    // Calculate averages
    const avgStress = data.reduce((sum, entry) => sum + entry.stressLevel, 0) / data.length;
    const avgSleep = data.reduce((sum, entry) => sum + entry.sleepHours, 0) / data.length;
    const avgScreenTime = data.reduce((sum, entry) => sum + entry.screenTime, 0) / data.length;

    // Calculate changes
    let stressChange = 0;
    let sleepChange = 0;
    if (data.length >= 2) {
      const recentData = data.slice(0, 2);
      stressChange = recentData[0].stressLevel - recentData[1].stressLevel;
      sleepChange = recentData[0].sleepHours - recentData[1].sleepHours;
    }

    // Determine trend
    let trend: 'increasing' | 'decreasing' | 'stable' = 'stable';
    if (Math.abs(stressChange) > 0.5) {
      trend = stressChange > 0 ? 'increasing' : 'decreasing';
    }

    setAnalysis({
      averageStress: Number(avgStress.toFixed(1)),
      averageSleep: Number(avgSleep.toFixed(1)),
      averageScreenTime: Number(avgScreenTime.toFixed(1)),
      trend,
      stressChange: Number(stressChange.toFixed(1)),
      sleepChange: Number(sleepChange.toFixed(1)),
    });
  }, [data]);

  if (data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Dashboard</h2>
        <p className="text-gray-600 text-center py-4">No data available yet. Start by logging your stress levels!</p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Activity className="w-6 h-6 text-red-500" />
            <h3 className="text-lg font-semibold text-gray-800">Average Stress</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{analysis.averageStress}</p>
            <p className="text-sm text-gray-500">/10</p>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {analysis.stressChange !== 0 && (
              <>
                {analysis.stressChange > 0 ? (
                  <ArrowUp className="w-4 h-4 text-red-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-green-500" />
                )}
                <span className={`text-sm ${
                  analysis.stressChange > 0 ? 'text-red-500' : 'text-green-500'
                }`}>
                  {Math.abs(analysis.stressChange)} from last entry
                </span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Moon className="w-6 h-6 text-indigo-500" />
            <h3 className="text-lg font-semibold text-gray-800">Average Sleep</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{analysis.averageSleep}</p>
            <p className="text-sm text-gray-500">hours</p>
          </div>
          <div className="flex items-center gap-1 mt-2">
            {analysis.sleepChange !== 0 && (
              <>
                {analysis.sleepChange > 0 ? (
                  <ArrowUp className="w-4 h-4 text-green-500" />
                ) : (
                  <ArrowDown className="w-4 h-4 text-red-500" />
                )}
                <span className={`text-sm ${
                  analysis.sleepChange > 0 ? 'text-green-500' : 'text-red-500'
                }`}>
                  {Math.abs(analysis.sleepChange)} hours from last entry
                </span>
              </>
            )}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center gap-3 mb-4">
            <Monitor className="w-6 h-6 text-blue-500" />
            <h3 className="text-lg font-semibold text-gray-800">Average Screen Time</h3>
          </div>
          <div className="flex items-baseline gap-2">
            <p className="text-3xl font-bold text-gray-900">{analysis.averageScreenTime}</p>
            <p className="text-sm text-gray-500">hours</p>
          </div>
          <p className="text-sm text-gray-500 mt-2">per day</p>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <TrendingUp className="w-6 h-6 text-green-500" />
          <h3 className="text-lg font-semibold text-gray-800">Stress Trend</h3>
        </div>
        <div className="flex items-center gap-2">
          {analysis.trend === 'increasing' ? (
            <ArrowUp className="w-6 h-6 text-red-500" />
          ) : analysis.trend === 'decreasing' ? (
            <ArrowDown className="w-6 h-6 text-green-500" />
          ) : (
            <Minus className="w-6 h-6 text-yellow-500" />
          )}
          <span className={`text-lg font-medium ${
            analysis.trend === 'increasing' ? 'text-red-500' :
            analysis.trend === 'decreasing' ? 'text-green-500' :
            'text-yellow-500'
          }`}>
            {analysis.trend.charAt(0).toUpperCase() + analysis.trend.slice(1)}
          </span>
        </div>
      </div>

      <StressChart data={data} />
      <RecommendationsDisplay
        stressLevel={data[0].stressLevel}
        sleepHours={data[0].sleepHours}
        screenTime={data[0].screenTime}
      />
    </div>
  );
}; 