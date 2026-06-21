import React, { useState } from 'react';

const crops = [
  { id: 'wheat', name: 'Wheat', initials: 'WH' },
  { id: 'tomato', name: 'Tomato', initials: 'TO' },
  { id: 'rice', name: 'Rice', initials: 'RI' },
  { id: 'potato', name: 'Potato', initials: 'PO' },
  { id: 'maize', name: 'Maize', initials: 'MA' },
  { id: 'grape', name: 'Grape', initials: 'GR' }
];

const CropSelector = ({ onSelect }) => {
  const [selectedCrop, setSelectedCrop] = useState('tomato');

  const handleSelect = (crop) => {
    setSelectedCrop(crop.id);
    onSelect?.(crop);
  };

  return (
    <div className="w-full">
      <div className="mb-3 flex items-center justify-between px-4">
        <h3 className="text-lg font-semibold text-gray-800">My Crops</h3>
        <button className="py-2 text-sm font-medium text-green-600 active:text-green-800">
          Add New
        </button>
      </div>

      <div className="no-scrollbar flex snap-x gap-3 overflow-x-auto px-4 pb-4">
        {crops.map((crop) => {
          const isSelected = selectedCrop === crop.id;

          return (
            <button
              key={crop.id}
              type="button"
              onClick={() => handleSelect(crop)}
              className={`flex flex-shrink-0 snap-start items-center gap-2 rounded-xl px-4 py-3 shadow-sm transition-all active:scale-95 ${
                isSelected
                  ? 'bg-green-600 text-white shadow-green-200'
                  : 'border border-gray-200 bg-white text-gray-700 hover:border-green-300'
              }`}
            >
              <span
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold ${
                  isSelected ? 'bg-white/20 text-white' : 'bg-green-50 text-green-700'
                }`}
              >
                {crop.initials}
              </span>
              <span className="whitespace-nowrap font-medium">{crop.name}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default CropSelector;
