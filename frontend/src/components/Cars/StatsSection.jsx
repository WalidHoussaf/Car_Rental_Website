import React from 'react';

const StatsSection = () => {
  // Mock translation function for demo
  const t = (key) => {
    const translations = {
      'stats_vehicles': 'Premium Vehicles',
      'stats_locations': 'Service Locations',
      'stats_rating': 'Customer Rating',
      'stats_support': 'Support Available'
    };
    return translations[key] || key;
  };

  const stats = [
    { value: '50+', label: t('stats_vehicles')},
    { value: '7', label: t('stats_locations')},
    { value: '5', label: t('stats_rating')},
    { value: '24/7', label: t('stats_support')}
  ];

  return (
    <section className="relative py-16 bg-black border-t border-b border-gray-800/50">
      {/* Background gradients */}
      <div className="absolute inset-0 bg-gradient-to-r from-blue-900/5 to-cyan-900/5"></div>
      <div className="absolute inset-0 bg-gradient-radial from-cyan-500/5 via-transparent to-transparent opacity-60"></div>
      
      {/* Subtle grid pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full bg-[linear-gradient(rgba(6,182,212,0.1)_1px,transparent_1px),linear-gradient(90deg,rgba(6,182,212,0.1)_1px,transparent_1px)] bg-[size:50px_50px]"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4">
        {/* Section title */}
        <div className="text-center mb-12">
          <h2 className="text-2xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-200 to-cyan-400 font-['Orbitron'] mb-3">
            Performance Metrics
          </h2>
          <div className="w-24 h-0.5 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mx-auto"></div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
          {stats.map((stat, index) => (
            <div 
              key={index}
              className="group relative text-center p-6 rounded-xl border border-gray-800/30 bg-gradient-to-b from-gray-900/20 to-black/40 backdrop-blur-sm hover:border-cyan-500/30 hover:bg-gradient-to-b hover:from-gray-900/30 hover:to-black/50 transition-all duration-300"
            >
              {/* Subtle glow effect on hover */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-cyan-500/0 to-blue-500/0 group-hover:from-cyan-500/5 group-hover:to-blue-500/5 transition-all duration-300"></div>
              
              {/* Icon */}
              <div className="text-2xl mb-3 opacity-60 group-hover:opacity-80 transition-opacity duration-300 filter grayscale group-hover:grayscale-0">
                {stat.icon}
              </div>
              
              {/* Value */}
              <div className="relative text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-3 group-hover:from-cyan-100 group-hover:to-cyan-300 transition-all duration-300">
                {stat.value}
              </div>
              
              {/* Label */}
              <div className="text-gray-300 group-hover:text-gray-200 font-['Orbitron'] text-sm transition-colors duration-300 leading-relaxed">
                {stat.label}
              </div>

              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-0.5 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-16 transition-all duration-300"></div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;