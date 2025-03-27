import React from 'react';

const TabNavigation = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'overview', label: 'OVERVIEW' },
    { id: 'gallery', label: 'GALLERY' },
    { id: 'specifications', label: 'SPECIFICATIONS' },
    { id: 'features', label: 'FEATURES' },
  ];
  
  return (
    <div className="flex flex-wrap border-b border-gray-800 mb-12">
      {tabs.map(tab => (
        <button 
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`py-4 px-6 font-['Orbitron'] text-sm font-medium border-b-2 transition-all duration-300 ${
            activeTab === tab.id 
              ? 'border-cyan-400 text-white' 
              : 'border-transparent text-gray-500 hover:text-gray-300'
          }`}
        >
          {tab.label}
        </button>
      ))}
    </div>
  );
};

export default TabNavigation;