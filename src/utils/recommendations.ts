interface Recommendation {
    type: 'stress' | 'sleep' | 'screen';
    message: string;
    priority: 'high' | 'medium' | 'low';
  }
  
  export const generateRecommendations = (
    stressLevel: number,
    sleepHours: number,
    screenTime: number
  ): Recommendation[] => {
    const recommendations: Recommendation[] = [];
  
    // Stress level recommendations
    if (stressLevel >= 8) {
      recommendations.push({
        type: 'stress',
        message: 'Your stress level is very high. Consider taking a short break, practicing deep breathing, or going for a walk.',
        priority: 'high',
      });
    } else if (stressLevel >= 6) {
      recommendations.push({
        type: 'stress',
        message: 'Your stress level is elevated. Try some stress management techniques like meditation or stretching.',
        priority: 'medium',
      });
    }
  
    // Sleep recommendations
    if (sleepHours < 6) {
      recommendations.push({
        type: 'sleep',
        message: 'You\'re not getting enough sleep. Try to establish a consistent sleep schedule and create a relaxing bedtime routine.',
        priority: 'high',
      });
    } else if (sleepHours < 7) {
      recommendations.push({
        type: 'sleep',
        message: 'Your sleep duration is slightly below optimal. Consider going to bed 30 minutes earlier.',
        priority: 'medium',
      });
    }
  
    // Screen time recommendations
    if (screenTime >= 8) {
      recommendations.push({
        type: 'screen',
        message: 'Your screen time is quite high. Take regular breaks and try to reduce screen time, especially before bedtime.',
        priority: 'high',
      });
    } else if (screenTime >= 6) {
      recommendations.push({
        type: 'screen',
        message: 'Your screen time is elevated. Consider implementing the 20-20-20 rule: every 20 minutes, look at something 20 feet away for 20 seconds.',
        priority: 'medium',
      });
    }
  
    // Combined recommendations
    if (stressLevel >= 7 && sleepHours < 7) {
      recommendations.push({
        type: 'stress',
        message: 'High stress and insufficient sleep can create a cycle. Try to prioritize sleep and relaxation techniques.',
        priority: 'high',
      });
    }
  
    if (screenTime >= 6 && sleepHours < 7) {
      recommendations.push({
        type: 'screen',
        message: 'High screen time might be affecting your sleep. Try to reduce screen time at least 1 hour before bedtime.',
        priority: 'medium',
      });
    }
  
    return recommendations;
  }; 