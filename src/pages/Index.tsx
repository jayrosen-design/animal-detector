import { useState } from 'react';
import Navigation from '@/components/Navigation';
import Upload from '@/components/Upload';
import Camera from '@/components/Camera';
import SessionLog from '@/components/SessionLog';
import { Detection } from '@/utils/types';

const Index = () => {
  const [activeTab, setActiveTab] = useState('upload');
  const [detections, setDetections] = useState<Detection[]>([]);

  const handleDetection = (detection: Detection) => {
    setDetections(prev => [...prev, detection]);
  };

  const handleClearHistory = () => {
    setDetections([]);
  };

  return (
    <div className="min-h-screen bg-sage pb-20">
      <header className="bg-primary text-white p-4 shadow-md">
        <h1 className="text-2xl font-bold text-center">Animal Detector</h1>
      </header>

      <main className="container mx-auto px-4 py-6">
        {activeTab === 'upload' && <Upload onDetection={handleDetection} />}
        {activeTab === 'camera' && <Camera onDetection={handleDetection} />}
        {activeTab === 'log' && <SessionLog detections={detections} onClearHistory={handleClearHistory} />}
      </main>

      <Navigation activeTab={activeTab} onTabChange={setActiveTab} />
    </div>
  );
};

export default Index;