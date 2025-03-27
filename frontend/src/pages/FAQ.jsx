import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';

const FAQPage = () => {
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
      title: "Booking & Reservations",
      icon: "🗓️",
      questions: [
        {
          id: "booking-1",
          question: "How far in advance should I book my rental car?",
          answer: "We recommend booking at least 7 days in advance to ensure vehicle availability, especially for our premium and performance models. During peak tourist seasons (June-September and December), we suggest booking 2-3 weeks ahead. Last-minute bookings are possible based on availability."
        },
        {
          id: "booking-2",
          question: "What is your cancellation policy?",
          answer: "Cancellations made more than 48 hours before the scheduled pickup time receive a full refund. Cancellations within 48 hours of pickup incur a 30% fee. No-shows or cancellations within 24 hours are charged the full day's rental fee. For luxury and special edition vehicles, a 72-hour cancellation policy applies."
        },
        {
          id: "booking-3",
          question: "Can I modify my reservation after booking?",
          answer: "Yes, you can modify your reservation up to 24 hours before your scheduled pickup time, subject to vehicle availability. This includes changing pickup/return locations, rental duration, or even vehicle model. Modifications may affect pricing."
        },
        {
          id: "booking-4",
          question: "Is there a minimum rental period?",
          answer: "Standard rentals have a minimum period of 24 hours. Premium and luxury vehicles require a minimum rental period of 2 days. Special promotions may be available for weekly or monthly rentals with significant discounts."
        }
      ]
    },
    {
      id: "requirements",
      title: "Requirements & Eligibility",
      icon: "📋",
      questions: [
        {
          id: "requirements-1",
          question: "What documents do I need to rent a car?",
          answer: "You'll need a valid driver's license (held for at least 1 year), passport or national ID card, and a credit card for the security deposit. For international visitors, an International Driving Permit (IDP) is recommended but not mandatory if your license is in English, French, or Arabic."
        },
        {
          id: "requirements-2",
          question: "What is the minimum age to rent a vehicle?",
          answer: "The minimum age for standard rentals is 21 years. For premium and performance vehicles, drivers must be at least 25 years old. Drivers under 25 may be subject to a young driver surcharge. All drivers must have held their license for a minimum of one year."
        },
        {
          id: "requirements-3",
          question: "Do I need insurance to rent a car?",
          answer: "Basic insurance is included in all our rental packages, covering third-party liability. We strongly recommend our Premium Coverage option, which reduces the excess/deductible to zero and provides comprehensive protection. Your personal auto insurance or credit card coverage may also apply."
        },
        {
          id: "requirements-4",
          question: "What credit cards do you accept for the security deposit?",
          answer: "We accept Visa, MasterCard, and American Express for security deposits. The card must be in the primary driver's name. Debit cards and cash are not accepted for security deposits but can be used for the rental payment."
        }
      ]
    },
    {
      id: "policies",
      title: "Rental Policies & Services",
      icon: "📒",
      questions: [
        {
          id: "policies-1",
          question: "Is there a mileage limit?",
          answer: "Most of our rental packages include 200 kilometers per day. Additional kilometers are charged at 2-5 MAD per kilometer depending on the vehicle category. We also offer unlimited mileage packages for longer journeys or cross-country trips at an additional fee."
        },
        {
          id: "policies-2",
          question: "Do you offer one-way rentals?",
          answer: "Yes, we offer one-way rentals between our locations in major Moroccan cities. A one-way fee applies, ranging from 500-1500 MAD depending on the distance between pickup and drop-off locations. Please specify this requirement when booking."
        },
        {
          id: "policies-3",
          question: "Do you offer delivery and pickup services?",
          answer: "Yes, we offer complimentary delivery and pickup within city limits for rentals of 3+ days. For shorter rentals or locations outside the city, a nominal fee applies. Airport transfers are available 24/7 with advance notice, including meet-and-greet service."
        },
        {
          id: "policies-4",
          question: "Can I take the rental car outside of Morocco?",
          answer: "No, our vehicles cannot be taken outside of Morocco. Doing so would violate the rental agreement and invalidate insurance coverage. GPS tracking systems in our vehicles monitor their location for security purposes."
        }
      ]
    },
    {
      id: "vehicles",
      title: "Vehicles & Features",
      icon: "🚗",
      questions: [
        {
          id: "vehicles-1",
          question: "What types of vehicles do you offer?",
          answer: "Our fleet includes luxury sedans (BMW, Mercedes, Audi), sports cars (Porsche, Jaguar), SUVs (Range Rover, Bentley Bentayga), exotic supercars (Lamborghini, Ferrari), and convertibles for the ultimate Moroccan experience. We regularly update our fleet to offer the latest models."
        },
        {
          id: "vehicles-2",
          question: "Do all your vehicles have air conditioning?",
          answer: "Yes, all vehicles in our fleet are equipped with climate control or air conditioning. Additionally, our premium vehicles feature multi-zone climate systems allowing different temperature settings for driver and passengers."
        },
        {
          id: "vehicles-3",
          question: "Can I rent a car with a driver?",
          answer: "Yes, we offer chauffeur services with all our vehicles. Our professional drivers are multilingual, highly trained, and knowledgeable about local routes and attractions. Chauffeur services can be booked hourly, daily, or for your entire trip duration."
        },
        {
          id: "vehicles-4",
          question: "Do you offer child seats or additional equipment?",
          answer: "Yes, we provide child seats (infant, toddler, and booster), GPS navigation systems, Wi-Fi hotspots, additional drivers, and more. These can be added during the booking process. Please request in advance to ensure availability."
        }
      ]
    },
    {
      id: "payment",
      title: "Payments & Pricing",
      icon: "💳",
      questions: [
        {
          id: "payment-1",
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards (Visa, MasterCard, American Express), bank transfers, and cash in Moroccan Dirhams. For security deposits, only credit cards are accepted. Corporate clients can arrange for invoicing with advance approval."
        },
        {
          id: "payment-2",
          question: "When is my credit card charged?",
          answer: "A pre-authorization hold is placed on your credit card at the time of booking. The full rental amount is charged upon vehicle pickup. The security deposit (ranging from 5,000-50,000 MAD depending on vehicle value) is also held as a pre-authorization and released upon vehicle return."
        },
        {
          id: "payment-3",
          question: "Are there any hidden fees I should know about?",
          answer: "We pride ourselves on transparent pricing. Your quoted rate includes basic insurance, roadside assistance, and standard mileage. Additional fees may apply for: extra mileage, additional drivers, special equipment, airport/hotel delivery, after-hours service, or fuel replacement."
        },
        {
          id: "payment-4",
          question: "Do you offer special rates for long-term rentals?",
          answer: "Yes, we offer significant discounts for weekly (10-15% off), monthly (20-30% off), and long-term rentals. Corporate accounts and frequent renters can benefit from our loyalty program with preferential rates and complimentary upgrades."
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
            FREQUENTLY ASKED QUESTIONS
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10">
            Everything you need to know about our premium rental experience
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
              placeholder="Search for answers..."
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
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Our customer support team is here to help with any questions you may have about our services.
          </p>
          <div className="flex flex-col md:flex-row justify-center gap-6">
            <Link
              to="/contact"
              className="px-8 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-medium rounded-md hover:shadow-lg transform transition-all duration-300 hover:scale-105"
            >
              Contact Us
            </Link>
            <a
              href="tel:+212 57 77 777"
              className="px-8 py-3 border border-blue-500/50 text-blue-400 font-medium rounded-md hover:bg-blue-500/10 transition-all duration-300"
            >
              Call: +212 57 77 777
            </a>
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>
      
      {/* Popular Guides Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl text-center font-semibold mb-12 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            HELPFUL RESOURCES
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Guide 1 */}
            <div className="bg-black/80 backdrop-blur-md rounded-xl border border-gray-800 overflow-hidden group relative">
              <div className="h-48 overflow-hidden">
                <img 
                  src={ assets.faq?.keys || "/api/placeholder/600/400"} 
                  alt="First-time renter guide" 
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
              <div className="p-6">
                <h3 className="text-xl font-semibold mb-3">First-Time Renter's Guide</h3>
                <p className="text-gray-400 text-sm mb-4">Everything you need to know for a smooth rental experience with Drift.</p>
                <Link to="/guides/first-time" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Read More →
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
                <h3 className="text-xl font-semibold mb-3">Driving in Morocco: Tips & Rules</h3>
                <p className="text-gray-400 text-sm mb-4">Essential information about local driving laws, customs, and recommended routes.</p>
                <Link to="/guides/morocco-driving" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Read More →
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
                <h3 className="text-xl font-semibold mb-3">Choosing the Perfect Luxury Vehicle</h3>
                <p className="text-gray-400 text-sm mb-4">How to select the ideal luxury or sports car for your Moroccan adventure.</p>
                <Link to="/guides/vehicle-selection" className="text-cyan-400 hover:text-cyan-300 text-sm">
                  Read More →
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
            Ready to Experience Luxury on the Road?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Browse our premium fleet and book your next extraordinary journey through Morocco.
          </p>
          <Link
            to="/cars"
            className="inline-block px-10 py-3 text-base font-medium text-white bg-gradient-to-r from-blue-500 to-purple-600 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Explore Our Fleet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default FAQPage;