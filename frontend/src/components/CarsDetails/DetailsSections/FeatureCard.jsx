import React from 'react';
import { featureIcons } from './featureIcons.jsx';
import { useLanguage } from '../../../hooks/useLanguage';
import { useTranslations } from '../../../translations';

const FeatureCard = ({ feature, iconType, icon, description = "" }) => {
  // Use hooks for translation
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Determine which icon to display based on iconType or use the provided custom icon
  const displayIcon = iconType ? featureIcons[iconType] || featureIcons.default : icon;
  
  // Get feature-specific description based on iconType or feature name
  const getFeatureDescription = () => {
    if (description) return description;
    
    // Try to get description based on iconType first
    if (iconType) {
      const descKey = `featureDesc_${iconType}`;
      const specificDesc = t(descKey);
      if (specificDesc !== descKey) return specificDesc;
    }
    
    // Try to get description based on feature name
    const featureLower = feature.toLowerCase();
    let descKey = '';
    
    if (featureLower.includes('bluetooth')) descKey = 'featureDesc_bluetooth';
    else if (featureLower.includes('navigation') || featureLower.includes('gps')) descKey = 'featureDesc_navigation';
    else if (featureLower.includes('driver assistance') || featureLower.includes('safety')) descKey = 'featureDesc_driver_assistance';
    else if (featureLower.includes('performance') || featureLower.includes('engine')) descKey = 'featureDesc_performance';
    else if (featureLower.includes('battery') || featureLower.includes('electric')) descKey = 'featureDesc_battery';
    else if (featureLower.includes('audio') || featureLower.includes('sound')) descKey = 'featureDesc_audio';
    else if (featureLower.includes('climate') || featureLower.includes('air')) descKey = 'featureDesc_climate';
    else if (featureLower.includes('connectivity') || featureLower.includes('wifi')) descKey = 'featureDesc_connectivity';
    else if (featureLower.includes('security') || featureLower.includes('alarm')) descKey = 'featureDesc_security';
    else if (featureLower.includes('camera') || featureLower.includes('view')) descKey = 'featureDesc_camera';
    
    if (descKey) {
      const specificDesc = t(descKey);
      if (specificDesc !== descKey) return specificDesc;
    }
    
    // Fallback to default description
    return t('defaultFeatureDescription');
  };
  
  const featureDescription = getFeatureDescription();
  
  return (
    <div className="group relative bg-gradient-to-br from-gray-900/70 to-black/80 border border-gray-800 rounded-xl px-6 pt-6 pb-4 hover:border-blue-500 transition-all duration-300 overflow-hidden shadow-lg h-full flex flex-col">
      {/* Glow effect */}
      <div className="absolute inset-0 bg-gradient-to-tr from-blue-500/0 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Decorative Element */}
      <div className="absolute -right-4 -top-4 w-24 h-24 bg-blue-500/10 rounded-full blur-xl group-hover:bg-blue-500/20 transition-all duration-500"></div>

      <div className="flex items-start gap-4 flex-1 mb-3 md:mb-4">
        {/* Icon Container */}
        <div className="bg-blue-500/20 p-2 rounded-lg text-cyan-400 group-hover:text-blue-300 group-hover:bg-blue-500/30 transition-all duration-300 flex-shrink-0">
          {displayIcon}
        </div>

        <div className="flex-1 flex flex-col">
          {/* Title */}
          <h3 className="text-lg font-bold text-white mb-2 font-['Orbitron'] tracking-wide group-hover:text-blue-300 transition-colors duration-300">{feature}</h3>
          
          {/* Description */}
          <p className="text-gray-400 text-sm font-['Orbitron'] text-justify group-hover:text-gray-300 transition-colors duration-300 flex-1">
            {featureDescription}
          </p>
        </div>
      </div>
      
      {/* Bottom Line */}
      <div className="w-12 h-1 bg-cyan-400 mt-auto mb-2 rounded-full group-hover:w-full transition-all duration-500"></div>
    </div>
  );
};

export default FeatureCard;