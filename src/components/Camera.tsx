import { useState, useRef, useEffect } from 'react';
import { loadModel } from '@/utils/tensorflow';
import { Detection, AUDIO_RANGES } from '@/utils/types';
import DetectionResult from './DetectionResult';
import { Camera as CameraIcon } from 'lucide-react';
import { Button } from './ui/button';
import CameraDisplay from './camera/CameraDisplay';
import CameraControls from './camera/CameraControls';

interface CameraProps {
  onDetection: (detection: Detection) => void;
}

const Camera = ({ onDetection }: CameraProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [isLive, setIsLive] = useState(true);
  const [devices, setDevices] = useState<MediaDeviceInfo[]>([]);
  const [currentDeviceIndex, setCurrentDeviceIndex] = useState(0);
  const [capturedImage, setCapturedImage] = useState<string | undefined>();
  
  const webcamRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const getVideoDevices = async () => {
      try {
        const devices = await navigator.mediaDevices.enumerateDevices();
        const videoDevices = devices.filter(device => device.kind === 'videoinput');
        setDevices(videoDevices);
      } catch (err) {
        console.error('Error getting video devices:', err);
      }
    };

    const initModel = async () => {
      try {
        const model = await loadModel();
        modelRef.current = model;
        setIsLoading(false);
      } catch (err) {
        setError('Failed to load model. Please try again.');
        setIsLoading(false);
      }
    };

    getVideoDevices();
    initModel();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  const handleWebcamSetup = (webcam: any) => {
    webcamRef.current = webcam;
    const updateFrame = () => {
      if (!isLive || !webcamRef.current) return;
      webcamRef.current.update();
      animationFrameRef.current = requestAnimationFrame(updateFrame);
    };
    updateFrame();
  };

  const handleCapture = async () => {
    if (!webcamRef.current || !modelRef.current) return;
    
    setIsLive(false);
    try {
      const canvas = webcamRef.current.canvas;
      setCapturedImage(canvas.toDataURL('image/jpeg'));
      
      const predictions = await modelRef.current.predict(canvas);
      const bestPrediction = predictions.reduce((prev: any, current: any) => 
        (prev.probability > current.probability) ? prev : current
      );
      
      if (bestPrediction.probability >= 0.5) {
        const detection: Detection = {
          animal: bestPrediction.className,
          confidence: bestPrediction.probability,
          audioRange: AUDIO_RANGES[bestPrediction.className],
          timestamp: new Date(),
          imageUrl: canvas.toDataURL('image/jpeg')
        };
        setCurrentDetection(detection);
        onDetection(detection);
      }
    } catch (err) {
      setError('Error processing image. Please try again.');
    }
  };

  const handleResume = () => {
    setIsLive(true);
    setCurrentDetection(null);
    setCapturedImage(undefined);
    setError(null);
  };

  const handleSwitchCamera = async () => {
    if (devices.length <= 1) return;
    
    if (webcamRef.current) {
      webcamRef.current.stop();
    }

    const nextIndex = (currentDeviceIndex + 1) % devices.length;
    setCurrentDeviceIndex(nextIndex);
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-4xl mx-auto">
        {error ? (
          <div className="p-4 text-center">
            <CameraIcon className="w-12 h-12 text-red-500 mx-auto mb-2" />
            <p className="text-red-500">{error}</p>
            <Button onClick={handleResume} className="mt-4">
              Try Again
            </Button>
          </div>
        ) : (
          <div className="relative">
            <CameraDisplay
              isLive={isLive}
              deviceId={devices[currentDeviceIndex]?.deviceId}
              onWebcamSetup={handleWebcamSetup}
              capturedImage={capturedImage}
            />
            <CameraControls
              isLive={isLive}
              devices={devices}
              currentDeviceIndex={currentDeviceIndex}
              onCapture={handleCapture}
              onResume={handleResume}
              onSwitchCamera={handleSwitchCamera}
            />
          </div>
        )}

        {currentDetection && (
          <div className="mt-4">
            <DetectionResult detection={currentDetection} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Camera;
