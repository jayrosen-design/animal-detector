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
        <div className="bg-white rounded-lg p-6 mb-6 shadow-sm">
          <h2 className="text-xl font-semibold text-primary mb-3">About This Project</h2>
          <p className="text-gray-600 mb-4">
            Welcome to the Animal Detection Prototype, developed by University of Florida College of Engineering students. This AI-powered application is designed to help reduce wildlife-vehicle collisions on roads.
          </p>
          <p className="text-gray-600 mb-4">
            When an animal is detected in an uploaded image or through the camera, the system will identify the species and emit an ultrasonic sound specifically calibrated to safely deter that particular animal from the roadway.
          </p>
          <div className="bg-sage/20 p-4 rounded-lg">
            <h3 className="font-medium text-primary mb-2">How to Use:</h3>
            <ol className="list-decimal list-inside text-gray-600 space-y-1">
              <li>Upload an image or use the camera to capture an animal</li>
              <li>The AI will analyze the image and identify the animal species</li>
              <li>If an animal is detected with high confidence, an appropriate ultrasonic signal will be emitted</li>
              <li>View the detection history in the Log tab to track all identifications</li>
            </ol>
          </div>
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