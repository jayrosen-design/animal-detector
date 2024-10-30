import { useState } from 'react';
import { Upload as UploadIcon } from 'lucide-react';
import { predictFromImage } from '@/utils/tensorflow';
import { Detection } from '@/utils/types';
import DetectionResult from './DetectionResult';
import { useToast } from '@/hooks/use-toast';
import { Dialog, DialogContent } from '@/components/ui/dialog';

interface UploadProps {
  onDetection: (detection: Detection) => void;
}

const Upload = ({ onDetection }: UploadProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [currentDetection, setCurrentDetection] = useState<Detection | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const { toast } = useToast();

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsLoading(true);
    try {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrl(imageUrl);
      
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = imageUrl;
      
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
      });
      
      const detection = await predictFromImage(img);
      if (detection) {
        const detectionWithImage = {
          ...detection,
          imageUrl
        };
        setCurrentDetection(detectionWithImage);
        onDetection(detectionWithImage);
      } else {
        toast({
          title: "No animal detected",
          description: "Try uploading a clearer image of an animal.",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Error processing image:', error);
      toast({
        title: "Error processing image",
        description: "Please try again with a different image.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full px-4">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg p-4 mb-4 shadow-sm">
          <p className="text-gray-600">
            UF Engineering Innovation Team 7 developed Animal Detector, an AI prototype to prevent wildlife-vehicle collisions. Upload or capture an animal image, and the AI will identify the species and emit ultrasonic signals to deter wildlife.
          </p>
        </div>

        <label className="block w-full aspect-video bg-sage border-2 border-dashed border-primary rounded-lg cursor-pointer hover:bg-sage/80 transition-colors">
          <div className="flex flex-col items-center justify-center h-full">
            {previewUrl ? (
              <img 
                src={previewUrl} 
                alt="Preview" 
                className="w-full h-full object-contain rounded-lg"
              />
            ) : (
              <>
                <UploadIcon className="w-12 h-12 text-primary mb-2" />
                <span className="text-primary font-medium">Upload Image</span>
              </>
            )}
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
