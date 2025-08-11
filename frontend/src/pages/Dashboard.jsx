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

  // Formatters
  const numberFmt = new Intl.NumberFormat('en-US');
  const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  // Simple sparkline helpers (demo data until backend trend endpoints are available)
  const bookingsTrend = [12, 18, 14, 20, 22, 19, 25, 23, 28, 26, 30, 34];
  const revenueTrend = [800, 1200, 950, 1600, 1500, 1700, 1800, 1750, 2100, 2000, 2300, 2600];
  const sparklinePath = (data, width = 220, height = 48, pad = 4) => {
    if (!data || data.length === 0) return '';
    const w = width - pad * 2;
    const h = height - pad * 2;
    const min = Math.min(...data);
    const max = Math.max(...data);
    const range = Math.max(1, max - min);
    const step = w / (data.length - 1);
    const points = data.map((d, i) => {
      const x = pad + i * step;
      const y = pad + (1 - (d - min) / range) * h;
      return `${x},${y}`;
    });
    return `M ${points[0]} L ${points.slice(1).join(' ')}`;
  };

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
            className="px-6 py-3 bg-cyan-600 hover:bg-cyan-700 rounded-lg transition-colors cursor-pointer"
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
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0 z-0">
        <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
        {/* Subtle grid pattern */}
        <div
          className="absolute inset-0 opacity-[0.08]"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)'
            ,backgroundSize: '28px 28px',
          }}
        />
      </div>
      <div className="relative z-20 container mx-auto px-4 py-12">
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
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent mt-3"></div>
            </div>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-lg transition-colors cursor-pointer"
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
              {/* Users */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    {/* User Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.75 20.1a8.25 8.25 0 0116.5 0 .9.9 0 01-.9.9H4.65a.9.9 0 01-.9-.9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-cyan-400 text-sm font-medium">
                    {language === 'fr' ? 'Total Utilisateurs' : 'Total Users'}
                  </h3>
                </div>
                <p className="text-3xl font-bold">{numberFmt.format(stats.totalUsers)}</p>
              </div>

              {/* Bookings */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
                    {/* Calendar Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M6.75 2.25A.75.75 0 017.5 3v.75h9V3a.75.75 0 011.5 0v.75h.75A2.25 2.25 0 0121 6v12a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 18V6A2.25 2.25 0 015.25 3.75H6V3a.75.75 0 01.75-.75z" />
                      <path fillRule="evenodd" d="M20.25 9.75H3.75v8.25c0 .414.336.75.75.75h15a.75.75 0 00.75-.75V9.75z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-blue-400 text-sm font-medium">
                    {language === 'fr' ? 'Total Réservations' : 'Total Bookings'}
                  </h3>
                </div>
                <p className="text-3xl font-bold">{numberFmt.format(stats.totalBookings)}</p>
              </div>

              {/* Cars */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-300">
                    {/* Car Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path d="M3 13.5l.894-3.129A3 3 0 016.81 8h10.38a3 3 0 012.916 2.371L21 13.5v4.125a.375.375 0 01-.375.375h-.75a.375.375 0 01-.375-.375V17.25H4.5v.375a.375.375 0 01-.375.375h-.75A.375.375 0 013 17.625V13.5z" />
                      <path d="M7.125 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25zM16.875 16.5a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" />
                    </svg>
                  </div>
                  <h3 className="text-green-400 text-sm font-medium">
                    {language === 'fr' ? 'Total Voitures' : 'Total Cars'}
                  </h3>
                </div>
                <p className="text-3xl font-bold">{numberFmt.format(stats.totalCars)}</p>
              </div>

              {/* Revenue */}
              <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-2">
                  <div className="h-9 w-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    {/* Currency Icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M12 3.75a.75.75 0 01.75.75v.75h1.5a.75.75 0 010 1.5h-1.5v9h1.5a.75.75 0 010 1.5h-1.5v.75a.75.75 0 01-1.5 0v-.75h-1.5a.75.75 0 010-1.5h1.5v-9h-1.5a.75.75 0 010-1.5h1.5V4.5a.75.75 0 01.75-.75z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <h3 className="text-purple-400 text-sm font-medium">
                    {language === 'fr' ? 'Revenus' : 'Revenue'}
                  </h3>
                </div>
                <p className="text-3xl font-bold">{moneyFmt.format(stats.revenue)}</p>
              </div>
            </div>
          )}

          {/* Trends Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
            {/* Bookings Trend */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-cyan-400 text-sm font-medium">
                  {language === 'fr' ? 'Tendance des réservations' : 'Bookings Trend'}
                </h3>
                <span className="text-xs text-gray-400">{language === 'fr' ? '12 derniers points' : 'Last 12 points'}</span>
              </div>
              <svg viewBox="0 0 220 48" className="w-full h-12">
                <path d={sparklinePath(bookingsTrend)} className="stroke-cyan-400" fill="none" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
            {/* Revenue Trend */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-purple-400 text-sm font-medium">
                  {language === 'fr' ? 'Tendance des revenus' : 'Revenue Trend'}
                </h3>
                <span className="text-xs text-gray-400">{language === 'fr' ? '12 derniers points' : 'Last 12 points'}</span>
              </div>
              <svg viewBox="0 0 220 48" className="w-full h-12">
                <path d={sparklinePath(revenueTrend)} className="stroke-purple-400" fill="none" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
            <h2 className="text-2xl font-semibold mb-6">
              {language === 'fr' ? 'Actions rapides' : 'Quick Actions'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">

            <button className="p-4 bg-cyan-600/15 hover:bg-cyan-600/25 border border-cyan-600/30 rounded-lg transition-colors text-left group cursor-pointer">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    {/* Users icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M16 11a4 4 0 10-8 0 4 4 0 008 0z"/><path d="M4 19a6 6 0 1116 0v1H4v-1z"/></svg>
                  </div>
                  <h3 className="font-medium text-cyan-400">{language === 'fr' ? 'Utilisateurs' : 'Users'}</h3>
                </div>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Gérer les utilisateurs' : 'Manage users'}</p>
              </button>
              
              <button className="p-4 bg-blue-600/15 hover:bg-blue-600/25 border border-blue-600/30 rounded-lg transition-colors text-left group cursor-pointer">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-300">
                    {/* Clipboard list icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M9 2a2 2 0 00-2 2H5.5A1.5 1.5 0 004 5.5v14A1.5 1.5 0 005.5 21h13a1.5 1.5 0 001.5-1.5v-14A1.5 1.5 0 0018.5 4H17a2 2 0 00-2-2H9zm0 2h6v2H9V4zm1 5h8v2h-8V9zm0 4h8v2h-8v-2zM7 9h1v1H7V9zm0 4h1v1H7v-1z"/></svg>
                  </div>
                  <h3 className="font-medium text-blue-400">{language === 'fr' ? 'Voir les réservations' : 'View Bookings'}</h3>
                </div>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Gérer les réservations' : 'Manage reservations'}</p>
              </button>

              <button className="p-4 bg-green-600/15 hover:bg-green-600/25 border border-green-600/30 rounded-lg transition-colors text-left group cursor-pointer">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-300">
                    {/* Car wrench icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5">
                      <path d="M21 16v-2a2 2 0 00-2-2h-1l-1.2-3.6A2 2 0 0014.9 7H9.1a2 2 0 00-1.9 1.4L6 12H5a2 2 0 00-2 2v2h1a2 2 0 004 0h8a2 2 0 004 0h1z" />
                    </svg>
                  </div>
                  <h3 className="font-medium text-green-400">{language === 'fr' ? 'Gérer les voitures' : 'Manage Cars'}</h3>
                </div>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Ajouter, modifier, supprimer' : 'Add, edit, delete cars'}</p>
              </button>

              <button className="p-4 bg-purple-600/15 hover:bg-purple-600/25 border border-purple-600/30 rounded-lg transition-colors text-left group cursor-pointer">
                <div className="flex items-center gap-3 mb-1">
                  <div className="h-9 w-9 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    {/* Chart icon */}
                    <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" className="h-5 w-5"><path d="M5 3a2 2 0 00-2 2v14h18v-2H5V5a2 2 0 00-2-2zm4 10h2v4H9v-4zm4-6h2v10h-2V7zm4 3h2v7h-2v-7z"/></svg>
                  </div>
                  <h3 className="font-medium text-purple-400">{language === 'fr' ? 'Rapports' : 'Reports'}</h3>
                </div>
                <p className="text-sm text-gray-400">{language === 'fr' ? 'Voir les statistiques' : 'View analytics'}</p>
              </button>
            </div>
          </div>

          {/* Recent Bookings Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 mt-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-2xl font-semibold">{language === 'fr' ? 'Réservations récentes' : 'Recent Bookings'}</h2>
              <span className="text-xs text-gray-400">{language === 'fr' ? 'Exemple de données' : 'Sample data'}</span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-left text-sm">
                <thead className="text-gray-400">
                  <tr>
                    <th className="py-2 pr-4">ID</th>
                    <th className="py-2 pr-4">{language === 'fr' ? 'Client' : 'Customer'}</th>
                    <th className="py-2 pr-4">{language === 'fr' ? 'Voiture' : 'Car'}</th>
                    <th className="py-2 pr-4">{language === 'fr' ? 'Dates' : 'Dates'}</th>
                    <th className="py-2 pr-4">{language === 'fr' ? 'Statut' : 'Status'}</th>
                    <th className="py-2 pr-4 text-right">{language === 'fr' ? 'Montant' : 'Amount'}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/30">
                  {[{id:'#B-1021', name:'John D.', car:'Tesla Model 3', dates:'Aug 01-03', status:'Paid', amount: 189},
                    {id:'#B-1020', name:'Sara K.', car:'BMW X5', dates:'Jul 28-31', status:'Pending', amount: 299},
                    {id:'#B-1019', name:'Alex P.', car:'Audi A4', dates:'Jul 25-27', status:'Refunded', amount: 0}
                  ].map((r) => (
                    <tr key={r.id} className="hover:bg-white/5">
                      <td className="py-3 pr-4 text-gray-300">{r.id}</td>
                      <td className="py-3 pr-4">{r.name}</td>
                      <td className="py-3 pr-4">{r.car}</td>
                      <td className="py-3 pr-4 text-gray-300">{r.dates}</td>
                      <td className="py-3 pr-4">
                        <span className={`px-2 py-0.5 rounded text-xs ${r.status === 'Paid' ? 'bg-green-500/20 text-green-300 border border-green-500/30' : r.status === 'Pending' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'}`}>{r.status}</span>
                      </td>
                      <td className="py-3 pr-4 text-right">{r.amount ? moneyFmt.format(r.amount) : '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
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

export default Dashboard;
