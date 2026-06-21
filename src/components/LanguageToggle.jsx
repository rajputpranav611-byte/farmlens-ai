import React, { useState } from 'react';

const languages = [
  { code: 'EN', name: 'English' },
  { code: 'HI', name: 'Hindi' },
  { code: 'GU', name: 'Gujarati' }
];

const LanguageToggle = ({ onLanguageChange }) => {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeLanguage = languages[activeIndex];

  const cycleLanguage = () => {
    const nextIndex = (activeIndex + 1) % languages.length;
    const nextLanguage = languages[nextIndex];

    setActiveIndex(nextIndex);
    onLanguageChange?.(nextLanguage.name);
  };

  return (
    <button
      type="button"
      onClick={cycleLanguage}
      className="min-w-[48px] rounded-full border border-white/40 bg-white/20 px-3 py-1 text-sm font-bold text-white shadow-sm transition-colors hover:bg-white/30"
      aria-label={`Language: ${activeLanguage.name}`}
    >
      {activeLanguage.code}
    </button>
  );
};

export default LanguageToggle;
