import React from 'react';
import { Brain, Target, Lightbulb, CheckCircle, ArrowRight, Shield, Heart, Users, Clock } from 'lucide-react';

const LearnMore = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1532012197267-da84d127e765')] bg-cover bg-center">
          <div className="absolute inset-0 bg-indigo-900 bg-opacity-80"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">
              Empowering Student Mental Health
              <span className="block text-indigo-300 mt-2">Through AI and Community</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-3xl mx-auto">
              Discover how MindfulStudent is revolutionizing mental health support for students worldwide through innovative technology and compassionate care.
            </p>
          </div>
        </div>
      </div>

      {/* Problem Statement Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">The Challenge We're Addressing</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Students today face unprecedented mental health challenges that traditional support systems struggle to address effectively.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: Brain,
                title: "Mental Health Crisis",
                description: "73% of students experience some form of mental health crisis during their academic career."
              },
              {
                icon: Clock,
                title: "Limited Access",
                description: "Only 1 in 3 students who need mental health support have access to professional help."
              },
              {
                icon: Shield,
                title: "Privacy Concerns",
                description: "Students often hesitate to seek help due to stigma and privacy concerns."
              }
            ].map((item, index) => (
              <div key={index} className="bg-indigo-50 rounded-xl p-6">
                <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                  <item.icon className="w-6 h-6 text-indigo-600" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Our Solution Section */}
      <div className="py-16 bg-gradient-to-b from-white to-indigo-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Comprehensive Solution</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We've developed a holistic approach that combines AI technology with human support to create a complete mental health ecosystem.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">AI-Powered Support</h3>
                  <p className="text-gray-600">24/7 intelligent mental health monitoring and support through advanced AI algorithms.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Personalized Experience</h3>
                  <p className="text-gray-600">Customized wellness plans and recommendations based on individual needs and patterns.</p>
                </div>
              </div>
              <div className="flex items-start space-x-4">
                <div className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center">
                  <CheckCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Safe Community</h3>
                  <p className="text-gray-600">Moderated peer support groups and forums for sharing experiences and support.</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.unsplash.com/photo-1516321318423-f06f85e504b3"
                alt="Student using MindfulStudent"
                className="rounded-xl shadow-lg"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Key Benefits Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Key Benefits</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our platform delivers tangible results for students' mental well-being and academic success.
            </p>
          </div>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              {
                stat: "89%",
                label: "Stress Reduction",
                description: "Students report lower stress levels after 3 months"
              },
              {
                stat: "94%",
                label: "Accessibility",
                description: "Students can access support whenever they need it"
              },
              {
                stat: "78%",
                label: "Academic Performance",
                description: "Users report improved academic focus"
              },
              {
                stat: "92%",
                label: "User Satisfaction",
                description: "Students would recommend to peers"
              }
            ].map((item, index) => (
              <div key={index} className="text-center p-6 bg-indigo-50 rounded-xl">
                <div className="text-4xl font-bold text-indigo-600 mb-2">{item.stat}</div>
                <div className="text-xl font-semibold mb-2">{item.label}</div>
                <p className="text-gray-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-indigo-900 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Mental Well-being?</h2>
          <p className="text-xl text-indigo-200 mb-8 max-w-2xl mx-auto">
            Join thousands of students who have already taken the first step towards better mental health.
          </p>
          <div className="flex justify-center space-x-4">
            <button className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold hover:bg-indigo-50 transition-colors duration-300">
              Get Started Now
            </button>
            <button className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-colors duration-300">
              Schedule a Demo
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LearnMore; 