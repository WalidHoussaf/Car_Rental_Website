import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Select from 'react-select';
import { assets } from '../assets/assets';
import '../styles/animations.css';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: '',
    subject: 'General Inquiry'
  });
  
  const [submitStatus, setSubmitStatus] = useState(null);
  
  const subjectOptions = [
    { value: 'General Inquiry', label: 'General Inquiry' },
    { value: 'Reservation', label: 'Make a Reservation' },
    { value: 'Support', label: 'Customer Support' },
    { value: 'Partnership', label: 'Business Partnership' }
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
            CONTACT US
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10">
            Ready to experience the extraordinary? We're here to assist you
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
              <h2 className="text-3xl mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400">GET IN TOUCH</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label htmlFor="name" className="block text-gray-200 mb-2">Full Name</label>
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
                    <label htmlFor="email" className="block text-gray-200 mb-2">Email Address</label>
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
                    <label htmlFor="phone" className="block text-gray-200 mb-2">Phone Number</label>
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
                    <label htmlFor="subject" className="block text-gray-200 mb-2">Subject</label>
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
                  <label htmlFor="message" className="block text-gray-300 mb-2">Message</label>
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
                
                <button
                  type="submit"
                  className="px-8 py-3 bg-gradient-to-r from-white to-cyan-400 text-black font-medium rounded-md hover:shadow-lg transform transition-all duration-300 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:ring-opacity-50 w-full md:w-auto cursor-pointer"
                  disabled={submitStatus === 'loading'}
                >
                  {submitStatus === 'loading' ? 'Sending...' : 'Send Message'}
                </button>
                
                {submitStatus === 'success' && (
                  <div className="p-4 bg-green-900/30 border border-green-700 rounded-md text-green-400">
                    Thank you! Your message has been sent successfully.
                  </div>
                )}
              </form>
            </div>
            
            {/* Contact Details */}
            <div>
              <h2 className="text-3xl mb-8 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">CONTACT INFORMATION</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {contactInfo.map((item, index) => (
                  <div key={index} className="p-6 bg-black/80 backdrop-blur-md border border-gray-800 rounded-xl group relative">
                    <div className="text-2xl mb-3">{item.icon}</div>
                    <h3 className="text-xl mb-2 font-semibold">{item.title}</h3>
                    <p className="text-gray-300">{item.details}</p>
                    
                    {/* Animated border effect */}
                    <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
                  </div>
                ))}
              </div>
              
              {/* Social Media */}
              <div className="mt-10">
                <h3 className="text-xl mb-4 font-semibold">Connect With Us</h3>
                <div className="flex space-x-4">
                  {/* Social Media Icons */}
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-blue-600 transition-colors duration-300">FB</a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-blue-400 transition-colors duration-300">TW</a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-gradient-to-r from-purple-600 to-pink-500 transition-colors duration-300">IG</a>
                  <a href="#" className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-800 text-white hover:bg-blue-700 transition-colors duration-300">LI</a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>

      {/* Locations Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl text-center font-semibold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            OUR LOCATIONS
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {locations.map((location, index) => (
              <div key={index} className="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-gray-800 text-center relative group flex flex-col">
                <h3 className="text-2xl mb-3 font-semibold">{location.city}</h3>
                <p className="text-gray-300 mb-4">{location.address}</p>
                <button className="mt-auto px-4 py-2 bg-blue-600/20 text-blue-400 border border-blue-500/30 rounded hover:bg-blue-600/30 transition-colors duration-300 text-sm cursor-pointer">
                  View on Map
                </button>
                {/* Animated hover effect */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Map Section - Placeholder */}
      <section className="py-12 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="relative h-96 rounded-xl overflow-hidden border border-gray-800 shadow-2xl">
            <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
              <p className="text-gray-400">Interactive Map Would Be Displayed Here</p>
            </div>
            {/* Map would be integrated here */}
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white to-cyan-400 opacity-70"></div>
      </div>
      
      {/* FAQ Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-4xl">
          <h2 className="text-3xl text-center font-semibold mb-10 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            FREQUENTLY ASKED QUESTIONS
          </h2>
          
          <div className="space-y-6">
            {/* FAQ Item 1 */}
            <div className="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-gray-800 relative group">
              <h3 className="text-xl mb-3 font-semibold">What documents do I need to rent a car?</h3>
              <p className="text-gray-300 text-justify">
                You'll need a valid driver's license (held for at least 1 year), passport or ID card, and a credit card for the security deposit. For premium vehicles, drivers must be at least 25 years old.
              </p>
              {/* Animated hover effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {/* FAQ Item 2 */}
            <div className="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-gray-800 relative group">
              <h3 className="text-xl mb-3 font-semibold">Is there a mileage limit?</h3>
              <p className="text-gray-300 text-justify">
                Most of our rental packages include 200 kilometers per day. Additional kilometers are charged at a rate specified in your rental agreement. We also offer unlimited mileage packages for longer journeys.
              </p>
              {/* Animated hover effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            {/* FAQ Item 3 */}
            <div className="bg-black/80 backdrop-blur-md p-6 rounded-xl border border-gray-800 relative group">
              <h3 className="text-xl mb-3 font-semibold">Do you offer delivery and pickup services?</h3>
              <p className="text-gray-300 text-justify">
                Yes, we offer complimentary delivery and pickup within city limits for rentals of 3+ days. For shorter rentals or locations outside the city, a nominal fee applies. Airport transfers are available 24/7.
              </p>
              {/* Animated hover effect */}
              <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
          
          <div className="text-center mt-10">
            <Link to="/faq" className="text-cyan-400 hover:text-cyan-300 underline transition-colors duration-300">
              View all Frequently Asked Questions
            </Link>
          </div>
        </div>
      </section>

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>
      
      {/* CTA Section */}
      <section className="py-16 px-4 relative overflow-hidden">
        {/* Background with overlay */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/80" />
          <img 
            src={assets.contact?.ctaBackground1 || "/api/placeholder/1920/600"} 
            alt="Luxury driving experience" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-4xl mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            Ready for Your Next Adventure?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Discover our premium fleet of luxury and performance vehicles and start your journey today.
          </p>
          <Link
            to="/cars"
            className="inline-block px-10 py-3 text-base font-medium text-black bg-gradient-to-r from-white to-cyan-400 rounded-md transform transition-all duration-300 hover:scale-105 hover:shadow-lg"
          >
            Explore Our Fleet
          </Link>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;