import React, { useState, useEffect } from 'react';
import InputView from './components/InputView';
import HistoryView from './components/HistoryView';
import BottomNav from './components/BottomNav';
import { Tab, ToastState } from './types';

const App: React.FC = () => {
  const [currentTab, setCurrentTab] = useState<Tab>('input');
  const [toast, setToast] = useState<ToastState>({ show: false, message: '' });

  const showToast = (message: string) => {
    setToast({ show: true, message });
    setTimeout(() => {
      setToast(prev => ({ ...prev, show: false }));
    }, 3000);
  };

  // Prevent bouncy scroll on mobile safari for the body, allow in content
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    const root = document.getElementById('root');
    if (root) {
      root.style.height = '100vh';
      root.style.overflowY = 'auto';
    }
  }, []);

  return (
    <div className="min-h-screen bg-bg-main relative font-sans">
      
      {/* Main Content Area */}
      <main className="w-full min-h-screen">
        {currentTab === 'input' ? (
          <InputView onSave={showToast} />
        ) : (
          <HistoryView onNavigateToInput={() => setCurrentTab('input')} />
        )}
      </main>

      {/* Navigation */}
      <BottomNav currentTab={currentTab} onTabChange={setCurrentTab} />

      {/* Toast Notification */}
      <div 
        className={`fixed top-6 left-1/2 transform -translate-x-1/2 bg-gray-800/90 backdrop-blur-sm text-white px-6 py-3 rounded-full shadow-2xl transition-all duration-300 z-[100] flex items-center gap-2 ${
          toast.show ? 'translate-y-0 opacity-100' : '-translate-y-12 opacity-0 pointer-events-none'
        }`}
      >
        <span className="text-sm font-medium">{toast.message}</span>
      </div>
    </div>
  );
};

export default App;