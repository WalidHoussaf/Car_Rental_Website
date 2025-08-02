import React from 'react';
import { Link } from 'react-router-dom';
import { useLanguage } from '../../context/LanguageContext';
import { useTranslations } from '../../translations';

const Testimonials = ({ testimonials }) => {
  const { language } = useLanguage();
  const t = useTranslations(language);

  return (
    <section className="relative py-24 px-4 bg-black overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 bg-gradient-to-br via-black to-cyan-700"></div>
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-600 via-transparent to-transparent"></div>
      
      {/* Grid Pattern */}
      <div className="absolute inset-0 opacity-[0.03]" style={{
        backgroundImage: `radial-gradient(circle at 1px 1px, rgba(255,255,255,0.15) 1px, transparent 0)`,
        backgroundSize: '40px 40px'
      }}></div>
      
      <div className="max-w-7xl mx-auto relative z-10">
        {/* Header */}
        <div className="text-center mb-20">
          <div className="inline-block">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron'] leading-tight">
              {t('customerTestimonials')}
            </h2>
            <div className="h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent rounded-full"></div>
          </div>
          <p className="text-gray-400 mt-6 text-lg font-['Orbitron'] max-w-2xl mx-auto">
            Discover what our clients say about their transformative experiences
          </p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div 
              key={index}
              className="group relative"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Card Container */}
              <div className="relative bg-gradient-to-br to-black rounded-xl border border-cyan-500 backdrop-blur-sm transform transition-all duration-300 hover:border-cyan-600 hover:shadow-[0_0_25px_rgba(6,182,212,0.3)] overflow-hidden">
                
                <div className="absolute inset-0 bg-gradient-to-br from-cyan-400/5 via-transparent to-cyan-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                
                <div className="relative p-6">
                  {/* Quote */}
                  <div className="mb-6">
                    <svg className="w-6 h-6 text-cyan-400 mb-4" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h4v10h-10z"/>
                    </svg>
                    <p className="text-white font-['Orbitron'] text-sm leading-relaxed text-justify">
                      "{t(`testimonial_${testimonial.name.toLowerCase().replace(/\s+/g, '_')}_quote`) || testimonial.quote}"
                    </p>
                  </div>
                  
                  {/* User Info */}
                  <div className="flex items-center">
                    <div className="relative">
                      <div className="w-12 h-12 rounded-full border-2 border-cyan-800 transition-all duration-300 overflow-hidden">
                        <img
                          src={testimonial.photo}
                          alt={testimonial.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="ml-4 flex-1">
                      <h3 className="font-semibold text-white transition-colors duration-300 font-['Orbitron'] text-sm">
                        {t(`testimonial_${testimonial.name.toLowerCase().replace(/\s+/g, '_')}_name`) || testimonial.name}
                      </h3>
                      <p className="text-xs text-cyan-400 font-['Orbitron']">
                        {t(`testimonial_${testimonial.name.toLowerCase().replace(/\s+/g, '_')}_title`) || testimonial.title}
                      </p>
                    </div>
                    
                    {/* Star Rating */}
                    <div className="flex items-center space-x-1">
                      {[...Array(testimonial.rating || 5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"/>
                        </svg>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA Button */}
        <div className="text-center mt-16">
          <Link
            to="/reviews"
            className="inline-flex items-center px-8 py-4 text-lg font-medium text-black bg-gradient-to-r from-white to-cyan-400 border border-cyan-500/50 rounded-lg hover:from-cyan-400 hover:to-white transition-all duration-300 transform hover:scale-105 hover:shadow-[0_0_30px_rgba(34,211,238,0.4)] group"
          >
            <span className="relative z-10 font-['Orbitron'] mr-2">
              {t('readMoreReviews')}
            </span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 transform transition-transform duration-300 group-hover:translate-x-1" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Testimonials;