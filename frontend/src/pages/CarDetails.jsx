import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { sampleCars, resolveImagePaths, resolveGalleryPaths, categoryTranslations } from '../assets/assets';
import HeroSection from '../components/CarsDetails/HeroSection';
import PerformanceStats from '../components/CarsDetails/PerformanceStats';
import AvailabilitySection from '../components/CarsDetails/AvailabilitySection';
import DetailsTabSection from '../components/CarsDetails/DetailsTabSection';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const CarDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // Scroll to Top on Component Mount
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [id]);
  
  // Function to Scroll Navigation to the Top
  const navigateWithScroll = (path) => {
    window.scrollTo(0, 0);
    navigate(path);
  };
  
  // Find the Car by ID
  const car = sampleCars.find(car => car.id === parseInt(id));
  
  // If Car is not Found, Show the Error UI
  if (!car) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="max-w-lg text-center px-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-24 w-24 mx-auto text-gray-600 mb-6" viewBox="0 0 24 24" fill="none">
            <path d="M3 14L4 8C4.4 6.5 5.2 6 7 6H17C18.8 6 19.6 6.5 20 8L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <path d="M4 17H2C1.5 17 1 16.5 1 16V14C1 13.5 1.5 13 2 13H22C22.5 13 23 13.5 23 14V16C23 16.5 22.5 17 22 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            <circle cx="6" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="18" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
            <path d="M4 11H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          </svg>
          <h2 className="text-2xl font-bold mb-4 font-['Orbitron']">{t('vehicleNotFound')}</h2>
          <p className="text-gray-400 mb-8">{t('vehicleNotFoundDesc')}</p>
          <button 
            className="px-6 py-3 bg-gradient-to-r from-cyan-400 to-white hover:from-white hover:to-cyan-400 text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 rounded-md"
            onClick={() => navigateWithScroll('/cars')}
          >
            {t('backToVehicles')}
          </button>
        </div>
      </div>
    );
  }
  
  // Resolve the Car Image Paths
  const processedCar = resolveImagePaths([car], 'image')[0];
  
  // Resolve Gallery Paths as per your Requirement
  const [resolvedCar] = resolveGalleryPaths([car]);
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section Component */}
      <HeroSection car={processedCar} />

      {/* Availability Section */}
      <section className="py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <AvailabilitySection carId={car.id} />
        </div>
      </section>
      
      {/* Performance Stats Component */}
      <PerformanceStats specifications={processedCar.specifications} />

      {/* Details Tab Section */}
      <DetailsTabSection car={resolvedCar} />

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white animate-pulse"></div>
      </div>

      {/* Related Vehicles Section */}
      <section className="py-20 px-4 relative">
        {/* Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-950/30 to-black z-0"></div>
        </div>

        <div className="max-w-7xl mx-auto relative z-20">
          <div className="text-center mb-16">
            <div className="inline-block mb-6">
              <h2 className="text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white font-['Orbitron'] mb-4 tracking-wider">
                {t('similarVehicles')}
              </h2>
            <div className="w-32 h-1 bg-gradient-to-r from-white to-cyan-400 mx-auto rounded-full"></div>
            </div>
            <p className="text-gray-300 max-w-3xl mx-auto text-lg font-['Orbitron'] leading-relaxed">
              {t('exploreVehicles')}
            </p>
          </div>
          
          {/* Updated grid with equal height cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 items-stretch">
            {sampleCars
              .filter(relatedCar => relatedCar.category === car.category && relatedCar.id !== car.id)
              .slice(0, 3)
              .map((relatedCar, index) => {
                const processedRelatedCar = resolveImagePaths([relatedCar], 'image')[0];
                return (
                  <div
                    key={relatedCar.id}
                    className="relative group h-full" 
                    style={{
                      animationDelay: `${index * 200}ms`
                    }}
                  >
                    {/* Glow effect */}
                    <div className="absolute -inset-1 bg-gradient-to-r from-cyan-400/20 via-blue-500/20 to-cyan-400/20 rounded-xl blur opacity-0 group-hover:opacity-100 transition duration-500"></div>
                    
                    {/* Updated card structure with flex layout for consistent height */}
                    <div className="relative h-full bg-black/80 backdrop-blur-xl border border-gray-800/50 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-500 group-hover:shadow-2xl group-hover:shadow-cyan-500/20 transform group-hover:-translate-y-2 flex flex-col">
                      {/* Card Header - Fixed height */}
                      <div className="relative h-56 overflow-hidden flex-shrink-0">
                        <img
                          src={processedRelatedCar.image || "/api/placeholder/400/240"}
                          alt={processedRelatedCar.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent"></div>
                        
                        {/* Badge for Category */}
                        <div className="absolute top-4 left-4">
                          <div className="px-3 py-1 rounded-full bg-cyan-400 text-black font-bold text-xs font-['Orbitron'] uppercase tracking-wider shadow-lg backdrop-blur-sm border border-white/20">
                             {categoryTranslations[processedRelatedCar.category] 
                               ? categoryTranslations[processedRelatedCar.category][language] 
                               : processedRelatedCar.category}
                           </div>
                         </div>
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-4 right-4">
                          <div className="px-4 py-2 rounded-lg bg-black/80 backdrop-blur-sm border border-cyan-400/30">
                            <div className="text-cyan-400 text-xs font-['Orbitron'] uppercase tracking-wider">Price</div>
                            <div className="text-white text-lg font-bold font-['Orbitron']">
                              ${processedRelatedCar.price}<span className="text-sm text-gray-400">/{t('day')}</span>
                            </div>
                          </div>
                        </div>

                        {/* Hover overlay */}
                        <div className="absolute inset-0 bg-gradient-to-t from-cyan-400/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-6 flex flex-col flex-grow">
                        {/* Title and Rating */}
                        <div className="flex justify-between items-start mb-4 min-h-[3rem]">
                          <h3 className="text-xl font-bold text-white font-['Orbitron'] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-white transition-all duration-300 flex-1 mr-4 line-clamp-2">
                            {processedRelatedCar.name}
                          </h3>
                          <div className="flex items-center bg-black/50 backdrop-blur-sm px-3 py-2 rounded-lg border border-gray-700/50 flex-shrink-0">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-400 mr-2" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                            </svg>
                            <span className="text-white font-bold font-['Orbitron']">{processedRelatedCar.rating.toFixed(1)}</span>
                          </div>
                        </div>

                        {/* Quick specs */}
                        <div className="grid grid-cols-2 gap-3 mb-6 min-h-[2.5rem]">
                          <div className="flex items-center text-gray-300 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                            </svg>
                            <span className="font-['Orbitron'] truncate">{processedRelatedCar.specifications?.power || 'N/A'} HP</span>
                          </div>
                          <div className="flex items-center text-gray-300 text-sm">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 text-cyan-400 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            <span className="font-['Orbitron'] truncate">{processedRelatedCar.specifications?.acceleration || 'N/A'}s</span>
                          </div>
                        </div>
                        
                        {/* Button */}
                        <div className="mt-auto">
                          <button
                            onClick={() => {
                              navigateWithScroll(`/cars/${processedRelatedCar.id}`);
                            }}
                            className="w-full relative overflow-hidden bg-gradient-to-r from-cyan-400 to-white text-black font-bold font-['Orbitron'] py-3 px-6 rounded-lg transition-all duration-300 transform hover:scale-105 hover:shadow-lg hover:shadow-cyan-500/30 group/btn cursor-pointer"
                          >
                            <span className="relative z-10 flex items-center justify-center">
                              {t('viewDetails')}
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 transform group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                              </svg>
                            </span>
                            <div className="absolute inset-0 bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover/btn:opacity-100 transition-opacity duration-300"></div>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
          </div>
        </div>
      </section>
    </div>
  );
};

export default CarDetailPage;