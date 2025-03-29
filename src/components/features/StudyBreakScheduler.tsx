// import React from 'react';
// import { Clock } from 'lucide-react';

// const StudyBreakScheduler = () => {
//   return (
//     <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white pt-16">
//       <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="text-center mb-12">
//           <div className="flex items-center justify-center mb-6">
//             <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center">
//               <Clock className="w-8 h-8 text-indigo-600" />
//             </div>
//           </div>
//           <h1 className="text-4xl font-bold text-gray-900 mb-4">Study & Break Scheduler</h1>
//           <p className="text-xl text-gray-600 max-w-2xl mx-auto">
//             Personalized study sessions with integrated Pomodoro timer and break reminders.
//           </p>
//         </div>
        
//         <div className="grid md:grid-cols-2 gap-8">
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">Features</h2>
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Customizable study intervals</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Smart break reminders</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Progress tracking</p>
//               </li>
//             </ul>
//           </div>
          
//           <div className="bg-white p-6 rounded-xl shadow-lg">
//             <h2 className="text-2xl font-semibold mb-4">Benefits</h2>
//             <ul className="space-y-4">
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Improved study efficiency</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Better time management</p>
//               </li>
//               <li className="flex items-start">
//                 <span className="text-indigo-600 mr-2">•</span>
//                 <p>Reduced study fatigue</p>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default StudyBreakScheduler; 


import React, { useState, useEffect } from 'react';
import { Moon, Sun, Clock, Activity, Calendar, BarChart2, Settings, Bell, Lightbulb, TrendingUp, Sparkles, Book, Phone, Bed, Timer, Coffee, Dumbbell, Brain, Utensils } from 'lucide-react';
import { db } from '../../firebase';
import { collection, addDoc, getDocs, query, orderBy, limit, onSnapshot } from 'firebase/firestore';
import { analyzeSleep, calculateSleepDuration, SleepAnalysis } from '../../utils/sleepAnalysis';
import { getSleepTips } from  '../../utils/sleepTips';

interface SleepRecord {
  bedtime: string;
  wakeTime: string;
  restlessness: number;
  timestamp: string;
  sleepHours: number;
  quality: number;
}

