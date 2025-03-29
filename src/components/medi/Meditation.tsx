import React, { useState } from 'react';
import { Play, Clock, Volume2 } from 'lucide-react';

const Meditation = () => {
  const [selectedDuration, setSelectedDuration] = useState(5);

  const meditations = [
    {
      title: 'Mindful Breathing',
      description: 'Focus on your breath to calm your mind and reduce stress.',
      image: 'https://images.unsplash.com/photo-1518241353330-0f7941c2d9b5?auto=format&fit=crop&q=80&w=400',
      duration: 5,
    },
    {
      title: 'Body Scan',
      description: 'Progressive relaxation technique to release tension.',
      image: 'https://images.unsplash.com/photo-1506126613408-eca07ce68773?auto=format&fit=crop&q=80&w=400',
      duration: 10,
    },
    {
      title: 'Loving Kindness',
      description: 'Cultivate compassion and positive emotions.',
      image: 'https://images.unsplash.com/photo-1531747056595-07f6cbbe10ad?auto=format&fit=crop&q=80&w=400',
      duration: 15,
    },
  ];

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-2xl font-semibold text-gray-900 mb-4">Guided Meditations</h2>
        <p className="text-gray-600">Choose from our collection of guided meditations to start your practice.</p>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-medium text-gray-900">Duration</h3>
          <div className="flex space-x-2">
            {[5, 10, 15, 20].map((minutes) => (
              <button
                key={minutes}
                onClick={() => setSelectedDuration(minutes)}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  selectedDuration === minutes
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {minutes}m
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {meditations.map((meditation, index) => (
          <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img
              src={meditation.image}
              alt={meditation.title}
              className="w-full h-48 object-cover"
            />
            <div className="p-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">{meditation.title}</h3>
              <p className="text-gray-600 mb-4">{meditation.description}</p>
              <div className="flex items-center justify-between">
                <div className="flex items-center text-gray-500">
                  <Clock className="h-5 w-5 mr-1" />
                  <span>{meditation.duration} min</span>
                </div>
                <button className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors">
                  <Play className="h-5 w-5 mr-2" />
                  Start
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Meditation;