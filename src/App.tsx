import React, { useState, useEffect } from 'react';
import {  BrainCircuit, BrainCog , Moon, Clock, Users, Activity, Sparkles, Menu, X, ArrowRight, MessageSquare, Heart, Shield, Mail, Phone, MapPin } from 'lucide-react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';

import AIPoweredStressTracking from './components/features/AIPoweredStressTracking';
import DigitalDetoxAssistant from './components/features/DigitalDetoxAssistant';
import AISupport from './components/features/AISupport';
import StudyBreakScheduler from './components/features/StudyBreakScheduler';
import GuidedWellness from './components/features/GuidedWellness';
import CommunitySupport from './components/features/CommunitySupport';
import LearnMore from './components/pages/LearnMore';

function NavBar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  

  const scrollToSection = (sectionId: string) => {
    // If we're not on the home page, navigate to home first
    if (location.pathname !== '/') {
      navigate('/?section=' + sectionId);
      return;
    }
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
      setIsOpen(false); // Close mobile menu after clicking
    }
  };

  // Handle initial scroll when URL contains hash or query param
  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace('#', '');
      const element = document.getElementById(id);
      setTimeout(() => {
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }, 0);
    } else if (location.search) {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      if (section) {
        const element = document.getElementById(section);
        setTimeout(() => {
          if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
          }
        }, 0);
      }
    }
  }, [location]);

  return (
    <nav className="bg-white shadow-sm fixed w-full z-50">
   <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between h-16">
    <div className="flex items-center">
      <Link to="/" className="flex items-center group">
        <BrainCircuit className="h-8 w-8 text-indigo-600 transition-transform duration-300 group-hover:scale-110" />
        <span className="ml-2 text-xl font-bold text-gray-900 transition-transform duration-300 group-hover:scale-110">
          MindfulStudent
        </span>
      </Link>
      </div>
        <div className="hidden md:flex items-center space-x-8">
          <button 
            onClick={() => scrollToSection('features')} 
            className="text-gray-600 hover:text-indigo-600 relative group"
          >
            Features
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('how-it-works')} 
            className="text-gray-600 hover:text-indigo-600 relative group"
          >
            How It Works
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('testimonials')} 
            className="text-gray-600 hover:text-indigo-600 relative group"
          >
            Testimonials
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('contact')} 
            className="text-gray-600 hover:text-indigo-600 relative group"
          >
            Contact
            <span className="absolute bottom-0 left-0 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
          </button>
          <button 
            onClick={() => scrollToSection('features')} 
            className="bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
          >
            Get Started
          </button>
        </div>
        <div className="md:hidden flex items-center">
          <button onClick={() => setIsOpen(!isOpen)} className="text-gray-600">
            {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button 
              onClick={() => scrollToSection('features')} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 relative group"
            >
              Features
              <span className="absolute bottom-0 left-3 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-20"></span>
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 relative group"
            >
              How It Works
              <span className="absolute bottom-0 left-3 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-24"></span>
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 relative group"
            >
              Testimonials
              <span className="absolute bottom-0 left-3 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-24"></span>
            </button>
            <button 
              onClick={() => scrollToSection('contact')} 
              className="block w-full text-left px-3 py-2 text-gray-600 hover:text-indigo-600 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-3 h-0.5 w-0 bg-indigo-600 transition-all duration-300 group-hover:w-16"></span>
            </button>
            <button 
              onClick={() => scrollToSection('features')} 
              className="w-full text-center bg-indigo-600 text-white px-4 py-2 rounded-full hover:bg-indigo-700"
            >
              Get Started
            </button>
          </div>
        </div>
      )}
    </div>
  </nav>
  );
}

