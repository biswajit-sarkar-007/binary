import { useState, useEffect } from 'react';
import FacialStressDetector from '../../components/stress/FacialStressDetector';
import TypingSpeedDetector from '../../components/stress/TypingSpeedDetector';
import VoiceAnalyzer from '../../components/stress/VoiceAnalyzer';
import GuidedSession from '../../components/guided/GuidedSession';
import { getPersonalizedRecommendations, getStressLevelDescription, Recommendation } from '../../services/recommendations';

interface StressMetrics {
  facialStress: number;
  typingStress: number;
  voiceStress: number;
  sentiment: number;
}

export default function Recommendations() {
  const [stressMetrics, setStressMetrics] = useState<StressMetrics>({
    facialStress: 0,
    typingStress: 0,
    voiceStress: 0,
    sentiment: 0.5 // Default neutral sentiment
  });
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [selectedRecommendation, setSelectedRecommendation] = useState<Recommendation | null>(null);
  const [isSessionComplete, setIsSessionComplete] = useState(false);

  useEffect(() => {
    // Update recommendations whenever stress metrics change
    const newRecommendations = getPersonalizedRecommendations(stressMetrics);
    setRecommendations(newRecommendations);
  }, [stressMetrics]);

  const handleFacialStressChange = (stress: number) => {
    setStressMetrics(prev => ({ ...prev, facialStress: stress }));
  };

  const handleTypingStressChange = (stress: number) => {
    setStressMetrics(prev => ({ ...prev, typingStress: stress }));
  };

  const handleVoiceStressChange = (stress: number) => {
    setStressMetrics(prev => ({ ...prev, voiceStress: stress }));
  };

  const handleSessionComplete = () => {
    setIsSessionComplete(true);
    setSelectedRecommendation(null);
  };

  const averageStress = Object.values(stressMetrics).reduce((a, b) => a + b, 0) / 4;

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">Personalized Recommendations</h1>
          <p className="mt-2 text-gray-600">
            {getStressLevelDescription(averageStress)}
          </p>
        </div>

        {selectedRecommendation ? (
          <GuidedSession
            recommendation={selectedRecommendation}
            onComplete={handleSessionComplete}
          />
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Stress Assessment</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FacialStressDetector onStressChange={handleFacialStressChange} />
                <TypingSpeedDetector onStressChange={handleTypingStressChange} />
                <VoiceAnalyzer onStressChange={handleVoiceStressChange} />
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">Recommended Activities</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {recommendations.map((recommendation, index) => (
                  <div
                    key={index}
                    className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors cursor-pointer"
                    onClick={() => setSelectedRecommendation(recommendation)}
                  >
                    <h3 className="text-lg font-medium text-gray-900">
                      {recommendation.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600">
                      {recommendation.description}
                    </p>
                    <div className="mt-4 flex justify-between items-center text-sm text-gray-500">
                      <span>{recommendation.duration} minutes</span>
                      <span className="capitalize">{recommendation.intensity}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {isSessionComplete && (
          <div className="mt-8 text-center">
            <p className="text-green-600 font-medium">
              Great job completing the session! Would you like to try another activity?
            </p>
          </div>
        )}
      </div>
    </div>
  );
} 