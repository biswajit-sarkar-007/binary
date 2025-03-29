interface SleepTip {
  icon: string;
  title: string;
  description: string;
}

export const getSleepTips = (sleepScore: number): SleepTip[] => {
  const tips: SleepTip[] = [
    {
      icon: 'moon',
      title: 'Consistent Bedtime',
      description: 'Go to bed and wake up at the same time every day to regulate your sleep cycle.'
    },
    {
      icon: 'coffee',
      title: 'Limit Caffeine',
      description: 'Avoid caffeine in the afternoon and evening to improve sleep quality.'
    },
    {
      icon: 'exercise',
      title: 'Regular Exercise',
      description: 'Engage in physical activity during the day, but avoid intense workouts close to bedtime.'
    },
    {
      icon: 'meditation',
      title: 'Relaxation Techniques',
      description: 'Practice meditation or deep breathing exercises before bed to reduce stress.'
    },
    {
      icon: 'book',
      title: 'Reading',
      description: 'Read a physical book instead of using electronic devices before sleep.'
    },
    {
      icon: 'phone',
      title: 'Digital Detox',
      description: 'Avoid screens at least 1 hour before bedtime to improve sleep quality.'
    }
  ];

  // Customize tips based on sleep score
  if (sleepScore < 60) {
    tips.push({
      icon: 'bed',
      title: 'Sleep Environment',
      description: 'Create a dark, quiet, and cool sleeping environment (65-67°F/18-19°C).'
    });
    tips.push({
      icon: 'alarm',
      title: 'Morning Routine',
      description: 'Expose yourself to natural light in the morning to help regulate your circadian rhythm.'
    });
  }

  return tips;
}; 