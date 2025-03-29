import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';

const FAQPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  // State to track which FAQ items are expanded
  const [expandedItems, setExpandedItems] = useState({});
  
  // Toggle FAQ item expansion
  const toggleItem = (id) => {
    setExpandedItems(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // FAQ categories and questions
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
  
  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  
  // Filter questions based on search query
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
          <div className="absolute inset-0 bg-black/70" />
          <img 
            src={assets.faq?.heroImage || "/api/placeholder/1920/600"} 
            alt="Luxury car interior" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl md:text-6xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 leading-[1.2]">
            {t('frequentlyAskedQuestions')}
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10">
            {t('everythingYouNeed')}
          </p>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white animate-pulse"></div>
      </div>
      
      {/* Search Section */}
      <div className="bg-black/60 backdrop-blur-sm py-10">
        <div className="container mx-auto max-w-4xl px-4">
          <div className="relative">
            <input
              type="text"
              placeholder={t('searchForAnswers')}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-5 py-4 pl-12 bg-gray-900/70 border border-gray-700 rounded-lg focus:outline-none focus:ring-2 focus:ring-cyan-500 text-white"
            />
            <div className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400">
              🔍
            </div>
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
              >
                ✕
              </button>
            )}
          </div>
        </div>
      </div>
      
      {/* FAQ Content */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          {filteredFAQs.length > 0 ? (
            filteredFAQs.map((category) => (
              <div key={category.id} className="mb-16">
                <div className="flex items-center mb-8">
                  <span className="text-3xl mr-4">{category.icon}</span>
                  <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                    {category.title}
                  </h2>
                </div>
                
                <div className="space-y-6">
                  {category.questions.map((item) => (
                    <div 
                      key={item.id} 
                      className="bg-black/80 backdrop-blur-md border border-cyan-400 rounded-xl overflow-hidden relative group"
                    >
                      <button
                        onClick={() => toggleItem(item.id)}
                        className="w-full text-left p-6 flex justify-between items-center"
                      >
                        <h3 className="text-xl font-medium pr-8">{item.question}</h3>
                        <span className="text-xl transition-transform duration-300" style={{ transform: expandedItems[item.id] ? 'rotate(180deg)' : 'rotate(0deg)' }}>
                          ⌄
                        </span>
                      </button>
                      
                      {expandedItems[item.id] && (
                        <div className="px-6 pb-6 text-gray-300 text-justify">
                          <div className="h-px w-full bg-cyan-800 mb-4"></div>
                          {item.answer}
                        </div>
                      )}
                      
                      {/* Animated border effect */}
                      <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                    </div>
                  ))}
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-10">
              <div className="text-5xl mb-6">🔍</div>
              <h3 className="text-2xl mb-4">No results found</h3>
              <p className="text-gray-400">
                We couldn't find any FAQs matching your search. Try different keywords or browse our categories.
              </p>
              <button
                onClick={() => setSearchQuery('')}
                className="mt-6 px-6 py-2 bg-gradient-to-r font-medium from-white to-cyan-400 text-black rounded-md hover:bg-cyan-700 transition-colors cursor-pointer"
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
      <section className="py-16 px-4 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto max-w-4xl text-center">
          <h2 className="text-4xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            {t('stillHaveQuestions')}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {t('supportTeamHelp')}
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-medium rounded-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              {t('contactUs')}
            </Link>
            <a
              href="tel:+212 57 77 777"
              className="px-8 py-3 border border-blue-500/50 text-blue-400 font-medium rounded-md hover:bg-blue-500/10 transition-all duration-300"
            >
              {t('callUs')}
            </a>
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>
      
      {/* Popular Guides */}
      <section className="py-16 px-4 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto max-w-6xl">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 mb-4">
              {t('popularGuides')}
          </h2>
            <div className="w-24 h-1 bg-gradient-to-r from-white to-cyan-400 mx-auto mb-4"></div>
            <p className="text-gray-300 max-w-2xl mx-auto">
              {language === 'fr' 
                ? "Des ressources utiles pour tirer le meilleur parti de votre expérience de location de luxe au Maroc" 
                : "Helpful resources to get the most out of your luxury rental experience in Morocco"}
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Guide 1 */}
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden group relative">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.keys || "/api/placeholder/600/400"} 
                  alt="First-time renter's guide" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('howToChooseRightCar')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {language === 'fr'
                    ? "Tout ce que vous devez savoir pour une expérience de location fluide avec Rent My Ride."
                    : "Everything you need to know for a smooth rental experience with Rent My Ride."}
                </p>
                <Link to="/guides/first-time" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  {language === 'fr' ? "Lire Plus →" : "Read More →"}
                </Link>
              </div>
              {/* Animated border effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {/* Guide 2 */}
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden group relative">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.morocco || "/api/placeholder/600/400"} 
                  alt="Morocco driving guide" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('drivingInMorocco')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {language === 'fr'
                    ? "Informations essentielles sur les lois locales de conduite, les coutumes et les itinéraires recommandés."
                    : "Essential information about local driving laws, customs, and recommended routes."}
                </p>
                <Link to="/guides/morocco-driving" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  {language === 'fr' ? "Lire Plus →" : "Read More →"}
                </Link>
              </div>
              {/* Animated border effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {/* Guide 3 */}
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden group relative">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.luxury || "/api/placeholder/600/400"} 
                  alt="Car selection guide" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">{t('ultimateRoadTrip')}</h3>
                <p className="text-gray-400 text-sm mb-4">
                  {language === 'fr'
                    ? "Comment sélectionner le véhicule de luxe ou sportif idéal pour votre aventure marocaine."
                    : "How to select the ideal luxury or sports car for your Moroccan adventure."}
                </p>
                <Link to="/guides/vehicle-selection" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  {language === 'fr' ? "Lire Plus →" : "Read More →"}
                </Link>
              </div>
              {/* Animated border effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80" />
          <img 
            src={assets.faq?.ctaBackground || "/api/placeholder/1920/600"} 
            alt="Luxury driving experience" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-gray-500">
            {t('readyToExperienceLuxury')}
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            {language === 'fr' 
              ? "Parcourez notre flotte premium et réservez votre prochain voyage extraordinaire à travers le Maroc." 
              : "Browse our premium fleet and book your next extraordinary journey through Morocco."}
          </p>
          <Link
            to="/cars"
            className="inline-block px-10 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            {t('browseOurFleet')}
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;