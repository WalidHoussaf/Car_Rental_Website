import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import { useLanguage } from '../hooks/useLanguage';
import { useTranslations } from '../translations';

const FAQPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const faqSectionRef = useRef(null);
  const guidesRef = useRef(null);
  
  const [expandedItems, setExpandedItems] = useState({});
  
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  const faqCategories = [
    {
      id: "booking",
      title: t('bookingReservations'),
      icon: "🗓️",
      questions: [
        {
          id: "booking-1",
          question: language === 'fr' ? "Combien de temps à l'avance dois-je réserver ma voiture de location ?" : "How far in advance should I book my rental car?",
          answer: language === 'fr' ? "Nous recommandons de réserver au moins 7 jours à l'avance pour garantir la disponibilité du véhicule, en particulier pour nos modèles premium et performants. Pendant les périodes touristiques de pointe (juin-septembre et décembre), nous suggérons de réserver 2-3 semaines à l'avance. Les réservations de dernière minute sont possibles selon disponibilité." : "We recommend booking at least 7 days in advance to ensure vehicle availability, especially for our premium and performance models. During peak tourist seasons (June-September and December), we suggest booking 2-3 weeks ahead. Last-minute bookings are possible based on availability."
        },
        {
          id: "booking-2",
          question: language === 'fr' ? "Quelle est votre politique d'annulation ?" : "What is your cancellation policy?",
          answer: language === 'fr' ? "Les annulations effectuées plus de 48 heures avant l'heure de prise en charge prévue donnent droit à un remboursement complet. Les annulations dans les 48 heures précédant le retrait entraînent des frais de 30%. Les non-présentations ou annulations dans les 24 heures sont facturées au tarif journalier complet. Pour les véhicules de luxe et les éditions spéciales, une politique d'annulation de 72 heures s'applique." : "Cancellations made more than 48 hours before the scheduled pickup time receive a full refund. Cancellations within 48 hours of pickup incur a 30% fee. No-shows or cancellations within 24 hours are charged the full day's rental fee. For luxury and special edition vehicles, a 72-hour cancellation policy applies."
        },
        {
          id: "booking-3",
          question: language === 'fr' ? "Puis-je modifier ma réservation après l'avoir effectuée ?" : "Can I modify my reservation after booking?",
          answer: language === 'fr' ? "Oui, vous pouvez modifier votre réservation jusqu'à 24 heures avant l'heure de prise en charge prévue, sous réserve de disponibilité du véhicule. Cela inclut le changement de lieux de prise en charge/retour, de durée de location ou même de modèle de véhicule. Les modifications peuvent affecter les tarifs." : "Yes, you can modify your reservation up to 24 hours before your scheduled pickup time, subject to vehicle availability. This includes changing pickup/return locations, rental duration, or even vehicle model. Modifications may affect pricing."
        },
        {
          id: "booking-4",
          question: language === 'fr' ? "Y a-t-il une période minimale de location ?" : "Is there a minimum rental period?",
          answer: language === 'fr' ? "Les locations standard ont une période minimale de 24 heures. Les véhicules premium et de luxe nécessitent une période de location minimale de 2 jours. Des promotions spéciales peuvent être disponibles pour les locations hebdomadaires ou mensuelles avec des réductions significatives." : "Standard rentals have a minimum period of 24 hours. Premium and luxury vehicles require a minimum rental period of 2 days. Special promotions may be available for weekly or monthly rentals with significant discounts."
        }
      ]
    },
    {
      id: "requirements",
      title: t('requirementsEligibility'),
      icon: "📋",
      questions: [
        {
          id: "requirements-1",
          question: language === 'fr' ? "Quels documents dois-je fournir pour louer une voiture ?" : "What documents do I need to rent a car?",
          answer: language === 'fr' ? "Vous aurez besoin d'un permis de conduire valide (détenu depuis au moins 1 an), d'un passeport ou d'une carte d'identité nationale, et d'une carte de crédit pour la caution. Pour les visiteurs internationaux, un permis de conduire international (IDP) est recommandé mais pas obligatoire si votre permis est en anglais, français ou arabe." : "You'll need a valid driver's license (held for at least 1 year), passport or national ID card, and a credit card for the security deposit. For international visitors, an International Driving Permit (IDP) is recommended but not mandatory if your license is in English, French, or Arabic."
        },
        {
          id: "requirements-2",
          question: language === 'fr' ? "Quel est l'âge minimum pour louer un véhicule ?" : "What is the minimum age to rent a vehicle?",
          answer: language === 'fr' ? "L'âge minimum pour les locations standard est de 21 ans. Pour les véhicules premium et performants, les conducteurs doivent avoir au moins 25 ans. Les conducteurs de moins de 25 ans peuvent être soumis à un supplément pour jeune conducteur. Tous les conducteurs doivent avoir leur permis depuis au moins un an." : "The minimum age for standard rentals is 21 years. For premium and performance vehicles, drivers must be at least 25 years old. Drivers under 25 may be subject to a young driver surcharge. All drivers must have held their license for a minimum of one year."
        },
        {
          id: "requirements-3",
          question: language === 'fr' ? "Ai-je besoin d'une assurance pour louer une voiture ?" : "Do I need insurance to rent a car?",
          answer: language === 'fr' ? "Une assurance de base est incluse dans tous nos forfaits de location, couvrant la responsabilité civile. Nous recommandons vivement notre option de couverture Premium, qui réduit la franchise à zéro et fournit une protection complète. Votre assurance automobile personnelle ou la couverture de votre carte de crédit peuvent également s'appliquer." : "Basic insurance is included in all our rental packages, covering third-party liability. We strongly recommend our Premium Coverage option, which reduces the excess/deductible to zero and provides comprehensive protection. Your personal auto insurance or credit card coverage may also apply."
        },
        {
          id: "requirements-4",
          question: language === 'fr' ? "Quelles cartes de crédit acceptez-vous pour le dépôt de garantie ?" : "What credit cards do you accept for the security deposit?",
          answer: language === 'fr' ? "Nous acceptons Visa, MasterCard et American Express pour les dépôts de garantie. La carte doit être au nom du conducteur principal. Les cartes de débit et l'argent liquide ne sont pas acceptés pour les dépôts de garantie mais peuvent être utilisés pour le paiement de la location." : "We accept Visa, MasterCard, and American Express for security deposits. The card must be in the primary driver's name. Debit cards and cash are not accepted for security deposits but can be used for the rental payment."
        }
      ]
    },
    {
      id: "policies",
      title: t('rentalPoliciesServices'),
      icon: "📒",
      questions: [
        {
          id: "policies-1",
          question: language === 'fr' ? "Y a-t-il une limite de kilométrage ?" : "Is there a mileage limit?",
          answer: language === 'fr' ? "La plupart de nos forfaits de location comprennent 200 kilomètres par jour. Les kilomètres supplémentaires sont facturés entre 2 et 5 MAD par kilomètre selon la catégorie du véhicule. Nous proposons également des forfaits kilométrage illimité pour les voyages plus longs ou les trajets interurbains moyennant des frais supplémentaires." : "Most of our rental packages include 200 kilometers per day. Additional kilometers are charged at 2-5 MAD per kilometer depending on the vehicle category. We also offer unlimited mileage packages for longer journeys or cross-country trips at an additional fee."
        },
        {
          id: "policies-2",
          question: language === 'fr' ? "Proposez-vous des locations aller simple ?" : "Do you offer one-way rentals?",
          answer: language === 'fr' ? "Oui, nous proposons des locations aller simple entre nos agences dans les principales villes marocaines. Des frais de location aller simple s'appliquent, allant de 500 à 1500 MAD selon la distance entre les lieux de prise en charge et de restitution. Veuillez préciser cette exigence lors de la réservation." : "Yes, we offer one-way rentals between our locations in major Moroccan cities. A one-way fee applies, ranging from 500-1500 MAD depending on the distance between pickup and drop-off locations. Please specify this requirement when booking."
        },
        {
          id: "policies-3",
          question: language === 'fr' ? "Proposez-vous des services de livraison et de ramassage ?" : "Do you offer delivery and pickup services?",
          answer: language === 'fr' ? "Oui, nous offrons la livraison et le ramassage gratuits dans les limites de la ville pour les locations de 3 jours ou plus. Pour les locations plus courtes ou les emplacements en dehors de la ville, des frais nominaux s'appliquent. Les transferts aéroportuaires sont disponibles 24h/24 et 7j/7 avec préavis, y compris le service d'accueil." : "Yes, we offer complimentary delivery and pickup within city limits for rentals of 3+ days. For shorter rentals or locations outside the city, a nominal fee applies. Airport transfers are available 24/7 with advance notice, including meet-and-greet service."
        },
        {
          id: "policies-4",
          question: language === 'fr' ? "Puis-je emmener la voiture de location en dehors du Maroc ?" : "Can I take the rental car outside of Morocco?",
          answer: language === 'fr' ? "Non, nos véhicules ne peuvent pas être emmenés en dehors du Maroc. Le faire violerait le contrat de location et invaliderait la couverture d'assurance. Les systèmes de suivi GPS de nos véhicules surveillent leur emplacement à des fins de sécurité." : "No, our vehicles cannot be taken outside of Morocco. Doing so would violate the rental agreement and invalidate insurance coverage. GPS tracking systems in our vehicles monitor their location for security purposes."
        }
      ]
    },
    {
      id: "vehicles",
      title: t('vehiclesFeatures'),
      icon: "🚗",
      questions: [
        {
          id: "vehicles-1",
          question: language === 'fr' ? "Quels types de véhicules proposez-vous ?" : "What types of vehicles do you offer?",
          answer: language === 'fr' ? "Notre flotte comprend des berlines de luxe (BMW, Mercedes, Audi), des voitures de sport (Porsche, Jaguar), des SUV (Range Rover, Bentley Bentayga), des supercars exotiques (Lamborghini, Ferrari) et des décapotables pour une expérience marocaine ultime. Nous mettons régulièrement à jour notre flotte pour offrir les derniers modèles." : "Our fleet includes luxury sedans (BMW, Mercedes, Audi), sports cars (Porsche, Jaguar), SUVs (Range Rover, Bentley Bentayga), exotic supercars (Lamborghini, Ferrari), and convertibles for the ultimate Moroccan experience. We regularly update our fleet to offer the latest models."
        },
        {
          id: "vehicles-2",
          question: language === 'fr' ? "Tous vos véhicules sont-ils équipés de la climatisation ?" : "Do all your vehicles have air conditioning?",
          answer: language === 'fr' ? "Oui, tous les véhicules de notre flotte sont équipés de climatisation ou de contrôle de climat. De plus, nos véhicules premium disposent de systèmes climatiques multi-zones permettant différents réglages de température pour le conducteur et les passagers." : "Yes, all vehicles in our fleet are equipped with climate control or air conditioning. Additionally, our premium vehicles feature multi-zone climate systems allowing different temperature settings for driver and passengers."
        },
        {
          id: "vehicles-3",
          question: language === 'fr' ? "Puis-je louer une voiture avec chauffeur ?" : "Can I rent a car with a driver?",
          answer: language === 'fr' ? "Oui, nous proposons des services de chauffeur avec tous nos véhicules. Nos chauffeurs professionnels sont multilingues, hautement qualifiés et connaissent bien les itinéraires locaux et les attractions. Les services de chauffeur peuvent être réservés à l'heure, à la journée ou pour toute la durée de votre voyage." : "Yes, we offer chauffeur services with all our vehicles. Our professional drivers are multilingual, highly trained, and knowledgeable about local routes and attractions. Chauffeur services can be booked hourly, daily, or for your entire trip duration."
        },
        {
          id: "vehicles-4",
          question: language === 'fr' ? "Proposez-vous des sièges enfants ou des équipements supplémentaires ?" : "Do you offer child seats or additional equipment?",
          answer: language === 'fr' ? "Oui, nous fournissons des sièges enfants (pour bébé, enfant et rehausseur), des systèmes de navigation GPS, des points d'accès Wi-Fi, des conducteurs supplémentaires, et plus encore. Ces éléments peuvent être ajoutés lors du processus de réservation. Veuillez les demander à l'avance pour garantir leur disponibilité." : "Yes, we provide child seats (infant, toddler, and booster), GPS navigation systems, Wi-Fi hotspots, additional drivers, and more. These can be added during the booking process. Please request in advance to ensure availability."
        }
      ]
    },
    {
      id: "payment",
      title: t('paymentsPricing'),
      icon: "💳",
      questions: [
        {
          id: "payment-1",
          question: language === 'fr' ? "Quels moyens de paiement acceptez-vous ?" : "What payment methods do you accept?",
          answer: language === 'fr' ? "Nous acceptons toutes les principales cartes de crédit (Visa, MasterCard, American Express), les virements bancaires et les espèces en dirhams marocains. Pour les dépôts de garantie, seules les cartes de crédit sont acceptées. Les clients professionnels peuvent convenir d'une facturation avec approbation préalable." : "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and cash in Moroccan Dirhams. For security deposits, only credit cards are accepted. Corporate clients can arrange for invoicing with advance approval."
        },
        {
          id: "payment-2",
          question: language === 'fr' ? "Quand ma carte de crédit est-elle débitée ?" : "When is my credit card charged?",
          answer: language === 'fr' ? "Une pré-autorisation est placée sur votre carte de crédit au moment de la réservation. Le montant total de la location est débité lors de la prise en charge du véhicule. La caution (allant de 5 000 à 50 000 MAD selon la valeur du véhicule) est également retenue comme pré-autorisation et libérée lors du retour du véhicule." : "A pre-authorization hold is placed on your credit card at the time of booking. The full rental amount is charged upon vehicle pickup. The security deposit (ranging from 5,000-50,000 MAD depending on vehicle value) is also held as a pre-authorization and released upon vehicle return."
        },
        {
          id: "payment-3",
          question: language === 'fr' ? "Y a-t-il des frais cachés que je devrais connaître ?" : "Are there any hidden fees I should know about?",
          answer: language === 'fr' ? "Nous sommes fiers de notre tarification transparente. Votre tarif indiqué comprend l'assurance de base, l'assistance routière et le kilométrage standard. Des frais supplémentaires peuvent s'appliquer pour : le kilométrage supplémentaire, les conducteurs additionnels, l'équipement spécial, la livraison à l'aéroport/hôtel, le service en dehors des heures d'ouverture ou le remplacement de carburant." : "We pride ourselves on transparent pricing. Your quoted rate includes basic insurance, roadside assistance, and standard mileage. Additional fees may apply for: extra mileage, additional drivers, special equipment, airport/hotel delivery, after-hours service, or fuel replacement."
        },
        {
          id: "payment-4",
          question: language === 'fr' ? "Proposez-vous des tarifs spéciaux pour les locations à long terme ?" : "Do you offer special rates for long-term rentals?",
          answer: language === 'fr' ? "Oui, nous offrons des réductions significatives pour les locations hebdomadaires (10-15% de réduction), mensuelles (20-30% de réduction) et à long terme. Les comptes d'entreprise et les locataires fréquents peuvent bénéficier de notre programme de fidélité avec des tarifs préférentiels et des surclassements gratuits." : "Yes, we offer significant discounts for weekly (10-15% off), monthly (20-30% off), and long-term rentals. Corporate accounts and frequent renters can benefit from our loyalty program with preferential rates and complimentary upgrades."
        }
      ]
    }
  ];
  
  const [searchQuery, setSearchQuery] = useState('');
  
  const getFilteredFAQs = () => {
    if (!searchQuery.trim()) return faqCategories;
    
    return faqCategories.map(category => ({
      ...category,
      questions: category.questions.filter(q => 
        q.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
        q.answer.toLowerCase().includes(searchQuery.toLowerCase())
      )
    })).filter(category => category.questions.length > 0);
  };
  
  const filteredFAQs = getFilteredFAQs();
  
  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/80 to-black/90" />
          <img 
            src={assets.faq?.heroImage2 || "/api/placeholder/1920/600"} 
            alt="Luxury car interior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <div className="inline-block mb-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-blue-500/20 animate-pulse-slow">
            <span className="text-sm text-cyan-400 font-['Orbitron'] tracking-widest">{t('premiumCarRental')}</span>
          </div>
          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white relative uppercase animate-fade-in-up animation-delay-200">
            {t('frequentlyAskedQuestions')}
            <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10 relative animate-fade-in-up animation-delay-300">
            {t('everythingYouNeed')}
            <div className="absolute -z-10 inset-0 bg-gradient-to-r from-transparent via-cyan-900/5 to-transparent blur-xl"></div>
          </p>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-400 to-transparent animate-pulse"></div>
      </div>
      
      {/* Search Section */}
      <div className="bg-gradient-to-b from-black/80 via-black/70 to-black/80 backdrop-blur-sm py-10 relative overflow-hidden">
        <div className="container mx-auto max-w-4xl px-4 relative z-10">
          <div className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-lg blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            
            <input
              type="text"
              placeholder={t('searchForAnswers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-gray-900/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white transition-all duration-300 focus:border-cyan-400"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-cyan-400">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
              </svg>
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-cyan-400 cursor-pointer transition-colors duration-300"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* FAQ Content */}
      <section ref={faqSectionRef} className="py-16 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-4xl relative z-10">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category) => (
              <div key={category.id} className="mb-16">
                <div className="flex items-center mb-8">
                  <span className="text-3xl mr-4 text-cyan-400">
                    {category.id === "booking" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M6.75 2.25A.75.75 0 017.5 3v1.5h9V3A.75.75 0 0117.25 2.25c.41 0 .75.334.75.75V4.5h.75A2.25 2.25 0 0121 6.75v2.25h-2.25V6.75a.75.75 0 00-.75-.75H5.25a.75.75 0 00-.75.75v2.25H2.25V6.75A2.25 2.25 0 014.5 4.5h.75V3a.75.75 0 01.75-.75zm13.5 9a1.5 1.5 0 00-1.5-1.5H5.25a1.5 1.5 0 00-1.5 1.5v7.5a1.5 1.5 0 001.5 1.5h13.5a1.5 1.5 0 001.5-1.5v-7.5zm-15-3.75V6.75a.75.75 0 01.75-.75h.75v3h-.75a.75.75 0 01-.75-.75zm14.25 0a.75.75 0 01-.75.75h-.75v-3h.75a.75.75 0 01.75.75v2.25z" clipRule="evenodd" />
                      </svg>
                    ) : category.id === "requirements" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M7.502 6h7.128A3.375 3.375 0 0118 9.375v9.375a3 3 0 003-3V6.108c0-1.505-1.125-2.811-2.664-2.94a48.972 48.972 0 00-.673-.05A3 3 0 0015 1.5h-1.5a3 3 0 00-2.663 1.618c-.225.015-.45.032-.673.05C8.662 3.295 7.554 4.542 7.502 6zM13.5 3A1.5 1.5 0 0012 4.5h4.5A1.5 1.5 0 0015 3h-1.5z" clipRule="evenodd" />
                        <path fillRule="evenodd" d="M3 9.375C3 8.339 3.84 7.5 4.875 7.5h9.75c1.036 0 1.875.84 1.875 1.875v11.25c0 1.035-.84 1.875-1.875 1.875h-9.75A1.875 1.875 0 013 20.625V9.375zm9.586 4.594a.75.75 0 00-1.172-.938l-2.476 3.096-.908-.907a.75.75 0 00-1.06 1.06l1.5 1.5a.75.75 0 001.116-.062l3-3.75z" clipRule="evenodd" />
                      </svg>
                    ) : category.id === "policies" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path fillRule="evenodd" d="M5.625 1.5c-1.036 0-1.875.84-1.875 1.875v17.25c0 1.035.84 1.875 1.875 1.875h12.75c1.035 0 1.875-.84 1.875-1.875V12.75A3.75 3.75 0 0016.5 9h-1.875a1.875 1.875 0 01-1.875-1.875V5.25A3.75 3.75 0 009 1.5H5.625zM7.5 15a.75.75 0 01.75-.75h7.5a.75.75 0 010 1.5h-7.5A.75.75 0 017.5 15zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                        <path d="M12.971 1.816A5.23 5.23 0 0114.25 5.25v1.875c0 .207.168.375.375.375H16.5a5.23 5.23 0 013.434 1.279 9.768 9.768 0 00-6.963-6.963z" />
                      </svg>
                    ) : category.id === "vehicles" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M3.375 4.5C2.339 4.5 1.5 5.34 1.5 6.375V13.5h12V6.375c0-1.036-.84-1.875-1.875-1.875h-8.25zM13.5 15h-12v2.625c0 1.035.84 1.875 1.875 1.875h8.25c1.035 0 1.875-.84 1.875-1.875V15z" />
                        <path d="M8.25 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0zM15.75 6.75a.75.75 0 00-.75.75v11.25c0 .087.015.17.042.248a3 3 0 015.958.464c.853-.175 1.522-.935 1.464-1.883a18.659 18.659 0 00-3.732-10.104 1.837 1.837 0 00-1.47-.725H15.75z" />
                        <path d="M19.5 19.5a1.5 1.5 0 10-3 0 1.5 1.5 0 003 0z" />
                      </svg>
                    ) : category.id === "payment" ? (
                      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-8 h-8">
                        <path d="M4.5 3.75a3 3 0 00-3 3v.75h21v-.75a3 3 0 00-3-3h-15z" />
                        <path fillRule="evenodd" d="M22.5 9.75h-21v7.5a3 3 0 003 3h15a3 3 0 003-3v-7.5zm-18 3.75a.75.75 0 01.75-.75h6a.75.75 0 010 1.5h-6a.75.75 0 01-.75-.75zm.75 2.25a.75.75 0 000 1.5h3a.75.75 0 000-1.5h-3z" clipRule="evenodd" />
                      </svg>
                    ) : category.icon}
                  </span>
                  <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400 relative">
                    {category.title}
                    <div className="absolute -bottom-2 left-0 w-20 h-1 bg-gradient-to-r from-cyan-500 to-transparent"></div>
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {category.questions.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-gradient-to-b from-gray-900/80 to-black/80 backdrop-blur-md border border-cyan-900/50 rounded-xl overflow-hidden relative group transition-all duration-300 hover:shadow-[0_0_15px_rgba(6,182,212,0.15)]"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left p-6 flex justify-between items-center"
                      >
                        <h3 className="text-xl font-medium pr-8 group-hover:text-cyan-300 transition-colors duration-300">{item.question}</h3>
                        <span className="text-cyan-400 transition-transform duration-500" style={{ transform: expandedItems[item.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </span>
                      </button>
                      
                      <div 
                        className={`px-6 pb-6 text-gray-300 text-justify overflow-hidden transition-all duration-500 ${
                          expandedItems[item.id] ? 'max-h-[1000px] opacity-100' : 'max-h-0 opacity-0'
                        }`}
                      >
                        {expandedItems[item.id] && (
                          <>
                            <div className="h-px w-full bg-gradient-to-r from-cyan-800/50 via-cyan-600/50 to-cyan-800/50 mb-4"></div>
                            {item.answer}
                          </>
                        )}
                      </div>
                      
                      {/* Border Accents */}
                      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent group-hover:via-cyan-400/60 transition-colors duration-500"></div>
                      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-400/30 to-transparent group-hover:via-cyan-400/60 transition-colors duration-500"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-16 h-16 mx-auto text-cyan-500 opacity-80">
                  <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                </svg>
              </div>
              <h3 className="text-2xl mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white">No results found</h3>
              <p className="text-gray-400 max-w-lg mx-auto">
                We couldn't find any FAQs matching your search. Try different keywords or browse our categories.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-medium rounded-md transition-all duration-300 transform hover:scale-105"
              >
                Clear Search
              </button>
            </div>
          )}
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>
      
      {/* Still Have Questions Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-black/80 via-black/60 to-black/80 backdrop-blur-md relative overflow-hidden">
        {/* Background patterns */}
        <div className="absolute inset-0 bg-[url('/patterns/grid-pattern.svg')] bg-center opacity-30"></div>
         
        {/* Decorative Elements */}
        <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/40 to-transparent"></div>
        
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="relative">
            <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
            <h2 className="text-4xl font-semibold uppercase mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
              {t('stillHaveQuestions')}
            </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto mb-4"></div>
            <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
              {t('supportTeamHelp')}
            </p>
          </div>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-medium rounded-md shadow-lg hover:shadow-cyan-500/20 transition-all duration-300 transform hover:scale-105 relative overflow-hidden group"
            >
              <span className="relative z-10 flex items-center justify-center gap-2">
                {/* Leading icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('contactUs')}
                {/* Trailing arrow icon */}
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </span>
            </Link>
            <a
              href="tel:+212 57 77 777"
              className="px-8 py-3 border border-cyan-500/30 hover:border-cyan-400/60 text-cyan-400 font-medium rounded-md hover:bg-cyan-500/10 transition-all duration-300 group"
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
                </svg>
                {t('callUs')}
              </span>
            </a>
          </div>
        </div>
      </section>
      
      {/* Popular Guides */}
      <section ref={guidesRef} className="py-16 px-4 relative overflow-hidden">
        {/* Background Effects */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 right-1/4 w-40 h-40 rounded-full bg-cyan-500/5 blur-3xl"></div>
          <div className="absolute bottom-1/3 left-1/3 w-36 h-36 rounded-full bg-blue-500/5 blur-3xl"></div>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-black/90 via-black/85 to-black/90 pointer-events-none"></div>
        
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="text-center mb-12">
            <div className="relative">
              <div className="absolute -z-10 top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-40 h-40 rounded-full bg-cyan-500/10 blur-3xl"></div>
              <h2 className="text-4xl font-semibold uppercase text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
                {t('popularGuides')}
              </h2>
              <div className="w-24 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0 mx-auto mb-4"></div>
              <p className="text-gray-300 max-w-2xl mx-auto">
                {language === 'fr' 
                  ? "Des ressources utiles pour tirer le meilleur parti de votre expérience de location de luxe au Maroc" 
                  : "Helpful resources to get the most out of your luxury rental experience in Morocco"}
              </p>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guide 1 */}
            <div className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl border border-cyan-900/30 overflow-hidden group relative transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.keys || "/api/placeholder/600/400"} 
                  alt="First-time renter's guide" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6 relative">
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{t('howToChooseRightCar')}</h3>
                <p className="text-gray-400 text-sm mb-4 text-justify">
                  {language === 'fr'
                    ? "Tout ce que vous devez savoir pour une expérience de location fluide avec Rent My Ride."
                    : "Everything you need to know for a smooth rental experience with Rent My Ride."}
                </p>
                <Link to="/guides/first-time" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
                  {language === 'fr' ? "Lire Plus " : "Read More "}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            
            {/* Guide 2 */}
            <div className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl border border-cyan-900/30 overflow-hidden group relative transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.morocco || "/api/placeholder/600/400"} 
                  alt="Morocco driving guide" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6 relative">
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{t('drivingInMorocco')}</h3>
                <p className="text-gray-400 text-sm mb-4 text-justify">
                  {language === 'fr'
                    ? "Informations essentielles sur les lois locales de conduite, les coutumes et les itinéraires recommandés."
                    : "Essential information about local driving laws, customs, and recommended routes."}
                </p>
                <Link to="/guides/morocco-driving" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
                  {language === 'fr' ? "Lire Plus " : "Read More "}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
            
            {/* Guide 3 */}
            <div className="bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm rounded-xl border border-cyan-900/30 overflow-hidden group relative transform transition-all duration-500 hover:scale-[1.02] hover:shadow-[0_0_25px_rgba(6,182,212,0.15)]">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.luxury || "/api/placeholder/600/400"} 
                  alt="Car selection guide" 
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent"></div>
              </div>
              
              <div className="p-6 relative">
                <h3 className="text-xl font-semibold mb-3 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">{t('ultimateRoadTrip')}</h3>
                <p className="text-gray-400 text-sm mb-4 text-justify">
                  {language === 'fr'
                    ? "Comment sélectionner le véhicule de luxe ou sportif idéal pour votre aventure marocaine."
                    : "How to select the ideal luxury or sports car for your Moroccan adventure."}
                </p>
                <Link to="/guides/vehicle-selection" className="text-cyan-400 hover:text-cyan-300 text-sm flex items-center">
                  {language === 'fr' ? "Lire Plus " : "Read More "}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1 transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </Link>
              </div>
              
              {/* Glow Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-transparent via-cyan-600/20 to-transparent rounded-xl blur-xl -z-10 opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
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
          <h2 className="text-3xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-white relative inline-block animate-fade-in-up animation-delay-200">
            {t('readyToExperienceLuxury')}
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-cyan-500/0 via-cyan-500 to-cyan-500/0"></div>
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto animate-fade-in-up animation-delay-300">
            {language === 'fr' 
              ? "Parcourez notre flotte premium et réservez votre prochain voyage extraordinaire à travers le Maroc." 
              : "Browse our premium fleet and book your next extraordinary journey through Morocco."}
          </p>
          <Link
            to="/cars"
            className="group px-6 py-3 rounded-md bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-cyan-600/20 hover:shadow-cyan-500/30 cursor-pointer transform hover:scale-105 inline-flex items-center justify-center gap-2 text-base font-semibold relative overflow-hidden animate-fade-in-up animation-delay-500"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-cyan-300/20 to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transition-transform duration-300 group-hover:rotate-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
            <span className="relative z-10">{t('browseOurFleet')}</span>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;