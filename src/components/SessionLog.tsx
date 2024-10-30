import { useState } from 'react';
import { Detection } from '@/utils/types';
import { ArrowUpDown, Trash2, CircleCheck, CircleX } from 'lucide-react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { format } from 'date-fns';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { playFrequency } from '@/utils/audio';

interface SessionLogProps {
  detections: Detection[];
  onClearHistory: () => void;
}

const SessionLog = ({ detections, onClearHistory }: SessionLogProps) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const { toast } = useToast();

  const sortedDetections = [...detections].sort((a, b) => {
    const comparison = a.timestamp.getTime() - b.timestamp.getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const getSignalEmitted = (detection: Detection) => {
    if (detection.confidence >= 0.75) {
      const range = detection.audioRange;
      const [min, max] = range.split('-').map(n => parseFloat(n));
      const midRange = ((min + max) / 2).toFixed(1);
      return midRange;
    }
    return null;
  };

  const handlePlaySignal = (frequency: number) => {
    playFrequency(frequency);
  };

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  const handleClearHistory = () => {
    onClearHistory();
    toast({
      title: "History cleared",
      description: "Detection history has been cleared successfully.",
    });
  };

  return (
    <div className="w-full px-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="p-4 border-b border-gray-200 flex justify-between items-center">
          <h2 className="text-lg font-semibold text-primary">Detection History</h2>
          <div className="flex gap-2">
            <button
              onClick={toggleSort}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}
            </button>
            <Button
              variant="destructive"
              size="sm"
              onClick={handleClearHistory}
              className="flex items-center gap-1"
            >
              <Trash2 className="w-4 h-4" />
              Clear History
            </Button>
          </div>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="bg-sage/50">
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Image</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Time</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Animal</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Confidence</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Audio Range</th>
                <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Signal Emitted</th>
              </tr>
            </thead>
            <tbody>
              {sortedDetections.map((detection, index) => {
                const signalFrequency = getSignalEmitted(detection);
                return (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-sage/20 transition-colors"
                  >
                    <td className="px-4 py-3">
                      <button
                        onClick={() => setSelectedImage(detection.imageUrl)}
                        className="w-12 h-12 rounded overflow-hidden"
                      >
                        <img
                          src={detection.imageUrl}
                          alt={detection.animal}
                          className="w-full h-full object-cover"
                        />
                      </button>
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {format(detection.timestamp, 'MM/dd/yy h:mm a')}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {detection.animal}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {(detection.confidence * 100).toFixed(1)}%
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {detection.audioRange}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      <div className="flex items-center gap-2">
                        {signalFrequency ? (
                          <>
                            <CircleCheck className="w-4 h-4 text-green-500" />
                            <button
                              onClick={() => handlePlaySignal(parseFloat(signalFrequency))}
                              className="text-primary hover:underline cursor-pointer"
                            >
                              {signalFrequency} kHz signal emitted
                            </button>
                          </>
                        ) : (
                          <>
                            <CircleX className="w-4 h-4 text-red-500" />
                            No signal emitted
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {sortedDetections.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-4 py-8 text-center text-gray-500">
                    No detections yet. Try uploading an image or using the camera!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
        <DialogContent className="max-w-3xl">
          {selectedImage && (
            <img
              src={selectedImage}
              alt="Full size preview"
              className="w-full h-auto rounded-lg"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SessionLog;