import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { api } from '../config/api';

const Dashboard = () => {
  const { user, logout } = useAuth();
  const { language } = useLanguage();
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalBookings: 0,
    totalCars: 0,
    revenue: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const response = await api.users.getDashboardStats();
        if (response.success) {
          setStats(response.data);
        }
      } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
      } finally {
        setIsLoading(false);
      }
    };

    if (user && user.role === 'admin') {
      fetchDashboardData();
    } else {
      setIsLoading(false);
    }
  }, [user]);

  const handleLogout = () => {
    logout();
    window.location.href = '/';
  };

  // Redirect non-admin users
  if (user && user.role !== 'admin') {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center text-white">
          <h2 className="text-2xl mb-4">Access Denied</h2>
          <p className="text-gray-400 mb-6">You don't have permission to access this page.</p>
          <button
            onClick={() => window.location.href = '/profile'}
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors"
          >
            Go to Profile
          </button>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <h2 className="text-2xl mb-4">Loading...</h2>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Background Effects */}
      <div className="fixed inset-0 bg-gradient-to-br from-black via-gray-900 to-black"></div>
      <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_center,_var(--tw-gradient-stops))] from-cyan-900/20 via-transparent to-transparent"></div>
      
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="max-w-7xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2">
                {language === 'fr' ? 'Tableau de bord' : 'Admin Dashboard'}
              </h1>
              <p className="text-gray-400">
                {language === 'fr' ? 'Bienvenue, ' : 'Welcome, '}{user.firstName}
              </p>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors"
            >
              {language === 'fr' ? 'Déconnexion' : 'Logout'}
            </button>
          </div>

          {/* Stats Grid */}
          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 animate-pulse">
                  <div className="h-4 bg-gray-700 rounded mb-2"></div>
                  <div className="h-8 bg-gray-700 rounded"></div>
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <h3 className="text-cyan-400 text-sm font-medium mb-2">
                  {language === 'fr' ? 'Total Utilisateurs' : 'Total Users'}
                </h3>
                <p className="text-3xl font-bold">{stats.totalUsers}</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <h3 className="text-cyan-400 text-sm font-medium mb-2">
                  {language === 'fr' ? 'Total Réservations' : 'Total Bookings'}
                </h3>
                <p className="text-3xl font-bold">{stats.totalBookings}</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <h3 className="text-cyan-400 text-sm font-medium mb-2">
                  {language === 'fr' ? 'Total Voitures' : 'Total Cars'}
                </h3>
                <p className="text-3xl font-bold">{stats.totalCars}</p>
              </div>
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <h3 className="text-cyan-400 text-sm font-medium mb-2">
                  {language === 'fr' ? 'Revenus' : 'Revenue'}
                </h3>
                <p className="text-3xl font-bold">${stats.revenue}</p>
              </div>
            </div>
          )}

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              {language === 'fr' ? 'Actions rapides' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <button className="p-4 bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/30 rounded-lg transition-colors text-left">
                <h3 className="font-medium text-cyan-400 mb-1">
                  {language === 'fr' ? 'Gérer les voitures' : 'Manage Cars'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'fr' ? 'Ajouter, modifier, supprimer' : 'Add, edit, delete cars'}
                </p>
              </button>
              <button className="p-4 bg-blue-600/20 hover:bg-blue-600/30 border border-blue-600/30 rounded-lg transition-colors text-left">
                <h3 className="font-medium text-blue-400 mb-1">
                  {language === 'fr' ? 'Voir les réservations' : 'View Bookings'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'fr' ? 'Gérer les réservations' : 'Manage reservations'}
                </p>
              </button>
              <button className="p-4 bg-green-600/20 hover:bg-green-600/30 border border-green-600/30 rounded-lg transition-colors text-left">
                <h3 className="font-medium text-green-400 mb-1">
                  {language === 'fr' ? 'Utilisateurs' : 'Users'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'fr' ? 'Gérer les utilisateurs' : 'Manage users'}
                </p>
              </button>
              <button className="p-4 bg-purple-600/20 hover:bg-purple-600/30 border border-purple-600/30 rounded-lg transition-colors text-left">
                <h3 className="font-medium text-purple-400 mb-1">
                  {language === 'fr' ? 'Rapports' : 'Reports'}
                </h3>
                <p className="text-sm text-gray-400">
                  {language === 'fr' ? 'Voir les statistiques' : 'View analytics'}
                </p>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
