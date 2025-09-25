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

  useEffect(() => {
    if (!loading && !user) {
      navigate('/', { replace: true });
    }
  }, [loading, user, navigate]);

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
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024" fill="currentColor" className="h-5 w-5">
          <path d="M713.664 832H310.208L182.4 959.936 128 905.6 201.6 832H64V64h896v768h-137.664l73.6 73.6-54.336 54.336L713.664 832zM140.8 140.8v614.4h742.4V140.8H140.8zM281.6 256h76.8v384H281.6V256z m384 192h76.8v192h-76.8V448z m-192-96h76.8V640H473.6V352z" />
        </svg>
      ),
      color: 'cyan'
    },
    {
      id: 'users',
      label: language === 'fr' ? 'Utilisateurs' : 'Users',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.75 20.1a8.25 8.25 0 0116.5 0 .9.9 0 01-.9.9H4.65a.9.9 0 01-.9-.9z" clipRule="evenodd" />
        </svg>
      ),
      color: 'cyan'
    },
    {
      id: 'bookings',
      label: language === 'fr' ? 'Réservations' : 'Bookings',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M6.75 2.25A.75.75 0 017.5 3v.75h9V3a.75.75 0 011.5 0v.75h.75A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6A2.25 2.25 0 015.25 3.75H6V3a.75.75 0 01.75-.75z" />
          <path fillRule="evenodd" d="M20.25 9.75H3.75v8.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V9.75z" clipRule="evenodd" />
        </svg>
      ),
      color: 'blue'
    },
    {
      id: 'cars',
      label: language === 'fr' ? 'Voitures' : 'Cars',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path d="M3 13.5l.894-3.129A3 3 0 016.81 8h10.38a3 3 0 012.916 2.371L21 13.5v4.125a.375.375 0 01-.375.375h-.75a.375.375 0 01-.375-.375V17.25H4.5v.375a.375.375 0 01-.375.375h-.75A.375.375 0 013 17.625V13.5z" />
          <path d="M7.125 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM16.875 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
        </svg>
      ),
      color: 'green'
    },
    {
      id: 'revenue',
      label: language === 'fr' ? 'Revenus' : 'Revenue',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
          <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v.75h1.5a.75.75 0 010 1.5h-1.5v9h1.5a.75.75 0 010 1.5h-1.5v.75a.75.75 0 01-1.5 0v-.75h-1.5a.75.75 0 010-1.5h1.5v-9h-1.5a.75.75 0 010-1.5h1.5V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
        </svg>
      ),
      color: 'purple'
    }
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="space-y-8">
            {/* Header Section */}
            <div className="text-center">
              <h2 className="text-3xl font-bold text-white mb-4">
                {language === 'fr' ? 'Tableau de Bord Analytique' : 'Analytics Dashboard'}
              </h2>
              <p className="text-gray-400 max-w-2xl mx-auto">
                {language === 'fr' 
                  ? 'Vue d\'ensemble complète de votre entreprise de location avec métriques en temps réel et analyses avancées'
                  : 'Complete overview of your rental business with real-time metrics and advanced analytics'
                }
              </p>
            </div>

            {/* Quick Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Total System Health */}
              <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-gray-300 text-sm font-medium">
                      {language === 'fr' ? 'État du système' : 'System Health'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">LIVE</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">100%</div>
                <div className="text-xs text-gray-400">
                  {language === 'fr' ? 'Toutes fonctionnalités actives' : 'All features operational'}
                </div>
              </div>

              {/* Data Sources */}
              <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm font-medium">
                      {language === 'fr' ? 'Sources de données' : 'Data Sources'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">API</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">6</div>
                <div className="text-xs text-gray-400">
                  {language === 'fr' ? 'Modules connectés' : 'Connected modules'}
                </div>
              </div>

              {/* Report Categories */}
              <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm font-medium">
                      {language === 'fr' ? 'Catégories' : 'Categories'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">TYPES</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">4</div>
                <div className="text-xs text-gray-400">
                  {language === 'fr' ? 'Types de rapports' : 'Report types'}
                </div>
              </div>

              {/* Last Updated */}
              <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm font-medium">
                      {language === 'fr' ? 'Dernière MAJ' : 'Last Updated'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">AUTO</div>
                </div>
                <div className="text-2xl font-bold text-white mb-1">
                  {new Date().toLocaleTimeString('en-US', { 
                    hour: '2-digit', 
                    minute: '2-digit',
                    hour12: false 
                  })}
                </div>
                <div className="text-xs text-gray-400">
                  {language === 'fr' ? 'Temps réel' : 'Real-time sync'}
                </div>
              </div>
            </div>

            {/* Features Section */}
            <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-semibold text-white mb-2">
                    {language === 'fr' ? 'Fonctionnalités Avancées des Rapports' : 'Advanced Report Features'}
                  </h3>
                  <p className="text-gray-400 text-sm">
                    {language === 'fr' ? 'Système complet d\'analyse et de gestion pour votre entreprise de location' : 'Complete analytics and management system for your rental business'}
                  </p>
                </div>
                <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
                  {language === 'fr' ? 'SYSTÈME COMPLET' : 'FULL SYSTEM'}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Real-time Analytics */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">
                      {language === 'fr' ? 'Données en Temps Réel' : 'Real-time Analytics'}
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {language === 'fr' ? 'Métriques mises à jour automatiquement' : 'Auto-updated metrics'}</li>
                    <li>• {language === 'fr' ? 'Disponibilité des voitures en direct' : 'Live car availability'}</li>
                    <li>• {language === 'fr' ? 'Statuts de réservation dynamiques' : 'Dynamic booking statuses'}</li>
                  </ul>
                </div>

                {/* Advanced Charts */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">
                      {language === 'fr' ? 'Graphiques Avancés' : 'Advanced Charts'}
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {language === 'fr' ? 'Graphiques en aires interactifs' : 'Interactive area charts'}</li>
                    <li>• {language === 'fr' ? 'Graphiques en barres détaillés' : 'Detailed bar charts'}</li>
                    <li>• {language === 'fr' ? 'Graphiques circulaires avec légendes' : 'Pie charts with legends'}</li>
                  </ul>
                </div>

                {/* Business Intelligence */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">
                      {language === 'fr' ? 'Intelligence d\'Affaires' : 'Business Intelligence'}
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {language === 'fr' ? 'Analyses prédictives' : 'Predictive analytics'}</li>
                    <li>• {language === 'fr' ? 'Tendances de croissance' : 'Growth trends'}</li>
                    <li>• {language === 'fr' ? 'Recommandations automatiques' : 'Automated insights'}</li>
                  </ul>
                </div>

                {/* Car Management */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M3 13.5l.894-3.129A3 3 0 016.81 8h10.38a3 3 0 012.916 2.371L21 13.5v4.125a.375.375 0 01-.375.375h-.75a.375.375 0 01-.375-.375V17.25H4.5v.375a.375.375 0 01-.375.375h-.75A.375.375 0 013 17.625V13.5z" />
                        <path d="M7.125 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM16.875 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">
                      {language === 'fr' ? 'Gestion de Flotte' : 'Fleet Management'}
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {language === 'fr' ? 'Suivi de disponibilité en temps réel' : 'Real-time availability tracking'}</li>
                    <li>• {language === 'fr' ? 'Performance par véhicule' : 'Per-vehicle performance'}</li>
                    <li>• {language === 'fr' ? 'Métriques de performance moteur' : 'Engine performance metrics'}</li>
                  </ul>
                </div>

                {/* Booking System */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-blue-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M6.75 2.25A.75.75 0 017.5 3v.75h9V3a.75.75 0 011.5 0v.75h.75A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6A2.25 2.25 0 015.25 3.75H6V3a.75.75 0 01.75-.75z" />
                        <path fillRule="evenodd" d="M20.25 9.75H3.75v8.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V9.75z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">
                      {language === 'fr' ? 'Système de Réservation' : 'Booking System'}
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {language === 'fr' ? 'Gestion automatique des statuts' : 'Automatic status management'}</li>
                    <li>• {language === 'fr' ? 'Validation des créneaux horaires' : 'Time slot validation'}</li>
                    <li>• {language === 'fr' ? 'Filtrage par localisation' : 'Location-based filtering'}</li>
                  </ul>
                </div>

                {/* Revenue Analytics */}
                <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="w-10 h-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                        <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v.75h1.5a.75.75 0 010 1.5h-1.5v9h1.5a.75.75 0 010 1.5h-1.5v.75a.75.75 0 01-1.5 0v-.75h-1.5a.75.75 0 010-1.5h1.5v-9h-1.5a.75.75 0 010-1.5h1.5V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-white">
                      {language === 'fr' ? 'Analyse Financière' : 'Financial Analytics'}
                    </h4>
                  </div>
                  <ul className="text-sm text-gray-400 space-y-1">
                    <li>• {language === 'fr' ? 'Revenus par statut de réservation' : 'Revenue by booking status'}</li>
                    <li>• {language === 'fr' ? 'Projections de revenus' : 'Revenue projections'}</li>
                    <li>• {language === 'fr' ? 'Top 5 des voitures performantes' : 'Top 5 performing cars'}</li>
                  </ul>
                </div>
              </div>

              {/* System Status */}
              <div className="mt-6 p-4 bg-gradient-to-r from-green-500/10 to-blue-500/10 rounded-lg border border-green-500/20">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                    <div>
                      <div className="text-sm text-white font-medium">
                        {language === 'fr' ? 'Système Opérationnel' : 'System Operational'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {language === 'fr' ? 'Toutes les fonctionnalités sont actives et fonctionnelles' : 'All features are active and functional'}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-green-400 font-bold">100%</div>
                    <div className="text-xs text-gray-500">{language === 'fr' ? 'Disponibilité' : 'Uptime'}</div>
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
            <div className="flex justify-center">
              <div className="inline-flex bg-gray-900/80 backdrop-blur-sm border border-gray-700/50 rounded-2xl p-2 shadow-2xl">
                <div className="flex flex-wrap justify-center gap-1">
                  {tabs.map((tab) => {
                    const getTabColorClasses = (color, isActive) => {
                      if (isActive) {
                        switch (color) {
                          case 'blue':
                            return { 
                              bg: 'bg-gradient-to-r from-blue-600 to-blue-500', 
                              icon: 'bg-white/20 text-white shadow-lg',
                              border: 'border-blue-400/50'
                            };
                          case 'purple':
                            return { 
                              bg: 'bg-gradient-to-r from-purple-600 to-purple-500', 
                              icon: 'bg-white/20 text-white shadow-lg',
                              border: 'border-purple-400/50'
                            };
                          case 'green':
                            return { 
                              bg: 'bg-gradient-to-r from-green-600 to-green-500', 
                              icon: 'bg-white/20 text-white shadow-lg',
                              border: 'border-green-400/50'
                            };
                          default: 
                            return { 
                              bg: 'bg-gradient-to-r from-cyan-600 to-cyan-500', 
                              icon: 'bg-white/20 text-white shadow-lg',
                              border: 'border-cyan-400/50'
                            };
                        }
                      } else {
                        switch (color) {
                          case 'blue':
                            return { 
                              bg: 'hover:bg-gray-800/70', 
                              icon: 'bg-blue-500/15 border border-blue-500/30 text-blue-300 group-hover:bg-blue-500/25 group-hover:border-blue-400/50 group-hover:text-blue-200 group-hover:shadow-md',
                              border: 'hover:border-blue-500/30'
                            };
                          case 'purple':
                            return { 
                              bg: 'hover:bg-gray-800/70', 
                              icon: 'bg-purple-500/15 border border-purple-500/30 text-purple-300 group-hover:bg-purple-500/25 group-hover:border-purple-400/50 group-hover:text-purple-200 group-hover:shadow-md',
                              border: 'hover:border-purple-500/30'
                            };
                          case 'green':
                            return { 
                              bg: 'hover:bg-gray-800/70', 
                              icon: 'bg-green-500/15 border border-green-500/30 text-green-300 group-hover:bg-green-500/25 group-hover:border-green-400/50 group-hover:text-green-200 group-hover:shadow-md',
                              border: 'hover:border-green-500/30'
                            };
                          default: 
                            return { 
                              bg: 'hover:bg-gray-800/70', 
                              icon: 'bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 group-hover:bg-cyan-500/25 group-hover:border-cyan-400/50 group-hover:text-cyan-200 group-hover:shadow-md',
                              border: 'hover:border-cyan-500/30'
                            };
                        }
                      }
                    };
                    
                    const isActive = activeTab === tab.id;
                    const colors = getTabColorClasses(tab.color, isActive);
                    
                    return (
                      <button
                        key={tab.id}
                        onClick={() => setActiveTab(tab.id)}
                        className={`flex items-center gap-3 px-6 py-4 rounded-xl transition-all duration-300 cursor-pointer group border ${
                          isActive
                            ? `${colors.bg} text-white shadow-xl transform scale-105 ${colors.border}`
                            : `text-gray-400 hover:text-white border-transparent ${colors.bg} ${colors.border}`
                        }`}
                      >
                        <div className={`h-8 w-8 rounded-lg flex items-center justify-center transition-all duration-300 ${colors.icon}`}>
                          <div className="scale-110">
                            {tab.icon}
                          </div>
                        </div>
                        <span className={`font-semibold text-sm whitespace-nowrap ${isActive ? 'text-white' : 'text-gray-300 group-hover:text-white'}`}>
                          {tab.label}
                        </span>
                        {isActive && (
                          <div className="w-2 h-2 bg-white/60 rounded-full animate-pulse"></div>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>
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
