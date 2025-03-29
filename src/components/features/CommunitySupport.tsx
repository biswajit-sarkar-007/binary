import React from 'react';
import { Users, MessageCircle, Shield, BookOpen, Heart, Award, Calendar, Clock } from 'lucide-react';

const CommunitySupport = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-16">
          <div className="flex items-center justify-center mb-6">
            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
              <Users className="w-10 h-10 text-indigo-600" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">Student Mental Health Community</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            A safe and supportive space where students can connect, share experiences, and find the support they need on their mental health journey.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {[
            { number: '5000+', label: 'Students Supported' },
            { number: '24/7', label: 'Support Available' },
            { number: '100+', label: 'Peer Mentors' },
            { number: '50+', label: 'Support Groups' },
          ].map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl font-bold text-indigo-600 mb-2">{stat.number}</div>
              <div className="text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Main Features Grid */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <MessageCircle className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Support Groups</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Anxiety & Stress Management</li>
              <li>• Academic Pressure</li>
              <li>• Work-Life Balance</li>
              <li>• Personal Growth</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <Shield className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Safe Space</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• 24/7 Moderated Forums</li>
              <li>• Anonymous Sharing</li>
              <li>• Confidential Support</li>
              <li>• Crisis Resources</li>
            </ul>
          </div>

          <div className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mb-6">
              <BookOpen className="w-6 h-6 text-indigo-600" />
            </div>
            <h2 className="text-2xl font-semibold mb-4">Resources</h2>
            <ul className="space-y-3 text-gray-600">
              <li>• Mental Health Guides</li>
              <li>• Wellness Workshops</li>
              <li>• Self-Help Tools</li>
              <li>• Expert Articles</li>
            </ul>
          </div>
        </div>

        {/* Upcoming Events Section */}
        <div className="bg-white rounded-xl shadow-lg p-8 mb-16">
          <h2 className="text-3xl font-bold mb-8 text-center">Upcoming Community Events</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                title: "Stress Management Workshop",
                date: "Every Monday",
                time: "6:00 PM - 7:30 PM",
                type: "Virtual"
              },
              {
                title: "Mindfulness Meditation",
                date: "Every Wednesday",
                time: "5:00 PM - 6:00 PM",
                type: "Hybrid"
              },
              {
                title: "Peer Support Circle",
                date: "Every Friday",
                time: "7:00 PM - 8:30 PM",
                type: "In-Person"
              }
            ].map((event, index) => (
              <div key={index} className="border border-gray-200 rounded-lg p-6 hover:border-indigo-300 transition-colors">
                <h3 className="font-semibold text-xl mb-2">{event.title}</h3>
                <div className="flex items-center text-gray-600 mb-2">
                  <Calendar className="w-4 h-4 mr-2" />
                  <span>{event.date}</span>
                </div>
                <div className="flex items-center text-gray-600">
                  <Clock className="w-4 h-4 mr-2" />
                  <span>{event.time}</span>
                </div>
                <span className="inline-block mt-4 px-3 py-1 bg-indigo-100 text-indigo-600 rounded-full text-sm">
                  {event.type}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Call to Action */}
        <div className="text-center">
          <button className="bg-indigo-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-indigo-700 transition-colors">
            Join Our Community
          </button>
          <p className="mt-4 text-gray-600">
            Your journey to better mental health starts with community support.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CommunitySupport; 