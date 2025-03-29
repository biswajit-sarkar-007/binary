import React from 'react';
import { Award, TrendingUp, Clock, Battery } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Welcome back!</h2>
        <p className="text-gray-600">Your mindfulness journey continues. Today is a great day to practice!</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Streak</h3>
            <Award className="h-6 w-6 text-indigo-600" />
          </div>
          <p className="text-3xl font-bold text-indigo-600">7 days</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Progress</h3>
            <TrendingUp className="h-6 w-6 text-green-600" />
          </div>
          <p className="text-3xl font-bold text-green-600">85%</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Time Meditated</h3>
            <Clock className="h-6 w-6 text-blue-600" />
          </div>
          <p className="text-3xl font-bold text-blue-600">32 min</p>
        </div>

        <div className="bg-white rounded-lg shadow-md p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Stress Level</h3>
            <Battery className="h-6 w-6 text-yellow-600" />
          </div>
          <p className="text-3xl font-bold text-yellow-600">Low</p>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-4">Recent Sessions</h3>
        <div className="space-y-4">
          {[
            { type: 'Breathing Exercise', duration: '10 min', time: '2 hours ago' },
            { type: 'Guided Meditation', duration: '15 min', time: 'Yesterday' },
            { type: 'Stress Check', duration: '5 min', time: 'Yesterday' },
          ].map((session, index) => (
            <div key={index} className="flex items-center justify-between py-2 border-b last:border-0">
              <div>
                <p className="font-medium text-gray-900">{session.type}</p>
                <p className="text-sm text-gray-500">{session.time}</p>
              </div>
              <span className="text-sm text-gray-600">{session.duration}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;