import React from 'react';
import { Activity, Moon, Clock, Brain } from 'lucide-react';
import { StressData } from '../services/firebaseService';

interface DataInputFormProps {
  formData: StressData;
  isSubmitting: boolean;
  submitStatus: 'success' | 'error' | null;
  onSubmit: (e: React.FormEvent) => Promise<void>;
  onInputChange: (field: keyof StressData, value: number) => void;
  onSentimentChange: (sentiment: number) => void;
}

export const DataInputForm: React.FC<DataInputFormProps> = ({
  formData,
  isSubmitting,
  submitStatus,
  onSubmit,
  onInputChange,
 
}) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-3 mb-6">
        <Brain className="w-8 h-8 text-indigo-600" />
        <h1 className="text-2xl font-bold text-gray-800">Stress Tracker</h1>
      </div>

      <form onSubmit={onSubmit} className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Activity className="w-4 h-4" />
              Stress Level (1-10)
            </label>
            <input
              type="range"
              min="1"
              max="10"
              value={formData.stressLevel}
              onChange={(e) => onInputChange('stressLevel', parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-indigo-600"
            />
            <div className="flex justify-between mt-2">
              <span className="text-sm text-gray-500">Low</span>
              <span className="font-medium text-indigo-600">{formData.stressLevel}</span>
              <span className="text-sm text-gray-500">High</span>
            </div>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Moon className="w-4 h-4" />
              Hours Slept
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={formData.sleepHours}
              onChange={(e) => onInputChange('sleepHours', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              required
            />
            <p className="mt-1 text-sm text-gray-500">Recommended: 7-9 hours</p>
          </div>

          <div>
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700 mb-2">
              <Clock className="w-4 h-4" />
              Screen Time (hours)
            </label>
            <input
              type="number"
              min="0"
              max="24"
              value={formData.screenTime}
              onChange={(e) => onInputChange('screenTime', parseInt(e.target.value))}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
            />
            <p className="mt-1 text-sm text-gray-500">Recommended: Less than 6 hours</p>
          </div>
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 transition-colors duration-200"
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Submitting...
            </span>
          ) : (
            'Log Entry'
          )}
        </button>

        {submitStatus === 'success' && (
          <div className="bg-green-50 border border-green-200 rounded-md p-4 mt-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <p className="text-green-700">Data submitted successfully!</p>
            </div>
          </div>
        )}
        {submitStatus === 'error' && (
          <div className="bg-red-50 border border-red-200 rounded-md p-4 mt-4">
            <div className="flex items-center gap-2">
              <svg className="h-5 w-5 text-red-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <p className="text-red-700">Error submitting data. Please check your inputs and try again.</p>
            </div>
          </div>
        )}
      </form>
    </div>
  );
}; 