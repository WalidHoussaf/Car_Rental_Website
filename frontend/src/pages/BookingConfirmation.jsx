import React, { useEffect, useState, useRef } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { useNotification } from '../context/NotificationContext';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import GlowingGrid from '../components/Ui/GlowingGrid';
import SuccessIcon from '../components/Ui/Icons/SuccessIcon';
import CalendarIcon from '../components/Ui/Icons/CalendarIcon';
import OptionsIcon from '../components/Ui/Icons/OptionsIcon';
import PriceIcon from '../components/Ui/Icons/PriceIcon';
import DownloadIcon from '../components/Ui/Icons/DownloadIcon';
import LocationIcon from '../components/Ui/Icons/LocationIcon';
import ReceiptGenerator from '../components/ReceiptGenerator';

const BookingConfirmation = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const detailsSectionRef = useRef(null);

  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const availableOptions = [
    { id: 'insurance', name: t('option_insurance'), price: 45 },
    { id: 'driver', name: t('option_driver'), price: 120 },
    { id: 'gps', name: t('option_gps'), price: 15 },
    { id: 'wifi', name: t('option_wifi'), price: 20 },
    { id: 'child_seat', name: t('option_child_seat'), price: 25 },
    { id: 'additional_driver', name: t('option_additional_driver'), price: 30 }
  ];
    const navigate = useNavigate();
  const location = useLocation();
  const { showSuccess } = useNotification();
  const handleExploreMore = () => {
    navigate('/'); 
  };
  const { createBooking } = useBooking();
  const [bookingId, setBookingId] = useState(null);
  const [carImage, setCarImage] = useState(null);

  // Get Booking Data from Location State
  const bookingData = location.state || {};
  const { bookingDetails, carDetails } = bookingData;

  // Resolve car image
  useEffect(() => {
    if (!carDetails) return;
    
    let image = null;
    
    // Try using car.image as asset reference
    if (carDetails.image && typeof carDetails.image === 'string' && carDetails.image.includes('.')) {
      const parts = carDetails.image.split('.');
      if (parts.length === 2) {
        const category = parts[0];
        const key = parts[1];
        image = assets[category] && assets[category][key];
      }
    }
    
    // Try using car ID
    if (!image && carDetails.id && assets.cars[`car${carDetails.id}`]) {
      image = assets.cars[`car${carDetails.id}`];
    }
    
    // Try using car brand
    if (!image && carDetails.name) {
      const carBrand = carDetails.name.toLowerCase().split(' ')[0];
      
      if (carBrand === 'tesla' && assets.cars.tesla) {
        image = assets.cars.tesla;
      } else if (carBrand === 'bmw' && assets.cars.bmw) {
        image = assets.cars.bmw;
      } else if (carBrand === 'mercedes' && assets.cars.mercedes) {
        image = assets.cars.mercedes;
      }
    }
    setCarImage(image);
  }, [carDetails]);

  // Create booking on component mount
  useEffect(() => {
    const createNewBooking = async () => {
      if (!bookingDetails || !carDetails) {
        navigate('/cars');
        return;
      }
      try {
        const result = await createBooking({
          car: carDetails,
          ...bookingDetails,
          confirmationDate: new Date().toISOString()
        });
        if (result.success) {
          setBookingId(result.booking.id);
          showSuccess(t('bookingConfirmed'));
        }
      } catch (error) {
        console.error('Error creating booking:', error);
      }
    };
    
    createNewBooking();
  }, [bookingDetails, carDetails, createBooking, navigate, showSuccess, t]);

  const handleDownloadReceipt = async () => {
    if (!bookingData || !bookingId) {
      console.error("Booking data or ID is not available for receipt generation.");
      return;
    }

    const receiptGenerator = new ReceiptGenerator(language, t);
    
    const onSuccess = () => {
      console.log("Receipt generated successfully.");
    };

    const onError = (error) => {
      console.error("Receipt generation failed:", error);
    };

    await receiptGenerator.generateReceipt(bookingData, bookingId, onSuccess, onError);
  };

  return (
    <div className="min-h-screen bg-black text-white pt-20 font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="w-full pt-5 pb-20 relative overflow-hidden">
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-cyan-400 mb-6 relative overflow-hidden group animate-pulse-slow">
              <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              <SuccessIcon />
            </div>

            <h1 className="text-3xl md:text-5xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white mb-4 relative leading-[1.2]">
              {t('bookingConfirmed')}
              <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
            </h1>
            <br></br>
            <p className="text-cyan-300 text-lg mb-2 relative">
              {t('thankYouForBooking')}
              <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto mb-8">
              {t('bookingSuccessDescription')}
            </p>
            
            {/* Action buttons */}
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button 
                onClick={handleDownloadReceipt}
                className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black rounded-lg flex items-center justify-center transition-all duration-300 shadow-lg hover:shadow-cyan-500/20 transform hover:scale-105 relative overflow-hidden group cursor-pointer"
              >
                <span className="relative z-10 flex items-center">
                  <DownloadIcon />
                  <span className="ml-2">{t('downloadReceipt')}</span>
                </span>
              </button>
              
              <button 
                onClick={handleExploreMore}
                className="px-6 py-3 bg-transparent border border-cyan-500/30 text-cyan-400 rounded-lg flex items-center justify-center hover:bg-cyan-900/10 hover:border-cyan-400 transition-all duration-300 transform hover:scale-105 cursor-pointer"
              >
                {t('exploreMoreVehicles')}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>

      {/* Booking Details Section */}
      <div ref={detailsSectionRef} className="py-16 px-4 relative overflow-hidden">
        {/* Background effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <GlowingGrid containerRef={detailsSectionRef} />
        </div>
      
        <div className="container mx-auto max-w-4xl relative z-10">
          {/* Section title */}
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
              <h2 className="text-4xl font-semibold text-transparent uppercase bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
                {t('bookingDetails')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto mb-4"></div>
            </div>
          </div>
          
          {/* Car information card */}
          <div className="mb-12 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-xl overflow-hidden shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-900/30 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:scale-[1.01] group">
            <div className="flex flex-col md:flex-row">
              {/* Car image */}
              <div className="md:w-2/5 relative overflow-hidden">
                {carImage ? (
                  <img 
                    src={carImage} 
                    alt={carDetails.name}
                    className="w-full h-64 md:h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/400x300/0f172a/22d3ee?text=${encodeURIComponent(carDetails.name)}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-64 md:h-full bg-blue-900/20 flex items-center justify-center">
                    <p className="text-cyan-400 text-xl">{carDetails.name}</p>
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-br-lg text-sm font-medium">
                  {carDetails.category}
                </div>
              </div>
              
              {/* Car details */}
              <div className="md:w-3/5 p-8 relative">
                <h2 className="text-2xl md:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
                  {carDetails.name}
                </h2>
                <div className="flex flex-wrap gap-2 mb-6">
                  {carDetails.features && carDetails.features.slice(0, 4).map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-3 py-1 rounded-full bg-cyan-900/20 text-cyan-400 border border-cyan-900/50 transition-all duration-300 hover:bg-cyan-900/30 hover:border-cyan-500/60"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-5">
                  {/* Rental period */}
                  <div className="flex items-start group">
                    <div className="w-10 h-10 rounded-full bg-cyan-900/20 flex items-center justify-center text-cyan-400 mr-4 mt-1 transition-all duration-300 group-hover:bg-cyan-900/40">
                      <CalendarIcon />
                    </div>
                    <div>
                      <h3 className="text-cyan-400 text-sm mb-1 group-hover:text-cyan-300 transition-colors duration-300">{t('rentalPeriodTitle')}</h3>
                      <p className="text-white font-medium">
                        {formatDate(bookingDetails.startDate)} - {formatDate(bookingDetails.endDate)}
                      </p>
                      <p className="text-gray-400 text-sm">{bookingDetails.totalDays} {t('days')}</p>
                    </div>
                  </div>
                  
                  {/* Locations */}
                  <div className="flex items-start group">
                    <div className="w-10 h-10 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400 mr-4 mt-1 transition-all duration-300 group-hover:bg-purple-900/40">
                      <LocationIcon />
                    </div>
                    <div>
                      <h3 className="text-purple-400 text-sm mb-1 group-hover:text-purple-300 transition-colors duration-300">{t('locationsTitle')}</h3>
                      <p className="text-white font-medium">
                        {t('pickupLabel')}: {bookingDetails.pickupLocation?.charAt(0).toUpperCase() + bookingDetails.pickupLocation?.slice(1)}
                      </p>
                      <p className="text-white font-medium">
                        {t('returnLabel')}: {bookingDetails.dropoffLocation?.charAt(0).toUpperCase() + bookingDetails.dropoffLocation?.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Booking details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
            {/* Options */}
            <div className="p-8 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-900/30 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:scale-[1.02] relative group">
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 mr-4 transition-all duration-300 group-hover:bg-blue-900/40">
                  <OptionsIcon />
                </div>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                  {t('optionsTitle')}
                </h3>
              </div>
              
              <div className="space-y-4">
                {bookingDetails.options && bookingDetails.options.length > 0 ? (
                  bookingDetails.options.map(optionId => {
                    const option = availableOptions.find(opt => opt.id === optionId);
                    return option ? (
                      <div key={optionId} className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-blue-500/50 transition-colors duration-300">
                        <span className="text-white group-hover/item:text-cyan-100 transition-colors duration-300">{option.name}</span>
                        <span className="text-cyan-400 font-medium group-hover/item:text-cyan-300 transition-colors duration-300">${option.price}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <div className="flex items-center justify-center h-32 border border-dashed border-blue-900/40 rounded-lg">
                    <p className="text-gray-400 italic">{t('noOptionsSelected')}</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Payment summary */}
            <div className="p-8 bg-gradient-to-b from-gray-900/60 to-black/60 rounded-xl shadow-[0_0_25px_rgba(6,182,212,0.1)] border border-cyan-900/30 backdrop-blur-sm hover:shadow-[0_0_30px_rgba(6,182,212,0.15)] transition-all duration-500 transform hover:scale-[1.02] relative group">
              
              <div className="flex items-center mb-6">
                <div className="w-12 h-12 rounded-full bg-green-900/20 flex items-center justify-center text-green-400 mr-4 transition-all duration-300 group-hover:bg-green-900/40">
                  <PriceIcon />
                </div>
                <h3 className="text-xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">
                  {t('paymentSummaryTitle')}
                </h3>
              </div>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-green-500/50 transition-colors duration-300">
                  <span className="text-white group-hover/item:text-green-100 transition-colors duration-300">{t('vehicleRental')}</span>
                  <span className="text-cyan-400 font-medium group-hover/item:text-green-300 transition-colors duration-300">
                    ${carDetails.price} × {bookingDetails.totalDays} {t('days')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-green-500/50 transition-colors duration-300">
                  <span className="text-white group-hover/item:text-green-100 transition-colors duration-300">{t('subtotal')}</span>
                  <span className="text-cyan-400 font-medium group-hover/item:text-green-300 transition-colors duration-300">
                    ${carDetails.price * bookingDetails.totalDays}
                  </span>
                </div>
                
                {/* Calculate option cost */}
                {bookingDetails.options && bookingDetails.options.length > 0 && (
                  <div className="flex justify-between items-center border-b border-blue-900/30 pb-3 group/item hover:border-green-500/50 transition-colors duration-300">
                    <span className="text-white group-hover/item:text-green-100 transition-colors duration-300">{t('additionalOptions')}</span>
                    <span className="text-cyan-400 font-medium group-hover/item:text-green-300 transition-colors duration-300">
                      ${bookingDetails.totalPrice - (carDetails.price * bookingDetails.totalDays)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-3 bg-gradient-to-r from-transparent via-green-900/10 to-transparent p-3 rounded-lg">
                  <span className="text-white text-lg">{t('total')}</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">
                    ${bookingDetails.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
          <img 
            src={assets.faq?.ctaBackground2 || "/api/placeholder/1920/600"} 
            alt="Luxury driving experience" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white relative inline-block">
            {t('readyToExperienceLuxury')}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {language === 'fr' 
              ? "Parcourez notre flotte premium et réservez votre prochain voyage extraordinaire à travers le Maroc." 
              : "Browse our premium fleet and book your next extraordinary journey through Morocco."}
          </p>
          <Link
            to="/cars"
            className="inline-block px-10 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-medium rounded-md shadow-lg hover:shadow-cyan-500/20 transform transition-all duration-300 hover:scale-105 relative overflow-hidden group"
          >
            <span className="relative z-10">{t('browseOurFleet')}</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default BookingConfirmation;