import React from 'react';
import { assets } from '../../assets/assets';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const HeroSection = ({ onExploreClick, onLearnMoreClick }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  return (
    <section className="relative h-screen max-h-[600px] bg-black overflow-hidden">
      {/* Video Background */}
      <div className="absolute inset-0 z-0">
        <video 
          autoPlay 
          loop 
          muted 
          playsInline
          preload="metadata"
          onError={(e) => { if (e && e.currentTarget && e.currentTarget.style) { e.currentTarget.style.display = 'none'; } }}
          className="w-full h-full object-cover opacity-60"
        >
          <source src={assets.hero.ourfleetbg} type="video/mp4" />
          Your browser does not support the video tag.
        </video>
      </div>
      
      {/* Content overlay */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center">
        <div className="text-center px-4 max-w-4xl mx-auto">
          <div className="inline-block mb-6 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 animate-fade-in-up animation-delay-100">
            <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('experienceTheFuture')}</span>
          </div>
          
          <h1 className="text-4xl md:text-7xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white font-['Orbitron'] mb-6 tracking-tight relative uppercase animate-fade-in-up animation-delay-200">
            {t('ourFleet')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h1>
          
          <p className="text-gray-300 max-w-2xl mx-auto text-lg md:text-xl font-['Orbitron'] leading-relaxed mb-8 animate-fade-in-up animation-delay-300">
            {t('discoverFleetDescription')}
          </p>
          
          <div className="flex flex-wrap gap-4 justify-center animate-fade-in-up animation-delay-500">
            <button 
              onClick={onExploreClick}
              className="group px-6 py-3 rounded-md bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30 cursor-pointer transform hover:scale-105 flex items-center gap-2 text-base font-semibold relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="relative z-10">{t('exploreCars')}</span>
            </button>
            <button 
              onClick={onLearnMoreClick}
              className="group px-6 py-3 rounded-md bg-transparent border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-['Orbitron'] transition-all duration-300 cursor-pointer transform hover:scale-105 flex items-center gap-2 text-base font-semibold relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">{t('learnMore')}</span>
            </button>
          </div>
        </div>
      </div>
      
      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-0 right-0 flex justify-center items-center animate-fade-in-up animation-delay-700">
        <div className="animate-bounce p-2">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
          </svg>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;