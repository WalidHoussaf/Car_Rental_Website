import React from 'react';
import { useLanguage } from '../../../context/LanguageContext';
import { useTranslations } from '../../../translations';

const PriceRangeFilter = ({ filters, handleFilterChange }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <div className="mb-6 p-5 bg-gray-900 rounded-xl shadow-lg">
      <label className="text-xs font-semibold text-gray-300 mb-3 flex items-center font-['Orbitron']">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-13a1 1 0 10-2 0v.092a4.535 4.535 0 00-1.676.662C6.602 6.234 6 7.009 6 8c0 .99.602 1.765 1.324 2.246.48.32 1.054.545 1.676.662v1.941c-.391-.127-.68-.317-.843-.504a1 1 0 10-1.51 1.31c.562.649 1.413 1.076 2.353 1.253V15a1 1 0 102 0v-.092a4.535 4.535 0 001.676-.662C13.398 13.766 14 12.991 14 12c0-.99-.602-1.765-1.324-2.246A4.535 4.535 0 0011 9.092V7.151c.391.127.68.317.843.504a1 1 0 101.511-1.31c-.563-.649-1.413-1.076-2.354-1.253V5z" clipRule="evenodd" />
        </svg>
        {t('priceRange')}: <span className="ml-1 text-cyan-400">${filters.priceRange[0]}</span> - <span className="text-gray-300">${filters.priceRange[1]}</span>
      </label>

      <div className="flex flex-col gap-6">
        {/* Min Slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-2">
            <span className="font-['Orbitron']">Min</span>
            <span className="font-medium text-cyan-400 font-['Orbitron']">${filters.priceRange[0]}</span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded">
            <div className="absolute h-2 bg-cyan-500 rounded transition-all" style={{ width: `${(filters.priceRange[0] / 1000) * 100}%` }}></div>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[0]}
              onChange={(e) => {
                const newMin = parseInt(e.target.value);
                const newMax = Math.max(filters.priceRange[1], newMin);
                handleFilterChange('priceRange', [newMin, newMax]);
              }}
              className="w-full h-2 appearance-none bg-transparent absolute top-0 left-0 z-10 cursor-pointer"
              style={{ 
                WebkitAppearance: 'none',
                appearance: 'none',
                background: 'transparent',
                cursor: 'pointer',
                opacity: 0, 
              }}
            />
            <div 
              className="absolute left-0 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-cyan-400 shadow-lg rounded-full animate-pulse cursor-pointer z-10" 
              style={{ left: `${(filters.priceRange[0] / 1000) * 100}%`, pointerEvents: 'none' }}
            ></div>
          </div>
        </div>
    
        {/* Max Slider */}
        <div>
          <div className="flex justify-between text-xs text-gray-300 mb-2">
            <span className="font-['Orbitron']">Max</span>
            <span className="font-medium text-gray-300 font-['Orbitron']">${filters.priceRange[1]}</span>
          </div>
          <div className="relative h-2 bg-gray-700 rounded">
            <div className="absolute h-2 bg-gray-300 rounded transition-all" style={{ width: `${(filters.priceRange[1] / 1000) * 100}%` }}></div>
            <input
              type="range"
              min="0"
              max="1000"
              value={filters.priceRange[1]}
              onChange={(e) => {
                const newMax = parseInt(e.target.value);
                const newMin = Math.min(filters.priceRange[0], newMax);
                handleFilterChange('priceRange', [newMin, newMax]);
              }}
              className="w-full h-2 appearance-none bg-transparent absolute top-0 left-0 z-10 cursor-pointer"
              style={{ 
                WebkitAppearance: 'none',
                appearance: 'none',
                background: 'transparent',
                cursor: 'pointer',
                opacity: 0, 
              }}
            />
            <div 
              className="absolute left-0 transform -translate-x-1/2 top-1/2 -translate-y-1/2 w-4 h-4 bg-gray-300 shadow-lg rounded-full animate-pulse cursor-pointer z-10" 
              style={{ left: `${(filters.priceRange[1] / 1000) * 100}%`, pointerEvents: 'none' }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PriceRangeFilter;