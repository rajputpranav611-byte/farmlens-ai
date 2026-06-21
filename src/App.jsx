import React, { useState } from 'react';
import HomeScreen from './screens/HomeScreen';
import ScanScreen from './screens/ScanScreen';
import ResultScreen from './screens/ResultScreen';
import HistoryScreen from './screens/HistoryScreen';
import StoresScreen from './screens/StoresScreen';
import { getDiagnosis } from './services/geminiService';

const saveScanHistory = (scanResult) => {
  const historyItem = {
    id: Date.now(),
    disease: scanResult.disease,
    date: new Date().toISOString(),
    confidence: scanResult.confidence,
    severity: scanResult.severity
  };

  let savedHistory = [];

  try {
    savedHistory = JSON.parse(localStorage.getItem('farmlens_history') || '[]');
  } catch {
    savedHistory = [];
  }

  const nextHistory = [historyItem, ...savedHistory].slice(0, 20);
  localStorage.setItem('farmlens_history', JSON.stringify(nextHistory));
};

function App() {
  const [activeScreen, setActiveScreen] = useState('home');
  const [scanImage, setScanImage] = useState(null);
  const [result, setResult] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [language, setLanguage] = useState('English');

  const handleStartScan = () => {
    setScanImage(null);
    setResult(null);
    setActiveScreen('scan');
  };

  const handleCapture = async (imageData) => {
    setScanImage(imageData);
    setIsAnalyzing(true);

    try {
      const diagnosis = await getDiagnosis({ image: imageData, language });

      const nextResult = {
        disease: diagnosis.disease || 'Unknown Crop Issue',
        confidence: Number(diagnosis.confidence) || 0,
        severity: diagnosis.severity || 'Unknown',
        cause: diagnosis.cause || 'No cause available.',
        organicRemedy: diagnosis.organicRemedy || 'No organic remedy available.',
        chemicalRemedy: diagnosis.chemicalRemedy || 'No chemical remedy available.'
      };

      setResult(nextResult);
      saveScanHistory(nextResult);
      setActiveScreen('result');
    } catch (error) {
      console.error('Diagnosis failed:', error);
      setResult({
        disease: 'Unknown Crop Issue',
        confidence: 0,
        severity: 'Unknown',
        cause: 'Unable to identify the disease at this time.',
        organicRemedy: 'Please try again with a clearer image or ensure the camera captures the crop area precisely.',
        chemicalRemedy: 'No chemical recommendation available.'
      });
      setActiveScreen('result');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleCloseScan = () => {
    setActiveScreen('home');
    setScanImage(null);
    setResult(null);
  };

  const handleBackFromResult = () => {
    setActiveScreen('home');
    setResult(null);
    setScanImage(null);
  };

  const handleLanguageChange = async (nextLanguage) => {
    setLanguage(nextLanguage);

    if (!result) return;

    setIsAnalyzing(true);
    try {
      const diagnosis = await getDiagnosis({
        disease: result.disease,
        confidence: result.confidence,
        language: nextLanguage
      });
      setResult((prev) => ({
        ...prev,
        disease: diagnosis.disease || prev.disease,
        confidence: Number(diagnosis.confidence ?? prev.confidence),
        severity: diagnosis.severity || prev.severity,
        cause: diagnosis.cause || prev.cause,
        organicRemedy: diagnosis.organicRemedy || prev.organicRemedy,
        chemicalRemedy: diagnosis.chemicalRemedy || prev.chemicalRemedy
      }));
    } catch (error) {
      console.error('Language update failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <>
      {activeScreen === 'home' && (
        <HomeScreen onStartScan={handleStartScan} onNavigate={setActiveScreen} />
      )}

      {activeScreen === 'history' && (
        <HistoryScreen onNavigate={setActiveScreen} onStartScan={handleStartScan} />
      )}

      {activeScreen === 'stores' && (
        <StoresScreen onNavigate={setActiveScreen} onStartScan={handleStartScan} />
      )}

      {activeScreen === 'scan' && (
        <div className="fixed inset-0 z-50">
          <ScanScreen
            onClose={handleCloseScan}
            onCapture={handleCapture}
            isAnalyzing={isAnalyzing}
          />
        </div>
      )}

      {activeScreen === 'result' && result && (
        <ResultScreen
          result={result}
          onBack={handleBackFromResult}
          onLanguageChange={handleLanguageChange}
        />
      )}
    </>
  );
}

export default App;
