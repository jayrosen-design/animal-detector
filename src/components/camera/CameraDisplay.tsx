import { useRef, useEffect } from 'react';
import { setupWebcam } from '@/utils/tensorflow';

interface CameraDisplayProps {
  isLive: boolean;
  deviceId?: string;
  onWebcamSetup: (webcam: any) => void;
  capturedImage?: string;
}

const CameraDisplay = ({ isLive, deviceId, onWebcamSetup, capturedImage }: CameraDisplayProps) => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let webcam: any;

    const initCamera = async () => {
      if (isLive) {
        // Stop any existing webcam before initializing a new one
        if (webcam) {
          webcam.stop();
        }
        
        webcam = await setupWebcam(deviceId);
        
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(webcam.canvas);
        }
        
        await webcam.play();
        onWebcamSetup(webcam);
      }
    };

    initCamera();

    // Cleanup function to stop the webcam when component unmounts or deviceId changes
    return () => {
      if (webcam) {
        webcam.stop();
      }
    };
  }, [isLive, deviceId, onWebcamSetup]); // Added deviceId to dependencies

  return (
    <div className="relative aspect-video bg-sage rounded-lg overflow-hidden">
      {isLive ? (
        <div ref={containerRef} className="w-full h-full" />
      ) : capturedImage && (
        <img src={capturedImage} alt="Captured" className="w-full h-full object-cover" />
      )}
    </div>
  );
};

export default CameraDisplay;