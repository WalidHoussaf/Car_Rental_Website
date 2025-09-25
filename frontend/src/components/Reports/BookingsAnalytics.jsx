import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import BarChart from '../Charts/BarChart';
import DonutChart from '../Charts/DonutChart';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const BookingsAnalytics = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [bookingsData, setBookingsData] = useState({
    totalBookings: 0,
    monthlyBookings: [],
    statusDistribution: [],
    dailyBookings: [],
    locationBookings: [],
    recentTrends: []
  });

  const numberFmt = new Intl.NumberFormat('en-US');

  useEffect(() => {
    const fetchBookingsData = async () => {
      try {
        const response = await api.bookings.getAll({ limit: 1000 });
        if (response.success && response.data.bookings) {
          const bookings = response.data.bookings;
          processBookingsData(bookings);
        }
      } catch (error) {
        console.error('Failed to fetch bookings data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookingsData();
  }, []);

  const processBookingsData = (bookings) => {
    const now = new Date();
    
    // Monthly bookings from January to current month of current year
    const monthlyData = {};
    const monthLabels = [];
    
    // Start from January of current year
    const currentYear = now.getFullYear();
    const currentMonth = now.getMonth(); 
    
    for (let i = 0; i <= currentMonth; i++) {
      const date = new Date(currentYear, i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[key] = 0;
      monthLabels.push(label);
    }

    // Daily bookings for last 30 days
    const dailyData = {};
    const dailyLabels = [];
    
    for (let i = 29; i >= 0; i--) {
      const date = new Date(now);
      date.setDate(date.getDate() - i);
      const key = date.toISOString().split('T')[0];
      const label = date.getDate().toString();
      dailyData[key] = 0;
      dailyLabels.push(label);
    }

    const statusCounts = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    };

    const locationCounts = {};

    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt || booking.startDate);
      
      const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(monthlyData, monthKey)) {
        monthlyData[monthKey]++;
      }

      const dayKey = bookingDate.toISOString().split('T')[0];
      if (Object.prototype.hasOwnProperty.call(dailyData, dayKey)) {
        dailyData[dayKey]++;
      }

      if (Object.prototype.hasOwnProperty.call(statusCounts, booking.status)) {
        statusCounts[booking.status]++;
      }

      const location = booking.pickupLocation?.branch || booking.pickupLocation || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    const monthlyBookings = Object.values(monthlyData);
    const dailyBookings = Object.values(dailyData);
    
    const statusDistribution = Object.entries(statusCounts).map(([status, count]) => ({
      label: status.charAt(0).toUpperCase() + status.slice(1),
      value: count
    }));

    const locationBookings = Object.entries(locationCounts)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, count]) => ({
        label: location.charAt(0).toUpperCase() + location.slice(1).toLowerCase(),
        value: count
      }));

    setBookingsData({
      totalBookings: bookings.length,
      monthlyBookings: { data: monthlyBookings, labels: monthLabels },
      statusDistribution,
      dailyBookings: { data: dailyBookings, labels: dailyLabels },
      locationBookings,
      recentTrends: monthlyBookings.slice(-6) // Last 6 months for trends
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
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Bookings */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Total réservations' : 'Total bookings'}
              </span>
            </div>
            <div className="text-xs text-gray-500">YTD</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {numberFmt.format(bookingsData.totalBookings)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Réservations totales' : 'Total reservations'}
          </div>
        </div>

        {/* Monthly Average */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Moyenne mensuelle' : 'Monthly average'}
              </span>
            </div>
            <div className="text-xs text-gray-500">AVG</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {bookingsData.monthlyBookings.data ? Math.round(bookingsData.monthlyBookings.data.reduce((a, b) => a + b, 0) / bookingsData.monthlyBookings.data.length) : 0}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Par mois' : 'Per month'}
          </div>
        </div>

        {/* Daily Average */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Moyenne quotidienne' : 'Daily average'}
              </span>
            </div>
            <div className="text-xs text-gray-500">30D</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {bookingsData.dailyBookings.data ? Math.round(bookingsData.dailyBookings.data.reduce((a, b) => a + b, 0) / 30) : 0}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Par jour' : 'Per day'}
          </div>
        </div>
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Monthly Trend */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Tendance mensuelle' : 'Monthly trend'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Évolution des réservations par mois' : 'Booking evolution by month'}
              </p>
            </div>
            <div className="text-xs text-gray-500">
              {bookingsData.monthlyBookings.labels ? bookingsData.monthlyBookings.labels.length : 0} months
            </div>
          </div>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsAreaChart
                data={(() => {
                  if (!bookingsData.monthlyBookings.data || !bookingsData.monthlyBookings.labels) return [];
                  
                  return bookingsData.monthlyBookings.labels.map((label, index) => {
                    const currentValue = bookingsData.monthlyBookings.data[index] || 0;
                    const previousValue = index > 0 ? bookingsData.monthlyBookings.data[index - 1] || 0 : 0;
                    const monthlyGrowth = currentValue - previousValue;
                    
                    return {
                      month: label,
                      bookings: currentValue,
                      growth: monthlyGrowth,
                      percentage: bookingsData.monthlyBookings.data.length > 0 
                        ? ((currentValue / Math.max(...bookingsData.monthlyBookings.data)) * 100).toFixed(1)
                        : 0
                    };
                  });
                })()}
                margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
              >
                <defs>
                  <linearGradient id="bookingTrendGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.05}/>
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
                  content={({ active, payload, label }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload;
                      return (
                        <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                          <div className="text-cyan-400 font-semibold mb-2">{label}</div>
                          <div className="space-y-1">
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-gray-300 text-sm">
                                {language === 'fr' ? 'Total réservations:' : 'Total bookings:'}
                              </span>
                              <span className="text-white font-bold">
                                {numberFmt.format(data.bookings)}
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
                                {language === 'fr' ? 'Performance relative:' : 'Relative performance:'}
                              </span>
                              <span className="text-cyan-400 font-bold">
                                {data.percentage}%
                              </span>
                            </div>
                            <div className="flex justify-between items-center gap-4">
                              <span className="text-gray-300 text-sm">
                                {language === 'fr' ? 'Statut:' : 'Status:'}
                              </span>
                              <span className={`font-bold text-xs px-2 py-1 rounded ${
                                data.growth > 0 ? 'bg-green-500/20 text-green-400' :
                                data.growth === 0 ? 'bg-yellow-500/20 text-yellow-400' :
                                'bg-red-500/20 text-red-400'
                              }`}>
                                {data.growth > 0 ? (language === 'fr' ? 'Croissance' : 'Growing') :
                                 data.growth === 0 ? (language === 'fr' ? 'Stable' : 'Stable') :
                                 (language === 'fr' ? 'Déclin' : 'Declining')}
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
                  dataKey="bookings"
                  stroke="#06b6d4"
                  strokeWidth={3}
                  fill="url(#bookingTrendGradient)"
                  dot={{
                    fill: '#06b6d4',
                    strokeWidth: 2,
                    stroke: '#FFFFFF',
                    r: 4
                  }}
                  activeDot={{
                    r: 6,
                    fill: '#06b6d4',
                    stroke: '#FFFFFF',
                    strokeWidth: 2
                  }}
                />
              </RechartsAreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Status Distribution */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Distribution par statut' : 'Status distribution'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Répartition des réservations' : 'Booking status breakdown'}
              </p>
            </div>
          </div>
          <div className="h-64 flex justify-center items-center">
            <DonutChart
              data={bookingsData.statusDistribution.map(item => item.value)}
              labels={bookingsData.statusDistribution.map(item => item.label)}
              colors={['#8F5300', '#101D42', '#285943', '#2E1F47', '#6E0C18']}
              size={280}
              strokeWidth={35}
            />
          </div>
        </div>
      </div>

      {/* Third Row - Detailed Analytics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Bookings */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
          <div className="h-96">
            <BarChart
              data={bookingsData.dailyBookings.data || []}
              labels={bookingsData.dailyBookings.labels || []}
              height={380}
              title={language === 'fr' ? 'Activité quotidienne' : 'Daily activity'}
              subtitle={language === 'fr' ? 'Réservations des 30 derniers jours' : 'Bookings over last 30 days'}
              className="w-full"
            />
          </div>
        </div>

        {/* Location Performance */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {language === 'fr' ? 'Performance par lieu' : 'Location performance'}
              </h3>
              <p className="text-gray-400 text-sm">
                {language === 'fr' ? 'Top 5 des lieux de prise en charge' : 'Top 5 pickup locations'}
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
              TOP 5
            </div>
          </div>

          {/* Location Stats Overview */}
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-1">Most Popular</div>
              <div className="text-cyan-400 font-bold text-sm truncate">
                {bookingsData.locationBookings[0]?.label || 'N/A'}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {bookingsData.locationBookings[0]?.value || 0} bookings
              </div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-1">Total Locations</div>
              <div className="text-blue-400 font-bold text-sm">
                {bookingsData.locationBookings.length}
              </div>
              <div className="text-xs text-gray-500 mt-1">Active offices</div>
            </div>
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-1">Coverage</div>
              <div className="text-green-400 font-bold text-sm">
                {bookingsData.locationBookings.length > 0 ? '100%' : '0%'}
              </div>
              <div className="text-xs text-gray-500 mt-1">Availability</div>
            </div>
          </div>

          {/* Enhanced Location List */}
          <div className="space-y-4">
            {bookingsData.locationBookings.slice(0, 5).map((location, index) => {
              const percentage = bookingsData.totalBookings > 0 
                ? (location.value / bookingsData.totalBookings * 100).toFixed(1)
                : 0;
              
              const isTop = index === 0;
              const isSecond = index === 1;
              const isThird = index === 2;
              
              // SVG Icons
              const GoldMedalIcon = () => (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" fill="#fbbf24" stroke="#f59e0b" strokeWidth="2"/>
                  <text x="12" y="16" textAnchor="middle" className="text-xs font-bold fill-yellow-900">1</text>
                </svg>
              );

              const SilverMedalIcon = () => (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" fill="#d1d5db" stroke="#9ca3af" strokeWidth="2"/>
                  <text x="12" y="16" textAnchor="middle" className="text-xs font-bold fill-gray-700">2</text>
                </svg>
              );

              const BronzeMedalIcon = () => (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none">
                  <circle cx="12" cy="12" r="8" fill="#f97316" stroke="#ea580c" strokeWidth="2"/>
                  <text x="12" y="16" textAnchor="middle" className="text-xs font-bold fill-orange-900">3</text>
                </svg>
              );

              const LocationIcon = () => (
                <svg className="w-5 h-5" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg">
                  <path d="M309.2 584.776h105.5l-49 153.2H225.8c-7.3 0-13.3-6-13.3-13.3 0-2.6 0.8-5.1 2.2-7.3l83.4-126.7c2.5-3.6 6.7-5.9 11.1-5.9z" fill="#FFFFFF" />
                  <path d="M404.5 791.276H225.8c-36.7 0-66.5-29.8-66.5-66.5 0-13 3.8-25.7 11-36.6l83.4-126.7c12.3-18.7 33.1-29.9 55.5-29.9h178.4l-83.1 259.7z m-95.3-206.5c-4.5 0-8.6 2.2-11.1 6l-83.4 126.7c-1.4 2.2-2.2 4.7-2.2 7.3 0 7.3 6 13.3 13.3 13.3h139.9l49-153.2H309.2z" fill="#333333" />
                  <path d="M454.6 584.776h109.6l25.3 153.3H429.3z" fill="#FFFFFF" />
                  <path d="M652.2 791.276H366.6l42.8-259.6h200l42.8 259.6z m-222.9-53.2h160.2l-25.3-153.3H454.6l-25.3 153.3z" fill="#333333" />
                  <path d="M618.6 584.776h105.5c4.5 0 8.6 2.2 11.1 6l83.5 126.7c4 6.1 2.3 14.4-3.8 18.4-2.2 1.4-4.7 2.2-7.3 2.2H667.7l-49.1-153.3z" fill="#FFFFFF" />
                  <path d="M807.6 791.276H628.9l-83.1-259.7h178.4c22.4 0 43.2 11.2 55.5 29.9l83.4 126.7c9.8 14.8 13.2 32.6 9.6 50s-13.7 32.3-28.6 42.1c-10.8 7.2-23.5 11-36.5 11z m-139.9-53.2h139.9c2.6 0 5.1-0.8 7.3-2.2 4-2.6 5.3-6.4 5.7-8.4 0.4-2 0.7-6-1.9-10l-83.4-126.6c-2.5-3.8-6.6-6-11.1-6H618.6l49.1 153.2z" fill="#333333" />
                  <path d="M534.1 639.7C652.5 537.4 711.7 445.8 711.7 365c0-127-102.7-212.1-195-212.1s-195 85.1-195 212.1c0 80.8 59.2 172.3 177.7 274.7 9.9 8.6 24.7 8.6 34.7 0z" fill="#8CAAFF" />
                  <path d="M516.7 672.7c-12.5 0-24.9-4.3-34.8-12.9C356.2 551.2 295.1 454.7 295.1 365c0-142.8 114.6-238.7 221.6-238.7S738.3 222.2 738.3 365c0 89.7-61.1 186.2-186.9 294.8-9.8 8.6-22.3 12.9-34.7 12.9z m0-493.2c-79.7 0-168.4 76.2-168.4 185.5 0 72.3 56.7 158 168.4 254.6C628.5 523 685.1 437.3 685.1 365c0-109.3-88.7-185.5-168.4-185.5z" fill="#333333" />
                  <path d="M516.7 348m-97.5 0a97.5 97.5 0 1 0 195 0 97.5 97.5 0 1 0-195 0Z" fill="#FFFFFF" />
                  <path d="M516.7 472.1c-68.4 0-124.1-55.7-124.1-124.1s55.7-124.1 124.1-124.1S640.8 279.5 640.8 348 585.1 472.1 516.7 472.1z m0-195.1c-39.1 0-70.9 31.8-70.9 70.9 0 39.1 31.8 70.9 70.9 70.9s70.9-31.8 70.9-70.9c0-39.1-31.8-70.9-70.9-70.9z" fill="#333333" />
                </svg>
              );

              // Get ranking colors and icons
              const getRankingStyle = () => {
                if (isTop) return { 
                  bg: 'bg-gradient-to-r from-yellow-500/20 to-orange-500/20', 
                  border: 'border-yellow-500/30',
                  icon: <GoldMedalIcon />,
                  color: 'text-yellow-400'
                };
                if (isSecond) return { 
                  bg: 'bg-gradient-to-r from-gray-400/20 to-gray-500/20', 
                  border: 'border-gray-400/30',
                  icon: <SilverMedalIcon />,
                  color: 'text-gray-300'
                };
                if (isThird) return { 
                  bg: 'bg-gradient-to-r from-orange-600/20 to-orange-700/20', 
                  border: 'border-orange-600/30',
                  icon: <BronzeMedalIcon />,
                  color: 'text-orange-400'
                };
                return { 
                  bg: 'bg-gray-800/30', 
                  border: 'border-gray-700/30',
                  icon: <LocationIcon />,
                  color: 'text-gray-400'
                };
              };

              const style = getRankingStyle();
              
              return (
                <div 
                  key={index} 
                  className={`${style.bg} ${style.border} border rounded-lg p-4 hover:scale-[1.02] transition-all duration-300 cursor-pointer group`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 flex-1">
                      {/* Rank and Icon */}
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0">{style.icon}</div>
                        <div className={`text-xs font-bold ${style.color} w-6 text-center`}>
                          #{index + 1}
                        </div>
                      </div>
                      
                      {/* Location Info */}
                      <div className="flex-1">
                        <div className="text-white font-medium text-sm group-hover:text-cyan-400 transition-colors">
                          {location.label}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {percentage}% of total bookings
                        </div>
                      </div>
                    </div>
                    
                    {/* Performance Metrics */}
                    <div className="flex items-center gap-4">
                      {/* Progress Bar */}
                      <div className="w-24 bg-gray-700/50 rounded-full h-2 overflow-hidden">
                        <div 
                          className={`h-2 rounded-full transition-all duration-1000 ${
                            isTop ? 'bg-gradient-to-r from-yellow-400 to-orange-500' :
                            isSecond ? 'bg-gradient-to-r from-gray-400 to-gray-500' :
                            isThird ? 'bg-gradient-to-r from-orange-500 to-orange-600' :
                            'bg-gradient-to-r from-cyan-400 to-blue-500'
                          }`}
                          style={{ width: `${Math.min(percentage * 2, 100)}%` }}
                        ></div>
                      </div>
                      
                      {/* Booking Count */}
                      <div className="text-right min-w-16">
                        <div className={`text-lg font-bold ${style.color}`}>
                          {location.value}
                        </div>
                        <div className="text-xs text-gray-500">bookings</div>
                      </div>
                      
                      {/* Performance Indicator */}
                      <div className="text-right min-w-12">
                        <div className="flex justify-center">
                          {percentage >= 30 ? (
                            <svg className="w-4 h-4 text-red-400" viewBox="0 0 24 24" fill="currentColor">
                              <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-2 15l-5-5 1.41-1.41L10 14.17l7.59-7.59L19 8l-9 9z"/>
                            </svg>
                          ) : percentage >= 20 ? (
                            <svg className="w-4 h-4 text-green-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                              <polyline points="17 6 23 6 23 12"/>
                            </svg>
                          ) : percentage >= 10 ? (
                            <svg className="w-4 h-4 text-blue-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <line x1="18" y1="20" x2="18" y2="10"/>
                              <line x1="12" y1="20" x2="12" y2="4"/>
                              <line x1="6" y1="20" x2="6" y2="14"/>
                            </svg>
                          ) : (
                            <svg className="w-4 h-4 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                              <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"/>
                              <polyline points="17 18 23 18 23 12"/>
                            </svg>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Additional Info for Top 3 */}
                  {index < 3 && (
                    <div className="mt-3 pt-3 border-t border-gray-700/30">
                      <div className="flex items-center justify-between text-xs">
                        <div className="flex items-center gap-4">
                          <span className="text-gray-400">
                            Market Share: <span className={style.color}>{percentage}%</span>
                          </span>
                          <span className="text-gray-400">
                            Status: <span className="text-green-400">Active</span>
                          </span>
                        </div>
                        <div className="text-gray-500">
                          {location.value > 10 ? 'High Volume' : location.value > 5 ? 'Medium Volume' : 'Low Volume'}
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Performance Summary */}
          <div className="mt-6 p-4 bg-gray-800/30 rounded-lg border border-gray-700/30">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex-shrink-0">
                  <svg className="w-8 h-8 text-cyan-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="18" y1="20" x2="18" y2="10"/>
                    <line x1="12" y1="20" x2="12" y2="4"/>
                    <line x1="6" y1="20" x2="6" y2="14"/>
                  </svg>
                </div>
                <div>
                  <div className="text-sm text-white font-medium">Performance Summary</div>
                  <div className="text-xs text-gray-400">Location distribution analysis</div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm text-cyan-400 font-bold">
                  {bookingsData.locationBookings.length > 0 ? 
                    `${((bookingsData.locationBookings[0]?.value || 0) / bookingsData.totalBookings * 100).toFixed(1)}%` : 
                    '0%'
                  }
                </div>
                <div className="text-xs text-gray-500">Top location share</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsAnalytics;
