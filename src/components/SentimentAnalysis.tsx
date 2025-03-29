import React, { useState } from 'react';
import { HfInference } from '@huggingface/inference';
import { MessageSquare } from 'lucide-react';

interface SentimentAnalysisProps {
  onSentimentChange: (sentiment: number) => void;
}

export const SentimentAnalysis: React.FC<SentimentAnalysisProps> = ({ onSentimentChange }) => {
  const [text, setText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [sentiment, setSentiment] = useState<number | null>(null);

  const analyzeSentiment = async () => {
    if (!text.trim()) return;

    setIsAnalyzing(true);
    try {
      const hf = new HfInference(import.meta.env.VITE_HUGGINGFACE_API_KEY);
      const result = await hf.textClassification({
        model: 'distilbert-base-uncased-finetuned-sst-2-english',
        inputs: text,
      });

      // Convert sentiment to a number between 1-10
      const sentimentScore = result[0].label === 'POSITIVE' 
        ? Math.min(10, Math.round(result[0].score * 10))
        : Math.max(1, Math.round((1 - result[0].score) * 10));

      setSentiment(sentimentScore);
      onSentimentChange(sentimentScore);
    } catch (error) {
      console.error('Error analyzing sentiment:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-lg p-6 mb-8">
      <div className="flex items-center gap-2 mb-4">
        <MessageSquare className="w-5 h-5 text-indigo-600" />
        <h2 className="text-xl font-bold text-gray-800">How do you feel?</h2>
      </div>
      
      <div className="space-y-4">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe your current mood..."
          className="w-full h-24 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
        />
        
        <div className="flex justify-between items-center">
          <button
            onClick={analyzeSentiment}
            disabled={isAnalyzing || !text.trim()}
            className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze Mood'}
          </button>

          {sentiment !== null && (
            <div className="text-right">
              <p className="text-sm text-gray-600">Detected Mood Level:</p>
              <p className="text-2xl font-bold text-indigo-600">{sentiment}/10</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}; 