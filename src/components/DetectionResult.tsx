import { Detection } from '@/utils/types';
import { CircleCheck, CircleX } from 'lucide-react';
import { playFrequency } from '@/utils/audio';
import { useEffect } from 'react';

interface DetectionResultProps {
  detection: Detection;
}

const DetectionResult = ({ detection }: DetectionResultProps) => {
  const getSignalEmitted = (detection: Detection) => {
    if (detection.confidence >= 0.75) {
      const range = detection.audioRange;
      const [min, max] = range.split('-').map(n => parseFloat(n));
      const midRange = ((min + max) / 2).toFixed(1);
      return `${midRange} kHz signal emitted`;
    }
    return "No signal emitted";
  };

  const isSignalEmitted = detection.confidence >= 0.75;

  useEffect(() => {
    if (isSignalEmitted) {
      const range = detection.audioRange;
      const [min, max] = range.split('-').map(n => parseFloat(n));
      const midRange = (min + max) / 2;
      playFrequency(midRange);
    }
  }, [detection, isSignalEmitted]);

  return (
    <div className="bg-white rounded-lg p-6 shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary mb-2">
        {detection.animal}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div>
          <div className="text-sm text-gray-600">Confidence</div>
          <div className="text-xl font-semibold">
            {(detection.confidence * 100).toFixed(1)}%
          </div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Audio Range</div>
          <div className="text-xl font-semibold">{detection.audioRange}</div>
        </div>
        <div>
          <div className="text-sm text-gray-600">Signal Status</div>
          <div className="text-xl font-semibold flex items-center gap-2">
            {isSignalEmitted ? (
              <CircleCheck className="w-5 h-5 text-green-500" />
            ) : (
              <CircleX className="w-5 h-5 text-red-500" />
            )}
            {getSignalEmitted(detection)}
          </div>
        </div>
      </div>
    </div>
  );
};

export default DetectionResult;