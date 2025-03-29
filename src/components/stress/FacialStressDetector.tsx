import React, { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js'; // Ensure face-api.js is installed and imported correctly


interface FacialStressDetectorProps {
  onStressChange: (stressLevel: number) => void;
}

const FacialStressDetector: React.FC<FacialStressDetectorProps> = ({ onStressChange }: FacialStressDetectorProps) => {

  const videoRef = useRef<HTMLVideoElement>(null);
  const [stressLevel, setStressLevel] = useState(0);
  const [displayedStressLevel, setDisplayedStressLevel] = useState(0);
  const [isModelLoaded, setIsModelLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isStreaming, setIsStreaming] = useState(false);
  const streamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const lastUpdateRef = useRef<number>(0);
  const stressUpdateIntervalRef = useRef<NodeJS.Timeout | null>(null);

  // Update displayed stress level smoothly
  useEffect(() => {
    const updateDisplayedStress = () => {
      setDisplayedStressLevel(prev => {
        const diff = stressLevel - prev;
        if (Math.abs(diff) < 1) return stressLevel;
        return prev + (diff * 0.1); // Smooth transition
      });
    };

    // Update every 100ms for smooth animation
    stressUpdateIntervalRef.current = setInterval(updateDisplayedStress, 100);

    return () => {
      if (stressUpdateIntervalRef.current) {
        clearInterval(stressUpdateIntervalRef.current);
      }
    };
  }, [stressLevel]);

  useEffect(() => {
const loadModels = async () => {
    setError(null);
    setLoadingProgress(0);

      try {
        setError(null);
        setLoadingProgress(0);

        // Define model URLs with full paths
        const modelPath = '/models'; // Ensure this path is correct

        const models = [ // Define model URLs with full paths

          { name: 'tiny_face_detector', url: `${modelPath}/tiny_face_detector_model-weights_manifest.json` },
          { name: 'face_expression', url: `${modelPath}/face_expression_model-weights_manifest.json` },
          { name: 'face_landmarks', url: `${modelPath}/face_landmark_68_model-weights_manifest.json` }
        ];

        // Load models sequentially with progress tracking
        for (let i = 0; i < models.length; i++) {
          const model = models[i];
          console.log(`Loading model: ${model.name} from ${model.url}`);

          
          try {
            switch (model.name) {
              case 'tiny_face_detector':
                await faceapi.nets.tinyFaceDetector.loadFromUri(modelPath);
                break;
              case 'face_expression':
                await faceapi.nets.faceExpressionNet.loadFromUri(modelPath);
                break;
              case 'face_landmarks':
                await faceapi.nets.faceLandmark68Net.loadFromUri(modelPath);
                break;
            }
            console.log(`Successfully loaded model: ${model.name}`);
          } catch (err) {
            console.error(`Error loading model ${model.name}:`, err);
            throw new Error(`Failed to load model: ${model.name}. Please check if the model files are present in the /public/models directory.`);
          }
          
          setLoadingProgress(((i + 1) / models.length) * 100); // Update loading progress

        }

        setIsModelLoaded(true); // All models loaded successfully

        console.log('All face detection models loaded successfully');
      } catch (err) {
        console.error('Error loading models from /models directory:', err);

        setError(err instanceof Error ? err.message : 'Failed to load face detection models. Please check if the model files are present in the /public/models directory.');
      }
    };

    loadModels();
    return () => {
      stopStreaming();
    };
  }, []);

  const startStreaming = async () => {
    try {
      setError(null);
      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: {
          width: 640,
          height: 480,
          facingMode: 'user'
        } 
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        // Wait for video to be ready
        await new Promise((resolve) => {
          if (videoRef.current) {
            videoRef.current.onloadedmetadata = resolve;
          }
        });
      }
      
      streamRef.current = stream;
      setIsStreaming(true);
      startDetection();
    } catch (err) {
      console.error('Error accessing webcam:', err);
      setError('Unable to access webcam. Please make sure you have granted camera permissions.');
    }
  };

  const stopStreaming = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    if (stressUpdateIntervalRef.current) {
      clearInterval(stressUpdateIntervalRef.current);
    }
    setIsStreaming(false);
  };

  const startDetection = async () => {
    if (!videoRef.current || !isModelLoaded || !canvasRef.current) {
      console.error('Required refs or model not ready:', {
        video: !!videoRef.current,
        modelLoaded: isModelLoaded,
        canvas: !!canvasRef.current
      });
      return;
    }

    const video = videoRef.current;
    const canvas = canvasRef.current;
    
    // Ensure video dimensions are set
    if (!video.width || !video.height) {
      video.width = 640;
      video.height = 480;
    }
    
    const displaySize = { width: video.width, height: video.height };
    
    // Set canvas size to match video
    canvas.width = displaySize.width;
    canvas.height = displaySize.height;
    faceapi.matchDimensions(canvas, displaySize);

    const detectFaces = async () => {
      try {
        // Detect faces with expressions
        const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions({ 
            inputSize: 320, 
            scoreThreshold: 0.3 
          })).withFaceExpressions();


        // Clear canvas
        const context = canvas.getContext('2d');
        if (context) {
          context.clearRect(0, 0, canvas.width, canvas.height);
        }

        // Draw detections
        const resizedDetections = faceapi.resizeResults(detections, displaySize);
        faceapi.draw.drawDetections(canvas, resizedDetections);
        faceapi.draw.drawFaceExpressions(canvas, resizedDetections, 0.05);

        const currentTime = Date.now();
        // Update stress level every second
        if (currentTime - lastUpdateRef.current >= 1000) {
          if (detections.length > 0) {
            const expressions = detections[0].expressions;
            const stressScore = calculateStressScore(expressions);
            setStressLevel(stressScore);
            onStressChange(stressScore);
          } else {
            // No face detected, gradually reduce stress level
            setStressLevel(prev => Math.max(0, prev - 2));
            onStressChange(Math.max(0, stressLevel - 2));
          }
          lastUpdateRef.current = currentTime;
        }

        if (isStreaming) {
          animationFrameRef.current = requestAnimationFrame(detectFaces);
        }
      } catch (err) {
        console.error('Error detecting faces:', err);
        if (err instanceof Error && err.message.includes('Failed to load model')) {
          setError('Error detecting faces. Please check if the model files are present in the /public/models directory.');
        }
      }
    };

    // Start detection after a short delay to ensure video is ready
    setTimeout(detectFaces, 100);
  };