function StudyBreakScheduler() {
  const [sleepScore, setSleepScore] = useState(85);
  const [lastNightSleep, setLastNightSleep] = useState(7.5);
  const [activeDay, setActiveDay] = useState<number | null>(null);
  const [sleepData, setSleepData] = useState<SleepRecord[]>([]);
  const [newSleepRecord, setNewSleepRecord] = useState<Partial<SleepRecord>>({
    bedtime: '',
    wakeTime: '',
    restlessness: 0
  });
  const [analysis, setAnalysis] = useState<SleepAnalysis | null>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  // Update Firebase listener for real-time updates
  useEffect(() => {
    const q = query(collection(db, 'sleepRecords'), orderBy('timestamp', 'desc'), limit(7));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const records = snapshot.docs.map(doc => ({
        ...doc.data(),
        timestamp: doc.data().timestamp.toDate().toISOString()
      })) as SleepRecord[];
      setSleepData(records);
    }, (error) => {
      console.error('Error fetching sleep data:', error);
    });

    return () => unsubscribe();
  }, []);

  const handleInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setNewSleepRecord(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveSleepData = async () => {
    try {
      setIsAnalyzing(true);
      
      // Calculate sleep hours
      const sleepHours = calculateSleepDuration(
        newSleepRecord.bedtime || '',
        newSleepRecord.wakeTime || ''
      );

      // Calculate quality based on restlessness (inverse relationship)
      const quality = Math.max(0, 100 - (Number(newSleepRecord.restlessness) * 10));

      const recordToSave: SleepRecord = {
        bedtime: newSleepRecord.bedtime || '',
        wakeTime: newSleepRecord.wakeTime || '',
        restlessness: newSleepRecord.restlessness || 0,
        timestamp: new Date().toISOString(),
        sleepHours,
        quality
      };

      // Save to Firebase
      await addDoc(collection(db, 'sleepRecords'), recordToSave);
      
      // Update local state
      setSleepData(prev => [recordToSave, ...prev].slice(0, 7));
      setNewSleepRecord({
        bedtime: '',
        wakeTime: '',
        restlessness: 0
      });
      
      // Perform sleep analysis
      const historicalData = sleepData.map(record => ({
        duration: record.sleepHours,
        restlessness: record.restlessness
      }));
      
      const analysisResult = await analyzeSleep(
        sleepHours,
        recordToSave.restlessness,
        historicalData
      );
      
      setAnalysis(analysisResult);
      setSleepScore(analysisResult.score);
      setLastNightSleep(sleepHours);
    } catch (error) {
      console.error('Error saving sleep data:', error);
      alert('Error saving sleep data. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getIconComponent = (iconName: string) => {
    switch (iconName) {
      case 'moon': return <Moon className="h-5 w-5 text-purple-300" />;
      case 'sun': return <Sun className="h-5 w-5 text-purple-300" />;
      case 'coffee': return <Coffee className="h-5 w-5 text-purple-300" />;
      case 'exercise': return <Dumbbell className="h-5 w-5 text-purple-300" />;
      case 'meditation': return <Brain className="h-5 w-5 text-purple-300" />;
      case 'book': return <Book className="h-5 w-5 text-purple-300" />;
      case 'phone': return <Phone className="h-5 w-5 text-purple-300" />;
      case 'bed': return <Bed className="h-5 w-5 text-purple-300" />;
      case 'alarm': return <Timer className="h-5 w-5 text-purple-300" />;
      case 'food': return <Utensils className="h-5 w-5 text-purple-300" />;
      default: return <Moon className="h-5 w-5 text-purple-300" />;
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center space-x-2">
            <Moon className="h-8 w-8 text-purple-300" />
            <h1 className="text-2xl font-bold text-white">DreamTrack</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Bell className="h-6 w-6 text-purple-300 cursor-pointer hover:text-purple-200" />
            <Settings className="h-6 w-6 text-purple-300 cursor-pointer hover:text-purple-200" />
          </div>
        </header>

        {/* Input Form */}
        <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white mb-6">
          <h2 className="text-lg font-semibold mb-4">Record Your Sleep</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm mb-2">Bedtime</label>
              <input
                type="time"
                name="bedtime"
                value={newSleepRecord.bedtime}
                onChange={handleInput}
                className="w-full bg-white/5 border border-purple-300/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-300"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Wake Time</label>
              <input
                type="time"
                name="wakeTime"
                value={newSleepRecord.wakeTime}
                onChange={handleInput}
                className="w-full bg-white/5 border border-purple-300/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-300"
              />
            </div>
            <div>
              <label className="block text-sm mb-2">Restlessness (0-10)</label>
              <input
                type="number"
                name="restlessness"
                value={newSleepRecord.restlessness}
                onChange={handleInput}
                min="0"
                max="10"
                className="w-full bg-white/5 border border-purple-300/30 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-purple-300"
              />
            </div>
          </div>
          <button
            onClick={saveSleepData}
            disabled={!newSleepRecord.bedtime || !newSleepRecord.wakeTime || isAnalyzing}
            className={`mt-4 bg-purple-500 hover:bg-purple-600 text-white px-6 py-2 rounded-lg transition-colors duration-200 ${
              isAnalyzing ? 'opacity-50 cursor-not-allowed' : ''
            }`}
          >
            {isAnalyzing ? 'Analyzing...' : 'Save & Analyze'}
          </button>
        </div>

        {/* Enhanced Analysis Results */}
        {analysis && (
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white mb-6 transform transition-all duration-500 ">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold flex items-center space-x-2">
                <Sparkles className="h-6 w-6 text-yellow-400" />
                <span>Sleep Analysis</span>
              </h2>
              <div className="text-sm text-purple-300">
                {new Date().toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Quality Assessment Card */}
              <div className="bg-white/5 rounded-lg p-6 border border-purple-300/20">
                <h3 className="text-md font-medium mb-4 flex items-center space-x-2">
                  <Activity className="h-5 w-5 text-purple-300" />
                  <span>Quality Assessment</span>
                </h3>
                <div className="flex items-center space-x-3 mb-4">
                  <div className={`w-4 h-4 rounded-full ${
                    analysis.quality === 'Good' ? 'bg-green-400 animate-pulse' :
                    analysis.quality === 'Average' ? 'bg-yellow-400 animate-pulse' :
                    'bg-red-400 animate-pulse'
                  }`} />
                  <span className="text-lg font-medium">{analysis.quality} Quality</span>
                </div>
                <div className="relative">
                  <div className="text-4xl font-bold mb-1">{analysis.score}</div>
                  <div className="text-purple-300">Sleep Score</div>
                  <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
                    <Activity className="w-full h-full" />
                  </div>
                </div>
              </div>

              {/* Insights Card */}
              <div className="bg-white/5 rounded-lg p-6 border border-purple-300/20">
                <h3 className="text-md font-medium mb-4 flex items-center space-x-2">
                  <Lightbulb className="h-5 w-5 text-purple-300" />
                  <span>Key Insights</span>
                </h3>
                <ul className="space-y-3">
                  {analysis.insights.map((insight: string, index: number) => (
                    <li key={index} className="flex items-start space-x-3 group">
                      <div className="w-1.5 h-1.5 rounded-full bg-purple-300 mt-2 group-hover:bg-purple-400 transition-colors" />
                      <span className="text-sm leading-relaxed">{insight}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Recommendations Card */}
              <div className="bg-white/5 rounded-lg p-6 border border-purple-300/20 md:col-span-2">
                <h3 className="text-md font-medium mb-4 flex items-center space-x-2">
                  <TrendingUp className="h-5 w-5 text-purple-300" />
                  <span>Personalized Recommendations</span>
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {analysis.recommendations.map((rec: string, index: number) => (
                    <div 
                      key={index}
                      className="flex items-start space-x-3 p-3 bg-white/5 rounded-lg hover:bg-white/10 transition-colors"
                    >
                      <div className="w-6 h-6 rounded-full bg-purple-500/20 flex items-center justify-center">
                        <TrendingUp className="h-4 w-4 text-purple-300" />
                      </div>
                      <span className="text-sm leading-relaxed">{rec}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Sleep Statistics */}
            <div className="mt-6 pt-6 border-t border-purple-300/20">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold">{analysis.duration.toFixed(1)}h</div>
                  <div className="text-sm text-purple-300">Sleep Duration</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">{sleepData.length}</div>
                  <div className="text-sm text-purple-300">Days Recorded</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {(sleepData.reduce((acc, curr) => acc + curr.sleepHours, 0) / sleepData.length || 0).toFixed(1)}h
                  </div>
                  <div className="text-sm text-purple-300">Weekly Average</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold">
                    {Math.round(sleepData.reduce((acc, curr) => acc + curr.quality, 0) / sleepData.length || 0)}%
                  </div>
                  <div className="text-sm text-purple-300">Avg Quality</div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Main Dashboard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Sleep Score Card */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Sleep Score</h2>
              <Activity className="h-5 w-5 text-purple-300" />
            </div>
            <div className="text-4xl font-bold mb-2">{sleepScore}</div>
            <div className="text-purple-300">Good sleep quality</div>
          </div>

          {/* Last Night's Sleep */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Last Night</h2>
              <Clock className="h-5 w-5 text-purple-300" />
            </div>
            <div className="text-4xl font-bold mb-2">{lastNightSleep.toFixed(1)}h</div>
            <div className="text-purple-300">
              {sleepData[0]?.bedtime} - {sleepData[0]?.wakeTime}
            </div>
          </div>

          {/* Weekly Average */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-semibold">Weekly Average</h2>
              <BarChart2 className="h-5 w-5 text-purple-300" />
            </div>
            <div className="text-4xl font-bold mb-2">
              {(sleepData.reduce((acc, curr) => acc + curr.sleepHours, 0) / sleepData.length || 0).toFixed(1)}h
            </div>
            <div className="text-purple-300">
              {sleepData.length} days recorded
            </div>
          </div>

          {/* Sleep Pattern Analysis */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white col-span-full">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-lg font-semibold">Sleep Pattern Analysis</h2>
              <Calendar className="h-5 w-5 text-purple-300" />
            </div>
            <div className="relative">
              <div className="h-48 flex items-end justify-between space-x-2">
                {sleepData.map((data, index) => (
                  <div 
                    key={index} 
                    className="flex-1 relative group"
                    onMouseEnter={() => setActiveDay(index)}
                    onMouseLeave={() => setActiveDay(null)}
                  >
                    <div 
                      className={`${
                        activeDay === index 
                          ? 'bg-purple-400/80' 
                          : 'bg-purple-400/50'
                      } rounded-t-sm transition-all duration-300 cursor-pointer`}
                      style={{ height: `${data.quality}%` }}
                    />
                    {/* Tooltip */}
                    <div className={`
                      absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2
                      bg-white/90 text-purple-900 p-2 rounded-lg shadow-lg
                      transition-opacity duration-200 text-sm whitespace-nowrap
                      ${activeDay === index ? 'opacity-100' : 'opacity-0 pointer-events-none'}
                    `}>
                      <div className="font-semibold">{new Date(data.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}</div>
                      <div>Sleep: {data.sleepHours.toFixed(1)}h</div>
                      <div>Quality: {data.quality}%</div>
                      <div className="text-xs">
                        {data.bedtime} - {data.wakeTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              {/* Y-axis labels */}
              <div className="absolute left-0 top-0 h-full flex flex-col justify-between -ml-6 text-xs text-purple-300">
                <span>100%</span>
                <span>75%</span>
                <span>50%</span>
                <span>25%</span>
                <span>0%</span>
              </div>
            </div>
            <div className="flex justify-between mt-2 text-purple-300 text-sm">
              {sleepData.map((data, index) => (
                <span 
                  key={index}
                  className={`${
                    activeDay === index 
                      ? 'text-white' 
                      : 'text-purple-300'
                  } transition-colors duration-300`}
                >
                  {new Date(data.timestamp).toLocaleDateString('en-US', { weekday: 'short' })}
                </span>
              ))}
            </div>
          </div>

          {/* Tips Section */}
          <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 text-white col-span-full">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold flex items-center space-x-2">
                <Lightbulb className="h-5 w-5 text-yellow-400" />
                <span>Personalized Sleep Tips</span>
              </h2>
              <div className="text-sm text-purple-300">
                Based on your sleep score: {sleepScore}
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {getSleepTips(sleepScore).map((tip, index) => (
                <div 
                  key={index}
                  className="flex items-start space-x-4 p-4 bg-white/5 rounded-lg hover:bg-white/10 transition-all duration-300 transform hover:scale-[1.02]"
                >
                  <div className="flex-shrink-0">
                    {getIconComponent(tip.icon)}
                  </div>
                  <div>
                    <h3 className="font-semibold mb-1">{tip.title}</h3>
                    <p className="text-purple-300 text-sm leading-relaxed">{tip.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyBreakScheduler;