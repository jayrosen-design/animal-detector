import { useState } from 'react';
import { Detection } from '@/utils/types';
import { ArrowUpDown } from 'lucide-react';

interface SessionLogProps {
  detections: Detection[];
}

const SessionLog = ({ detections }: SessionLogProps) => {
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

  const sortedDetections = [...detections].sort((a, b) => {
    const comparison = a.timestamp.getTime() - b.timestamp.getTime();
    return sortOrder === 'asc' ? comparison : -comparison;
  });

  const toggleSort = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  return (
    <div className="p-4">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className="p-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-primary">Detection History</h2>
            <button
              onClick={toggleSort}
              className="flex items-center text-gray-600 hover:text-primary transition-colors"
            >
              <ArrowUpDown className="w-4 h-4 mr-1" />
              {sortOrder === 'asc' ? 'Oldest first' : 'Newest first'}
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="bg-sage/50">
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Time</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Animal</th>
                  <th className="px-4 py-2 text-left text-sm font-medium text-gray-600">Audio Range</th>
                </tr>
              </thead>
              <tbody>
                {sortedDetections.map((detection, index) => (
                  <tr
                    key={index}
                    className="border-t border-gray-200 hover:bg-sage/20 transition-colors"
                  >
                    <td className="px-4 py-3 text-sm">
                      {detection.timestamp.toLocaleTimeString()}
                    </td>
                    <td className="px-4 py-3 text-sm font-medium">
                      {detection.animal}
                    </td>
                    <td className="px-4 py-3 text-sm">
                      {detection.audioRange}
                    </td>
                  </tr>
                ))}
                {sortedDetections.length === 0 && (
                  <tr>
                    <td colSpan={3} className="px-4 py-8 text-center text-gray-500">
                      No detections yet. Try uploading an image or using the camera!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SessionLog;