import React from 'react';
import { Tab } from '../types';
import { PenLine, LineChart } from 'lucide-react';

interface BottomNavProps {
  currentTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const BottomNav: React.FC<BottomNavProps> = ({ currentTab, onTabChange }) => {
  return (
    <div className="fixed bottom-0 left-0 w-full bg-white border-t border-gray-100 pb-safe pt-2 px-6 shadow-[0_-4px_20px_rgba(0,0,0,0.03)] z-50">
      <div className="flex justify-around items-center max-w-md mx-auto h-16 pb-2">
        <button
          onClick={() => onTabChange('input')}
          className="flex flex-col items-center justify-center w-20 gap-1 active:scale-95 transition-transform"
        >
          <div className={`p-1.5 rounded-xl transition-colors ${currentTab === 'input' ? 'bg-rose-50' : 'bg-transparent'}`}>
            <PenLine 
              size={24} 
              className={currentTab === 'input' ? 'text-primary' : 'text-gray-300'} 
              strokeWidth={currentTab === 'input' ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs font-medium transition-colors ${currentTab === 'input' ? 'text-primary' : 'text-gray-400'}`}>
            輸入
          </span>
        </button>

        <button
          onClick={() => onTabChange('history')}
          className="flex flex-col items-center justify-center w-20 gap-1 active:scale-95 transition-transform"
        >
           <div className={`p-1.5 rounded-xl transition-colors ${currentTab === 'history' ? 'bg-rose-50' : 'bg-transparent'}`}>
            <LineChart 
              size={24} 
              className={currentTab === 'history' ? 'text-primary' : 'text-gray-300'} 
              strokeWidth={currentTab === 'history' ? 2.5 : 2}
            />
          </div>
          <span className={`text-xs font-medium transition-colors ${currentTab === 'history' ? 'text-primary' : 'text-gray-400'}`}>
            歷程
          </span>
        </button>
      </div>
    </div>
  );
};

export default BottomNav;