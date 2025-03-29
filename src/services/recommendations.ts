interface StressIndicators {
  facialStress?: number;
  typingStress?: number;
  voiceStress?: number;
  sentiment?: number;
}

export interface Recommendation {
  type: 'exercise' | 'meditation' | 'breathing';
  title: string;
  description: string;
  duration: number;
  intensity: 'low' | 'medium' | 'high';
}

const exercises: Recommendation[] = [
  {
    type: 'breathing',
    title: 'Deep Breathing',
    description: 'Take slow, deep breaths to calm your mind and reduce stress.',
    duration: 5,
    intensity: 'low'
  },
  {
    type: 'breathing',
    title: 'Box Breathing',
    description: 'Inhale, hold, exhale, and hold again in equal counts.',
    duration: 10,
    intensity: 'medium'
  },
  {
    type: 'meditation',
    title: 'Mindful Pause',
    description: 'Take a moment to observe your thoughts without judgment.',
    duration: 5,
    intensity: 'low'
  },
  {
    type: 'meditation',
    title: 'Body Scan',
    description: 'Focus on different parts of your body, releasing tension.',
    duration: 15,
    intensity: 'medium'
  },
  {
    type: 'exercise',
    title: 'Quick Stretch',
    description: 'Simple stretches to release physical tension.',
    duration: 5,
    intensity: 'low'
  },
  {
    type: 'exercise',
    title: 'Desk Yoga',
    description: 'Gentle yoga poses you can do at your desk.',
    duration: 10,
    intensity: 'medium'
  }
];

export function getPersonalizedRecommendations(indicators: StressIndicators): Recommendation[] {
  // Calculate overall stress level
  const stressLevels = [
    indicators.facialStress,
    indicators.typingStress,
    indicators.voiceStress
  ].filter((level): level is number => level !== undefined);

  const averageStress = stressLevels.length > 0
    ? stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length
    : 0;

  // Adjust recommendations based on stress level
  let recommendations: Recommendation[] = [];

  if (averageStress > 70) {
    // High stress - focus on immediate relief
    recommendations = exercises
      .filter(ex => ex.intensity === 'low' && ex.duration <= 5)
      .slice(0, 2);
  } else if (averageStress > 40) {
    // Medium stress - mix of immediate and longer-term solutions
    recommendations = exercises
      .filter(ex => ex.intensity === 'medium' || ex.duration <= 10)
      .slice(0, 3);
  } else {
    // Low stress - focus on prevention and maintenance
    recommendations = exercises
      .filter(ex => ex.intensity === 'medium' && ex.duration >= 10)
      .slice(0, 2);
  }

  // Add sentiment-based adjustments
  if (indicators.sentiment !== undefined && indicators.sentiment < 0.3) {
    // Negative sentiment - add more calming exercises
    recommendations = [
      ...recommendations,
      ...exercises.filter(ex => ex.type === 'breathing' && ex.intensity === 'low')
    ].slice(0, 3);
  }

  return recommendations;
}

export function getStressLevelDescription(stressLevel: number): string {
  if (stressLevel > 70) {
    return 'High stress level detected. Consider taking a break and practicing deep breathing.';
  } else if (stressLevel > 40) {
    return 'Moderate stress level. Try some gentle exercises or meditation.';
  } else {
    return 'Stress level is manageable. Focus on maintaining good habits.';
  }
} 