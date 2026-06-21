import React, { useState } from 'react';
import { Camera, Sprout, History } from 'lucide-react';
import CropSelector from '../components/CropSelector';
import BottomNav from '../components/BottomNav';

const HomeScreen = ({ onStartScan, onNavigate }) => {
  const [activeTab, setActiveTab] = useState('home');

  const handleTabChange = (tabId) => {
    if (tabId === 'scan') {
      if (onStartScan) onStartScan();
    } else {
      setActiveTab(tabId);
      onNavigate?.(tabId);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans max-w-md mx-auto sm:border-x sm:border-gray-200 relative">
      {/* Header / Branding */}
      <header className="px-6 py-5 bg-green-600 text-white rounded-b-3xl shadow-md z-10 relative">
        <div className="flex items-center gap-3">
          <Sprout size={28} className="text-white" />
          <h1 className="text-2xl font-bold tracking-wide">FarmLens</h1>
        </div>
        <p className="mt-2 text-green-100 text-sm">Smart AI Crop Care</p>
      </header>

      {/* Main Content */}
      <main className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-28">
        
        {/* Hero / CTA Section */}
        <section className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 flex flex-col items-center text-center space-y-4">
          <div className="h-24 w-24 bg-green-100 rounded-full flex items-center justify-center mb-2">
            <Camera size={40} className="text-green-600" />
          </div>
          <div>
            <h2 className="text-xl font-semibold text-gray-800">Scan Crop Disease</h2>
            <p className="text-sm text-gray-500 mt-1">Identify diseases instantly and get treatment plans.</p>
          </div>
          <button onClick={onStartScan} className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-4 px-6 rounded-xl shadow-lg shadow-green-200 transition-all active:scale-95 flex items-center justify-center gap-2 min-h-[48px]">
            <Camera size={20} />
            <span>Tap to Scan</span>
          </button>
        </section>

        {/* Crop Selector Integration */}
        <section className="-mx-4">
          <CropSelector onSelect={(crop) => console.log('Selected:', crop)} />
        </section>

        {/* Recent Scans Section */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="text-lg font-semibold text-gray-800">Recent Scans</h3>
            <button className="text-sm text-green-600 font-medium active:text-green-800 transition-colors py-2">
              View All
            </button>
          </div>
          <div className="space-y-3">
            {[1, 2].map((_, index) => (
              <div key={index} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 active:bg-gray-50 transition-colors">
                <div className="h-12 w-12 bg-gray-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <History size={20} className="text-gray-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-semibold text-gray-800 truncate">Tomato Leaf Blight</h4>
                  <p className="text-xs text-gray-500 mt-0.5">2 hours ago</p>
                </div>
                <div className="bg-red-50 text-red-600 px-2 py-1 rounded text-xs font-semibold whitespace-nowrap">
                  Detected
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      {/* Bottom Navigation Integration */}
      <BottomNav activeTab={activeTab} onTabChange={handleTabChange} />
    </div>
  );
};

export default HomeScreen;
