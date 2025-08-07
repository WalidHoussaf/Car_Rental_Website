import React, { useState, useEffect} from 'react';
import { Link } from 'react-router-dom';
import { assets, resolveImagePaths } from '../assets/assets';
import HowItWorks from '../components/Home/HowItWorks';
import FeaturedCars from '../components/Home/FeaturedCars';
import PopularDestinations from '../components/Home/PopularDestinations';
import Testimonials from '../components/Home/Testimonials';
import NewsletterSection from '../components/Home/NewsletterSection';
 
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Hero Slides Captions 
  const heroMessages = [
    {
      title: language === 'en' ? "Luxury Cars, Affordable Prices" : "Voitures de Luxe, Prix Abordables",
      subtitle: language === 'en' ? "Enjoy Luxury Rides at an Unbeatable Price" : "Profitez de Voyages de Luxe à un Prix Imbattable"
    },
    {
      title: language === 'en' ? "Discover New Horizons" : "Découvrez de Nouveaux Horizons",
      subtitle: language === 'en' ? "The perfect vehicle for every adventure" : "Le véhicule parfait pour chaque aventure"
    },
    {
      title: language === 'en' ? "Quick & Easy Booking" : "Réservation Rapide & Facile",
      subtitle: language === 'en' ? "Your journey begins with just a few clicks" : "Votre voyage commence en quelques clics"
    }
  ];

  // Get Data From Assets.js
  const featuredCars = resolveImagePaths(assets.data.featuredCars, 'image');
  const destinations = resolveImagePaths(assets.data.destinations, 'image');
  const testimonials = resolveImagePaths(assets.data.testimonials, 'photo');

  // Auto-Rotate Hero Captions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMessages.length]);

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative h-screen w-full overflow-hidden">
        {/* Video Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/60" />
          <video
            autoPlay
            muted
            loop
            playsInline
            className="w-full h-full object-cover"
          >
            <source src={assets.hero.backgroundVideo} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        </div>

        {/* Hero Content */}
        <div className="relative z-20 h-full flex flex-col justify-center items-center text-center px-4 -mt-5">
          {/* Decorative Top Element */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-4">
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
              <div className="w-3 h-3 border-2 border-cyan-400 rotate-45 animate-spin-slow" />
              <div className="w-16 h-px bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse" />
            </div>
          </div>

          {/* Height Container */}
          <div className="flex flex-col justify-center items-center mb-6 h-36 relative">
            <div className="h-full flex flex-col justify-center items-center relative z-10">
              <h1 className="text-4xl md:text-6xl font-bold mb-4 max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-300 to-cyan-400 font-['Orbitron'] text-center break-words px-4 leading-[1.2] animate-fade-in-up uppercase">
                {heroMessages[currentSlide].title}
              </h1>
              <p className="text-sm md:text-xl mb-8 max-w-xl text-gray-200 font-['Orbitron'] break-words px-4 animate-fade-in-up animation-delay-300">
                {heroMessages[currentSlide].subtitle}
              </p>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center mt-8 animate-fade-in-up animation-delay-600">
            <Link
              to="/cars"
              className="group px-8 py-4 rounded-md bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30 cursor-pointer transform hover:scale-105 flex items-center gap-3 text-lg font-semibold relative overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              <span className="relative z-10">{t('exploreOurFleet')}</span>
            </Link>

            <Link
              to="/contact"
              className="group px-8 py-4 rounded-md bg-transparent border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-['Orbitron'] transition-all duration-300 cursor-pointer transform hover:scale-105 flex items-center gap-3 text-lg font-semibold relative overflow-hidden backdrop-blur-sm"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-400/10 to-cyan-300/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 transition-transform duration-300 group-hover:scale-110" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
              </svg>
              <span className="relative z-10">{language === 'en' ? 'Contact Us Now' : 'Contactez-nous Maintenant'}</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-2 w-full overflow-hidden">
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-gray-500 via-cyan-400 to-blue-500 animate-pulse" />
        <div className="absolute inset-0 h-full w-full bg-gradient-to-r from-transparent via-white to-transparent opacity-50 animate-shimmer" />
      </div>

      {/* How It Works Section */}
      <HowItWorks />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Featured Cars Section */}
      <FeaturedCars featuredCars={featuredCars} />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Popular Destinations Section */}
      <PopularDestinations destinations={destinations} />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Testimonials Section */}
      <Testimonials testimonials={testimonials} />

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
       <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 opacity-70"></div>
      </div>

      {/* Newsletter Section */}
      <NewsletterSection />
    </div>
  );
};

export default HomePage;