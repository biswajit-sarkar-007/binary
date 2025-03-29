import * as tf from '@tensorflow/tfjs';

export interface SleepAnalysis {
  score: number;
  quality: 'Good' | 'Average' | 'Poor';
  duration: number;
  insights: string[];
  recommendations: string[];
}

// Calculate sleep duration in hours
export const calculateSleepDuration = (bedtime: string, wakeTime: string): number => {
  if (!bedtime || !wakeTime) return 0;
  
  const [bedHour, bedMinute] = bedtime.split(':').map(Number);
  const [wakeHour, wakeMinute] = wakeTime.split(':').map(Number);
  
  let duration = (wakeHour - bedHour) + (wakeMinute - bedMinute) / 60;
  
  // Handle overnight sleep (when wake time is next day)
  if (duration < 0) {
    duration += 24;
  }
  
  return duration;
};

// Generate mock training data for sleep quality prediction
const generateTrainingData = () => {
  const data = [];
  for (let i = 0; i < 100; i++) {
    const duration = 4 + Math.random() * 6; // Random duration between 4-10 hours
    const restlessness = Math.floor(Math.random() * 11); // Random restlessness 0-10
    const quality = duration < 6 || restlessness > 7 ? 0 : 
                    duration < 7 || restlessness > 4 ? 1 : 2;
    data.push({
      features: [duration, restlessness],
      label: quality
    });
  }
  return data;
};

// Create and train a simple neural network
const createModel = async () => {
  const model = tf.sequential({
    layers: [
      tf.layers.dense({ inputShape: [2], units: 8, activation: 'relu' }),
      tf.layers.dense({ units: 3, activation: 'softmax' })
    ]
  });

  model.compile({
    optimizer: tf.train.adam(0.001),
    loss: 'sparseCategoricalCrossentropy',
    metrics: ['accuracy']
  });

  // Generate and prepare training data
  const trainingData = generateTrainingData();
  const xs = tf.tensor2d(trainingData.map(d => d.features));
  const ys = tf.tensor1d(trainingData.map(d => d.label));

  // Train the model
  await model.fit(xs, ys, {
    epochs: 50,
    batchSize: 32,
    shuffle: true,
    verbose: 0
  });

  return model;
};

// Analyze sleep patterns and generate insights
export const analyzeSleep = async (
  duration: number,
  restlessness: number,
  historicalData: { duration: number; restlessness: number }[]
): Promise<SleepAnalysis> => {
  // Calculate base score (0-100)
  let score = 100;
  
  // Deduct points for short or long sleep
  if (duration < 6) score -= 20;
  if (duration > 9) score -= 15;
  
  // Deduct points for restlessness
  score -= restlessness * 5;
  
  // Calculate average duration from historical data
  const avgDuration = historicalData.reduce((acc, curr) => acc + curr.duration, 0) / historicalData.length;
  
  // Generate insights
  const insights: string[] = [];
  if (duration < avgDuration) {
    insights.push('Your sleep duration was shorter than your average');
  } else if (duration > avgDuration) {
    insights.push('Your sleep duration was longer than your average');
  }
  
  if (restlessness > 5) {
    insights.push('You experienced significant restlessness during sleep');
  }
  
  // Generate recommendations
  const recommendations: string[] = [];
  if (duration < 7) {
    recommendations.push('Try to get at least 7-8 hours of sleep');
  }
  if (restlessness > 5) {
    recommendations.push('Consider reducing screen time before bed');
    recommendations.push('Try relaxation exercises before sleep');
  }
  
  // Determine quality
  let quality: 'Good' | 'Average' | 'Poor';
  if (score >= 80) quality = 'Good';
  else if (score >= 60) quality = 'Average';
  else quality = 'Poor';
  
  return {
    score: Math.max(0, Math.min(100, score)),
    quality,
    duration,
    insights,
    recommendations
  };
}; 