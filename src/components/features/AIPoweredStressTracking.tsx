 
// import { Brain } from 'lucide-react';

// const AIPoweredStressTracking = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center mb-6">
//             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
//               <Brain className="w-8 h-8 text-indigo-600" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">AI-Powered Stress Tracking</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Advanced AI analysis of your stress patterns with personalized wellness recommendations.
//           </p>
//         </div>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">How It Works</h2>
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Our AI analyzes your daily activities, sleep patterns, and mood indicators</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Generates personalized stress management recommendations</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Provides real-time alerts when stress levels are elevated</p>
//               </li>
//             </ul>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">Key Benefits</h2>
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Early detection of stress patterns</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Personalized coping strategies</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Progress tracking over time</p>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default AIPoweredStressTracking; 


import React, { useState, useEffect } from 'react';
import { Dashboard } from '../Dashboard';
import { SentimentAnalysis } from '../SentimentAnalysis';
import { DataInputForm } from '../DataInputForm';
import { StressData, subscribeToStressData, addStressData, getStressData } from '../../services/firebaseService';

function AIPoweredStressTracking() {
  const [formData, setFormData] = useState<StressData>({
    stressLevel: 5,
    sleepHours: 7,
    screenTime: 4,
    timestamp: new Date(),
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<'success' | 'error' | null>(null);
  const [allData, setAllData] = useState<StressData[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Load initial data
    const loadInitialData = async () => {
      try {
        const data = await getStressData();
        setAllData(data);
      } catch (error) {
        console.error('Error loading initial data:', error);
        setError('Failed to load data. Please check your connection.');
      }
    };

    loadInitialData();

    // Subscribe to real-time updates
    const unsubscribe = subscribeToStressData((data) => {
      setAllData(data);
    });

    // Cleanup subscription on unmount
    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);
    setError(null);

    // Validate inputs
    if (formData.stressLevel < 1 || formData.stressLevel > 10) {
      setSubmitStatus('error');
      setError('Stress level must be between 1 and 10');
      setIsSubmitting(false);
      return;
    }

    if (formData.sleepHours < 0 || formData.sleepHours > 24) {
      setSubmitStatus('error');
      setError('Sleep hours must be between 0 and 24');
      setIsSubmitting(false);
      return;
    }

    if (formData.screenTime < 0 || formData.screenTime > 24) {
      setSubmitStatus('error');
      setError('Screen time must be between 0 and 24');
      setIsSubmitting(false);
      return;
    }

    try {
      const newData = {
        ...formData,
        timestamp: new Date(),
      };
      await addStressData(newData);
      setSubmitStatus('success');
      setFormData({
        stressLevel: 5,
        sleepHours: 7,
        screenTime: 4,
        timestamp: new Date(),
      });
    } catch (error) {
      console.error('Error saving data:', error);
      setSubmitStatus('error');
      setError('Failed to save data. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleInputChange = (field: keyof StressData, value: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSentimentChange = (sentiment: number) => {
    setFormData(prev => ({
      ...prev,
      stressLevel: sentiment
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-6">
              <div className="flex items-center gap-2">
                <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
                <p className="text-red-700">{error}</p>
              </div>
            </div>
          )}

          <DataInputForm
            formData={formData}
            isSubmitting={isSubmitting}
            submitStatus={submitStatus}
            onSubmit={handleSubmit}
            onInputChange={handleInputChange}
            onSentimentChange={handleSentimentChange}
          />
          
          <SentimentAnalysis onSentimentChange={handleSentimentChange} />
          <Dashboard data={allData} />
        </div>
      </div>
    </div>
  );
}

export default AIPoweredStressTracking;