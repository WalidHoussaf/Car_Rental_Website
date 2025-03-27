import React from 'react';
import { Link } from 'react-router-dom';

const FeaturedCars = ({ featuredCars }) => {
  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-b from-black via-blue-900/10 to-purple-900/10 pointer-events-none"></div>
      {/* Grid Lines Background */}
      <div className="absolute inset-0 opacity-10">
        <div className="h-full w-full" style={{
         backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #3B82F6 1px, transparent 1px)',
         backgroundSize: '40px 40px'
        }}></div>
      </div>
  
      <div className="max-w-7xl mx-auto relative z-10">
        <div className="flex flex-col md:flex-row justify-between items-center mb-16">
          <h2 className="text-2xl md:text-5xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-6 md:mb-0">
            Featured Cars
          </h2>
      
          <Link
            to="/cars"
            className="group flex items-center space-x-2 px-6 py-3 rounded-md border border-cyan-500/50 bg-black/50 backdrop-blur-sm hover:bg-blue-900/20 transition-all duration-300 hover:shadow-[0_0_15px_rgba(59,130,246,0.4)]"
          >
            <span className="text-white group-hover:text-cyan-400 transition-colors duration-300 font-['Orbitron'] text-sm">View All Vehicles</span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-white group-hover:text-cyan-400 transition-colors duration-300 transform group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
    
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredCars.map((car) => (
            <div
              key={car.id}
              className="relative group bg-gradient-to-b from-black/90 to-black/80 rounded-xl overflow-hidden border border-gray-800 transform transition-all duration-500 hover:scale-105 hover:border-blue-500/50 hover:shadow-[0_0_20px_rgba(59,130,246,0.3)]"
            >
              {/* Style Corner */}
              <div className="absolute top-0 right-0 w-12 h-12 overflow-hidden">
                <div className="absolute top-0 right-0 w-16 h-2 bg-blue-500 transform rotate-45 translate-y-1 translate-x-2"></div>
                <div className="absolute top-0 right-0 h-16 w-2 bg-gray-500 transform -rotate-45 translate-y-2 translate-x-1"></div>
              </div>
              
              {/* Car Image Container */}
              <div className="relative h-48 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                <img
                  src={car.image}
                  alt={car.name}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Category Tag */}
                <div className="absolute top-4 left-4 z-20 px-3 py-1 rounded-md bg-black/70 backdrop-blur-sm border border-blue-500/50 flex items-center space-x-1 group-hover:border-cyan-500/50 transition-all duration-300">
                  <div className="w-2 h-2 rounded-full bg-white group-hover:bg-cyan-400 transition-colors duration-300"></div>
                  <span className="text-xs font-medium text-white group-hover:text-cyan-400 transition-colors duration-300 font-['Orbitron']">
                    {car.category}
                  </span>
                </div>
              </div>
              
              {/* Car Details */}
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 group-hover:bg-gradient-to-r group-hover:from-cyan-400 group-hover:to-white transition-all duration-300 font-['Orbitron']">{car.name}</h3>
                
                {/* Technical Specs */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {car.features.map((feature, index) => (
                    <span
                      key={index}
                      className="text-sm px-2 py-1 rounded-md bg-blue-900/20 border border-blue-500/30 text-white group-hover:bg-blue-500/2 group-hover:border-cyan-500/30 group-hover:text-cyan-200 transition-all duration-300 font-['Orbitron']"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                {/* Progress Bar */}
                <div className="w-full h-0.5 bg-gray-800 mb-6 overflow-hidden">
                  <div className="h-full bg-gradient-to-r from-blue-500 to-white w-3/3 animate-pulse"></div>
                </div>
                
                {/* Price and CTA */}
                <div className="flex justify-between items-center mt-4">
                  <div>
                    <span className="text-sm text-gray-400 font-['Orbitron']">From</span>
                    <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 ml-1 font-['Orbitron']">${car.price}</span>
                    <span className="text-sm text-gray-400 font-['Orbitron']">/day</span>
                  </div>
                  
                  <Link
                    to={`/cars/${car.id}`}
                    className="relative px-5 py-2 text-sm font-medium text-white bg-blue-900/30 border border-blue-500/50 rounded-md group-hover:bg-black group-hover:border-blue-900/30 transition-all duration-300 overflow-hidden"
                  >
                    {/* Animated Background Glow */}
                    <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-cyan-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 animate-pulse"></div>
                    <span className="relative z-10 bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">Book Now</span>
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturedCars;