import React from 'react';
import { Sparkles } from 'lucide-react';

const AISupport = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Sparkles className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">24/7 AI Support</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Intelligent chatbot offering round-the-clock mental health support and guidance.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Always available support system</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Natural language understanding</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Personalized responses</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Support Areas</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Stress management</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Study techniques</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Mental health guidance</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AISupport; 