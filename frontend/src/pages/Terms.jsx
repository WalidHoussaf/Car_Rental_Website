import React, { useState } from 'react';
import { FileText, Scale, Users, CreditCard, Shield, Mail, ChevronRight } from 'lucide-react';
import { useLanguage } from '../context/LanguageContext';
import { useTranslations } from '../translations';
import { assets } from '../assets/assets';

const TermsPage = () => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  const [activeSection, setActiveSection] = useState(0);

  const sections = [
    { 
      icon: FileText, 
      title: t('acceptanceOfTerms'), 
      content: t('acceptanceOfTermsText'),
      gradient: "from-gray-900/60 to-black/40"
    },
    { 
      icon: Users, 
      title: t('useOfService'), 
      content: t('useOfServiceText'),
      gradient: "from-gray-900/60 to-black/40"
    },
    { 
      icon: Scale, 
      title: t('rentalAgreement'), 
      content: t('rentalAgreementText'),
      gradient: "from-gray-900/60 to-black/40"
    },
    { 
      icon: CreditCard, 
      title: t('paymentTerms'), 
      content: t('paymentTermsText'),
      gradient: "from-gray-900/60 to-black/40"
    },
    { 
      icon: Shield, 
      title: t('liabilityLimitation'), 
      content: t('liabilityLimitationText'),
      gradient: "from-gray-900/60 to-black/40"
    },
    { 
      icon: Mail, 
      title: t('contactUs'), 
      content: t('termsContactUsText'),
      gradient: "from-gray-900/60 to-black/40"
    }
  ];

  const scrollToSection = (index) => {
    setActiveSection(index);
    const element = document.getElementById(`section-${index}`);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-x-hidden">
      {/* Hero Section */}
      <div className="relative py-20 overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-40"
          style={{ backgroundImage: `url(${assets.terms})` }}
        ></div>
        <div className="absolute inset-0 bg-black/50"></div>
        <div className="relative z-10 container mx-auto px-4 py-16 text-center">
          {/* Terms Icon */}
          <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-8 animate-pulse">
            <Scale className="w-12 h-12 text-cyan-400" />
          </div>

          <h1 className="text-4xl md:text-7xl font-bold mb-6 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white relative leading-relaxed uppercase">
            {t('termsOfService')}
          </h1>
          
          <p className="text-xl max-w-3xl mx-auto text-gray-200 mb-10 relative leading-relaxed">
            {t('termsSubtitle')}
          </p>

          {/* Scroll indicator */}
          <div className="animate-bounce">
            <ChevronRight className="w-6 h-6 text-cyan-400 mx-auto rotate-90" />
          </div>
        </div>
      </div>

      {/* Table of Contents */}
      <section className="py-8 px-4 bg-gray-900/30 backdrop-blur-sm border-y border-gray-800/50">
        <div className="container mx-auto max-w-6xl">
          <h2 className="text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-white mb-6 text-center">{t('quickNavigation')}</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {sections.map((section, index) => {
              const IconComponent = section.icon;
              return (
                <button
                  key={index}
                  onClick={() => scrollToSection(index)}
                  className={`p-4 rounded-lg border transition-all duration-300 hover:scale-105 group cursor-pointer ${
                    activeSection === index 
                      ? 'bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border-cyan-500/50' 
                      : 'bg-gray-800/30 border-gray-700/50 hover:border-cyan-500/30'
                  }`}
                >
                  <IconComponent className={`w-6 h-6 mx-auto mb-2 transition-colors ${
                    activeSection === index ? 'text-cyan-400' : 'text-gray-400 group-hover:text-cyan-400'
                  }`} />
                  <p className={`text-sm font-medium transition-colors ${
                    activeSection === index ? 'text-white' : 'text-gray-300 group-hover:text-white'
                  }`}>
                    {section.title}
                  </p>
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* Terms Content Sections */}
      <section className="py-16 px-4 relative">
        <div className="container mx-auto max-w-4xl relative z-10 space-y-16">
          {sections.map((section, index) => {
            const IconComponent = section.icon;
            return (
              <div
                key={index}
                id={`section-${index}`}
                className="group"
              >
                <div className={`p-8 rounded-2xl border border-gray-800/50 bg-gradient-to-br ${section.gradient} backdrop-blur-sm transition-all duration-500 hover:border-cyan-500/30 hover:shadow-2xl hover:shadow-cyan-500/10`}>
                  {/* Section Header */}
                  <div className="flex items-center mb-6">
                    <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-gray-800/50 border border-gray-700/50 mr-4 group-hover:border-cyan-500/50 transition-colors">
                      <IconComponent className="w-6 h-6 text-cyan-400" />
                    </div>
                    <h2 className="text-2xl md:text-3xl font-semibold text-white group-hover:text-cyan-100 transition-colors">
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Content */}
                  <div className="prose prose-invert prose-lg max-w-none">
                    <p className="text-gray-200 leading-relaxed text-lg group-hover:text-gray-100 transition-colors text-justify">
                      {section.content}
                    </p>
                  </div>

                  {/* Decorative elements */}
                  <div className="absolute top-4 right-4 w-2 h-2 bg-cyan-400 rounded-full opacity-0 group-hover:opacity-100 transition-opacity animate-pulse"></div>
                  <div className="absolute bottom-4 left-4 w-1 h-8 bg-gradient-to-t from-cyan-400/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Footer CTA */}
      <section className="py-16 px-4 bg-gradient-to-r from-gray-900/50 to-gray-800/50 backdrop-blur-sm border-t border-gray-800/50 relative overflow-hidden">
        {/* Background Image */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat opacity-50"
          style={{ backgroundImage: `url(${assets.terms1})` }}
        ></div>
        <div className="absolute inset-0 bg-black/60"></div>
        <div className="container mx-auto max-w-4xl text-center relative z-10">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-cyan-500/30 mb-6">
            <Mail className="w-8 h-8 text-cyan-400" />
          </div>
          <h2 className="text-3xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-100">
            {t('haveQuestions')}
          </h2>
          <p className="text-gray-200 mb-8 text-lg">
            {t('termsHelpText')}
          </p>
          <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-400 to-white text-black rounded-xl font-semibold hover:from-white hover:to-cyan-400 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-cyan-500/25 cursor-pointer">
            <Mail className="w-5 h-5 mr-2" />
            {t('contactLegalTeam')}
            <ChevronRight className="w-4 h-4 ml-2" />
          </button>
        </div>
      </section>
    </div>
  );
};

export default TermsPage;
