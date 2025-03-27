import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { sampleCars, resolveImagePaths } from '../assets/assets'; 
import Select from 'react-select';
import HeroSection from '../components/Cars/HeroSection';
import StatsSection from '../components/Cars/StatsSection';
import CallToAction from '../components/Cars/CallToAction';
import FiltersSidebar from '../components/Cars/Filters/FiltersSidebar';
import { selectStyles } from '../styles/selectStyles';

const CarsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const queryParams = new URLSearchParams(location.search);
  const locationParam = queryParams.get('location');
  
  // Reference to store current scroll position
  const scrollPositionRef = useRef(0);
  
  // Reference for the cars section
  const carsSectionRef = useRef(null);
  
  // State for filters
  const [filters, setFilters] = useState({
    location: locationParam || 'all',
    category: 'all',
    priceRange: [0, 1000],
    features: []
  });
  
  // State for cars data
  const [carsData, setCarsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('recommended');
  
  // Initialize cars data
  useEffect(() => {
    setLoading(true);
    setTimeout(() => {
      const processedCars = resolveImagePaths(sampleCars, 'image');
      setCarsData(processedCars);
      setLoading(false);
    }, 800);
  }, []);
  
  // Effect to handle scroll restoration
  useEffect(() => {
    // Restore scroll position after URL change/navigation
    const timeoutId = setTimeout(() => {
      window.scrollTo(0, scrollPositionRef.current);
    }, 0);
    
    return () => clearTimeout(timeoutId);
  }, [location.search]);
  
  // Handle scroll to cars section
  const scrollToCarsSection = () => {
    if (carsSectionRef.current) {
      carsSectionRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };
  
  // Handle navigation to About Us page
  const navigateToAboutUs = () => {
    navigate('/about');
  };
  
  // Handle filter changes
  const handleFilterChange = (filterType, value) => {
    // Save current scroll position before navigation
    scrollPositionRef.current = window.pageYOffset;
    
    const newFilters = { ...filters, [filterType]: value };
    setFilters(newFilters);
    
    // Update URL if location filter changes
    if (filterType === 'location' && value !== 'all') {
      navigate(`/cars?location=${value}`, { replace: true });
    } else if (filterType === 'location' && value === 'all') {
      navigate('/cars', { replace: true });
    }
  };
  
  // Toggle feature filter
  const toggleFeature = (feature) => {
    // Save current scroll position before navigation
    scrollPositionRef.current = window.pageYOffset;
    
    const newFeatures = filters.features.includes(feature)
      ? filters.features.filter(f => f !== feature)
      : [...filters.features, feature];
    
    handleFilterChange('features', newFeatures);
  };
  
  // Reset filters
  const resetFilters = () => {
    // Save current scroll position before navigation
    scrollPositionRef.current = window.pageYOffset;
    
    setFilters({
      location: 'all',
      category: 'all',
      priceRange: [0, 1000],
      features: []
    });
    navigate('/cars', { replace: true });
  };
  
  // Filter cars based on current filters
  const filteredCars = carsData.filter(car => {
    // Filter by location
    if (filters.location !== 'all') {
      // Handle both string and array locations
      if (Array.isArray(car.location)) {
        if (!car.location.includes(filters.location)) {
          return false;
        }
      } else if (car.location !== filters.location) {
        return false;
      }
    }
    
    // Filter by category
    if (filters.category !== 'all' && car.category !== filters.category) {
      return false;
    }
    
    // Filter by price range
    if (car.price < filters.priceRange[0] || car.price > filters.priceRange[1]) {
      return false;
    }
    
    // Filter by features
    if (filters.features.length > 0 && !filters.features.every(feature => car.features.includes(feature))) {
      return false;
    }
    
    return true;
  });
  
  // Sort cars
  const sortedCars = [...filteredCars].sort((a, b) => {
    switch (sortBy) {
      case 'price-low':
        return a.price - b.price;
      case 'price-high':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return 0;
    }
  });
  
  return (
    <div className="min-h-screen bg-black text-white">
      {/* Hero Section */}
      <HeroSection onExploreClick={scrollToCarsSection} onLearnMoreClick={navigateToAboutUs} />
      
      {/* Stats Section */}
      <StatsSection />
      
      {/* Main Content */}
      <section ref={carsSectionRef} id="cars-section" className="relative py-16 px-4 bg-black">
        <div className="max-w-7xl mx-auto">
          {/* Section Title */}
          <div className="text-center mb-12">
            <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20">
              <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">CUSTOMIZE YOUR SEARCH</span>
            </div>
            <br />
            <br />
            <h2 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4">
              FIND YOUR PERFECT RIDE
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-400 max-w-2xl mx-auto text-sm font-['Orbitron']">
              Use the filters to narrow down your options and find the ideal vehicle for your needs.
            </p>
          </div>
          
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Filters Sidebar */}
            <FiltersSidebar 
              filters={filters}
              handleFilterChange={handleFilterChange}
              toggleFeature={toggleFeature}
              resetFilters={resetFilters}
            />
            
            {/* Cars Grid */}
            <div className="flex-grow">
              {/* Sort Controls */}
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 pb-4 border-b border-gray-800/50 bg-gradient-to-r from-transparent via-gray-800/10 to-transparent">
                <div className="mb-4 sm:mb-0">
                  <h2 className="text-xl font-semibold text-white font-['Orbitron'] flex items-center">
                    {loading ? (
                      <span className="flex items-center">
                        <div className="w-4 h-4 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin mr-2"></div>
                        Loading vehicles...
                      </span>
                    ) : (
                      <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2 text-cyan-400" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                          <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1v-1h3a1 1 0 00.8-.4l3-4a1 1 0 00.2-.6V5a1 1 0 00-1-1H3zM14 7h2.7l-1.5 2H14V7z" />
                        </svg>
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{sortedCars.length}</span>
                        <span className="ml-1">vehicles available</span>
                      </>
                    )}
                  </h2>
                </div>
                <div className="flex items-center">
                  <label className="mr-2 text-sm text-gray-300 font-['Orbitron']">Sort by:</label>
                  <div className="w-48">
                    <Select
                      options={[
                        { value: 'recommended', label: 'Recommended' },
                        { value: 'price-low', label: 'Price: Low to High' },
                        { value: 'price-high', label: 'Price: High to Low' },
                        { value: 'rating', label: 'Rating' }
                      ]}
                      value={{ 
                        value: sortBy, 
                        label: {
                          'recommended': 'Recommended',
                          'price-low': 'Price: Low to High',
                          'price-high': 'Price: High to Low',
                          'rating': 'Rating'
                        }[sortBy] 
                      }}
                      onChange={(selectedOption) => {
                        scrollPositionRef.current = window.pageYOffset;
                        setSortBy(selectedOption.value);
                      }}
                      isSearchable={false}
                      styles={{
                        ...selectStyles,
                        control: (provided, state) => ({
                          ...selectStyles.control(provided, state),
                          minHeight: '2.25rem',
                          height: '2.25rem'
                        })
                      }}
                      theme={(theme) => ({
                        ...theme,
                        colors: {
                          ...theme.colors,
                          primary: 'rgba(59, 130, 246, 0.5)',
                          primary25: 'rgba(59, 130, 246, 0.1)',
                        }
                      })}
                    />
                  </div>
                </div>
              </div>
              
              {/* Loading State */}
              {loading && (
                <div className="flex flex-col items-center justify-center py-20">
                  <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin mb-4"></div>
                  <p className="text-gray-400 font-['Orbitron']">Loading vehicles...</p>
                </div>
              )}
              
              {/* Empty State */}
              {!loading && sortedCars.length === 0 && (
                <div className="bg-gray-900/30 backdrop-blur-sm border border-gray-800 rounded-lg p-8 text-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto text-gray-600 mb-4" viewBox="0 0 24 24" fill="none">
                    {/* Car outline */}
                    <path d="M3 14L4 8C4.4 6.5 5.2 6 7 6H17C18.8 6 19.6 6.5 20 8L21 14" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <path d="M4 17H2C1.5 17 1 16.5 1 16V14C1 13.5 1.5 13 2 13H22C22.5 13 23 13.5 23 14V16C23 16.5 22.5 17 22 17H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    <circle cx="6" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <circle cx="18" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.5" />
                    <path d="M4 11H20" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                  </svg>
                  <h3 className="text-xl font-bold font-['Orbitron'] text-white mb-2">No vehicles found</h3>
                  <p className="text-gray-400 mb-6 max-w-md mx-auto font-['Orbitron']">
                    We couldn't find any vehicles matching your current filters. Try adjusting your search criteria.
                  </p>
                  <button
                    onClick={resetFilters}
                    className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 rounded-md cursor-pointer"
                  >
                    Reset Filters
                  </button>
                </div>
              )}
              
              {/* Cars Grid */}
              {!loading && sortedCars.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 xl:grid-cols-3 gap-6">
                  {sortedCars.map((car) => (
                    <div
                      key={car.id}
                      className="bg-gradient-to-b from-gray-900/40 to-black/20 backdrop-blur-sm border border-gray-800 rounded-lg overflow-hidden hover:shadow-lg hover:shadow-blue-900/20 transition-all duration-300 group hover:border-blue-500/30 flex flex-col h-full"
                    >
                      {/* Card Header */}
                      <div className="relative h-48 overflow-hidden">
                        <img
                          src={car.image || "/api/placeholder/400/240"}
                          alt={car.name}
                          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent"></div>
                        
                        {/* Badge for Category */}
                        <div className="absolute top-3 left-3">
                          <div className="px-3 py-1 rounded-full bg-cyan-500/90 backdrop-blur-sm text-xs font-bold text-white font-['Orbitron'] uppercase tracking-wider">
                            {car.category}
                          </div>
                        </div>
                        
                        {/* Price Badge */}
                        <div className="absolute bottom-3 right-3">
                          <div className="px-3 py-1 rounded-md bg-black/80 backdrop-blur-sm text-sm font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                            ${car.price}/day
                          </div>
                        </div>
                      </div>
                      
                      {/* Card Content */}
                      <div className="p-5 flex flex-col flex-grow">
                        <div>
                          <div className="flex justify-between items-start mb-2">
                            <h3 className="text-xl font-bold text-white font-['Orbitron'] group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-white group-hover:to-cyan-400 transition-all duration-300">
                              {car.name}
                            </h3>
                            <div className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-yellow-500 mr-1" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                              <span className="text-white text-xl font-['Rationale']">{car.rating.toFixed(1)}</span>
                            </div>
                          </div>
                          
                          {/* Location */}
                          <div className="flex items-center mb-4 text-xl text-gray-400 font-['Rationale']">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1 text-cyan-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span>
                              {Array.isArray(car.location) 
                                ? car.location.join(', ').charAt(0).toUpperCase() + car.location.join(', ').slice(1).toLowerCase()
                                : car.location.charAt(0).toUpperCase() + car.location.slice(1).toLowerCase()}
                            </span>
                          </div>
                          
                          {/* Features */}
                          <div className="flex flex-wrap gap-2 mb-5">
                            {car.features.slice(0, 3).map((feature, index) => (
                              <span
                                key={index}
                                className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300 font-['Orbitron']"
                              >
                                {feature}
                              </span>
                            ))}
                            {car.features.length > 3 && (
                              <span className="px-2 py-1 bg-gray-800/50 rounded text-xs text-gray-300 font-['Orbitron']">
                                +{car.features.length - 3} more
                              </span>
                            )}
                          </div>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex space-x-2 mt-auto">
                          <button
                            onClick={() => {
                              scrollPositionRef.current = window.pageYOffset;
                              navigate(`/booking/${car.id}`);
                            }}
                            className="flex-1 px-4 py-2 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] text-sm transition-all duration-300 rounded-md cursor-pointer">
                            Book Now
                          </button>
                          <button 
                            onClick={() => {
                              scrollPositionRef.current = window.pageYOffset;
                              navigate(`/cars/${car.id}`);
                            }}
                            className="px-4 py-2 bg-transparent border border-gray-700 hover:border-cyan-500 text-cyan-300 hover:text-cyan-400 font-['Orbitron'] text-sm transition-all duration-300 rounded-md cursor-pointer">
                            Details
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {/* Load More Button */}
              {!loading && sortedCars.length > 0 && (
                <div className="mt-12 text-center">
                  <button className="px-8 py-3 bg-gradient-to-r from-blue-600/20 to-cyan-600/20 hover:from-blue-600/30 hover:to-cyan-600/30 text-white font-['Orbitron'] transition-all duration-300 border border-cyan-500/30 hover:border-cyan-500/50 rounded-md shadow-lg shadow-blue-900/5 hover:shadow-blue-900/10 cursor-pointer">
                    Load More Vehicles
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      <CallToAction />
    </div>
  );
};

export default CarsPage;