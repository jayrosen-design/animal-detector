import { useEffect, useRef, useState } from 'react';
import { loadModel, setupWebcam } from '@/utils/tensorflow';
import { Detection, AUDIO_RANGES } from '@/utils/types';
import DetectionResult from './DetectionResult';
import { Button } from './ui/button';
import { Camera as CameraIcon } from 'lucide-react';

interface CameraProps {
  onDetection: (detection: Detection) => void;
}

const Camera = ({ onDetection }: CameraProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [isLive, setIsLive] = useState(true);
  const webcamRef = useRef<any>(null);
  const modelRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const initCamera = async () => {
      try {
        const model = await loadModel();
        modelRef.current = model;
        const webcam = await setupWebcam();
        webcamRef.current = webcam;
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(webcam.canvas);
        }
        
        await webcam.play();
        setIsLoading(false);
        
        const updateFrame = () => {
          if (!isLive || !webcamRef.current) return;
          webcamRef.current.update();
          animationFrameRef.current = requestAnimationFrame(updateFrame);
        };
        
        updateFrame();
      } catch (err) {
        setError('Failed to access camera. Please ensure you have granted camera permissions.');
        setIsLoading(false);
      }
    };

    initCamera();

    return () => {
      if (webcamRef.current) {
        webcamRef.current.stop();
      }
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isLive]);

  const handleCapture = async () => {
    if (!webcamRef.current || !modelRef.current) return;
    
    setIsLive(false);
    try {
      const predictions = await modelRef.current.predict(webcamRef.current.canvas);
      const bestPrediction = predictions.reduce((prev: any, current: any) => 
        (prev.probability > current.probability) ? prev : current
      );
      
      if (bestPrediction.probability >= 0.5) {
        const imageUrl = webcamRef.current.canvas.toDataURL('image/jpeg');
        
        const detection: Detection = {
          animal: bestPrediction.className,
          confidence: bestPrediction.probability,
          audioRange: AUDIO_RANGES[bestPrediction.className],
          timestamp: new Date(),
          imageUrl
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
    setError(null);
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <CameraIcon className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
        <Button onClick={handleResume} className="mt-4">
          Try Again
        </Button>
      </div>
    );
  }

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        {isLoading ? (
          <div className="aspect-video bg-sage rounded-lg flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : (
          <>
            <div
              ref={containerRef}
              className="aspect-video bg-sage rounded-lg overflow-hidden"
            />
            <div className="mt-4 space-y-4">
              {isLive ? (
                <Button 
                  onClick={handleCapture} 
                  className="w-full"
                >
                  Capture and Identify
                </Button>
              ) : (
                <Button 
                  onClick={handleResume} 
                  className="w-full"
                >
                  Resume Camera
                </Button>
              )}
            </div>
          </>
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