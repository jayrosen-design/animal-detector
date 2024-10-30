import { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { predictFromImage } from '@/utils/tensorflow';
import { Detection } from '@/utils/types';
import DetectionResult from './DetectionResult';

interface UploadProps {
  onDetection: (detection: Detection) => void;
}

const Upload = ({ onDetection }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const img = new Image();
      img.src = URL.createObjectURL(file);
      await img.decode();
      
      const detection = await predictFromImage(img);
      if (detection) {
        setCurrentDetection(detection);
        onDetection(detection);
      }
    } catch (error) {
      console.error('Error processing image:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <label className="block w-full aspect-video bg-sage border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-sage/80 transition-colors">
          <div className="flex flex-col items-center justify-center h-full">
            <UploadIcon className="w-12 h-12 text-primary mb-2" />
            <span className="text-primary font-medium">Upload Image</span>
            <input
              type="file"
              className="hidden"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={isLoading}
            />
          </div>
        </label>

        {isLoading && (
          <div className="mt-4 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
            <p className="mt-2 text-gray-600">Processing image...</p>
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

export default Upload;