function FeatureCard({ icon: Icon, title, description, to }: { icon: React.ElementType, title: string, description: string, to: string }) {
  const navigate = useNavigate();

  return (
    <div
      className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-transform duration-300 cursor-pointer transform hover:-translate-y-2 hover:scale-105"
      onClick={() => navigate(to)}
      style={{
        perspective: '1000px',
      }}
    >
      <div
        className="flex flex-col items-center justify-center w-full h-full"
        style={{
          transformStyle: 'preserve-3d',
        }}
      >
        <div className="flex items-center justify-center w-12 h-12 bg-indigo-100 rounded-full mb-4">
          <Icon className="w-6 h-6 text-indigo-600" />
        </div>
        <h3 className="text-xl font-semibold mb-2 text-gray-800">{title}</h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function HowItWorksStep({ number, title, description }: { number: number, title: string, description: string }) {
  return (
    <div className="flex items-start space-x-4">
      <div
        className="flex-shrink-0 w-8 h-8 bg-indigo-600 text-white rounded-full flex items-center justify-center font-bold transition-transform duration-300 hover:rotate-12 hover:scale-110"
      >
        {number}
      </div>
      <div>
        <h3
          className="text-lg font-semibold mb-2 transition-transform duration-300 hover:scale-110 hover:translate-x-4"
        >
          {title}
        </h3>
        <p className="text-gray-600">{description}</p>
      </div>
    </div>
  );
}

function TestimonialCard({ name, role, quote, image }: { name: string, role: string, quote: string, image: string }) {
  return (
    <div className="bg-white p-6 rounded-xl shadow-lg transition-transform duration-300 hover:scale-105 hover:bg-indigo-50">
      <div className="flex items-center mb-4">
        <img src={image} alt={name} className="w-12 h-12 rounded-full object-cover" />
        <div className="ml-4">
          <h4 className="font-semibold text-gray-900">{name}</h4>
          <p className="text-gray-600 text-sm">{role}</p>
        </div>
      </div>
      <p className="text-gray-700 italic">{quote}</p>
    </div>
  );
}

function Home() {
  const navigate = useNavigate();
  const location = useLocation();
  
  const scrollToFeatures = () => {
    const element = document.getElementById('features');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Handle initial scroll when component mounts
  useEffect(() => {
    if (location.search) {
      const params = new URLSearchParams(location.search);
      const section = params.get('section');
      if (section) {
        const element = document.getElementById(section);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth' });
        }
      }
    }
  }, [location]);
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white">
      <NavBar />

      {/* Hero Section */}
      <div className="relative pt-16">
        <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1517048676732-d65bc937f952')] bg-cover bg-center">
          <div className="absolute inset-0 bg-indigo-900 bg-opacity-70"></div>
        </div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-32">
          <div className="text-center">
            <h1 className="text-5xl font-bold text-white mb-6">
              Transform Your Mental Well-being
              <span className="block text-indigo-300">With AI-Powered Support</span>
            </h1>
            <p className="text-xl text-gray-200 mb-8 max-w-2xl mx-auto">
              Join thousands of students who've found peace, focus, and balance through our innovative mental health platform.
              Get personalized support exactly when you need it.
            </p>
            <div className="flex justify-center space-x-4">
  <button 
    onClick={scrollToFeatures}
    className="bg-white text-indigo-600 px-8 py-3 rounded-full text-lg font-semibold transition-all duration-500 overflow-hidden"
  >
    <span className="inline-block relative transition-all duration-500 hover:pr-6">
      Start Free Trial
      <span className="absolute opacity-0 top-0 right-[-20px] transition-all duration-500 hover:opacity-100 hover:right-0 text-indigo-500">&#187;</span>
    </span>
  </button>
  <button 
    onClick={() => navigate('/learn-more')}
    className="border-2 border-white text-white px-8 py-3 rounded-full text-lg font-semibold hover:bg-white hover:text-indigo-600 transition-all duration-500 overflow-hidden"
  >
    <span className="inline-block relative transition-all duration-500 hover:pr-6">
      Learn More
      <span className="absolute opacity-0 top-0 right-[-20px] transition-all duration-500 hover:opacity-100 hover:right-0">&#187;</span>
    </span>
  </button>
</div>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      
      <div id="features" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4 relative group">
            <span className="inline-block relative">
              Features Designed for Your Well-being
              <span className="absolute top-11 left-0 w-0 h-0.5  bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
            </span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Every feature is thoughtfully crafted to support your mental health journey and academic success.
          </p>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <FeatureCard
            icon={BrainCog }
            title="AI-Powered Stress Tracking"
            description="Advanced AI analysis of your stress patterns with personalized wellness recommendations."
            to="/features/ai-stress-tracking"
          />
          <FeatureCard
            icon={Activity}
            title="Digital Detox Assistant"
            description="Smart screen time tracking and gentle nudges to help you maintain focus."
            to="/features/digital-detox"
          />
          <FeatureCard
            icon={Sparkles}
            title="24/7 AI Support"
            description= "Intelligent chatbot offering round-the-clock mental health support and guidance."
            to="/ai-mental-health-chatbot"
          />
          <FeatureCard
            icon={Clock}
            title="Study & Break Scheduler"
            description="Personalized study sessions with integrated Pomodoro timer and break reminders."
            to="/features/study-scheduler"
          />
          <FeatureCard
            icon={Moon}
            title="Guided Wellness"
            description="AI-curated meditation and breathing exercises for stress reduction."
            to="/features/guided-wellness"
          />
          <FeatureCard
            icon={Users}
            title="Community Support"
            description="Connect with peers in a safe, moderated space for sharing and support."
            to="/features/community-support"
          />
        </div>
      </div>

      {/* How It Works Section */}
      <div id="how-it-works" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative group">
              <span className="inline-block relative">
                How Our Platform Works
                <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Our AI-powered platform provides comprehensive mental health support through an intuitive step-by-step process.
            </p>
          </div>
          <div className="grid md:grid-cols-2 gap-12">
            <div className="space-y-8">
              <HowItWorksStep
                number={1}
                title="AI-Powered Mental Health Assessment"
                description="Start with our intelligent stress tracking system that analyzes your mental state and creates a personalized wellness profile."
              />
              <HowItWorksStep
                number={2}
                title="Digital Wellness Management"
                description="Receive smart screen time monitoring and scheduled breaks to maintain a healthy study-life balance with our Digital Detox Assistant."
              />
              <HowItWorksStep
                number={3}
                title="24/7 AI Chatbot Support"
                description="Access immediate support through our AI mental health chatbot, providing guidance and coping strategies whenever you need them."
              />
              <HowItWorksStep
                number={4}
                title="Structured Study Planning"
                description="Use our Study Break Scheduler to create optimized study sessions with built-in Pomodoro timing and wellness breaks."
              />
              <HowItWorksStep
                number={5}
                title="Guided Wellness Activities"
                description="Follow AI-curated meditation and mindfulness exercises designed to reduce stress and improve mental clarity."
              />
              <HowItWorksStep
                number={6}
                title="Community Connection"
                description="Join our moderated community platform to connect with peers, share experiences, and build a support network."
              />
            </div>
            <div className="relative group w-full h-96 overflow-hidden rounded-xl shadow-lg">
              {/* Image */}
              <img
                src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f"
                alt="Students using the platform"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
              />

              {/* Overlay Content */}
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 flex items-end p-6">
                <div className="space-y-3 bg-white bg-opacity-90 p-4 rounded-lg shadow-md">
                  <p className="text-gray-600">
                    Combines AI technology with proven mental health practices
                  </p>
                  <p className="text-gray-600">
                    Provides personalized support based on individual needs
                  </p>
                  <p className="text-gray-600">
                    Offers continuous support through multiple channels
                  </p>
                  <p className="text-gray-600">
                    Creates a balanced approach to academic success and mental wellness
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Testimonials Section */}
      <div id="testimonials" className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4 relative group">
              <span className="inline-block relative">
                What Students Say
                <span className="absolute top-10 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover:w-full"></span>
              </span>
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Hear from students who've transformed their mental well-being with our platform.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <TestimonialCard
              name="Sarah Johnson"
              role="Computer Science Student"
              quote="This platform helped me manage my anxiety during finals. The AI suggestions were spot-on, and the meditation exercises made a real difference."
              image="https://images.unsplash.com/photo-1494790108377-be9c29b29330"
            />
            <TestimonialCard
              name="Michael Chen"
              role="Engineering Student"
              quote="The study scheduler and focus tools helped me stay productive without burning out. It's like having a personal wellness coach."
              image="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d"
            />
            <TestimonialCard
              name="Emily Rodriguez"
              role="Psychology Student"
              quote="The community support feature connected me with other students facing similar challenges. It's comforting to know you're not alone."
              image="https://images.unsplash.com/photo-1438761681033-6461ffad8d80"
            />
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div id="contact" className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-3xl font-bold text-gray-900 mb-4 transition-transform duration-300 hover:scale-105 hover:text-indigo-600">
                Get in Touch
              </h2>
              <p className="text-xl text-gray-600 mb-8">
                Have questions about our platform? We're here to help you on your mental wellness journey.
              </p>
              <div className="space-y-6">
                <div className="flex items-center">
                  <Mail className="w-6 h-6 text-indigo-600 mr-4" />
                  <span className="text-gray-600">support@mindfulstudent.com</span>
                </div>
                <div className="flex items-center">
                  <Phone className="w-6 h-6 text-indigo-600 mr-4" />
                  <span className="text-gray-600">1-800-MINDFUL</span>
                </div>
                <div className="flex items-center">
                  <MapPin className="w-6 h-6 text-indigo-600 mr-4" />
                  <span className="text-gray-600">123 Wellness Street, Education City</span>
                </div>
              </div>
            </div>
            <form className="space-y-6">
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input
                  type="text"
                  id="name"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
                <input
                  type="email"
                  id="email"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea
                  id="message"
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-600 focus:border-transparent"
                ></textarea>
              </div>
              <button className="w-full bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors duration-300">
                Send Message
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div>
              <div className="flex items-center mb-4">
                <BrainCircuit className="h-8 w-8 text-indigo-400" />
                <span className="ml-2 text-xl font-bold">MindfulStudent</span>
              </div>
              <p className="text-gray-400">
                Empowering students with AI-powered mental health support and wellness tools.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#features" className="text-gray-400 hover:text-white">Features</a></li>
                <li><a href="#how-it-works" className="text-gray-400 hover:text-white">How It Works</a></li>
                <li><a href="#testimonials" className="text-gray-400 hover:text-white">Testimonials</a></li>
                <li><a href="#contact" className="text-gray-400 hover:text-white">Contact</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Resources</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-400 hover:text-white">Blog</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Mental Health Tips</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Student Stories</a></li>
                <li><a href="#" className="text-gray-400 hover:text-white">Support Guide</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Connect With Us</h3>
              <div className="flex space-x-4">
                <a href="#" className="text-gray-400 hover:text-white">
                  <MessageSquare className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Heart className="h-6 w-6" />
                </a>
                <a href="#" className="text-gray-400 hover:text-white">
                  <Shield className="h-6 w-6" />
                </a>
              </div>
            </div>
          </div>
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-400">
            <p>© 2025 MindfulStudent. All rights reserved.</p>
            <p className="mt-2">Made with ❤️ for students worldwide</p>
          </div>
        </div>
      </footer>
    </div>
  );
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn-more" element={<LearnMore />} />
        <Route path="/features/ai-stress-tracking" element={<AIPoweredStressTracking />} />
        <Route path="/features/digital-detox" element={<DigitalDetoxAssistant />} />
        <Route path="/features/ai-support" element={<AISupport />} />
        <Route path="/ai-mental-health-chatbot" element={<iframe src="/ai_mental_health_chatbot_Final.html" style={{ width: '100%', height: '100vh', border: 'none' }} title="AI Mental Health Chatbot" />} />
        <Route path="/features/study-scheduler" element={<StudyBreakScheduler />} />
        <Route path="/features/guided-wellness/*" element={<GuidedWellness />} />
        <Route path="/features/community-support" element={<CommunitySupport />} />
        <Route path="/features/game" element={<iframe src="/detoxing_media/game.html" style={{ width: '100%', height: '100vh', border: 'none' }} title="Game" />} />

      </Routes>
    </Router>
  );
}

export default App;