const calculateStressScore = (expressions: faceapi.FaceExpressions): number => { // Ensure expressions is of the correct type

    const weights = {
      angry: 100,
      disgusted: 90,
      fearful: 80,
      sad: 70,
      surprised: 40,
      happy: 0
    };

    let totalScore = 0;
    let totalWeight = 0;

    Object.entries(expressions).forEach(([emotion, probability]: [string, number]) => { // Specify types for entries

      if (weights[emotion as keyof typeof weights] !== undefined) {
        totalScore += (weights[emotion as keyof typeof weights] * probability);
        totalWeight += probability;
      }
    });

    return totalWeight > 0 ? Math.round(totalScore / totalWeight) : 0;
  };

  const getStressColor = (level: number): string => {
    if (level < 30) return 'bg-green-500';
    if (level < 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getStressMessage = (level: number): string => {
    if (level < 30) return 'Low Stress';
    if (level < 60) return 'Moderate Stress';
    return 'High Stress';
  };

  return (
    <div className="w-full max-w-md mx-auto space-y-4">
      {error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      ) : (
        <>
          <div className="relative aspect-video">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              className="w-full h-full rounded-lg shadow-lg"
            />
            <canvas
              ref={canvasRef}
              className="absolute top-0 left-0 w-full h-full"
            />
            {!isModelLoaded && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-50 rounded-lg">
                <p className="text-white mb-2">Loading face detection models...</p>
                <div className="w-48 h-2 bg-gray-700 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-blue-500 transition-all duration-300"
                    style={{ width: `${loadingProgress}%` }}
                  />
                </div>
                <p className="text-white mt-2">{Math.round(loadingProgress)}%</p>
              </div>
            )}
          </div>

          <div className="flex justify-center space-x-4">
            {!isStreaming ? (
              <button
                onClick={startStreaming}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Start Detection
              </button>
            ) : (
              <button
                onClick={stopStreaming}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                Stop Detection
              </button>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-lg font-medium">Stress Level:</span>
              <span className="text-lg font-bold">{Math.round(displayedStressLevel)}%</span>
            </div>
            
            <div className="h-6 w-full bg-gray-200 rounded-full overflow-hidden">
              <div
                className={`h-full ${getStressColor(displayedStressLevel)} transition-all duration-300`}
                style={{ width: `${displayedStressLevel}%` }}
              />
            </div>
            
            <p className="text-center font-medium">
              Status: {getStressMessage(displayedStressLevel)}
            </p>
          </div>
        </>
      )}
    </div>
  );
};

export default FacialStressDetector;
