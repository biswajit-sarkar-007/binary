import { Link } from 'react-router-dom';
import BreathingExercise from '../medi/BreathingExercise';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-8">
            Welcome to Your AI Meditation Coach
          </h1>
          <p className="text-xl text-gray-600 mb-8">
            Begin your journey to mindfulness and inner peace
          </p>
          <Link
            to="/features/guided-wellness/session"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 transition-colors"
          >
            Start Session
          </Link>
        </div>

        <div className="mt-16">
          <h2 className="text-2xl font-semibold text-gray-900 mb-6 text-center">
            Quick Breathing Exercise
          </h2>
          <div className="max-w-md mx-auto">
            <BreathingExercise />
          </div>
        </div>
      </div>
    </div>
  );
} 