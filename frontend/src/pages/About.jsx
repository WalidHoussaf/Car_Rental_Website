import React from 'react';
import { Link } from 'react-router-dom';
import { assets } from '../assets/assets';
import '../styles/animations.css';

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Walid Houssaf",
      position: "Founder & CEO",
      bio: "With over 15 years in the luxury automotive industry, Walid founded Drift to revolutionize car rentals in Morocco. His passion for cars and technology drives our vision forward.",
      image: assets.about?.team?.walid || "/api/placeholder/300/300"
    },
    {
      name: "Zineb El Qodsi",
      position: "Operations Director",
      bio: "Leading our day-to-day operations across all locations, ensuring every rental experience exceeds expectations. Zineb's attention to detail and customer focus are unmatched.",
      image: assets.about?.team?.zineb || "/api/placeholder/300/300"
    },
    {
      name: "Mia Chen",
      position: "Customer Experience",
      bio: "Creating seamless experiences from booking to return, Mia ensures our customers' journey is as smooth as our vehicles.",
      image: assets.about?.team?.mia || "/api/placeholder/300/300"
    }
  ];

  // Statistics 
  const stats = [
    { value: "7+", label: "Locations" },
    { value: "100+", label: "Premium Vehicles" },
    { value: "10k+", label: "Happy Customers" },
    { value: "6", label: "Years Experience" }
  ];

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-black/70" />
          <img 
            src={assets.about?.heroImage || "/api/placeholder/1920/600"} 
            alt="Luxury cars" 
            className="w-full h-full object-cover"
          />
        </div>
        
        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          <h1 className="text-4xl md:text-6xl font-semibold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            ABOUT US
          </h1>
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10">
            Redefining the premium car rental experience in Morocco since 2019
          </p>
        </div>
      </div>

      {/* Animated Divider */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white animate-pulse"></div>
      </div>
      
      {/* Our Story Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl mb-6 font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white via-cyan-400 to-cyan-400 leading-[1.2]">OUR STORY</h2>
              <p className="text-gray-300 mb-4 text-justify">
                Founded in 2019, Rent My Ride began with a simple vision: to offer premium, high-performance vehicles at accessible prices throughout Morocco's most beautiful destinations.
              </p>
              <p className="text-gray-300 mb-4 text-justify">
                What started as a small fleet of three luxury vehicles in Casablanca has evolved into Morocco's most sought-after premium car rental service, with operations spanning the entire country.
              </p>
              <p className="text-gray-300 text-justify">
                We've combined our passion for exceptional automobiles with cutting-edge technology to create a seamless booking experience, allowing you to focus on what matters most – the journey ahead.
              </p>
            </div>
            <div className="relative">
              <div className="relative h-96 rounded-xl overflow-hidden border border-cyan-900 shadow-2xl">
                <img 
                  src={assets.about?.storyImage || "/api/placeholder/600/400"} 
                  alt="Our journey" 
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent"></div>
              </div>
              {/* Accent Effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-white to-cyan-600/90 rounded-xl blur-xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Stats Section */}
      <section className="py-12 px-4 bg-black/60 backdrop-blur-md">
        <div className="container mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {stats.map((stat, index) => (
              <div key={index} className="p-6 border border-cyan-900 rounded-xl bg-black/40 backdrop-blur-sm">
                <div className="text-3xl md:text-4xl font-bold font-['Orbitron'] mb-2 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
                  {stat.value}
                </div>
                <div className="from-white to-cyan-400 text-2xl font-['Rationale']">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>
      
      {/* Our Vision and Mission */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl text-center font-semibold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
            WHAT WE STAND FOR
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
            <div className="bg-black/80 backdrop-blur-md p-8 rounded-xl border border-cyan-800 relative group">
              <h3 className="text-2xl mb-4 font-semibold bg-gradient-to-r from-white via-cyan-400 to-cyan-400 bg-clip-text text-transparent">Our Vision</h3>
              <p className="text-gray-300 text-justify">
                To transform the car rental industry in North Africa by blending luxury, technology, and sustainability into a seamless experience that creates unforgettable journeys.
              </p>
              {/* Animated hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
            
            <div className="bg-black/80 backdrop-blur-md p-8 rounded-xl border border-cyan-800 relative group">
              <h3 className="text-2xl mb-4 font-semibold bg-gradient-to-r from-white via-cyan-400 to-cyan-400 bg-clip-text text-transparent">Our Mission</h3>
              <p className="text-gray-300 text-justify">
                To provide exceptional vehicles and service that exceed expectations, while fostering a culture of innovation, sustainability, and authentic Moroccan hospitality.
              </p>
              {/* Animated hover effect */}
              <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
            </div>
          </div>
        </div>
      </section>
      
      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-white via-cyan-400 to-white opacity-70"></div>
      </div>
      
      {/* Team Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-4xl text-center font-semibold mb-16 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">
           THE HEART OF THE COMPANY
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="bg-black/80 backdrop-blur-md rounded-xl border border-cyan-800 overflow-hidden group relative">
                <div className="h-64 overflow-hidden">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="p-6">
                  <h3 className="text-xl font-semibold mb-1 uppercase">{member.name}</h3>
                  <p className="text-cyan-400 text-sm mb-3">{member.position}</p>
                  <p className="text-gray-200 text-sm text-justify">{member.bio}</p>
                </div>
                {/* Animated border effect */}
                <div className="absolute -inset-[1px] rounded-xl bg-gradient-to-r from-white to-cyan-400 opacity-0 group-hover:opacity-30 transition-opacity duration-300 -z-10"></div>
              </div>
            ))}
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
            src={assets.about?.ctaBackground || "/api/placeholder/1920/600"} 
            alt="Luxury driving experience" 
            className="w-full h-full object-cover"
          />
        </div>
        
        <div className="container mx-auto max-w-4xl relative z-10 text-center">
          <h2 className="text-3xl mb-6 text-transparent bg-clip-text bg-gradient-to-r uppercase from-white to-cyan-400 leading-[1.2]">
            Ready to Experience the Extraordinary?
          </h2>
          <p className="text-xl text-gray-300 mb-10 max-w-2xl mx-auto">
            Whether it's a weekend getaway or a cross-country adventure, our fleet is ready to make your journey unforgettable.
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

export default AboutPage;