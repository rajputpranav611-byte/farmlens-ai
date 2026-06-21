import React, { useState, useEffect } from 'react';
import { History, ChevronRight } from 'lucide-react';
import BottomNav from '../components/BottomNav';

const HistoryScreen = ({ onNavigate, onStartScan }) => {
  const [history, setHistory] = useState([]);

  useEffect(() => {
    // MVP LocalStorage load
    const saved = localStorage.getItem('farmlens_history');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        console.error('Failed to parse history');
      }
    }
  }, []);

  const handleTabChange = (tabId) => {
    if (tabId === 'scan') {
      onStartScan?.();
      return;
    }

    onNavigate?.(tabId);
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans max-w-md mx-auto sm:border-x sm:border-gray-200 relative">
      <header className="px-6 py-5 bg-white text-gray-800 border-b border-gray-100 z-10 sticky top-0 shadow-sm">
        <h1 className="text-xl font-bold tracking-wide">Scan History</h1>
      </header>

      <main className="flex-1 overflow-y-auto px-4 py-6 pb-28">
        {history.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-gray-400 mt-20">
            <History size={48} className="mb-4 opacity-50" />
            <p>No past scans found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {history.map((item) => (
              <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:scale-95 transition-transform">
                <div className="h-12 w-12 bg-green-50 rounded-lg flex items-center justify-center flex-shrink-0">
                  <History size={20} className="text-green-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">{item.disease}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <span className="text-xs text-gray-500">{new Date(item.date).toLocaleDateString()}</span>
                    <span className="text-xs bg-gray-100 px-2 py-0.5 rounded text-gray-600 font-semibold">{(item.confidence * 100).toFixed(0)}%</span>
                  </div>
                </div>
                <div className={`px-2 py-1 rounded text-xs font-semibold whitespace-nowrap ${
                  item.severity === 'High' ? 'bg-red-50 text-red-600' : 
                  item.severity === 'Medium' ? 'bg-yellow-50 text-yellow-600' : 'bg-blue-50 text-blue-600'
                }`}>
                  {item.severity}
                </div>
                <ChevronRight size={20} className="text-gray-300 ml-1" />
              </div>
            ))}
          </div>
        )}
      </main>

      <BottomNav activeTab="history" onTabChange={handleTabChange} />
    </div>
  );
};

export default HistoryScreen;
