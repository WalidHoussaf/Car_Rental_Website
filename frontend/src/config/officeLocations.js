// Office locations configuration with specific addresses
export const OFFICE_LOCATIONS = [
  {
    id: 'mohammedia',
    name: 'Mohammedia',
    displayName: {
      en: 'Mohammedia Office',
      fr: 'Bureau Mohammedia'
    },
    address: {
      en: 'Derb Chabab A El Alia, Mohammedia 28810',
      fr: 'Derb Chabab A El Alia, Mohammedia 28810'
    },
    coordinates: {
      lat: 33.6866,
      lng: -7.3833
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 523-32-4567',
    email: 'mohammedia@rentmyride.ma',
    officeType: 'Main Branch',
    features: ['Free Parking', 'Customer Lounge', 'Car Wash Service', 'Insurance Desk', '24/7 Security']
  },
  {
    id: 'casablanca',
    name: 'Casablanca',
    displayName: {
      en: 'Casablanca Downtown Office',
      fr: 'Bureau Centre-ville Casablanca'
    },
    address: {
      en: 'Boulevard Mohammed V, Quartier des Habous, Casablanca 20250',
      fr: 'Boulevard Mohammed V, Quartier des Habous, Casablanca 20250'
    },
    coordinates: {
      lat: 33.5731,
      lng: -7.5898
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 522-48-9123',
    email: 'casablanca@rentmyride.ma',
    officeType: 'Premium Branch',
    features: ['Valet Service', 'Premium Lounge', 'VIP Parking', 'Business Center']
  },
  {
    id: 'rabat',
    name: 'Rabat',
    displayName: {
      en: 'Rabat Capital Office',
      fr: 'Bureau Capitale Rabat'
    },
    address: {
      en: 'Avenue Allal Ben Abdellah, Agdal, Rabat 10090',
      fr: 'Avenue Allal Ben Abdellah, Agdal, Rabat 10090'
    },
    coordinates: {
      lat: 34.0209,
      lng: -6.8417
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 537-77-8901',
    email: 'rabat@rentmyride.ma',
    officeType: 'Government Branch',
    features: ['Government District Access', 'Business Center', 'Concierge Service', 'Secure Parking', 'Document Processing', 'VIP Services']
  },
  {
    id: 'marrakesh',
    name: 'Marrakesh',
    displayName: {
      en: 'Marrakesh Gueliz Office',
      fr: 'Bureau Guéliz Marrakech'
    },
    address: {
      en: 'Avenue Mohammed VI, Gueliz, Marrakesh 40000',
      fr: 'Avenue Mohammed VI, Guéliz, Marrakech 40000'
    },
    coordinates: {
      lat: 31.6295,
      lng: -7.9811
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 524-43-5678',
    email: 'marrakesh@rentmyride.ma',
    officeType: 'Tourist Branch',
    features: ['Tourist Information', 'Multilingual Staff', 'Desert Tour Packages', 'Safari Vehicle Rentals', 'GPS Navigation', 'Travel Insurance']
  },
  {
    id: 'kenitra',
    name: 'Kenitra',
    displayName: {
      en: 'Kenitra Business Office',
      fr: 'Bureau Affaires Kénitra'
    },
    address: {
      en: 'Boulevard Hassan II, Centre-ville, Kenitra 14000',
      fr: 'Boulevard Hassan II, Centre-ville, Kénitra 14000'
    },
    coordinates: {
      lat: 34.2610,
      lng: -6.5802
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 537-37-2345',
    email: 'kenitra@rentmyride.ma',
    officeType: 'Industrial Branch',
    features: ['Industrial Zone Access', 'Fleet Management', 'Corporate Rates']
  },
  {
    id: 'agadir',
    name: 'Agadir',
    displayName: {
      en: 'Agadir Beach Office',
      fr: 'Bureau Plage Agadir'
    },
    address: {
      en: 'Boulevard du 20 Août, Secteur Balnéaire, Agadir 80000',
      fr: 'Boulevard du 20 Août, Secteur Balnéaire, Agadir 80000'
    },
    coordinates: {
      lat: 30.4278,
      lng: -9.5981
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 528-84-6789',
    email: 'agadir@rentmyride.ma',
    officeType: 'Beach Resort Branch',
    features: ['Beach Access', 'Resort Partnerships', 'Convertible Cars',]
  },
  {
    id: 'fes',
    name: 'Fes',
    displayName: {
      en: 'Fes Heritage Office',
      fr: 'Bureau Patrimoine Fès'
    },
    address: {
      en: 'Avenue Hassan II, Ville Nouvelle, Fes 30000',
      fr: 'Avenue Hassan II, Ville Nouvelle, Fès 30000'
    },
    coordinates: {
      lat: 34.0181,
      lng: -5.0078
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 535-94-1234',
    email: 'fes@rentmyride.ma',
    officeType: 'Heritage Branch',
    features: ['Medina Tours', 'Cultural Guides', 'Historic Vehicle Tours', 'Multilingual Audio Guides']
  },
  {
    id: 'tangier',
    name: 'Tangier',
    displayName: {
      en: 'Tangier Mediterranean Office',
      fr: 'Bureau Méditerranéen Tanger'
    },
    address: {
      en: 'Boulevard Pasteur, Centre-ville, Tangier 90000',
      fr: 'Boulevard Pasteur, Centre-ville, Tanger 90000'
    },
    coordinates: {
      lat: 35.7595,
      lng: -5.8340
    },
    operatingHours: {
      weekdays: { open: '08:00', close: '20:00' },
      weekends: { open: '09:00', close: '18:00' }
    },
    phone: '+212 539-94-5678',
    email: 'tangier@rentmyride.ma',
    officeType: 'Mediterranean Branch',
    features: ['Port Access', 'Ferry Services', 'International Travel', 'Multilingual Staff', 'European Routes', 'Cross-Border Documentation']
  },
  {
    id: 'mohammed-v-airport',
    name: 'Mohammed V Airport',
    displayName: {
      en: 'Mohammed V Airport Terminal',
      fr: 'Terminal Aéroport Mohammed V'
    },
    address: {
      en: 'Mohammed V International Airport, Terminal 1, Casablanca',
      fr: 'Aéroport International Mohammed V, Terminal 1, Casablanca'
    },
    coordinates: {
      lat: 33.3676,
      lng: -7.5897
    },
    operatingHours: {
      weekdays: { open: '06:00', close: '22:00' },
      weekends: { open: '06:00', close: '22:00' }
    },
    phone: '+212 522-53-9000',
    email: 'airport@rentmyride.ma',
    officeType: 'Airport Terminal Branch',
    features: ['24/7 Support', 'Flight Tracking', 'Express Service', 'Meet & Greet', 'Priority Lane', 'Luggage Assistance']
  }
];

// Helper function to get location by ID
export const getLocationById = (id) => {
  return OFFICE_LOCATIONS.find(location => location.id === id);
};

// Helper function to get all location options for dropdowns
export const getLocationOptions = (language = 'en') => {
  return OFFICE_LOCATIONS.map(location => ({
    value: location.id,
    label: location.displayName[language] || location.name,
    address: location.address[language],
    coordinates: location.coordinates,
    operatingHours: location.operatingHours,
    phone: location.phone,
    features: location.features
  }));
};

// Helper function to format address for display
export const formatLocationAddress = (location, language = 'en') => {
  if (!location) return '';
  return location.address[language] || location.address.en || '';
};

// Helper function to get operating hours text
export const getOperatingHoursText = (location, date, language = 'en') => {
  if (!location || !date) return '';
  
  const selectedDate = new Date(date);
  const isWeekend = selectedDate.getDay() === 0 || selectedDate.getDay() === 6;
  const hours = isWeekend ? location.operatingHours.weekends : location.operatingHours.weekdays;
  
  const dayType = language === 'fr' 
    ? (isWeekend ? 'Week-end' : 'Semaine') 
    : (isWeekend ? 'Weekend' : 'Weekday');
    
  return `${hours.open} - ${hours.close} (${dayType})`;
};
