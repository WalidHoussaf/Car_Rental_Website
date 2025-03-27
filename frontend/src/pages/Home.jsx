import React, { useState, useEffect} from 'react';
import Select from 'react-select';
import { Link } from 'react-router-dom';
import { assets, resolveImagePaths } from '../assets/assets';
import HowItWorks from '../components/Home/HowItWorks';
import FeaturedCars from '../components/Home/FeaturedCars';
import PopularDestinations from '../components/Home/PopularDestinations';
import Testimonials from '../components/Home/Testimonials';
import NewsletterSection from '../components/Home/NewsletterSection';
import '../styles/animations.css'; 

const HomePage = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  
  // Location Options 
  const locationOptions = [
    { value: "", label: "Select location", disabled: true },
    { value: "mohammedia", label: "Mohammedia" },
    { value: "casablanca", label: "Casablanca" },
    { value: "marrakesh", label: "Marrakesh" },
    { value: "kenitra", label: "Kénitra" },
    { value: "rabat", label: "Rabat" },
    { value: "agadir", label: "Agadir" },
    { value: "tangier", label: "Tangier" },
  ];

  // Hero Slides Captions 
  const heroMessages = [
    {
      title: "Luxury Cars, Affordable Prices",
      subtitle: "Enjoy Luxury Rides at an Unbeatable Price"
    },
    {
      title: "Discover New Horizons",
      subtitle: "The perfect vehicle for every adventure"
    },
    {
      title: "Quick & Easy Booking",
      subtitle: "Your journey begins with just a few clicks"
    }
  ];
  
  // Hero Booking Form States
  const [pickupLocation, setPickupLocation] = useState('');
  const [dropoffLocation, setDropoffLocation] = useState('');
  const [pickupDate, setPickupDate] = useState('');
  const [dropoffDate, setDropoffDate] = useState('');

  // Get Data From Assets.js
  const featuredCars = resolveImagePaths(assets.data.featuredCars, 'image');
  const destinations = resolveImagePaths(assets.data.destinations, 'image');
  const testimonials = resolveImagePaths(assets.data.testimonials, 'photo');

  // Custom Styles For Select
  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '2.75rem',
      minHeight: '2.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      borderRadius: '0.375rem',
      fontFamily: 'Orbitron, sans-serif',
      color: 'white',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: '#4B5563',
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      fontFamily: 'Orbitron, sans-serif',
      maxHeight: '240px',
      overflowY: 'hidden',
    }),
    menulist: (provided) => ({
      ...provided,
      maxHeight: '240px',
      overflowY: 'auto',
      paddingRight: '8px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.3)' : 'black',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      padding: '4px 8px',
      fontSize: '0.875rem',
      lineHeight: '1.2',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#FFFFFF',
      fontFamily: 'Orbitron, sans-serif',
    }),
  };

  // Convert Location Options For react-select
  const selectLocationOptions = locationOptions
    .filter(option => option.value !== "")
    .map(option => ({
      value: option.value,
      label: option.label
    }));

  // Auto-Rotate Hero Captions
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroMessages.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [heroMessages.length]);

  // Handle Pickup Date Change
  const handlePickupDateChange = (e) => {
    const newPickupDate = e.target.value;
    setPickupDate(newPickupDate);

    if (dropoffDate && new Date(dropoffDate) < new Date(newPickupDate)) {
      setDropoffDate('');
    }
  };

  // Generate Minimum Dropoff Date
  const getMinDropoffDate = () => {
    return pickupDate ? pickupDate : '';
  };

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
          {/* Height Container */}
          <div className="flex flex-col justify-center items-center mb-6 h-36">
            <div className="h-full flex flex-col justify-center items-center">
              <h1 className="text-4xl md:text-6xl font-semibold mb-4 max-w-4xl text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] text-center break-words px-4 leading-[1.2]">
                {heroMessages[currentSlide].title}
              </h1>
              <p className="text-sm md:text-xl mb-8 max-w-xl text-gray-200 font-['Orbitron'] break-words px-4">
                {heroMessages[currentSlide].subtitle}
              </p>
            </div>
          </div>

          {/* Booking Form Card */}
          <div className="w-full max-w-5xl bg-black/80 backdrop-blur-md rounded-xl p-6 shadow-2xl border border-gray-800 relative">
            <h2 className="text-2xl font-semibold mb-6 text-center font-['Orbitron']">Find Your Perfect Car</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 relative">
              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Location</label>
                <Select
                  options={selectLocationOptions}
                  value={selectLocationOptions.find(option => option.value === pickupLocation)}
                  onChange={(selectedOption) => setPickupLocation(selectedOption.value)}
                  styles={customStyles}
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Dropoff Location</label>
                <Select
                  options={selectLocationOptions}
                  value={selectLocationOptions.find(option => option.value === dropoffLocation)}
                  onChange={(selectedOption) => setDropoffLocation(selectedOption.value)}
                  styles={customStyles}
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

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Pickup Date</label>
                <input
                  type="date"
                  value={pickupDate}
                  onChange={handlePickupDateChange}
                  className="w-full bg-black/80 border border-gray-700 rounded-md px-4 h-11 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    font-['Orbitron'] 
                    text-sm
                    transition-all duration-300
                    hover:border-blue-500
                    hover:bg-black/90"
                  style={{
                    colorScheme: 'dark'
                  }}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-300 mb-1">Dropoff Date</label>
                <input
                  type="date"
                  value={dropoffDate}
                  onChange={(e) => setDropoffDate(e.target.value)}
                  min={getMinDropoffDate()}
                  className="w-full bg-black/80 border border-gray-700 rounded-md px-4 h-11 text-white 
                    focus:outline-none focus:ring-2 focus:ring-blue-500 
                    font-['Orbitron'] 
                    text-sm
                    transition-all duration-300
                    hover:border-blue-500
                    hover:bg-black/90"
                  style={{
                    colorScheme: 'dark'
                  }}
                  disabled={!pickupDate}
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <Link
                to="/cars"
                className="inline-block px-10 py-3 text-base font-medium text-black bg-gradient-to-r from-cyan-400 to-white rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Search Cars
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-gray-500 via-white to-blue-500 animate-pulse"></div>
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