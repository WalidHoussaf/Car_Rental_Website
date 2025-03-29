import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { useBooking } from '../context/BookingContext';
import { assets } from '../assets/assets';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

// Icônes SVG
const SuccessIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const CalendarIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
    <line x1="16" y1="2" x2="16" y2="6"></line>
    <line x1="8" y1="2" x2="8" y2="6"></line>
    <line x1="3" y1="10" x2="21" y2="10"></line>
  </svg>
);

const LocationIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
    <circle cx="12" cy="10" r="3"></circle>
  </svg>
);

const OptionsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const PriceIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const DownloadIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
    <polyline points="7 10 12 15 17 10"></polyline>
    <line x1="12" y1="15" x2="12" y2="3"></line>
  </svg>
);

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { createBooking } = useBooking();
  const [bookingId, setBookingId] = useState(null);
  const [carImage, setCarImage] = useState(null);
  const { language } = useLanguage();
  const t = useTranslations(language);

  // Récupération des données de réservation depuis l'état de location
  const bookingData = location.state || {};
  const { bookingDetails, carDetails } = bookingData;

  // Fonction d'aide pour formater la date
  const formatDate = (date) => {
    if (!date) return '';
    return new Date(date).toLocaleDateString('fr-FR', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric', 
      year: 'numeric' 
    });
  };

  // Liste des options disponibles avec tarification (identique à BookingOption.jsx)
  const availableOptions = [
    { id: 'insurance', name: 'Assurance Premium', price: 45 },
    { id: 'driver', name: 'Chauffeur Professionnel', price: 120 },
    { id: 'gps', name: 'Navigation GPS', price: 15 },
    { id: 'wifi', name: 'Hotspot Wi-Fi Mobile', price: 20 },
    { id: 'child_seat', name: 'Siège Enfant', price: 25 },
    { id: 'additional_driver', name: 'Conducteur Supplémentaire', price: 30 }
  ];

  // Résoudre l'image de la voiture
  useEffect(() => {
    if (!carDetails) return;
    
    let image = null;
    
    // Tentative 1: Utiliser car.image si c'est une référence d'actif
    if (carDetails.image && typeof carDetails.image === 'string' && carDetails.image.includes('.')) {
      const parts = carDetails.image.split('.');
      if (parts.length === 2) {
        const category = parts[0];
        const key = parts[1];
        image = assets[category] && assets[category][key];
      }
    }
    
    // Tentative 2: Rechercher par ID (car1, car2, etc.)
    if (!image && carDetails.id && assets.cars[`car${carDetails.id}`]) {
      image = assets.cars[`car${carDetails.id}`];
    }
    
    // Tentative 3: Rechercher par nom de marque
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

  // Créer la réservation au montage
  useEffect(() => {
    const createNewBooking = async () => {
      if (!bookingDetails || !carDetails) {
        navigate('/cars');
        return;
      }
      
      try {
        // Créer la réservation dans le contexte
        const result = await createBooking({
          car: carDetails,
          ...bookingDetails,
          confirmationDate: new Date().toISOString()
        });
        
        if (result.success) {
          setBookingId(result.booking.id);
        }
      } catch (error) {
        console.error('Erreur lors de la création de la réservation:', error);
      } finally {
        // Animation de chargement supprimée
      }
    };
    
    createNewBooking();
  }, [bookingDetails, carDetails, createBooking, navigate]);

  // Gérer le téléchargement du reçu
  const handleDownloadReceipt = () => {
    // Utiliser cette variable pour éviter les re-renders
    const pdfBookingId = bookingId || 'TEMP-' + Math.floor(Math.random() * 10000);
    
    // Afficher un message de chargement
    const loadingNotification = document.createElement('div');
    loadingNotification.style.position = 'fixed';
    loadingNotification.style.bottom = '20px';
    loadingNotification.style.right = '20px';
    loadingNotification.style.backgroundColor = 'rgba(6, 182, 212, 0.9)';
    loadingNotification.style.color = 'white';
    loadingNotification.style.padding = '10px 20px';
    loadingNotification.style.borderRadius = '5px';
    loadingNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    loadingNotification.style.zIndex = '1000';
    loadingNotification.textContent = t('receiptPreparation');
    document.body.appendChild(loadingNotification);
    
    try {
      // Créer un élément div pour le contenu du PDF
      const receiptContent = document.createElement('div');
      receiptContent.id = 'pdf-content';
      receiptContent.style.width = '210mm'; // Format A4
      receiptContent.style.padding = '20mm';
      receiptContent.style.backgroundColor = 'white';
      receiptContent.style.color = 'black';
      receiptContent.style.fontFamily = 'Arial, sans-serif';
      receiptContent.style.position = 'fixed';
      receiptContent.style.top = '0';
      receiptContent.style.left = '0';
      receiptContent.style.zIndex = '-9999';
      
      // Stocker des copies locales pour éviter les problèmes de référence
      const carName = carDetails?.name || 'Véhicule';
      const carCategory = carDetails?.category || 'Premium';
      const carPrice = carDetails?.price || 0;
      const startDateFormatted = formatDate(bookingDetails?.startDate);
      const endDateFormatted = formatDate(bookingDetails?.endDate);
      const totalDays = bookingDetails?.totalDays || 1;
      const totalPrice = bookingDetails?.totalPrice || 0;
      const pickupLocation = bookingDetails?.pickupLocation?.charAt(0).toUpperCase() + (bookingDetails?.pickupLocation?.slice(1) || '');
      const dropoffLocation = bookingDetails?.dropoffLocation?.charAt(0).toUpperCase() + (bookingDetails?.dropoffLocation?.slice(1) || '');
      const hasOptions = bookingDetails?.options && bookingDetails.options.length > 0;
      const optionsPrice = hasOptions ? totalPrice - (carPrice * totalDays) : 0;
      
      // Créer le contenu du reçu avec un style simple
      receiptContent.innerHTML = `
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #22d3ee; margin-bottom: 10px; font-size: 24px;">LUXE WHEELS</h1>
          <h2 style="margin-top: 0; font-size: 18px;">Confirmation de réservation</h2>
        </div>
        
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
          <p><strong>Numéro de réservation:</strong> #${pdfBookingId}</p>
          <p><strong>Date:</strong> ${new Date().toLocaleDateString('fr-FR')}</p>
        </div>
        
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
          <h3 style="margin-bottom: 10px; font-size: 16px;">Détails du véhicule</h3>
          <p><strong>Véhicule:</strong> ${carName}</p>
          <p><strong>Catégorie:</strong> ${carCategory}</p>
        </div>
        
        <div style="margin-bottom: 20px; border-bottom: 1px solid #ccc; padding-bottom: 15px;">
          <h3 style="margin-bottom: 10px; font-size: 16px;">Détails de la location</h3>
          <p><strong>Date de début:</strong> ${startDateFormatted}</p>
          <p><strong>Date de fin:</strong> ${endDateFormatted}</p>
          <p><strong>Durée:</strong> ${totalDays} jours</p>
          <p><strong>Lieu de prise en charge:</strong> ${pickupLocation}</p>
          <p><strong>Lieu de retour:</strong> ${dropoffLocation}</p>
        </div>
        
        <div style="margin-bottom: 20px;">
          <h3 style="margin-bottom: 10px; font-size: 16px;">Résumé du paiement</h3>
          <p><strong>Location du véhicule:</strong> $${carPrice} × ${totalDays} jours = $${carPrice * totalDays}</p>
          ${hasOptions ? `<p><strong>Options additionnelles:</strong> $${optionsPrice}</p>` : ''}
          <p style="font-size: 18px; font-weight: bold; margin-top: 15px;"><strong>Total:</strong> $${totalPrice}</p>
        </div>
        
        <div style="text-align: center; margin-top: 40px; color: #666;">
          <p>Merci d'avoir choisi Luxe Wheels pour votre location de véhicule.</p>
          <p>Pour toute assistance, contactez-nous au support@luxewheels.com</p>
        </div>
      `;
      
      // Ajouter au document
      document.body.appendChild(receiptContent);
      
      // Charger html2pdf via script (une seule fois)
      if (!window.html2pdf) {
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/html2pdf.js/0.10.1/html2pdf.bundle.min.js';
        
        script.onload = function() {
          // Attendre que le DOM soit prêt
          setTimeout(() => {
            generatePDF(receiptContent, pdfBookingId, loadingNotification);
          }, 1000);
        };
        
        script.onerror = function() {
          // Gérer l'erreur de chargement
          handlePDFError(loadingNotification);
        };
        
        document.head.appendChild(script);
      } else {
        // Le script est déjà chargé
        setTimeout(() => {
          generatePDF(receiptContent, pdfBookingId, loadingNotification);
        }, 1000);
      }
    } catch (error) {
      console.error('Erreur lors de la préparation du PDF:', error);
      handlePDFError(loadingNotification);
    }
  };
  
  // Fonction pour générer le PDF (extraite pour éviter la duplication de code)
  const generatePDF = (element, pdfBookingId, loadingNotification) => {
    try {
      const opt = {
        margin: 10,
        filename: `recu-reservation-${pdfBookingId}.pdf`,
        image: { type: 'jpeg', quality: 0.98 },
        html2canvas: { 
          scale: 2,
          useCORS: true,
          logging: true,
          letterRendering: true
        },
        jsPDF: { 
          unit: 'mm', 
          format: 'a4', 
          orientation: 'portrait',
          compress: true
        }
      };
      
      window.html2pdf().from(element).set(opt).save().then(() => {
        // Nettoyage après génération réussie
        cleanupAfterPDFGeneration(element, loadingNotification, true);
      }).catch(error => {
        console.error('Erreur lors de la génération:', error);
        handlePDFError(loadingNotification);
      });
    } catch (error) {
      console.error('Erreur dans generatePDF:', error);
      handlePDFError(loadingNotification);
    }
  };
  
  // Fonction pour gérer les erreurs PDF
  const handlePDFError = (loadingNotification) => {
    // Supprimer la notification de chargement
    if (document.body.contains(loadingNotification)) {
      document.body.removeChild(loadingNotification);
    }
    
    // Afficher une notification d'erreur
    const errorNotification = document.createElement('div');
    errorNotification.style.position = 'fixed';
    errorNotification.style.bottom = '20px';
    errorNotification.style.right = '20px';
    errorNotification.style.backgroundColor = 'rgba(220, 38, 38, 0.9)';
    errorNotification.style.color = 'white';
    errorNotification.style.padding = '10px 20px';
    errorNotification.style.borderRadius = '5px';
    errorNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
    errorNotification.style.zIndex = '1000';
    errorNotification.textContent = t('receiptError');
    
    document.body.appendChild(errorNotification);
    
    // Supprimer la notification après 3 secondes
    setTimeout(() => {
      if (document.body.contains(errorNotification)) {
        document.body.removeChild(errorNotification);
      }
    }, 3000);
    
    // Nettoyer tout élément PDF restant
    const pdfContent = document.getElementById('pdf-content');
    if (pdfContent && document.body.contains(pdfContent)) {
      document.body.removeChild(pdfContent);
    }
  };
  
  // Fonction pour nettoyer après la génération PDF
  const cleanupAfterPDFGeneration = (element, loadingNotification, success) => {
    // Supprimer l'élément du contenu PDF
    if (element && document.body.contains(element)) {
      document.body.removeChild(element);
    }
    
    // Supprimer la notification de chargement
    if (document.body.contains(loadingNotification)) {
      document.body.removeChild(loadingNotification);
    }
    
    if (success) {
      // Afficher une notification de succès
      const successNotification = document.createElement('div');
      successNotification.style.position = 'fixed';
      successNotification.style.bottom = '20px';
      successNotification.style.right = '20px';
      successNotification.style.backgroundColor = 'rgba(6, 182, 212, 0.9)';
      successNotification.style.color = 'white';
      successNotification.style.padding = '10px 20px';
      successNotification.style.borderRadius = '5px';
      successNotification.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
      successNotification.style.zIndex = '1000';
      successNotification.textContent = t('receiptDownloaded');
      
      document.body.appendChild(successNotification);
      
      // Supprimer la notification après 3 secondes
      setTimeout(() => {
        if (document.body.contains(successNotification)) {
          document.body.removeChild(successNotification);
        }
      }, 3000);
    }
  };

  // Gérer le clic sur le bouton explorer plus
  const handleExploreMore = () => {
    // Force la navigation avec un rafraîchissement de la page
    window.location.href = '/cars';
  };

  // Si pas de données de réservation, retourner à la page des voitures
  if (!bookingDetails || !carDetails) {
    return null; // Redirigera dans useEffect
  }

  return (
    <div className="min-h-screen bg-black text-white pt-20">
      {/* Section Héro */}
      <div className="w-full bg-gradient-to-r from-blue-900/30 to-black py-16 relative overflow-hidden">
        {/* Éléments d'arrière-plan */}
        <div className="absolute inset-0 opacity-15 z-0 bg-grid-scan"></div>
        <div className="absolute inset-0 opacity-10 z-0 bg-tech-lines"></div>
        <div className="absolute -top-20 -right-20 w-64 h-64 bg-blue-500 rounded-full opacity-8 blur-xl z-0 floating-light"></div>
        <div className="absolute -bottom-16 -left-16 w-48 h-48 bg-indigo-500 rounded-full opacity-8 blur-xl z-0 floating-light-slow"></div>
        
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-r from-green-500/20 to-cyan-500/20 text-green-400 mb-6">
              <SuccessIcon />
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-4">
              {t('bookingConfirmed')}
            </h1>
            <p className="text-cyan-300 font-['Orbitron'] text-lg mb-2">
              {t('thankYouForBooking')}
            </p>
            <p className="text-gray-400 max-w-2xl mx-auto">
              {t('bookingSuccessDescription')}
            </p>
          </div>
        </div>
      </div>

      {/* Détails de la confirmation */}
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          {/* Carte d'informations sur la voiture */}
          <div className="mb-8 bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-xl overflow-hidden shadow-lg border border-blue-900/30 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row">
              {/* Image de la voiture */}
              <div className="md:w-2/5 relative">
                {carImage ? (
                  <img 
                    src={carImage} 
                    alt={carDetails.name}
                    className="w-full h-64 md:h-full object-cover"
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = `https://via.placeholder.com/400x300/0f172a/22d3ee?text=${encodeURIComponent(carDetails.name)}`;
                    }}
                  />
                ) : (
                  <div className="w-full h-64 md:h-full bg-blue-900/20 flex items-center justify-center">
                    <p className="text-cyan-400 text-xl font-['Orbitron']">{carDetails.name}</p>
                  </div>
                )}
                <div className="absolute top-0 left-0 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-1 rounded-br-lg font-['Orbitron'] text-sm">
                  {carDetails.category}
                </div>
              </div>
              
              {/* Détails de la voiture */}
              <div className="md:w-3/5 p-6">
                <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] mb-2">
                  {carDetails.name}
                </h2>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  {carDetails.features && carDetails.features.slice(0, 4).map((feature, index) => (
                    <span 
                      key={index} 
                      className="text-xs px-2 py-1 rounded-full bg-blue-900/30 text-cyan-400 border border-blue-900/50"
                    >
                      {feature}
                    </span>
                  ))}
                </div>
                
                <div className="space-y-3">
                  {/* Période de location */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-cyan-900/20 flex items-center justify-center text-cyan-400 mr-3 mt-1">
                      <CalendarIcon />
                    </div>
                    <div>
                      <h3 className="text-cyan-400 font-['Orbitron'] text-sm">{t('rentalPeriodTitle')}</h3>
                      <p className="text-white">
                        {formatDate(bookingDetails.startDate)} - {formatDate(bookingDetails.endDate)}
                      </p>
                      <p className="text-gray-400 text-sm">{bookingDetails.totalDays} {t('days')}</p>
                    </div>
                  </div>
                  
                  {/* Lieux */}
                  <div className="flex items-start">
                    <div className="w-8 h-8 rounded-full bg-purple-900/20 flex items-center justify-center text-purple-400 mr-3 mt-1">
                      <LocationIcon />
                    </div>
                    <div>
                      <h3 className="text-purple-400 font-['Orbitron'] text-sm">{t('locationsTitle')}</h3>
                      <p className="text-white">
                        {t('pickupLabel')}: {bookingDetails.pickupLocation?.charAt(0).toUpperCase() + bookingDetails.pickupLocation?.slice(1)}
                      </p>
                      <p className="text-white">
                        {t('returnLabel')}: {bookingDetails.dropoffLocation?.charAt(0).toUpperCase() + bookingDetails.dropoffLocation?.slice(1)}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Détails de réservation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {/* Options */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-xl shadow-lg border border-blue-900/30 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-blue-900/20 flex items-center justify-center text-blue-400 mr-3">
                  <OptionsIcon />
                </div>
                <h3 className="text-xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-blue-400">
                  {t('optionsTitle')}
                </h3>
              </div>
              
              <div className="space-y-3">
                {bookingDetails.options && bookingDetails.options.length > 0 ? (
                  bookingDetails.options.map(optionId => {
                    const option = availableOptions.find(opt => opt.id === optionId);
                    return option ? (
                      <div key={optionId} className="flex justify-between items-center border-b border-blue-900/30 pb-2">
                        <span className="text-white">{option.name}</span>
                        <span className="text-cyan-400 font-['Orbitron']">${option.price}</span>
                      </div>
                    ) : null;
                  })
                ) : (
                  <p className="text-gray-400 italic">{t('noOptionsSelected')}</p>
                )}
              </div>
            </div>
            
            {/* Résumé du paiement */}
            <div className="p-6 bg-gradient-to-br from-gray-900 to-blue-900/30 rounded-xl shadow-lg border border-blue-900/30 backdrop-blur-sm">
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 rounded-full bg-green-900/20 flex items-center justify-center text-green-400 mr-3">
                  <PriceIcon />
                </div>
                <h3 className="text-xl font-['Orbitron'] text-transparent bg-clip-text bg-gradient-to-r from-white to-green-400">
                  {t('paymentSummaryTitle')}
                </h3>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-2">
                  <span className="text-white">{t('vehicleRental')}</span>
                  <span className="text-cyan-400 font-['Orbitron']">
                    ${carDetails.price} × {bookingDetails.totalDays} {t('days')}
                  </span>
                </div>
                
                <div className="flex justify-between items-center border-b border-blue-900/30 pb-2">
                  <span className="text-white">{t('subtotal')}</span>
                  <span className="text-cyan-400 font-['Orbitron']">
                    ${carDetails.price * bookingDetails.totalDays}
                  </span>
                </div>
                
                {/* Calculer le coût des options */}
                {bookingDetails.options && bookingDetails.options.length > 0 && (
                  <div className="flex justify-between items-center border-b border-blue-900/30 pb-2">
                    <span className="text-white">{t('additionalOptions')}</span>
                    <span className="text-cyan-400 font-['Orbitron']">
                      ${bookingDetails.totalPrice - (carDetails.price * bookingDetails.totalDays)}
                    </span>
                  </div>
                )}
                
                <div className="flex justify-between items-center pt-2 font-bold">
                  <span className="text-white text-lg">{t('total')}</span>
                  <span className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">
                    ${bookingDetails.totalPrice}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Boutons d'action */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button 
              onClick={handleDownloadReceipt}
              className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-['Orbitron'] rounded-lg flex items-center justify-center hover:from-blue-500 hover:to-cyan-500 transition-all duration-300 shadow-lg hover:shadow-cyan-500/20"
            >
              <DownloadIcon className="mr-2" />
              {t('downloadReceipt')}
            </button>
            
            <button 
              onClick={handleExploreMore}
              className="px-6 py-3 bg-black/60 border border-cyan-500/30 text-cyan-400 font-['Orbitron'] rounded-lg flex items-center justify-center hover:bg-black/80 hover:border-cyan-400 transition-all duration-300"
            >
              {t('exploreMoreVehicles')}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmation; 