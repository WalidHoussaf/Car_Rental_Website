import React from 'react';

const SpecsSection = ({ title, icon, specs, specKeys }) => {
  return (
    <div className="bg-gradient-to-br from-gray-900/50 to-black/50 border border-cyan-400 rounded-xl p-6">
      <h3 className="text-xl font-bold text-white font-['Orbitron'] mb-6 flex items-center">
        {icon}
        {title}
      </h3>
      
      <div className="space-y-4">
        {specs && Object.entries(specs)
          .filter(([key]) => specKeys.includes(key))
          .map(([key, value]) => (
            <div key={key} className="flex justify-between items-center py-3 border-b border-cyan-400 last:border-0">
              <span className="text-gray-400 font-['Orbitron'] text-2xs">
                {key.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase())}
              </span>
              <span className="text-white font-['Rationale'] text-xl">
                {value}
              </span>
            </div>
          ))}
      </div>
    </div>
  );
};

export default SpecsSection;