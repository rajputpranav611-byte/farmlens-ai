import React, { useEffect, useRef, useState } from 'react';
import { Camera, Image as ImageIcon, X, Zap, RotateCcw } from 'lucide-react';
import useCamera from '../hooks/useCamera';

const ScanScreen = ({ onCapture, onClose, isAnalyzing }) => {
  const { startCamera, stopCamera, captureImage, videoRef, isCameraActive, error, setError } = useCamera();
  const [isLoading, setIsLoading] = useState(false);
  const [capturedImage, setCapturedImage] = useState(null);
  const fileInputRef = useRef(null);
  const isBusy = isLoading || isAnalyzing;

  // Auto-start camera on mount
  useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  const handleCapture = () => {
    setIsLoading(true);
    // Simulate slight delay for UX
    setTimeout(() => {
      const image = captureImage();
      if (image) {
        setCapturedImage(image);
        stopCamera();
      } else {
        setError('Failed to capture image');
      }
      setIsLoading(false);
    }, 500);
  };

  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setIsLoading(true);
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedImage(reader.result);
        stopCamera();
        setIsLoading(false);
      };
      reader.onerror = () => {
        setError('Failed to read file');
        setIsLoading(false);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRetake = () => {
    setCapturedImage(null);
    startCamera();
  };

  const handleAnalyze = () => {
    if (capturedImage && onCapture) {
      onCapture(capturedImage);
    }
  };

  return (
    <div className="flex flex-col h-screen bg-black text-white max-w-md mx-auto relative sm:border-x sm:border-gray-800">
      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20 bg-gradient-to-b from-black/70 to-transparent">
        <button onClick={onClose} className="p-2 rounded-full bg-black/40 backdrop-blur-md active:scale-95 transition-transform">
          <X size={24} className="text-white" />
        </button>
        <span className="font-medium tracking-wide">Scan Crop</span>
        <button className="p-2 rounded-full bg-black/40 backdrop-blur-md active:scale-95 transition-transform">
          <Zap size={24} className="text-white" />
        </button>
      </header>

      {/* Main View Area */}
      <main className="flex-1 relative bg-gray-900 flex items-center justify-center overflow-hidden">
        {isBusy && (
          <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="w-12 h-12 border-4 border-green-500 border-t-transparent rounded-full animate-spin"></div>
            <p className="mt-4 font-medium text-green-400">
              {isAnalyzing ? 'Analyzing crop...' : 'Processing image...'}
            </p>
          </div>
        )}

        {error && !capturedImage && (
          <div className="absolute inset-0 z-20 flex flex-col items-center justify-center px-6 text-center bg-gray-900">
            <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mb-4">
              <Camera size={32} className="text-red-400" />
            </div>
            <h3 className="text-xl font-semibold mb-2">Camera Access Denied</h3>
            <p className="text-gray-400 text-sm mb-6">{error}</p>
            <button 
              onClick={startCamera}
              className="bg-green-600 text-white py-3 px-6 rounded-xl font-semibold active:scale-95 transition-transform w-full max-w-[200px] mb-3"
            >
              Retry Camera
            </button>
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="bg-gray-800 border border-gray-700 text-white py-3 px-6 rounded-xl font-semibold active:scale-95 transition-transform w-full max-w-[200px]"
            >
              Upload Image
            </button>
          </div>
        )}

        {capturedImage ? (
          <img src={capturedImage} alt="Captured crop" className="w-full h-full object-cover" />
        ) : (
          <video 
            ref={videoRef} 
            autoPlay 
            playsInline 
            muted 
            className={`w-full h-full object-cover ${isCameraActive ? 'opacity-100' : 'opacity-0'} transition-opacity duration-500`} 
          />
        )}
        
        {/* Viewfinder Overlay */}
        {!capturedImage && isCameraActive && !error && (
          <div className="absolute inset-0 z-10 pointer-events-none p-8">
            <div className="w-full h-full border-2 border-white/30 rounded-2xl relative">
              {/* Corner brackets */}
              <div className="absolute top-0 left-0 w-8 h-8 border-t-4 border-l-4 border-green-500 rounded-tl-2xl"></div>
              <div className="absolute top-0 right-0 w-8 h-8 border-t-4 border-r-4 border-green-500 rounded-tr-2xl"></div>
              <div className="absolute bottom-0 left-0 w-8 h-8 border-b-4 border-l-4 border-green-500 rounded-bl-2xl"></div>
              <div className="absolute bottom-0 right-0 w-8 h-8 border-b-4 border-r-4 border-green-500 rounded-br-2xl"></div>
            </div>
          </div>
        )}
      </main>

      {/* Bottom Controls */}
      <footer className="bg-black pb-safe pt-6 px-8 z-20 relative rounded-t-3xl border-t border-gray-800">
        {capturedImage ? (
          <div className="flex justify-between items-center pb-6">
            <button 
              onClick={handleRetake}
              className="flex flex-col items-center gap-2 text-white/70 active:text-white transition-colors"
            >
              <div className="p-4 rounded-full bg-white/10">
                <RotateCcw size={24} />
              </div>
              <span className="text-xs font-medium">Retake</span>
            </button>
            <button 
              onClick={handleAnalyze}
              disabled={isBusy}
              className="bg-green-600 hover:bg-green-500 text-white py-4 px-8 rounded-full font-bold shadow-lg shadow-green-600/30 active:scale-95 transition-all text-lg disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isAnalyzing ? 'Analyzing...' : 'Analyze Crop'}
            </button>
          </div>
        ) : (
          <div className="flex justify-between items-center pb-6">
            <button 
              onClick={() => fileInputRef.current?.click()}
              className="flex flex-col items-center gap-2 text-white/70 active:text-white transition-colors"
            >
              <div className="p-4 rounded-full bg-white/10">
                <ImageIcon size={24} />
              </div>
              <span className="text-xs font-medium">Upload</span>
            </button>
            
            <button 
              onClick={handleCapture}
              disabled={!isCameraActive}
              className="w-20 h-20 rounded-full border-4 border-white/20 p-1 active:scale-95 transition-transform disabled:opacity-50"
            >
              <div className="w-full h-full bg-green-500 rounded-full"></div>
            </button>
            
            {/* Hidden file input */}
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={handleFileUpload} 
            />
            
            {/* Empty div for flex spacing balance */}
            <div className="w-[68px]"></div>
          </div>
        )}
      </footer>
    </div>
  );
};

export default ScanScreen;
