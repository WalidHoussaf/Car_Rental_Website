import React, { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { useLanguage } from '../hooks/useLanguage';
import BookingsAnalytics from '../components/Reports/BookingsAnalytics';
import UsersAnalytics from '../components/Reports/UsersAnalytics';
import RevenueAnalytics from '../components/Reports/RevenueAnalytics';
import CarsAnalytics from '../components/Reports/CarsAnalytics';

const Reports = () => {
  const { user, loading } = useAuth();
  const navigate = useNavigate();
  const { language } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');

  // Redirect to home when not authenticated (after initial auth check)
  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate]);

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer"
          >
            Go to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // While auth is checking, show loader
  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  if (!user) return null;

  const tabs = [
    {
      id: 'overview',
      label: language === 'fr' ? 'Vue d\'ensemble' : 'Overview',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
        </svg>
      )
    },
    {
      id: 'bookings',
      label: language === 'fr' ? 'Réservations' : 'Bookings',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'users',
      label: language === 'fr' ? 'Utilisateurs' : 'Users',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z" />
        </svg>
      )
    },
    {
      id: 'revenue',
      label: language === 'fr' ? 'Revenus' : 'Revenue',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4 4a2 2 0 00-2 2v4a2 2 0 002 2V6h10a2 2 0 00-2-2H4zm2 6a2 2 0 012-2h8a2 2 0 012 2v4a2 2 0 01-2 2H8a2 2 0 01-2-2v-4zm6 4a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
        </svg>
      )
    },
    {
      id: 'cars',
      label: language === 'fr' ? 'Voitures' : 'Cars',
      icon: (
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 2a1 1 0 000 2h4a1 1 0 100-2H8zM3 7a2 2 0 012-2h10a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2V7zm2.5 1a1.5 1.5 0 100 3 1.5 1.5 0 000-3zm9 0a1.5 1.5 0 100 3 1.5 1.5 0 000-3z" clipRule="evenodd" />
        </svg>
      )
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {language === 'fr' ? 'Rapports Complets' : 'Comprehensive Reports'}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {language === 'fr' 
                  ? 'Explorez les analyses détaillées de votre entreprise de location de voitures. Sélectionnez un onglet pour voir les métriques spécifiques.'
                  : 'Explore detailed analytics for your car rental business. Select a tab to view specific metrics.'
                }
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tabs.slice(1).map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className="p-6 bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl hover:bg-gray-900/70 hover:border-cyan-600/50 hover:scale-105 transition-all duration-300 cursor-pointer group text-left"
                >
                  <div className="flex items-center gap-3 mb-3">
                    <div className="h-10 w-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/50 group-hover:text-cyan-200 transition-all duration-300">
                      {tab.icon}
                    </div>
                    <h3 className="text-lg font-semibold text-white group-hover:text-cyan-300 transition-colors duration-300">
                      {tab.label}
                    </h3>
                  </div>
                  <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                    {tab.id === 'bookings' && (language === 'fr' ? 'Analyse des réservations et tendances' : 'Booking analysis and trends')}
                    {tab.id === 'users' && (language === 'fr' ? 'Croissance et engagement des utilisateurs' : 'User growth and engagement')}
                    {tab.id === 'revenue' && (language === 'fr' ? 'Revenus et performance financière' : 'Revenue and financial performance')}
                    {tab.id === 'cars' && (language === 'fr' ? 'Performance de la flotte automobile' : 'Fleet performance analytics')}
                  </p>
                </button>
              ))}
            </div>

            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              <h3 className="text-xl font-semibold text-white mb-4">
                {language === 'fr' ? 'Fonctionnalités des Rapports' : 'Report Features'}
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      {language === 'fr' ? 'Données en Temps Réel' : 'Real-time Data'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {language === 'fr' ? 'Toutes les métriques sont mises à jour en temps réel' : 'All metrics are updated in real-time'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      {language === 'fr' ? 'Graphiques Interactifs' : 'Interactive Charts'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {language === 'fr' ? 'Visualisations dynamiques et interactives' : 'Dynamic and interactive visualizations'}
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center flex-shrink-0 mt-1">
                    <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="font-medium text-white mb-1">
                      {language === 'fr' ? 'Insights Avancés' : 'Advanced Insights'}
                    </h4>
                    <p className="text-sm text-gray-400">
                      {language === 'fr' ? 'Analyses approfondies et recommandations' : 'Deep analytics and recommendations'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      case 'bookings':
        return <BookingsAnalytics />;
      case 'users':
        return <UsersAnalytics />;
      case 'revenue':
        return <RevenueAnalytics />;
      case 'cars':
        return <CarsAnalytics />;
      default:
        return null;
    }
  };

  return (
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />
      </div>

      <div className="relative z-20 container mx-auto px-4 py-12">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">
                {language === 'fr' ? 'Rapports Analytiques' : 'Analytics Reports'}
              </h1>
              <p className="text-gray-400">
                {language === 'fr' ? 'Analyses détaillées de votre entreprise' : 'Detailed business analytics and insights'}
              </p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-3"></div>
            </div>
            <button
              onClick={() => navigate('/dashboard')}
              className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg transition-colors cursor-pointer"
            >
              {language === 'fr' ? 'Retour au Tableau de Bord' : 'Back to Dashboard'}
            </button>
          </div>

          {/* Navigation Tabs */}
          <div className="mb-8">
            <div className="flex flex-wrap gap-2 bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-2">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? 'bg-cyan-600 text-white shadow-lg'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800/50'
                  }`}
                >
                  {tab.icon}
                  <span className="font-medium">{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
          <div className="animate-fadeIn">
            {renderTabContent()}
          </div>
        </div>
      </div>

      {/* Bottom Border Glow */}
      <div className="relative h-px w-full overflow-hidden">
        <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
      </div>
    </div>
  );
};

export default Reports;
