import React, { useState, useEffect, useCallback } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import BarChart from '../Charts/BarChart';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

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

  const processUsersData = useCallback((users, bookings) => {
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
      roleDistribution: [
        {
          label: language === 'fr' ? 'Utilisateurs actifs' : 'Active users',
          value: activeUserIds.size,
          color: '#10b981'
        },
        {
          label: language === 'fr' ? 'Utilisateurs inactifs' : 'Inactive users', 
          value: users.length - activeUserIds.size,
          color: '#6b7280'
        }
      ],
      registrationTrends: { data: Object.values(registrationData), labels: registrationLabels },
      activeUsers: activeUserIds.size,
      newUsersThisMonth,
      userEngagement: Object.entries(engagementRanges).map(([range, count]) => ({
        label: range,
        value: count
      }))
    });
  }, [language]); // Dependencies: language is used in the function

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
  }, [processUsersData]); // Now includes processUsersData in dependencies

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
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Users */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Total utilisateurs' : 'Total users'}
              </span>
            </div>
            <div className="text-xs text-gray-500">ALL</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {numberFmt.format(usersData.totalUsers)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Utilisateurs enregistrés' : 'Registered users'}
          </div>
        </div>

        {/* Active Users */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Utilisateurs actifs' : 'Active users'}
              </span>
            </div>
            <div className="text-xs text-gray-500">30D</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {numberFmt.format(usersData.activeUsers)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Avec réservations' : 'With bookings'}
          </div>
        </div>

        {/* New This Month */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Nouveaux ce mois' : 'New this month'}
              </span>
            </div>
            <div className="text-xs text-gray-500">MTD</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {numberFmt.format(usersData.newUsersThisMonth)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Nouvelles inscriptions' : 'New registrations'}
          </div>
        </div>

        {/* Engagement Rate */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Taux d\'engagement' : 'Engagement rate'}
              </span>
            </div>
            <div className="text-xs text-gray-500">%</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {usersData.totalUsers > 0 ? ((usersData.activeUsers / usersData.totalUsers) * 100).toFixed(1) : 0}%
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Utilisateurs engagés' : 'Engaged users'}
          </div>
        </div>
      </div>

      {/* User Growth Trend */}
      <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              {language === 'fr' ? 'Croissance cumulative des utilisateurs' : 'Cumulative user growth'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'fr' ? 'Évolution détaillée et tendances de croissance' : 'Detailed evolution and growth trends'}
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
            {usersData.monthlyGrowth.labels ? usersData.monthlyGrowth.labels.length : 0} MONTHS
          </div>
        </div>

        {/* Growth Statistics Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Total Growth</div>
            <div className="text-green-400 font-bold text-lg">
              {usersData.monthlyGrowth.data && usersData.monthlyGrowth.data.length > 0 
                ? numberFmt.format(usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1])
                : 0
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">Users registered</div>
          </div>
          
          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Avg Monthly</div>
            <div className="text-blue-400 font-bold text-lg">
              {usersData.monthlyGrowth.data && usersData.monthlyGrowth.data.length > 1
                ? Math.round(usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] / usersData.monthlyGrowth.data.length)
                : 0
              }
            </div>
            <div className="text-xs text-gray-500 mt-1">Users per month</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Best Month</div>
            <div className="text-cyan-400 font-bold text-lg">
              {(() => {
                if (!usersData.monthlyGrowth.data || usersData.monthlyGrowth.data.length < 2) return 0;
                let maxGrowth = 0;
                for (let i = 1; i < usersData.monthlyGrowth.data.length; i++) {
                  const growth = usersData.monthlyGrowth.data[i] - usersData.monthlyGrowth.data[i - 1];
                  if (growth > maxGrowth) maxGrowth = growth;
                }
                return maxGrowth;
              })()}
            </div>
            <div className="text-xs text-gray-500 mt-1">New users</div>
          </div>

          <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
            <div className="text-xs text-gray-400 mb-1">Growth Rate</div>
            <div className="text-purple-400 font-bold text-lg">
              {(() => {
                if (!usersData.monthlyGrowth.data || usersData.monthlyGrowth.data.length < 2) return '0%';
                const firstMonth = usersData.monthlyGrowth.data[0] || 1;
                const lastMonth = usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1];
                const growthRate = ((lastMonth - firstMonth) / firstMonth * 100);
                return `${growthRate > 0 ? '+' : ''}${growthRate.toFixed(1)}%`;
              })()}
            </div>
            <div className="text-xs text-gray-500 mt-1">Total increase</div>
          </div>
        </div>

        {/* Enhanced Recharts Area Chart */}
        <div className="h-80 mb-4">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={(() => {
                if (!usersData.monthlyGrowth.data || !usersData.monthlyGrowth.labels) return [];
                
                return usersData.monthlyGrowth.labels.map((label, index) => {
                  const currentValue = usersData.monthlyGrowth.data[index] || 0;
                  const previousValue = index > 0 ? usersData.monthlyGrowth.data[index - 1] || 0 : 0;
                  const monthlyGrowth = currentValue - previousValue;
                  
                  return {
                    month: label,
                    users: currentValue,
                    growth: monthlyGrowth,
                    percentage: usersData.monthlyGrowth.data.length > 0 
                      ? ((currentValue / Math.max(...usersData.monthlyGrowth.data)) * 100).toFixed(1)
                      : 0
                  };
                });
              })()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="userGrowthGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#10b981" stopOpacity={0.05}/>
                </linearGradient>
              </defs>
              
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#374151" 
                strokeOpacity={0.3}
              />
              
              <XAxis 
                dataKey="month" 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#9CA3AF',
                  fontWeight: 500
                }}
                dy={10}
              />
              
              <YAxis 
                axisLine={false}
                tickLine={false}
                tick={{ 
                  fontSize: 12, 
                  fill: '#FFFFFF',
                  fontWeight: 600
                }}
                tickFormatter={(value) => numberFmt.format(value)}
                width={60}
              />
              
              <Tooltip
                contentStyle={{
                  backgroundColor: '#1F2937',
                  border: '1px solid #374151',
                  borderRadius: '8px',
                  boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
                  color: '#FFFFFF'
                }}
                labelStyle={{ 
                  color: '#10B981',
                  fontWeight: 600,
                  marginBottom: '8px'
                }}
                formatter={(value, name) => {
                  if (name === 'users') {
                    return [
                      <span style={{ color: '#10B981', fontWeight: 600 }}>
                        {numberFmt.format(value)} {language === 'fr' ? 'utilisateurs' : 'users'}
                      </span>,
                      language === 'fr' ? 'Total cumulé' : 'Cumulative total'
                    ];
                  }
                  return [value, name];
                }}
                labelFormatter={(label) => `${label}`}
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const data = payload[0].payload;
                    return (
                      <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                        <div className="text-green-400 font-semibold mb-2">{label}</div>
                        <div className="space-y-1">
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-300 text-sm">
                              {language === 'fr' ? 'Total cumulé:' : 'Cumulative total:'}
                            </span>
                            <span className="text-white font-bold">
                              {numberFmt.format(data.users)}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-300 text-sm">
                              {language === 'fr' ? 'Croissance mensuelle:' : 'Monthly growth:'}
                            </span>
                            <span className={`font-bold ${data.growth >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                              {data.growth >= 0 ? '+' : ''}{data.growth}
                            </span>
                          </div>
                          <div className="flex justify-between items-center gap-4">
                            <span className="text-gray-300 text-sm">
                              {language === 'fr' ? 'Pourcentage du total:' : 'Percentage of total:'}
                            </span>
                            <span className="text-cyan-400 font-bold">
                              {data.percentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              
              <Area
                type="monotone"
                dataKey="users"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#userGrowthGradient)"
                dot={{
                  fill: '#10b981',
                  strokeWidth: 2,
                  stroke: '#FFFFFF',
                  r: 4
                }}
                activeDot={{
                  r: 6,
                  fill: '#10b981',
                  stroke: '#FFFFFF',
                  strokeWidth: 2
                }}
              />
            </RechartsAreaChart>
          </ResponsiveContainer>
        </div>

        {/* Monthly Breakdown */}
        <div className="border-t border-gray-700/30 pt-4">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-white font-medium text-sm">
              {language === 'fr' ? 'Répartition mensuelle détaillée' : 'Detailed monthly breakdown'}
            </h4>
            <div className="text-xs text-gray-500">
              {language === 'fr' ? 'Croissance par période' : 'Growth by period'}
            </div>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
            {usersData.monthlyGrowth.labels && usersData.monthlyGrowth.data && 
             usersData.monthlyGrowth.labels.slice(-6).map((label, index) => {
               const dataIndex = usersData.monthlyGrowth.data.length - 6 + index;
               const currentValue = usersData.monthlyGrowth.data[dataIndex] || 0;
               const previousValue = dataIndex > 0 ? usersData.monthlyGrowth.data[dataIndex - 1] || 0 : 0;
               const monthlyGrowth = currentValue - previousValue;
               const totalUsers = usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] || 1;
               const percentage = ((currentValue / totalUsers) * 100).toFixed(1);
               
               return (
                 <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/20">
                   <div className="text-xs text-gray-400 mb-1">{label}</div>
                   <div className="text-white font-bold text-sm mb-1">
                     {numberFmt.format(currentValue)}
                   </div>
                   <div className="flex items-center justify-between">
                     <div className="text-xs text-green-400">
                       +{monthlyGrowth}
                     </div>
                     <div className="text-xs text-gray-500">
                       {percentage}%
                     </div>
                   </div>
                   
                   {/* Mini progress bar */}
                   <div className="w-full bg-gray-700/50 rounded-full h-1 mt-2">
                     <div 
                       className="bg-gradient-to-r from-green-400 to-emerald-500 h-1 rounded-full transition-all duration-1000"
                       style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                     ></div>
                   </div>
                 </div>
               );
             })
            }
          </div>
        </div>

        {/* Growth Insights */}
        <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                  <polyline points="17 6 23 6 23 12"/>
                </svg>
              </div>
              <div>
                <div className="text-sm text-white font-medium">Growth Insights</div>
                <div className="text-xs text-gray-400">
                  {(() => {
                    if (!usersData.monthlyGrowth.data || usersData.monthlyGrowth.data.length < 2) {
                      return language === 'fr' ? 'Données insuffisantes' : 'Insufficient data';
                    }
                    
                    const recentGrowth = usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] - 
                                       usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 2];
                    
                    if (recentGrowth > 0) {
                      return language === 'fr' 
                        ? `Croissance positive de ${recentGrowth} utilisateurs ce mois`
                        : `Positive growth of ${recentGrowth} users this month`;
                    } else if (recentGrowth === 0) {
                      return language === 'fr' 
                        ? 'Croissance stable ce mois'
                        : 'Stable growth this month';
                    } else {
                      return language === 'fr' 
                        ? 'Période de consolidation'
                        : 'Consolidation period';
                    }
                  })()}
                </div>
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-green-400 font-bold">
                {usersData.monthlyGrowth.data && usersData.monthlyGrowth.data.length >= 2
                  ? `${usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] - usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 2] >= 0 ? '+' : ''}${usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] - usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 2]}`
                  : '0'
                }
              </div>
              <div className="text-xs text-gray-500">This month</div>
            </div>
          </div>
        </div>
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* User Activity Distribution */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Activité des utilisateurs' : 'User activity'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Répartition utilisateurs actifs vs inactifs' : 'Active vs inactive user breakdown'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-80 h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={usersData.roleDistribution}
                    cx="50%"
                    cy="50%"
                    outerRadius={120}
                    dataKey="value"
                    label={({ value }) => {
                      const total = usersData.roleDistribution.reduce((sum, item) => sum + item.value, 0);
                      const percentage = total > 0 ? ((value / total) * 100).toFixed(0) : 0;
                      return `${percentage}%`;
                    }}
                    labelLine={false}
                  >
                    {usersData.roleDistribution.map((entry, index) => (
                      <Cell 
                        key={`cell-${index}`} 
                        fill={entry.color}
                        stroke="#1F2937"
                        strokeWidth={2}
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                            <div className="text-white font-semibold">
                              {numberFmt.format(data.value)} {data.label.toLowerCase()}
                            </div>
                          </div>
                        );
                      }
                      return null;
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
          
          {/* Legend below chart */}
          <div className="mt-6 flex justify-center">
            <div className="flex items-center gap-8">
              {usersData.roleDistribution.map((item, index) => {
                const total = usersData.roleDistribution.reduce((sum, role) => sum + role.value, 0);
                const percentage = total > 0 ? ((item.value / total) * 100).toFixed(1) : 0;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <div className="text-center">
                      <div className="text-white font-medium text-sm">
                        {item.label}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {numberFmt.format(item.value)} ({percentage}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Registration Trends (Last 7 Days) */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
          <div className="h-[500px]">
            <BarChart
              data={usersData.registrationTrends.data || []}
              labels={usersData.registrationTrends.labels || []}
              height={380}
              title={language === 'fr' ? 'Inscriptions récentes' : 'Recent registrations'}
              subtitle={language === 'fr' ? 'Nouvelles inscriptions des 7 derniers jours' : 'New registrations over last 7 days'}
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Third Row - User Engagement Analysis */}
      <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              {language === 'fr' ? 'Analyse d\'engagement' : 'Engagement analysis'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'fr' ? 'Comportement et activité des utilisateurs' : 'User behavior and activity patterns'}
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
            INSIGHTS
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Engagement Distribution */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                  <circle cx="9" cy="7" r="4"/>
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                  <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium text-base">
                  {language === 'fr' ? 'Répartition par activité' : 'Activity distribution'}
                </h4>
                <p className="text-xs text-gray-400">
                  {language === 'fr' ? 'Nombre de réservations par utilisateur' : 'Bookings per user breakdown'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {usersData.userEngagement.map((engagement, index) => {
                const totalEngagedUsers = usersData.userEngagement.reduce((sum, item) => sum + item.value, 0);
                const percentage = totalEngagedUsers > 0 
                  ? (engagement.value / totalEngagedUsers * 100).toFixed(1)
                  : 0;
                
                // SVG Icons for engagement levels
                const HighEngagementIcon = () => (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/>
                  </svg>
                );

                const MediumHighIcon = () => (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                    <polyline points="17 6 23 6 23 12"/>
                  </svg>
                );

                const MediumIcon = () => (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                );

                const LowIcon = () => (
                  <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
                    <circle cx="12" cy="7" r="4"/>
                  </svg>
                );

                // Get engagement level styling
                const getEngagementStyle = () => {
                  if (engagement.label.includes('6+')) return {
                    bg: 'bg-gradient-to-r from-green-500/20 to-emerald-500/20',
                    border: 'border-green-500/30',
                    color: 'text-green-400',
                    icon: <HighEngagementIcon />
                  };
                  if (engagement.label.includes('4-5')) return {
                    bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
                    border: 'border-blue-500/30',
                    color: 'text-blue-400',
                    icon: <MediumHighIcon />
                  };
                  if (engagement.label.includes('2-3')) return {
                    bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20',
                    border: 'border-yellow-500/30',
                    color: 'text-yellow-400',
                    icon: <MediumIcon />
                  };
                  return {
                    bg: 'bg-gradient-to-r from-gray-500/20 to-gray-600/20',
                    border: 'border-gray-500/30',
                    color: 'text-gray-400',
                    icon: <LowIcon />
                  };
                };

                const style = getEngagementStyle();
                
                return (
                  <div 
                    key={index} 
                    className={`${style.bg} ${style.border} border rounded-lg p-4 hover:scale-[1.02] transition-all duration-300`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3 flex-1">
                        <div className={`flex-shrink-0 ${style.color}`}>{style.icon}</div>
                        <div className="flex-1">
                          <div className="text-white font-medium text-sm">
                            {engagement.label}
                          </div>
                          <div className="text-xs text-gray-400 mt-1">
                            {percentage}% of engaged users
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-4">
                        <div className="w-20 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                          <div 
                            className="h-2 rounded-full transition-all duration-1000 bg-gradient-to-r from-purple-400 to-pink-500"
                            style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                          ></div>
                        </div>
                        
                        <div className="text-right min-w-12">
                          <div className={`text-lg font-bold ${style.color}`}>
                            {engagement.value}
                          </div>
                          <div className="text-xs text-gray-500">users</div>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Engagement Metrics */}
          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="flex-shrink-0">
                <svg className="w-6 h-6 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <line x1="18" y1="20" x2="18" y2="10"/>
                  <line x1="12" y1="20" x2="12" y2="4"/>
                  <line x1="6" y1="20" x2="6" y2="14"/>
                </svg>
              </div>
              <div>
                <h4 className="text-white font-medium text-base">
                  {language === 'fr' ? 'Métriques clés' : 'Key metrics'}
                </h4>
                <p className="text-xs text-gray-400">
                  {language === 'fr' ? 'Indicateurs de performance' : 'Performance indicators'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">
                      {language === 'fr' ? 'Taux d\'activité' : 'Activity rate'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">30D</div>
                </div>
                <div className="text-2xl font-bold text-green-400">
                  {usersData.totalUsers > 0 ? ((usersData.activeUsers / usersData.totalUsers) * 100).toFixed(1) : 0}%
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {language === 'fr' ? 'Utilisateurs actifs' : 'Active users'}
                </div>
              </div>
              
              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">
                      {language === 'fr' ? 'Croissance' : 'Growth'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">MTD</div>
                </div>
                <div className="text-2xl font-bold text-blue-400">
                  {usersData.monthlyGrowth.data && usersData.monthlyGrowth.data.length >= 2 
                    ? Math.max(0, usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 1] - usersData.monthlyGrowth.data[usersData.monthlyGrowth.data.length - 2])
                    : 0
                  }
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {language === 'fr' ? 'Nouveaux utilisateurs' : 'New users'}
                </div>
              </div>

              <div className="bg-gray-800/50 rounded-lg p-4 border border-gray-700/30">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
                    <span className="text-gray-300 text-sm">
                      {language === 'fr' ? 'Utilisateurs engagés' : 'Engaged users'}
                    </span>
                  </div>
                  <div className="text-xs text-gray-500">ALL</div>
                </div>
                <div className="text-2xl font-bold text-purple-400">
                  {usersData.userEngagement.reduce((sum, item) => sum + item.value, 0)}
                </div>
                <div className="text-xs text-gray-400 mt-1">
                  {language === 'fr' ? 'Avec réservations' : 'With bookings'}
                </div>
              </div>
            </div>

            {/* Engagement Summary */}
            <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="flex-shrink-0">
                    <svg className="w-8 h-8 text-purple-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
                      <circle cx="9" cy="7" r="4"/>
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
                      <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
                    </svg>
                  </div>
                  <div>
                    <div className="text-sm text-white font-medium">Engagement Summary</div>
                    <div className="text-xs text-gray-400">User activity overview</div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-sm text-cyan-400 font-bold">
                    {usersData.userEngagement.length > 0 && usersData.userEngagement.reduce((sum, item) => sum + item.value, 0) > 0 ? 
                      `${((usersData.userEngagement.reduce((sum, item) => sum + item.value, 0) / usersData.totalUsers) * 100).toFixed(1)}%` : 
                      '0%'
                    }
                  </div>
                  <div className="text-xs text-gray-500">Users with activity</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UsersAnalytics;
