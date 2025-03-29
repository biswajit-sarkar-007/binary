import React, { useEffect, useRef, useState } from 'react';

interface VoiceStressDetectorProps {
  onStressChange: (stressLevel: number) => void;
}

const VoiceStressDetector: React.FC<VoiceStressDetectorProps> = ({ onStressChange }) => {
  const [isRecording, setIsRecording] = useState(false);
  const [stressLevel, setStressLevel] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number>();
  const volumeHistoryRef = useRef<number[]>([]);
  const frequencyHistoryRef = useRef<number[]>([]);

  useEffect(() => {
    return () => {
      stopRecording();
    };
  }, []);

  const startRecording = async () => {
    try {
      // Request microphone access with specific constraints
      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
          sampleRate: 44100
        } 
      });
      streamRef.current = stream;

      // Create and initialize audio context
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      await audioContext.resume(); // Ensure context is running
      audioContextRef.current = audioContext;

      // Create and configure audio nodes
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyser.fftSize = 2048;
      analyser.smoothingTimeConstant = 0.8;
      analyserRef.current = analyser;

      // Connect the audio nodes
      source.connect(analyser);

      // Start analyzing
      analyzeAudio();
      setIsRecording(true);
      setError(null);
    } catch (err) {
      console.error('Error in startRecording:', err);
      setError(err instanceof Error ? err.message : 'Unable to access microphone');
      stopRecording();
    }
  };

  const stopRecording = () => {
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
        streamRef.current = null;
      }
      if (audioContextRef.current) {
        audioContextRef.current.close();
        audioContextRef.current = null;
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      volumeHistoryRef.current = [];
      frequencyHistoryRef.current = [];
      setIsRecording(false);
    } catch (err) {
      console.error('Error in stopRecording:', err);
      setError('Error stopping recording');
    }
  };

  const analyzeAudio = () => {
    try {
      if (!analyserRef.current) return;

      const analyser = analyserRef.current;
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      analyser.getFloatFrequencyData(dataArray);

      // Calculate average volume in dB
      const averageVolume = dataArray.reduce((a, b) => a + b, 0) / dataArray.length;
      
      // Convert dB to linear scale (0-1)
      const linearVolume = Math.pow(10, averageVolume / 20);
      
      // Calculate dominant frequency
      const dominantFrequency = calculateDominantFrequency(dataArray);
      
      // Add to history
      volumeHistoryRef.current.push(linearVolume);
      frequencyHistoryRef.current.push(dominantFrequency);
      
      // Keep only last 20 samples
      if (volumeHistoryRef.current.length > 20) {
        volumeHistoryRef.current.shift();
        frequencyHistoryRef.current.shift();
      }

      // Calculate stress based on multiple factors
      const newStressLevel = calculateStressLevel(
        volumeHistoryRef.current,
        frequencyHistoryRef.current
      );
      
      setStressLevel(newStressLevel);
      onStressChange(newStressLevel);

      // Continue analyzing
      animationFrameRef.current = requestAnimationFrame(analyzeAudio);
    } catch (err) {
      console.error('Error in analyzeAudio:', err);
      stopRecording();
    }
  };

  const calculateDominantFrequency = (dataArray: Float32Array): number => {
    let maxValue = -Infinity;
    let dominantFreq = 0;
    
    for (let i = 0; i < dataArray.length; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        dominantFreq = i;
      }
    }
    
    return dominantFreq;
  };

  const calculateStressLevel = (volumes: number[], frequencies: number[]): number => {
    if (volumes.length < 2 || frequencies.length < 2) return 0;

    // Calculate volume stress
    const avgVolume = volumes.reduce((a, b) => a + b, 0) / volumes.length;
    const volumeVariation = calculateVariation(volumes);
    const volumeStress = (avgVolume * 0.6 + volumeVariation * 0.4) * 100;

    // Calculate frequency stress
    const avgFrequency = frequencies.reduce((a, b) => a + b, 0) / frequencies.length;
    const frequencyVariation = calculateVariation(frequencies);
    const frequencyStress = (frequencyVariation / avgFrequency) * 100;

    // Combine stresses with weights
    const stressLevel = (volumeStress * 0.7 + frequencyStress * 0.3);
    return Math.min(Math.max(Math.round(stressLevel), 0), 100);
  };

  const calculateVariation = (values: number[]): number => {
    if (values.length < 2) return 0;
    const mean = values.reduce((a, b) => a + b, 0) / values.length;
    const variance = values.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / values.length;
    return Math.sqrt(variance);
  };

  const getStressColor = (level: number): string => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStressMessage = (level: number): string => {
    if (level < 30) return 'Low Voice Stress';
    if (level < 60) return 'Moderate Voice Stress';
    return 'High Voice Stress';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <div className="space-y-4">
          <div className="flex justify-center">
            <button
              onClick={isRecording ? stopRecording : startRecording}
              className={`px-6 py-3 rounded-full font-medium transition-colors ${
                isRecording
                  ? 'bg-red-500 hover:bg-red-600 text-white'
                  : 'bg-blue-500 hover:bg-blue-600 text-white'
              }`}
            >
              {isRecording ? 'Stop Recording' : 'Start Recording'}
            </button>
          </div>

          {isRecording && (
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-lg font-medium">Voice Stress Level:</span>
                <span className="text-lg font-bold">{stressLevel}%</span>
              </div>
              
              <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
                <div
                  className={`h-full ${getStressColor(stressLevel)} transition-all duration-300`}
                  style={{ width: `${stressLevel}%` }}
                />
              </div>
              
              <p className="text-center font-medium">
                Status: {getStressMessage(stressLevel)}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default VoiceStressDetector; 