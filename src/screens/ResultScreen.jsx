import React, { useRef } from 'react';
import { Share2, Download, ChevronLeft, AlertTriangle, Info, Sprout, TestTube } from 'lucide-react';
import { exportToPDF } from '../utils/pdfExport';
import { shareWhatsApp } from '../utils/shareWhatsApp';
import LanguageToggle from '../components/LanguageToggle';

const ResultScreen = ({ result, onBack, onLanguageChange }) => {
  const resultRef = useRef(null);

  if (!result) return null;

  return (
    <div className="flex flex-col h-screen bg-gray-50 font-sans max-w-md mx-auto relative sm:border-x sm:border-gray-200">
      <header className="px-4 py-4 bg-green-600 text-white flex justify-between items-center z-10 shadow-md">
        <button onClick={onBack} className="p-2 -ml-2 rounded-full active:bg-green-700 transition-colors">
          <ChevronLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Diagnosis</h1>
        <LanguageToggle onLanguageChange={onLanguageChange} />
      </header>

      <main ref={resultRef} className="flex-1 overflow-y-auto px-4 py-6 space-y-6 pb-28 bg-gray-50">
        
        {/* Main Status Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 text-center">
          <div className="h-20 w-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <AlertTriangle size={36} className="text-red-500" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-1">{result.disease}</h2>
          <div className="flex items-center justify-center gap-2 mb-4">
            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-semibold">
              {(result.confidence * 100).toFixed(0)}% Match
            </span>
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
              result.severity === 'High' ? 'bg-red-100 text-red-700' : 
              result.severity === 'Medium' ? 'bg-yellow-100 text-yellow-700' : 
              'bg-blue-100 text-blue-700'
            }`}>
              {result.severity} Severity
            </span>
          </div>
        </div>

        {/* Cause Section */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <Info size={20} className="text-blue-500" />
            <h3 className="text-lg font-bold text-gray-800">Cause</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm">
            {result.cause}
          </p>
        </div>

        {/* Organic Remedy */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-green-200 bg-green-50/30">
          <div className="flex items-center gap-2 mb-3">
            <Sprout size={20} className="text-green-600" />
            <h3 className="text-lg font-bold text-gray-800">Organic Remedy</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-sm whitespace-pre-line">
            {result.organicRemedy}
          </p>
        </div>

        {/* Chemical Remedy */}
        <div className="bg-white rounded-2xl p-5 shadow-sm border border-gray-100">
          <div className="flex items-center gap-2 mb-3">
            <TestTube size={20} className="text-purple-500" />
            <h3 className="text-lg font-bold text-gray-800">Chemical Remedy</h3>
          </div>
          <p className="text-gray-600 leading-relaxed text-sm whitespace-pre-line">
            {result.chemicalRemedy}
          </p>
        </div>

      </main>

      {/* Action Footer */}
      <footer className="absolute bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-6 py-4 pb-safe flex gap-3 z-20 shadow-[0_-4px_15px_rgba(0,0,0,0.05)]">
        <button 
          onClick={() => exportToPDF(resultRef.current, result.disease)}
          className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-800 font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 active:scale-95 transition-all"
        >
          <Download size={20} />
          <span className="text-sm">Save PDF</span>
        </button>
        <button 
          onClick={() => shareWhatsApp(result)}
          className="flex-1 bg-[#25D366] hover:bg-[#20bd5a] text-white font-semibold py-3 px-4 rounded-xl flex items-center justify-center gap-2 shadow-lg shadow-green-200 active:scale-95 transition-all"
        >
          <Share2 size={20} />
          <span className="text-sm">Share</span>
        </button>
      </footer>
    </div>
  );
};

export default ResultScreen;
