import { Detection } from '@/utils/types';

interface DetectionResultProps {
  detection: Detection;
}

const DetectionResult = ({ detection }: DetectionResultProps) => {
  return (
    <div className="bg-white rounded-lg p-6 shadow-md animate-fadeIn">
      <h2 className="text-2xl font-bold text-primary mb-2">
        {detection.animal}
      </h2>
      <div className="mb-4">
        <div className="text-sm text-gray-600">Confidence</div>
        <div className="text-xl font-semibold">
          {(detection.confidence * 100).toFixed(1)}%
        </div>
      </div>
      <div>
        <div className="text-sm text-gray-600">Audio Range</div>
        <div className="text-xl font-semibold">{detection.audioRange}</div>
      </div>
    </div>
  );
};

export default DetectionResult;