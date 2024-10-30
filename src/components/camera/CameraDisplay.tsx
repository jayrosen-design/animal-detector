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
    if (isLive) {
      const initCamera = async () => {
        const webcam = await setupWebcam(deviceId);
        if (containerRef.current) {
          containerRef.current.innerHTML = '';
          containerRef.current.appendChild(webcam.canvas);
        }
        await webcam.play();
        onWebcamSetup(webcam);
      };

      initCamera();
    }
  }, [isLive, deviceId, onWebcamSetup]);

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