import { Camera, Upload, List } from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
}

const Navigation = ({ activeTab, onTabChange }: NavigationProps) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white shadow-lg p-4">
      <div className="max-w-md mx-auto flex justify-around items-center">
        <button
          onClick={() => onTabChange('upload')}
          className={cn(
            'flex flex-col items-center p-2 rounded-lg transition-colors',
            activeTab === 'upload' ? 'text-primary' : 'text-gray-500'
          )}
        >
          <Upload className="w-6 h-6" />
          <span className="text-sm mt-1">Upload</span>
        </button>
        <button
          onClick={() => onTabChange('camera')}
          className={cn(
            'flex flex-col items-center p-2 rounded-lg transition-colors',
            activeTab === 'camera' ? 'text-primary' : 'text-gray-500'
          )}
        >
          <Camera className="w-6 h-6" />
          <span className="text-sm mt-1">Camera</span>
        </button>
        <button
          onClick={() => onTabChange('log')}
          className={cn(
            'flex flex-col items-center p-2 rounded-lg transition-colors',
            activeTab === 'log' ? 'text-primary' : 'text-gray-500'
          )}
        >
          <List className="w-6 h-6" />
          <span className="text-sm mt-1">Log</span>
        </button>
      </div>
    </nav>
  );
};

export default Navigation;