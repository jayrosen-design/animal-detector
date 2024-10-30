import { useEffect, useRef, useState } from 'react';
import { Camera as CameraIcon } from 'lucide-react';
import { loadModel, setupWebcam } from '@/utils/tensorflow';
import { Detection, AUDIO_RANGES } from '@/utils/types';
import DetectionResult from './DetectionResult';
import { Button } from './ui/button';

interface CameraProps {
  onDetection: (detection: Detection) => void;
}

const Camera = ({ onDetection }: CameraProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [isCapturing, setIsCapturing] = useState(true);
  const webcamRef = useRef<any>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const initCamera = async () => {
      try {
        await loadModel();
        const webcam = await setupWebcam();
        webcamRef.current = webcam;
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(webcam.canvas);
        }
        
        await webcam.play();
        setIsLoading(false);
        
        const predict = async () => {
          if (!isCapturing) return;
          
          const predictions = await webcamRef.current.model.predict(webcam.canvas);
          const bestPrediction = predictions.reduce((prev: any, current: any) => 
            (prev.probability > current.probability) ? prev : current
          );
          
          if (bestPrediction.probability >= 0.5) {
            const imageUrl = webcam.canvas.toDataURL('image/jpeg');
            
            const detection: Detection = {
              animal: bestPrediction.className,
              confidence: bestPrediction.probability,
              audioRange: AUDIO_RANGES[bestPrediction.className],
              timestamp: new Date(),
              imageUrl: imageUrl
            };
            setCurrentDetection(detection);
            onDetection(detection);
            setIsCapturing(false);
          }
          
          webcam.update();
          animationFrameRef.current = requestAnimationFrame(predict);
        };
        
        predict();
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
  }, [onDetection, isCapturing]);

  const handleResume = () => {
    setIsCapturing(true);
    setCurrentDetection(null);
  };

  if (error) {
    return (
      <div className="p-4 text-center">
        <CameraIcon className="w-12 h-12 text-red-500 mx-auto mb-2" />
        <p className="text-red-500">{error}</p>
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
            {!isCapturing && (
              <Button 
                onClick={handleResume} 
                className="mt-4 w-full"
              >
                Resume Camera
              </Button>
            )}
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