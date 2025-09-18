import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import DonutChart from '../Charts/DonutChart';
import AreaChart from '../Charts/AreaChart';

const UsersAnalytics = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [usersData, setUsersData] = useState({
    totalUsers: 0,
    monthlyGrowth: [],
    roleDistribution: [],
    registrationTrends: [],
    activeUsers: 0,
    newUsersThisMonth: 0,
    userEngagement: []
  });

  const numberFmt = new Intl.NumberFormat('en-US');

  useEffect(() => {
    const fetchUsersData = async () => {
      try {
        const [usersResponse, bookingsResponse] = await Promise.all([
          api.users.getAll({ limit: 1000 }),
          api.bookings.getAll({ limit: 1000 })
        ]);

        if (usersResponse.success && usersResponse.data.users) {
          const users = usersResponse.data.users;
          const bookings = bookingsResponse.success ? bookingsResponse.data.bookings : [];
          processUsersData(users, bookings);
        }
      } catch (error) {
        console.error('Failed to fetch users data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUsersData();
  }, []);

  const processUsersData = (users, bookings) => {
    const now = new Date();
    
    // Monthly growth for last 12 months
    const monthlyData = {};
    const monthLabels = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[key] = 0;
      monthLabels.push(label);
    }

    // Role distribution
    const roleCounts = {
      user: 0,
      admin: 0
    };

    // Registration trends (last 7 days)
    const registrationData = {};
    const registrationLabels = [];
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const label = date.toLocaleDateString('en-US', { weekday: 'short' });
      registrationData[key] = 0;
      registrationLabels.push(label);
    }

    // Process users
    let newUsersThisMonth = 0;
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    
    users.forEach(user => {
      const registrationDate = new Date(user.createdAt || user.registrationDate);
      
      // Monthly growth
      const monthKey = `${registrationDate.getFullYear()}-${String(registrationDate.getMonth() + 1).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(monthlyData, monthKey)) {
        monthlyData[monthKey]++;
      }

      // New users this month
      if (monthKey === currentMonth) {
        newUsersThisMonth++;
      }

      // Role distribution
      if (Object.prototype.hasOwnProperty.call(roleCounts, user.role)) {
        roleCounts[user.role]++;
      }

      // Registration trends (last 7 days)
      const dayKey = registrationDate.toISOString().split('T')[0];
      if (Object.prototype.hasOwnProperty.call(registrationData, dayKey)) {
        registrationData[dayKey]++;
      }
    });

    // Calculate active users (users with bookings in last 30 days)
    const thirtyDaysAgo = new Date(now);
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUserIds = new Set();
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt);
      if (bookingDate >= thirtyDaysAgo && booking.user?._id) {
        activeUserIds.add(booking.user._id);
      }
    });

    // User engagement (bookings per user)
    const userBookingCounts = {};
    bookings.forEach(booking => {
      if (booking.user?._id) {
        userBookingCounts[booking.user._id] = (userBookingCounts[booking.user._id] || 0) + 1;
      }
    });

    const engagementRanges = {
      '1 booking': 0,
      '2-3 bookings': 0,
      '4-5 bookings': 0,
      '6+ bookings': 0
    };

    Object.values(userBookingCounts).forEach(count => {
      if (count === 1) engagementRanges['1 booking']++;
      else if (count <= 3) engagementRanges['2-3 bookings']++;
      else if (count <= 5) engagementRanges['4-5 bookings']++;
      else engagementRanges['6+ bookings']++;
    });

    // Convert to cumulative growth
    const monthlyGrowth = [];
    let cumulativeUsers = 0;
    Object.values(monthlyData).forEach(monthlyCount => {
      cumulativeUsers += monthlyCount;
      monthlyGrowth.push(cumulativeUsers);
    });

    setUsersData({
      totalUsers: users.length,
      monthlyGrowth: { data: monthlyGrowth, labels: monthLabels },
      roleDistribution: Object.entries(roleCounts).map(([role, count]) => ({
        label: role.charAt(0).toUpperCase() + role.slice(1),
        value: count
      })),
      registrationTrends: { data: Object.values(registrationData), labels: registrationLabels },
      activeUsers: activeUserIds.size,
      newUsersThisMonth,
      userEngagement: Object.entries(engagementRanges).map(([range, count]) => ({
        label: range,
        value: count
      }))
    });
  };

  if (loading) {
    return (
      <div className="space-y-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6 animate-pulse">
            <div className="h-6 bg-gray-700 rounded mb-4 w-48"></div>
            <div className="h-48 bg-gray-700 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          {language === 'fr' ? 'Analyse des Utilisateurs' : 'Users Analytics'}
        </h2>
        <p className="text-gray-400">
          {language === 'fr' ? 'Croissance des utilisateurs et analyse d\'engagement' : 'User growth and engagement analysis'}
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">{numberFmt.format(usersData.totalUsers)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Total Utilisateurs' : 'Total Users'}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{numberFmt.format(usersData.activeUsers)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Utilisateurs Actifs' : 'Active Users'}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{numberFmt.format(usersData.newUsersThisMonth)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Nouveaux ce Mois' : 'New This Month'}</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">
              {usersData.totalUsers > 0 ? ((usersData.activeUsers / usersData.totalUsers) * 100).toFixed(1) : 0}%
            </div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Taux d\'Engagement' : 'Engagement Rate'}</div>
          </div>
        </div>
      </div>

      {/* User Growth Trend */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Croissance Cumulative des Utilisateurs' : 'Cumulative User Growth'}
        </h3>
        <div className="h-64">
          <AreaChart
            data={usersData.monthlyGrowth.data || []}
            labels={usersData.monthlyGrowth.labels || []}
            width={800}
            height={250}
            color="#10b981"
            fillColor="rgba(16, 185, 129, 0.2)"
            className="w-full"
          />
        </div>
      </div>

      {/* Role Distribution and Registration Trends */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Role Distribution */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Distribution par Rôle' : 'Role Distribution'}
          </h3>
          <div className="flex justify-center">
            <DonutChart
              data={usersData.roleDistribution.map(item => item.value)}
              labels={usersData.roleDistribution.map(item => item.label)}
              colors={['#06b6d4', '#8b5cf6']}
              size={280}
              strokeWidth={35}
            />
          </div>
        </div>

        {/* Registration Trends (Last 7 Days) */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Inscriptions (7 derniers jours)' : 'Registrations (Last 7 Days)'}
          </h3>
          <div className="h-64">
            <BarChart
              data={usersData.registrationTrends.data || []}
              labels={usersData.registrationTrends.labels || []}
              width={400}
              height={250}
              color="#f59e0b"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* User Engagement Analysis */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Analyse d\'Engagement des Utilisateurs' : 'User Engagement Analysis'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Engagement Distribution */}
          <div>
            <h4 className="text-lg font-medium text-gray-300 mb-3">
              {language === 'fr' ? 'Répartition par Nombre de Réservations' : 'Distribution by Booking Count'}
            </h4>
            <div className="space-y-3">
              {usersData.userEngagement.map((engagement, index) => {
                const totalEngagedUsers = usersData.userEngagement.reduce((sum, item) => sum + item.value, 0);
                const percentage = totalEngagedUsers > 0 
                  ? (engagement.value / totalEngagedUsers * 100).toFixed(1)
                  : 0;
                
                return (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-3 h-3 rounded-full bg-gradient-to-r from-purple-400 to-pink-500"></div>
                      <span className="text-white font-medium">{engagement.label}</span>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-32 bg-gray-700 rounded-full h-2">
                        <div 
                          className="bg-gradient-to-r from-purple-400 to-pink-500 h-2 rounded-full transition-all duration-500"
                          style={{ width: `${percentage}%` }}
                        ></div>
                      </div>
                      <div className="text-right min-w-20">
                        <div className="text-white font-semibold">{numberFmt.format(engagement.value)}</div>
                        <div className="text-xs text-gray-400">{percentage}%</div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div>
            <h4 className="text-lg font-medium text-gray-300 mb-3">
              {language === 'fr' ? 'Métriques d\'Engagement' : 'Engagement Metrics'}
            </h4>
            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-green-400">
                  {usersData.totalUsers > 0 ? ((usersData.activeUsers / usersData.totalUsers) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-sm text-gray-400">{language === 'fr' ? 'Utilisateurs Actifs (30j)' : 'Active Users (30d)'}</div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-blue-400">
                  {usersData.monthlyGrowth.data && usersData.monthlyGrowth.data.length >= 2 
                    ? Math.max(0, usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] - usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 2])
                    : 0
                  }
                </div>
                <div className="text-sm text-gray-400">{language === 'fr' ? 'Croissance Mensuelle' : 'Monthly Growth'}</div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4">
                <div className="text-2xl font-bold text-purple-400">
                  {usersData.userEngagement.reduce((sum, item) => sum + item.value, 0)}
                </div>
                <div className="text-sm text-gray-400">{language === 'fr' ? 'Utilisateurs avec Réservations' : 'Users with Bookings'}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAnalytics;
