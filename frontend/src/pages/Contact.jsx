import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { assets } from '../assets/assets';
import '../styles/animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const ContactPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const subjectOptions = [
    { value: 'General Inquiry', label: language === 'fr' ? 'Renseignement Général' : 'General Inquiry' },
    { value: 'Reservation', label: language === 'fr' ? 'Faire une Réservation' : 'Make a Reservation' },
    { value: 'Support', label: language === 'fr' ? 'Support Client' : 'Customer Support' },
    { value: 'Partnership', label: language === 'fr' ? 'Partenariat Commercial' : 'Business Partnership' }
  ];

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '2.75rem',
      minHeight: '2.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.7)',
      borderColor: '#374151',
      borderRadius: '0.375rem',
      fontFamily: 'Orbitron, sans-serif',
      color: 'white',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(6, 182, 212, 1)' : 'none',
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
    menuList: (provided) => ({
      ...provided,
      maxHeight: '240px',
      overflowY: 'auto',
      paddingRight: '8px',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(255, 255, 255, 0.5) transparent',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.5)' : 'black',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      padding: '4px 8px',
      fontSize: '0.875rem',
      lineHeight: '1.2',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
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
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({
      ...prevData,
      [name]: value
    }));
  };
  
  const handleSubmit = (e) => {
    e.preventDefault();
    // Simulate form submission
    setSubmitStatus('loading');
    setTimeout(() => {
      setSubmitStatus('success');
      // Reset form after success
      setFormData({
        name: '',
        email: '',
        phone: '',
        message: '',
        subject: 'General Inquiry'
      });
    }, 1500);
  };
  
  // Contact information
  const contactInfo = [
    {
      icon: "📍",
      title: "Main Office",
      details: "198 Boulevard Mohammed V, Mohammedia, Morocco"
    },
    {
      icon: "📞",
      title: "Phone",
      details: "+212 57 77 777"
    },
    {
      icon: "✉️",
      title: "Email",
      details: "info@rentmyride-morocco.ma"
    },
    {
      icon: "⏰",
      title: "Hours",
      details: "Open daily: 9:00 AM - 10:00 PM"
    }
  ];
  
  // Locations 
  const locations = [
    { city: "Casablanca", address: "123 Boulevard Mohammed V" },
    { city: "Marrakech", address: "45 Avenue Hassan II" },
    { city: "Rabat", address: "78 Rue des Consuls" },
    { city: "Tangier", address: "90 Boulevard Pasteur" }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70" />
          <img 
            src={assets.contact?.heroImage1 || "/api/placeholder/1920/600"} 
            alt="Luxury cars" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-3xl md:text-6xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t('contact')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10">
            {language === 'fr' ? 'Prêt à vivre l\'extraordinaire ? Nous sommes là pour vous aider' : 'Ready to experience the extraordinary? We\'re here to assist you'}
          </p>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white animate-pulse"></div>
      </div>
      
      {/* Contact Information */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-start">
            {/* Contact Form */}
            <div>
              <h2 className="text-3xl mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400">{t('getInTouch')}</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-200 mb-2">{t('fullName')}</label>
                    <input
                      type="text"
                      id="name"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="w-full px-4 py-0 h-[2.75rem] bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="email" className="block text-gray-200 mb-2">{t('email')}</label>
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="w-full px-4 py-0 h-[2.75rem] bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                      required
                    />
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="phone" className="block text-gray-200 mb-2">{t('phoneNumber')}</label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="w-full px-4 py-0 h-[2.75rem] bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
                    />
                  </div>
                  
                  <div>
                    <label htmlFor="subject" className="block text-gray-200 mb-2">{language === 'fr' ? 'Sujet' : 'Subject'}</label>
                    <Select
                      options={subjectOptions}
                      value={subjectOptions.find(option => option.value === formData.subject)}
                      onChange={(selectedOption) => 
                        setFormData(prevData => ({
                          ...prevData,
                          subject: selectedOption.value
                        }))
                      }
                      styles={customStyles}
                      isSearchable={false}
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
                
                <div>
                  <label htmlFor="message" className="block text-gray-300 mb-2">{t('message')}</label>
                  <textarea
                    id="message"
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows="4"
                    className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-white resize-none"
                    required
                  ></textarea>
                </div>
                
                <div className="mt-8">
                <button
                  type="submit"
                    className={`
                      px-8 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] rounded-md 
                      shadow-lg hover:shadow-blue-500/20 
                      transition-all duration-300
                      w-full sm:w-auto
                      ${submitStatus === 'loading' ? 'opacity-70 cursor-not-allowed' : ''}
                    `}
                  disabled={submitStatus === 'loading'}
                >
                    {submitStatus === 'loading' 
                      ? <span className="flex items-center justify-center">
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-black" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          {language === 'fr' ? 'Envoi en cours...' : 'Sending...'}
                        </span>
                      : t('sendMessage')
                    }
                </button>
                </div>
                
                {submitStatus === 'success' && (
                  <div className="mt-4 p-4 bg-green-900/30 border border-green-500 rounded-lg">
                    <p className="text-green-400">
                      {language === 'fr' 
                        ? 'Votre message a été envoyé avec succès. Notre équipe vous contactera prochainement.' 
                        : 'Your message has been sent successfully. Our team will contact you shortly.'}
                    </p>
                  </div>
                )}
              </form>
            </div>
            
            {/* Contact Information */}
            <div>
              <h2 className="text-3xl mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400">{language === 'fr' ? 'Informations de Contact' : 'Contact Information'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((info, index) => (
                  <div 
                    key={index} 
                    className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/50 shadow-lg hover:shadow-blue-900/20 transition-all duration-300 hover:border-cyan-400/50"
                  >
                    <div className="flex items-center mb-3">
                      <span className="text-xl mr-3">{info.icon}</span>
                      <h3 className="text-xl font-semibold text-white">{language === 'fr' && info.title === 'Main Office' ? 'Bureau Principal' : 
                                                                      language === 'fr' && info.title === 'Phone' ? 'Téléphone' : 
                                                                      language === 'fr' && info.title === 'Email' ? 'Email' : 
                                                                      language === 'fr' && info.title === 'Hours' ? 'Horaires' : 
                                                                      info.title}</h3>
                    </div>
                    <p className="text-gray-300">{info.details}</p>
                  </div>
                ))}
              </div>
              
              <h3 className="text-2xl mt-12 mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400">
                {t('locations')}
              </h3>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {locations.map((loc, index) => (
                  <div 
                    key={index} 
                    className="bg-black/40 backdrop-blur-sm p-4 rounded-lg border border-gray-800 hover:border-cyan-900/50 transition-all duration-300"
                  >
                    <h4 className="text-lg text-cyan-400 mb-1">{loc.city}</h4>
                    <p className="text-gray-400 text-sm">{loc.address}</p>
                  </div>
                ))}
              </div>
              
              <div className="mt-12">
                <div className="bg-black/60 backdrop-blur-sm p-6 rounded-lg border border-cyan-900/50 shadow-lg">
                  <h3 className="text-xl font-semibold text-white mb-4">{language === 'fr' ? 'Heures d\'Ouverture' : 'Opening Hours'}</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'fr' ? 'Lundi - Vendredi' : 'Monday - Friday'}</span>
                      <span className="text-cyan-400">9:00 AM - 10:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'fr' ? 'Samedi' : 'Saturday'}</span>
                      <span className="text-cyan-400">10:00 AM - 8:00 PM</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">{language === 'fr' ? 'Dimanche' : 'Sunday'}</span>
                      <span className="text-cyan-400">10:00 AM - 6:00 PM</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Map Section */}
      <section className="py-16 px-4 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {language === 'fr' ? 'Trouvez-Nous' : 'Find Us'}
          </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {language === 'fr' 
                ? 'Visitez notre bureau principal à Mohammedia ou l\'une de nos succursales situées dans les principales villes du Maroc.' 
                : 'Visit our main office in Mohammedia or one of our branches located in major cities across Morocco.'}
            </p>
          </div>
          
          {/* Map Placeholder */}
          <div className="relative h-96 rounded-xl overflow-hidden border border-gray-800">
            <iframe 
              title={language === 'fr' ? 'Carte de localisation Mohammedia' : 'Mohammedia Location Map'}
              className="w-full h-full"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d54109.88666072956!2d-7.422272027836355!3d33.6835136520606!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0xda7b69b2c4ac1c1%3A0xaec39cc99ffeea7c!2sMohammedia%2C%20Morocco!5e0!3m2!1sen!2sus!4v1626517232073!5m2!1sen!2sus"
              loading="lazy"
            ></iframe>
          </div>
        </div>
      </section>
      
      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white animate-pulse"></div>
      </div>
      
      {/* Newsletter Signup Section */}
      <section className="py-16 px-4 bg-black/80 backdrop-blur-lg">
        <div className="container mx-auto max-w-4xl text-center">
          <div className="relative mb-8">
            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
              {t('stayConnected')}
          </h2>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {t('newsletterDescription')}
            </p>
          </div>
          
          {/* Newsletter Form */}
          <form className="max-w-md mx-auto flex">
            <input
              type="email"
              placeholder={t('emailPlaceholder')}
              className="w-full px-4 py-3 bg-black/70 border border-gray-700 rounded-l-md focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
              required
            />
            <button 
              type="submit"
              className="px-6 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] rounded-r-md shadow-lg hover:shadow-blue-500/20 transition-all duration-300"
            >
              {t('subscribe')}
            </button>
          </form>
          
          <p className="text-gray-400 text-xs mt-4">
            {t('privacyNotice')}
          </p>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;