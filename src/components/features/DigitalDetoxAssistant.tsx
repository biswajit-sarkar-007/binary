import React from 'react';
import { Activity } from 'lucide-react';

const DigitalDetoxAssistant = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center mb-12">
          <div className="flex items-center justify-center mb-6">
            <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
              <Activity className="w-8 h-8 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Digital Detox Assistant</h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Smart screen time tracking and gentle nudges to help you maintain focus.
          </p>
        </div>
        
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Features</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Screen time monitoring across devices</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Smart notifications for breaks</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Focus mode for distraction-free study</p>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-6 rounded-xl shadow-lg">
            <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
            <ul className="space-y-4">
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Improved productivity and focus</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Better digital well-being</p>
              </li>
              <li className="flex items-start">
                <span className="text-indigo-600 mr-2">•</span>
                <p>Reduced eye strain and fatigue</p>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DigitalDetoxAssistant; 