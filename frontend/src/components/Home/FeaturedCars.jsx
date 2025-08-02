import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const FeaturedCars = ({ featuredCars }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Helper function to get car-specific specs
  const getCarSpecs = (car) => {
    // Default values if not specified
    const defaults = {
      horsepower: '415',
      acceleration: '5.6s',
      seats: '5',
      transmission: '9-Speed Automatic'
    };

    // Car Sample for now until the backend is ready
    const specsByModel = {
      'Tesla Cybertruck': {
        horsepower: '845',
        acceleration: '2.6s',
        seats: '5',
        transmission: 'Single-Speed'
      },
      'BMW i7': {
        horsepower: '544',
        acceleration: '4.5s',
        seats: '4',
        transmission: '8-Speed Automatic'
      },
      'Mercedes G-Class': {
        horsepower: '416',
        acceleration: '5.6s',
        seats: '5',
        transmission: '9-Speed Automatic'
      },
      'Audi e-tron GT': {
        horsepower: '590',
        acceleration: '3.3s',
        seats: '4',
        transmission: 'Single-Speed'
      },
      'Porsche Taycan': {
        horsepower: '750',
        acceleration: '2.8s',
        seats: '4',
        transmission: '2-Speed Automatic'
      },
      'Lamborghini Urus': {
        horsepower: '650',
        acceleration: '3.6s',
        seats: '5',
        transmission: '8-Speed Automatic'
      }
    };

    // Use model specific data or fall back to defaults
    const specs = specsByModel[car.name] || {};
    return {
      horsepower: car.horsepower || specs.horsepower || defaults.horsepower,
      acceleration: car.acceleration || specs.acceleration || defaults.acceleration,
      seats: car.seats || specs.seats || defaults.seats,
      transmission: car.transmission || specs.transmission || defaults.transmission
    };
  };

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-cyan-900/10 to-cyan-700/10 pointer-events-none"></div>

  
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <div className="text-center md:text-left mb-6 md:mb-0">
            <h2 className="text-2xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4 leading-[1.2]">
              {t('featuredCars')}
            </h2>
            
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full mb-4 max-w-md mx-auto md:mx-0"></div>
            
            {/* Description */}
            <p className="text-gray-300 text-lg max-w-2xl font-['Orbitron'] leading-relaxed">
              {t('featuredCarsDescription') || 'Experience the pinnacle of automotive excellence with our handpicked selection of premium vehicles.'}
            </p>
          </div>
      
          <Link
            to="/cars"
            className="inline-flex items-center px-6 py-3 text-black bg-gradient-to-r from-white to-cyan-400 border border-cyan-500/50 rounded-lg hover:from-cyan-400 hover:to-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_20px_rgba(34,211,238,0.4)] group"
          >
            <span className="font-['Orbitron'] text-sm font-medium mr-2">{t('viewAllVehicles')}</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => {
            const specs = getCarSpecs(car);
            return (
            <div
              key={car.id}
                className="relative bg-black rounded-xl overflow-hidden border border-cyan-900/30 shadow-lg transform transition-all duration-500 hover:scale-[1.02] hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(6,182,212,0.3)] group"
              >
               
                <div className="absolute inset-0 bg-gradient-to-b from-cyan-500/5 to-cyan-700/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"></div>
              
              {/* Car Image Container */}
                <div className="relative h-56 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent z-10 opacity-0 group-hover:opacity-40 transition-opacity duration-500"></div>
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Tag */}
                  <div className="absolute bottom-4 left-4 z-20 flex items-center space-x-2">
                    <div className="px-4 py-1 rounded-full bg-cyan-900/80 backdrop-blur-sm border border-cyan-500/50 text-white font-medium font-['Orbitron'] text-sm group-hover:bg-cyan-800/90 group-hover:border-cyan-400/60 transition-all duration-300">
                    {car.category}
                    </div>
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-black/50 backdrop-blur-sm border border-gray-600 group-hover:border-cyan-500/50 transition-colors duration-300 transform group-hover:rotate-12">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-white group-hover:text-cyan-400 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                      </svg>
                </div>
                </div>
              </div>
              
              {/* Car Details */}
                <div className="p-6 relative">
                  
                  <div className="absolute top-0 left-0 w-0 h-0.5 bg-gradient-to-r from-cyan-400 to-blue-500 group-hover:w-full transition-all duration-300 ease-in-out"></div>
                  
                  <h3 className="text-xl font-semibold mb-4 text-white font-['Orbitron'] group-hover:text-cyan-400 transition-colors duration-300">{car.name}</h3>
                  
                  {/* Technical Specs in 2 columns */}
                  <div className="grid grid-cols-2 gap-y-3 mb-6">
                    {/* Horsepower */}
                    <div className="flex items-center text-cyan-400 transform transition-transform duration-300 group-hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="font-['Orbitron'] text-white text-sm">{specs.horsepower} hp</span>
                    </div>
                    
                    {/* Acceleration */}
                    <div className="flex items-center text-cyan-400 transform transition-transform duration-300 group-hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span className="font-['Orbitron'] text-white text-sm">0-60 mph in {specs.acceleration}</span>
                    </div>
                    
                    {/* Seats */}
                    <div className="flex items-center text-cyan-400 transform transition-transform duration-300 group-hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <span className="font-['Orbitron'] text-white text-sm">{specs.seats} seats</span>
                    </div>
                    
                    {/* Transmission */}
                    <div className="flex items-center text-cyan-400 transform transition-transform duration-300 group-hover:translate-x-1">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2 group-hover:text-cyan-300 transition-colors duration-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                      </svg>
                      <span className="font-['Orbitron'] text-white text-sm">{specs.transmission}</span>
                    </div>
                </div>
                
                  <div className="w-full h-0.5 bg-gray-800/50 mb-6 overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-cyan-500 to-cyan-400 w-0 group-hover:w-full transition-all duration-200 ease-in-out"></div>
                </div>
                
                {/* Price and CTA */}
                  <div className="flex justify-between items-center">
                    <div className="transform transition-all duration-300 group-hover:scale-105 group-hover:translate-x-1">
                      <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] group-hover:text-cyan-400 transition-colors duration-300">${car.price}</span>
                      <span className="text-sm text-gray-400 font-['Orbitron'] transition-colors duration-300">/{t('day')}</span>
                  </div>
                  
                  <Link
                    to={`/cars/${car.id}`}
                      className="relative px-6 py-2 text-sm font-medium text-black bg-gradient-to-r from-white to-cyan-400 border border-cyan-500/50 rounded-lg hover:from-cyan-400 hover:to-white transition-all duration-300 font-['Orbitron'] transform hover:scale-105 hover:shadow-[0_0_15px_rgba(34,211,238,0.4)]"
                    >
                      <span className="relative z-10">{t('details')}</span>
                  </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;