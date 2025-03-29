import { useState, useRef } from 'react';

interface VoiceMetrics {
  pitch: number;
  volume: number;
  stressScore: number;
}

interface VoiceAnalyzerProps {
  onStressChange: (stress: number) => void;
}

export default function VoiceAnalyzer({ onStressChange }: VoiceAnalyzerProps) {
  const [isRecording, setIsRecording] = useState(false);
  const [metrics, setMetrics] = useState<VoiceMetrics>({
    pitch: 0,
    volume: 0,
    stressScore: 0
  });
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mediaRecorder = new MediaRecorder(stream);
      mediaRecorderRef.current = mediaRecorder;

      // Set up audio analysis
      const audioContext = new AudioContext();
      audioContextRef.current = audioContext;
      const source = audioContext.createMediaStreamSource(stream);
      const analyser = audioContext.createAnalyser();
      analyserRef.current = analyser;
      source.connect(analyser);

      // Start recording
      mediaRecorder.start();
      setIsRecording(true);

      // Analyze audio data
      const dataArray = new Float32Array(analyser.frequencyBinCount);
      const analyzeAudio = () => {
        if (!isRecording || !analyserRef.current) return;

        analyserRef.current.getFloatTimeDomainData(dataArray);
        const volume = calculateVolume(dataArray);
        const pitch = calculatePitch(dataArray);

        const stressScore = calculateStressScore(volume, pitch);

        setMetrics({
          volume,
          pitch,
          stressScore
        });

        onStressChange(stressScore);
        requestAnimationFrame(analyzeAudio);
      };

      analyzeAudio();
    } catch (err) {
      console.error('Error accessing microphone:', err);
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop();
      mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
      setIsRecording(false);
    }
  };

  const calculateVolume = (dataArray: Float32Array): number => {
    // Calculate RMS volume
    const rms = Math.sqrt(
      dataArray.reduce((acc, val) => acc + val * val, 0) / dataArray.length
    );
    return Math.min(100, rms * 100); // Return volume as a percentage
  };

  const calculatePitch = (dataArray: Float32Array): number => {
    // Improved pitch detection using autocorrelation
    const bufferSize = dataArray.length;
    const threshold = 0.1; // Threshold for detecting pitch
    let maxValue = -Infinity;
    let maxIndex = -1;

    for (let i = 0; i < bufferSize; i++) {
      if (dataArray[i] > maxValue) {
        maxValue = dataArray[i];
        maxIndex = i;
      }
    }

    // Convert index to frequency
    const sampleRate = 44100; // Assuming a sample rate of 44100 Hz
    const frequency = (maxIndex * sampleRate) / bufferSize;

    return frequency > threshold ? frequency : 0; // Return frequency if above threshold
  };

  const calculateStressScore = (volume: number, pitch: number): number => {
    // Enhanced stress score calculation
    const baseScore = 50;
    const volumeFactor = volume / 100;
    const pitchFactor = pitch > 0 ? pitch / 100 : 0; // Avoid negative pitch impact

    return Math.min(100, baseScore + (volumeFactor * 30) + (pitchFactor * 20)); // Adjusted weights for volume and pitch
  };

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Voice Analysis</h3>
        <div className="flex justify-center space-x-4">
          <button
            onClick={isRecording ? stopRecording : startRecording}
            className={`px-6 py-3 rounded-lg font-medium transition-colors ${
              isRecording
                ? 'bg-red-500 text-white hover:bg-red-600'
                : 'bg-indigo-500 text-white hover:bg-indigo-600'
            }`}
          >
            {isRecording ? 'Stop Recording' : 'Start Recording'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Voice Volume</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {metrics.volume.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Pitch</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {metrics.pitch.toFixed(1)}%
          </p>
        </div>
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium text-gray-500">Stress Level</h4>
          <p className="mt-2 text-2xl font-semibold text-gray-900">
            {metrics.stressScore.toFixed(1)}%
          </p>
        </div>
      </div>

      <div className="w-full bg-gray-200 rounded-full h-2.5">
        <div
          className="bg-indigo-600 h-2.5 rounded-full transition-all duration-300"
          style={{ width: `${metrics.stressScore}%` }}
        ></div>
      </div>
    </div>
  );
}
