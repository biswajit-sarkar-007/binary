import * as tf from '@tensorflow/tfjs';

export interface StressAnalysis {
  avgStress: number;
  isIncreasing: boolean;
  trend: string;
  lastWeekData: Array<{
    date: Date;
    stress: number;
    sleep: number;
    screenTime: number;
  }>;
}

export const analyzeStress = (data: Array<{
  timestamp: Date;
  stress: number;
  sleep: number;
  screenTime: number;
}>): StressAnalysis => {
  // Sort data by timestamp
  const sortedData = [...data].sort((a, b) => 
    a.timestamp.getTime() - b.timestamp.getTime()
  );

  // Get stress levels
  const stressLevels = sortedData.map(entry => entry.stress);
  
  // Convert to tensor for analysis
  const tensor = tf.tensor1d(stressLevels);
  
  // Calculate average stress
  const avgStress = tensor.mean().dataSync()[0];
  
  // Check if stress is increasing
  const isIncreasing = stressLevels.length > 1 && 
    stressLevels[stressLevels.length - 1] > avgStress;

  // Determine trend message
  const trend = isIncreasing 
    ? "Stress levels are trending upward" 
    : "Stress levels are stable or decreasing";

  // Clean up tensor to prevent memory leaks
  tensor.dispose();

  return {
    avgStress,
    isIncreasing,
    trend,
    lastWeekData: sortedData.map(entry => ({
      date: entry.timestamp,
      stress: entry.stress,
      sleep: entry.sleep,
      screenTime: entry.screenTime
    }))
  };
}; 