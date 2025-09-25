import React, { useState, useEffect, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assets } from '../assets/assets';
import BookingHeader from '../components/Booking/BookingHeader';
import BookingCalendar from '../components/Booking/BookingCalendar';
import BookingLocation from '../components/Booking/BookingLocation';
import BookingOption from '../components/Booking/BookingOption';
import BookingSummary from '../components/Booking/BookingSummary';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../translations';
import { useAuth } from '../hooks/useAuth';
import CarContext from '../context/CarContext';
import { calcBasePrice } from '../utils/price';

const Booking = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [car, setCar] = useState(null);
  const [loading, setLoading] = useState(true);
  const [bookingStep, setBookingStep] = useState(1); 
  const { language } = useLanguage();
  const t = useTranslations(language);
  const { isAuthenticated, loading: authLoading } = useAuth();
  
  const { cars } = useContext(CarContext);
  
  const resolveImagePath = (imagePath) => {
    if (!imagePath) return "/api/placeholder/400/240";
    
    if (imagePath.startsWith('http') || imagePath.startsWith('/')) {
      return imagePath;
    }
    
    if (imagePath.includes('.')) {
      const path = imagePath.split('.');
      let resolved = assets;
      
      try {
        path.forEach(key => {
          resolved = resolved[key];
        });
        return resolved || "/api/placeholder/400/240";
      } catch {
        return "/api/placeholder/400/240";
      }
    }
    
    return imagePath;
  };
  
  const [bookingDetails, setBookingDetails] = useState({
    startDate: null,
    endDate: null,
    pickupLocation: '',
    dropoffLocation: '',
    pickupTime: null,
    dropoffTime: null,
    options: [],
    totalDays: 0,
    totalPrice: 0
  });
  
  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      localStorage.setItem('redirectAfterLogin', `/booking/${id}`);
      navigate('/login');
    }
  }, [isAuthenticated, authLoading, navigate, id]);

  useEffect(() => {
    if (!isAuthenticated && !authLoading) {
      return;
    }
    
    setLoading(true);
    
    setTimeout(() => {
      if (!id) {
        setLoading(false);
        return;
      }
      
      const foundCar = cars.find(c => 
        c._id === id || 
        c.id === parseInt(id) || 
        c._id === parseInt(id) || 
        c.id === id ||
        String(c._id) === id ||
        String(c.id) === id
      );
      
      if (foundCar) {
        const carWithResolvedImage = {...foundCar};
        carWithResolvedImage.image = resolveImagePath(foundCar.image);
        setCar(carWithResolvedImage);
        
        const initialLocation = Array.isArray(foundCar.location) 
          ? foundCar.location[0] 
          : foundCar.location;
        
        setBookingDetails(prev => ({
          ...prev,
          pickupLocation: initialLocation,
          dropoffLocation: initialLocation
        }));
      }
      setLoading(false);
    }, 800);
  }, [id, cars, isAuthenticated, authLoading]);
  
  const handleDateSelection = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const differenceInTime = end.getTime() - start.getTime();
    const daysDifference = Math.ceil(differenceInTime / (1000 * 3600 * 24));
    const totalDays = daysDifference === 0 ? 1 : daysDifference;
    const finalTotalDays = Math.max(totalDays, 1);
    const basePrice = car ? calcBasePrice(car, finalTotalDays) : 0;
    
    setBookingDetails(prev => ({
      ...prev,
      startDate,
      endDate,
      totalDays: finalTotalDays,
      totalPrice: basePrice
    }));
    
    setBookingStep(2);
  };
  
  const handleLocationSelection = ({ pickupLocation, dropoffLocation, pickupTime, dropoffTime }) => {
    setBookingDetails(prev => ({
      ...prev,
      pickupLocation,
      dropoffLocation,
      pickupTime: pickupTime || prev.pickupTime,
      dropoffTime: dropoffTime || prev.dropoffTime
    }));
    
    setBookingStep(3);
  };
  
  const handleOptionSelection = (options, additionalPrice) => {
    const basePrice = car ? calcBasePrice(car, bookingDetails.totalDays) : 0;
    
    setBookingDetails(prev => ({
      ...prev,
      options,
      totalPrice: basePrice + additionalPrice
    }));
    
    setBookingStep(4);
  };
  
  const handleBookingSubmit = (paymentMethod = 'creditCard') => {
    navigate('/booking-confirmation', { 
      state: { 
        bookingDetails: {
          ...bookingDetails,
          paymentMethod
        },
        carDetails: car
      } 
    });
  };
  
  const goToNextStep = () => {
    setBookingStep(prev => Math.min(prev + 1, 4));
  };
  
  const goToPreviousStep = () => {
    setBookingStep(prev => Math.max(prev - 1, 1));
  };
  
  if (loading || authLoading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }
  
  if (!car) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-3xl font-bold mb-4 font-['Orbitron']">{t('carNotFound')}</h1>
        <p className="text-gray-400 mb-8">{t('vehicleNotAvailable')}</p>
        <button 
          onClick={() => navigate('/cars')}
          className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-medium rounded-md hover:opacity-90"
        >
          {t('viewAllCars')}
        </button>
      </div>
    );
  }
  
  return (
    <div className="min-h-screen bg-black text-white pb-10">
      <BookingHeader car={car} bookingStep={bookingStep} />
      <div className="container mx-auto px-4 py-12">
        {bookingStep !== 4 ? (
          <div className="flex justify-center">
            <div className="w-full max-w-screen-xl mx-auto">
              {bookingStep === 1 && (
                <BookingCalendar 
                  car={car}
                  onDateSelection={handleDateSelection} 
                  onNextStep={goToNextStep}
                />
              )}
              {bookingStep === 2 && (
                <BookingLocation 
                  car={car}
                  bookingDetails={bookingDetails}
                  onLocationSelection={handleLocationSelection}
                  onPreviousStep={goToPreviousStep}
                  onNextStep={goToNextStep}
                />
              )}
              {bookingStep === 3 && (
                <BookingOption 
                  car={car}
                  bookingDetails={bookingDetails}
                  onOptionSelection={handleOptionSelection}
                  onPreviousStep={goToPreviousStep}
                  onNextStep={goToNextStep}
                />
              )}
            </div>
          </div>
        ) : (
          <div className="flex justify-center">
            <div className="w-full max-w-5xl">
              <BookingSummary 
                car={car}
                bookingDetails={bookingDetails}
                bookingStep={bookingStep}
                onSubmit={handleBookingSubmit}
                onPreviousStep={goToPreviousStep}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Booking;
