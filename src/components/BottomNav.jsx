import React from 'react';
import { Home, History, Camera, MapPin } from 'lucide-react';

const BottomNav = ({ activeTab = 'home', onTabChange }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'history', label: 'History', icon: History },
    { id: 'scan', label: 'Scan', icon: Camera, isPrimary: true },
    { id: 'stores', label: 'Stores', icon: MapPin },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-2 pb-safe z-50">
      <div className="flex justify-between items-end max-w-md mx-auto">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;

          if (tab.isPrimary) {
            return (
              <div key={tab.id} className="relative pb-2">
                <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
                  <button
                    onClick={() => onTabChange?.(tab.id)}
                    className="bg-green-600 text-white p-4 rounded-full shadow-lg shadow-green-200 active:scale-95 transition-all flex flex-col items-center justify-center"
                    aria-label="Scan"
                  >
                    <Icon size={28} />
                  </button>
                </div>
                <span className="text-xs font-medium text-gray-800 opacity-0">Scan</span> {/* Invisible text for spacing */}
              </div>
            );
          }

          return (
            <button
              key={tab.id}
              onClick={() => onTabChange?.(tab.id)}
              className={`flex flex-col items-center pb-2 transition-colors ${
                isActive ? 'text-green-600' : 'text-gray-400 hover:text-green-500'
              }`}
            >
              <Icon size={24} />
              <span className="text-xs mt-1 font-medium">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
