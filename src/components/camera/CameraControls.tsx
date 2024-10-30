import { Button } from '@/components/ui/button';
import { SwitchCamera } from 'lucide-react';

interface CameraControlsProps {
  isLive: boolean;
  devices: MediaDeviceInfo[];
  currentDeviceIndex: number;
  onCapture: () => void;
  onResume: () => void;
  onSwitchCamera: () => void;
}

const CameraControls = ({
  isLive,
  devices,
  currentDeviceIndex,
  onCapture,
  onResume,
  onSwitchCamera,
}: CameraControlsProps) => {
  return (
    <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 px-4">
      {devices.length > 1 && (
        <Button 
          onClick={onSwitchCamera} 
          variant="outline" 
          className="bg-white/80 hover:bg-white"
        >
          <SwitchCamera className="w-4 h-4 mr-2" />
          Camera {currentDeviceIndex + 1}/{devices.length}
        </Button>
      )}
      {isLive ? (
        <Button 
          onClick={onCapture} 
          className="bg-primary/80 hover:bg-primary"
        >
          Capture and Identify
        </Button>
      ) : (
        <Button 
          onClick={onResume} 
          className="bg-primary/80 hover:bg-primary"
        >
          Resume Camera
        </Button>
      )}
    </div>
  );
};

export default CameraControls;