import React from 'react';
import FeatureCard from '../FeatureCard';

const FeaturesTab = ({ car }) => {
  return (
    <div className="relative overflow-hidden rounded-lg p-8">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-blue-950 to-black z-0"></div>
     
      {/* Animated Grid Lines */}
      <div className="absolute inset-0 opacity-20 z-0 bg-grid-scan"></div>
     
      {/* Tech Lines */}
      <div className="absolute inset-0 opacity-15 z-0 bg-tech-lines"></div>
     
      {/* Data Stream */}
      <div className="absolute inset-0 opacity-10 z-0 bg-data-stream"></div>
     
      {/* Glowing Circles */}
      <div className="absolute top-20 -right-20 w-80 h-80 bg-blue-500 rounded-full opacity-10 blur-xl z-0 floating-light"></div>
      <div className="absolute -bottom-16 left-20 w-64 h-64 bg-indigo-500 rounded-full opacity-10 blur-xl z-0 floating-light-slow"></div>
     
      {/* Digital Circuit Lines */}
      <div className="absolute bottom-0 right-0 w-full h-40 opacity-20 bg-circuit-pattern z-0"></div>
     
      {/* Content */}
      <div className="relative z-10">
        <div className="mb-12">
          <h2 className="text-3xl font-bold text-white font-['Orbitron'] mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">PREMIUM FEATURES</span>
          </h2>
          <p className="text-gray-300 font-['Orbitron'] text-2xs">Discover the exceptional features that make the {car.name} stand apart.</p>
        </div>
       
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {car.features && car.features.map((feature, index) => (
            <div key={index} className="transform transition-all duration-300 hover:scale-105 hover:z-20">
              <FeatureCard key={index} feature={feature} />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeaturesTab;