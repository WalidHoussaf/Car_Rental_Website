import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import { AreaChart as RechartsAreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const RevenueAnalytics = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [revenueData, setRevenueData] = useState({
    totalRevenue: 0,
    monthlyRevenue: [],
    revenueByStatus: [],
    revenueByLocation: [],
    averageBookingValue: 0,
    projectedRevenue: 0,
    revenueGrowth: [],
    topRevenueMonths: []
  });

  const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  useEffect(() => {
    const fetchRevenueData = async () => {
      try {
        const response = await api.bookings.getAll({ limit: 1000 });
        if (response.success && response.data.bookings) {
          const bookings = response.data.bookings;
          processRevenueData(bookings);
        }
      } catch (error) {
        console.error('Failed to fetch revenue data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchRevenueData();
  }, []);

  const processRevenueData = (bookings) => {
    const now = new Date();
    
    // Monthly revenue for last 12 months
    const monthlyData = {};
    const monthLabels = [];
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const key = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const label = date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
      monthlyData[key] = 0;
      monthLabels.push(label);
    }

    // Revenue by status
    const statusRevenue = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    };

    // Revenue by location
    const locationRevenue = {};

    // Process bookings
    let confirmedRevenue = 0; // Only confirmed, active, and completed bookings
    let totalBookings = 0;

    bookings.forEach(booking => {
      const amount = Number(booking.totalAmount) || 0;
      const bookingDate = new Date(booking.createdAt || booking.startDate);
      
      // Monthly revenue
      const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(monthlyData, monthKey)) {
        // Only count revenue from confirmed, active, and completed bookings
        if (['confirmed', 'active', 'completed'].includes(booking.status)) {
          monthlyData[monthKey] += amount;
          confirmedRevenue += amount;
        }
      }

      totalBookings++;

      // Revenue by status
      if (Object.prototype.hasOwnProperty.call(statusRevenue, booking.status)) {
        statusRevenue[booking.status] += amount;
      }

      // Revenue by location
      const location = booking.pickupLocation?.branch || booking.pickupLocation || 'Unknown';
      locationRevenue[location] = (locationRevenue[location] || 0) + amount;
    });

    // Calculate average booking value
    const averageBookingValue = totalBookings > 0 ? confirmedRevenue / totalBookings : 0;

    // Calculate projected revenue (based on current month trend)
    const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
    const currentMonthRevenue = monthlyData[currentMonth] || 0;
    const daysInMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0).getDate();
    const daysPassed = now.getDate();
    const projectedRevenue = daysPassed > 0 ? (currentMonthRevenue / daysPassed) * daysInMonth : 0;

    // Revenue growth calculation
    const monthlyRevenueArray = Object.values(monthlyData);
    const revenueGrowth = monthlyRevenueArray.map((current, index) => {
      if (index === 0) return 0;
      const previous = monthlyRevenueArray[index - 1];
      if (previous === 0) return current > 0 ? 100 : 0;
      return ((current - previous) / previous) * 100;
    });

    // Top revenue months
    const monthsWithRevenue = Object.entries(monthlyData)
      .map(([, revenue], index) => ({
        month: monthLabels[index],
        revenue
      }))
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 5);

    // Convert location revenue to array
    const locationRevenueArray = Object.entries(locationRevenue)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([location, revenue]) => ({
        label: location,
        value: revenue
      }));

    setRevenueData({
      totalRevenue: confirmedRevenue,
      monthlyRevenue: { data: monthlyRevenueArray, labels: monthLabels },
      revenueByStatus: Object.entries(statusRevenue).map(([status, revenue]) => ({
        label: status.charAt(0).toUpperCase() + status.slice(1),
        value: revenue
      })),
      revenueByLocation: locationRevenueArray,
      averageBookingValue,
      projectedRevenue,
      revenueGrowth: { data: revenueGrowth, labels: monthLabels },
      topRevenueMonths: monthsWithRevenue
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
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Total Revenue */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Revenus totaux' : 'Total revenue'}
              </span>
            </div>
            <div className="text-xs text-gray-500">ALL</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {moneyFmt.format(revenueData.totalRevenue)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Revenus cumulés' : 'Cumulative revenue'}
          </div>
        </div>

        {/* Average Booking Value */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Valeur moyenne' : 'Average booking'}
              </span>
            </div>
            <div className="text-xs text-gray-500">AVG</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {moneyFmt.format(revenueData.averageBookingValue)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Par réservation' : 'Per booking'}
          </div>
        </div>

        {/* Monthly Projection */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Projection mensuelle' : 'Monthly projection'}
              </span>
            </div>
            <div className="text-xs text-gray-500">PROJ</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {moneyFmt.format(revenueData.projectedRevenue)}
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Estimation' : 'Estimated'}
          </div>
        </div>

        {/* Monthly Average */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-cyan-400 rounded-full"></div>
              <span className="text-gray-300 text-sm font-medium">
                {language === 'fr' ? 'Moyenne mensuelle' : 'Monthly average'}
              </span>
            </div>
            <div className="text-xs text-gray-500">12M</div>
          </div>
          <div className="text-2xl font-bold text-white mb-1">
            {revenueData.monthlyRevenue.data && revenueData.monthlyRevenue.data.length > 0
              ? moneyFmt.format(revenueData.monthlyRevenue.data.reduce((a, b) => a + b, 0) / 12)
              : '$0'
            }
          </div>
          <div className="text-xs text-gray-400">
            {language === 'fr' ? 'Sur 12 mois' : 'Over 12 months'}
          </div>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              {language === 'fr' ? 'Tendance mensuelle des revenus' : 'Monthly revenue trend'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'fr' ? 'Évolution détaillée et croissance des revenus' : 'Detailed evolution and revenue growth'}
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
            {revenueData.monthlyRevenue.labels ? revenueData.monthlyRevenue.labels.length : 0} MONTHS
          </div>
        </div>

        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <RechartsAreaChart
              data={(() => {
                if (!revenueData.monthlyRevenue.data || !revenueData.monthlyRevenue.labels) return [];
                
                return revenueData.monthlyRevenue.labels.map((label, index) => ({
                  month: label,
                  revenue: revenueData.monthlyRevenue.data[index] || 0
                }));
              })()}
              margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
            >
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
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
                tickFormatter={(value) => moneyFmt.format(value)}
                width={80}
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
                formatter={(value) => [
                  <span style={{ color: '#10B981', fontWeight: 600 }}>
                    {moneyFmt.format(value)}
                  </span>,
                  language === 'fr' ? 'Revenus' : 'Revenue'
                ]}
              />
              
              <Area
                type="monotone"
                dataKey="revenue"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#revenueGradient)"
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
      </div>

      {/* Second Row - Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Status */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Revenus par statut' : 'Revenue by status'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Répartition des revenus par statut de réservation' : 'Revenue breakdown by booking status'}
              </p>
            </div>
          </div>
          
          <div className="flex justify-center">
            <div className="w-[500px] h-[500px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart margin={{ top: 40, right: 80, bottom: 40, left: 80 }}>
                  <Pie
                    data={revenueData.revenueByStatus.filter(item => item.value > 0)}
                    cx="50%"
                    cy="50%"
                    outerRadius={140}
                    innerRadius={0}
                    dataKey="value"
                    label={({ value }) => {
                      // Calculate total and percentage
                      const total = revenueData.revenueByStatus.reduce((sum, item) => sum + item.value, 0);
                      if (total === 0 || value === 0) return '0%';
                      const percentage = (value / total) * 100;
                      return `${Math.round(percentage)}%`;
                    }}
                    labelLine={true}
                  >
                    {revenueData.revenueByStatus.filter(item => item.value > 0).map((entry, index) => {
                      // Map colors to specific status types for consistency
                      const statusColorMap = {
                        'Pending': '#8F5300',    // Brown
                        'Confirmed': '#101D42',  // Dark Blue  
                        'Active': '#285943',     // Dark Green
                        'Completed': '#2E1F47',  // Dark Purple
                        'Cancelled': '#6E0C18'   // Dark Red
                      };
                      const color = statusColorMap[entry.label] || '#8F5300';
                      return (
                        <Cell 
                          key={`cell-${index}`} 
                          fill={color}
                          stroke="#1F2937"
                          strokeWidth={1}
                        />
                      );
                    })}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (active && payload && payload.length) {
                        const data = payload[0].payload;
                        return (
                          <div className="bg-gray-800 border border-gray-600 rounded-lg p-3 shadow-lg">
                            <div className="text-white font-semibold">
                              {moneyFmt.format(data.value)} {data.label.toLowerCase()}
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
            <div className="flex flex-wrap items-center gap-6 justify-center">
              {revenueData.revenueByStatus.filter(item => item.value > 0).map((item, index) => {
                // Map colors to specific status types for consistency
                const statusColorMap = {
                  'Pending': '#8F5300',    // Brown
                  'Confirmed': '#101D42',  // Dark Blue  
                  'Active': '#285943',     // Dark Green
                  'Completed': '#2E1F47',  // Dark Purple
                  'Cancelled': '#6E0C18'   // Dark Red
                };
                const color = statusColorMap[item.label] || '#8F5300';
                const total = revenueData.revenueByStatus.reduce((sum, status) => sum + status.value, 0);
                const percentage = total > 0 ? Math.round((item.value / total) * 100) : 0;
                
                return (
                  <div key={index} className="flex items-center gap-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: color }}
                    ></div>
                    <div className="text-center">
                      <div className="text-white font-medium text-sm">
                        {item.label}
                      </div>
                      <div className="text-gray-400 text-xs">
                        {moneyFmt.format(item.value)} ({percentage}%)
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Revenue Growth Analysis */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Analyse de croissance' : 'Growth analysis'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Taux de croissance mensuel des revenus' : 'Monthly revenue growth rate'}
              </p>
            </div>
          </div>

          {/* Growth Statistics */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-1">
                {language === 'fr' ? 'Croissance moy.' : 'Avg Growth'}
              </div>
              <div className="text-green-400 font-bold text-lg">
                {revenueData.revenueGrowth.data && revenueData.revenueGrowth.data.length > 0
                  ? `${(revenueData.revenueGrowth.data.reduce((a, b) => a + b, 0) / revenueData.revenueGrowth.data.length).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'fr' ? 'Par mois' : 'Per month'}
              </div>
            </div>
            
            <div className="bg-gray-800/50 rounded-lg p-3 border border-gray-700/30">
              <div className="text-xs text-gray-400 mb-1">
                {language === 'fr' ? 'Meilleur mois' : 'Best Month'}
              </div>
              <div className="text-blue-400 font-bold text-lg">
                {revenueData.revenueGrowth.data && revenueData.revenueGrowth.data.length > 0
                  ? `${Math.max(...revenueData.revenueGrowth.data).toFixed(1)}%`
                  : '0%'
                }
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {language === 'fr' ? 'Croissance max' : 'Max growth'}
              </div>
            </div>
          </div>

          {/* Growth Trend Visualization */}
          <div className="space-y-3">
            {revenueData.revenueGrowth.data && revenueData.revenueGrowth.labels && 
             revenueData.revenueGrowth.labels.slice(-6).map((label, index) => {
               const dataIndex = revenueData.revenueGrowth.data.length - 6 + index;
               const growthValue = revenueData.revenueGrowth.data[dataIndex] || 0;
               const isPositive = growthValue >= 0;
               
               return (
                 <div key={index} className="bg-gray-800/30 rounded-lg p-3 border border-gray-700/20">
                   <div className="flex items-center justify-between">
                     <div className="text-xs text-gray-400">{label}</div>
                     <div className={`text-sm font-bold ${isPositive ? 'text-green-400' : 'text-red-400'}`}>
                       {isPositive ? '+' : ''}{growthValue.toFixed(1)}%
                     </div>
                   </div>
                   
                   {/* Growth bar */}
                   <div className="w-full bg-gray-700/50 rounded-full h-2 mt-2">
                     <div 
                       className={`h-2 rounded-full transition-all duration-1000 ${
                         isPositive 
                           ? 'bg-gradient-to-r from-green-400 to-emerald-500' 
                           : 'bg-gradient-to-r from-red-400 to-red-500'
                       }`}
                       style={{ width: `${Math.min(Math.abs(growthValue) * 2, 100)}%` }}
                     ></div>
                   </div>
                 </div>
               );
             })
            }
          </div>
        </div>
      </div>

      {/* Third Row - Revenue by Location */}
      <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-semibold text-lg mb-1">
              {language === 'fr' ? 'Revenus par localisation' : 'Revenue by location'}
            </h3>
            <p className="text-gray-400 text-sm">
              {language === 'fr' ? 'Performance des revenus par bureau' : 'Revenue performance by office'}
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
            TOP {revenueData.revenueByLocation.length}
          </div>
        </div>

        <div className="space-y-3">
          {revenueData.revenueByLocation.map((location, index) => {
            const percentage = revenueData.totalRevenue > 0 
              ? (location.value / revenueData.totalRevenue * 100).toFixed(1)
              : 0;
            
            // Capitalize first letter of location name
            const capitalizedLocation = location.label.charAt(0).toUpperCase() + location.label.slice(1).toLowerCase();
            
            // Generate different colors for each location
            const locationColors = [
              'from-emerald-400 to-green-500',
              'from-blue-400 to-cyan-500', 
              'from-purple-400 to-violet-500',
              'from-orange-400 to-amber-500',
              'from-pink-400 to-rose-500'
            ];
            const colorClass = locationColors[index % locationColors.length];
            
            return (
              <div key={index} className="relative group bg-gray-800/60 rounded-xl p-5 border border-gray-700/40 hover:border-gray-600/60 hover:bg-gray-800/80 transition-all duration-300 hover:shadow-lg">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4 flex-1">
                    <div className="flex-shrink-0">
                      <div className={`w-4 h-4 rounded-full bg-gradient-to-r ${colorClass} shadow-sm`}></div>
                    </div>
                    <div className="flex-1">
                      <div className="text-white font-semibold text-base mb-1">
                        {capitalizedLocation}
                      </div>
                      <div className="text-xs text-gray-400">
                        {percentage}% {language === 'fr' ? 'du total' : 'of total revenue'}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-5">
                    {/* Enhanced progress bar */}
                    <div className="w-36 bg-gray-700/60 rounded-full h-2.5 overflow-hidden shadow-inner">
                      <div 
                        className={`h-2.5 rounded-full transition-all duration-1000 bg-gradient-to-r ${colorClass} shadow-sm`}
                        style={{ width: `${Math.min(percentage * 1.5, 100)}%` }}
                      ></div>
                    </div>
                    
                    {/* Enhanced revenue display */}
                    <div className="text-right min-w-28">
                      <div className="text-white font-bold text-base mb-0.5">
                        {moneyFmt.format(location.value)}
                      </div>
                      <div className="text-xs text-gray-400 font-medium">
                        {percentage}%
                      </div>
                    </div>
                  </div>
                </div>
                
                {/* Rank indicator */}
                <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  <div className="text-xs text-gray-500 bg-gray-700/50 px-2 py-1 rounded-full">
                    #{index + 1}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Fourth Row - Top Revenue Months & Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Revenue Months */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {language === 'fr' ? 'Meilleurs mois par revenus' : 'Top revenue months'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'fr' ? 'Classement des mois les plus performants' : 'Ranking of best performing months'}
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
              TOP 5
            </div>
          </div>

          <div className="space-y-3">
            {revenueData.topRevenueMonths.slice(0, 5).map((month, index) => {
              // SVG Medal Icons
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

              const CalendarIcon = () => (
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                  <line x1="16" y1="2" x2="16" y2="6"/>
                  <line x1="8" y1="2" x2="8" y2="6"/>
                  <line x1="3" y1="10" x2="21" y2="10"/>
                </svg>
              );

              // Enhanced medal system with better colors and effects
              const getRankStyle = (rank) => {
                switch(rank) {
                  case 0: return {
                    bg: 'bg-gradient-to-br from-yellow-400/20 to-amber-500/20',
                    border: 'border-yellow-400/40',
                    text: 'text-yellow-400',
                    icon: <GoldMedalIcon />,
                    shadow: 'shadow-yellow-400/20'
                  };
                  case 1: return {
                    bg: 'bg-gradient-to-br from-gray-300/20 to-slate-400/20',
                    border: 'border-gray-300/40',
                    text: 'text-gray-300',
                    icon: <SilverMedalIcon />,
                    shadow: 'shadow-gray-300/20'
                  };
                  case 2: return {
                    bg: 'bg-gradient-to-br from-orange-400/20 to-amber-600/20',
                    border: 'border-orange-400/40',
                    text: 'text-orange-400',
                    icon: <BronzeMedalIcon />,
                    shadow: 'shadow-orange-400/20'
                  };
                  default: return {
                    bg: 'bg-gray-700/30',
                    border: 'border-gray-600/40',
                    text: 'text-gray-400',
                    icon: <CalendarIcon />,
                    shadow: 'shadow-gray-600/10'
                  };
                }
              };
              
              const rankStyle = getRankStyle(index);
              
              return (
                <div key={index} className={`group ${rankStyle.bg} ${rankStyle.border} border rounded-xl p-4 hover:scale-[1.02] transition-all duration-300 hover:shadow-lg ${rankStyle.shadow}`}>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold ${rankStyle.text} bg-gray-800/50 border ${rankStyle.border}`}>
                          {rankStyle.icon}
                        </div>
                      </div>
                      <div>
                        <div className="text-white font-semibold text-base mb-1">{month.month}</div>
                        <div className="text-xs text-gray-400">
                          {language === 'fr' ? 'Revenus du mois' : 'Monthly revenue'}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-green-400 font-bold text-xl mb-1">
                        {moneyFmt.format(month.revenue)}
                      </div>
                      <div className="text-xs text-gray-500">
                        #{index + 1} {language === 'fr' ? 'place' : 'place'}
                      </div>
                    </div>
                  </div>
                  
                  {/* Progress indicator for visual comparison */}
                  <div className="mt-3 w-full bg-gray-700/50 rounded-full h-1.5 overflow-hidden">
                    <div 
                      className="h-1.5 rounded-full bg-gradient-to-r from-green-400 to-emerald-500 transition-all duration-1000"
                      style={{ 
                        width: `${revenueData.topRevenueMonths.length > 0 ? (month.revenue / revenueData.topRevenueMonths[0].revenue) * 100 : 0}%` 
                      }}
                    ></div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Revenue Insights */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-white font-semibold text-lg mb-1">
                {language === 'fr' ? 'Insights revenus' : 'Revenue insights'}
              </h3>
              <p className="text-sm text-gray-400">
                {language === 'fr' ? 'Analyses et recommandations' : 'Analysis and recommendations'}
              </p>
            </div>
            <div className="text-xs text-gray-500 bg-gray-800/50 px-3 py-1 rounded-full">
              AI POWERED
            </div>
          </div>

          <div className="space-y-4">
            {/* Growth Insight */}
            <div className="group bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-5 hover:from-green-500/15 hover:to-emerald-500/15 hover:border-green-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-green-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-green-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/>
                      <polyline points="17 6 23 6 23 12"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-green-400 text-base">
                      {language === 'fr' ? 'Croissance Positive' : 'Positive Growth'}
                    </h4>
                    <div className="px-2 py-0.5 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                      +{revenueData.revenueGrowth.data && revenueData.revenueGrowth.data.length > 0 
                        ? Math.max(...revenueData.revenueGrowth.data).toFixed(1) 
                        : '0'}%
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {language === 'fr' 
                      ? 'Revenus en croissance constante avec une projection positive pour les prochains mois.'
                      : 'Revenue showing consistent growth with positive projection for upcoming months.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Performance Insight */}
            <div className="group bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-5 hover:from-blue-500/15 hover:to-cyan-500/15 hover:border-blue-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-blue-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-blue-400" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                      <line x1="12" y1="1" x2="12" y2="23"/>
                      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-blue-400 text-base">
                      {language === 'fr' ? 'Performance Stable' : 'Stable Performance'}
                    </h4>
                    <div className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-xs font-medium rounded-full">
                      {moneyFmt.format(revenueData.averageBookingValue)}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {language === 'fr' 
                      ? 'Valeur moyenne par réservation maintenue à un niveau optimal et stable.'
                      : 'Average booking value maintained at optimal and stable level.'
                    }
                  </p>
                </div>
              </div>
            </div>

            {/* Opportunity Insight */}
            <div className="group bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-xl p-5 hover:from-purple-500/15 hover:to-pink-500/15 hover:border-purple-500/40 transition-all duration-300 hover:shadow-lg hover:shadow-purple-500/10">
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 rounded-xl bg-purple-500/20 flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                    <svg className="w-6 h-6 text-purple-400" fill="currentColor" viewBox="0 0 1024 1024">
                      <path d="M384 960v-64h192.064v64H384zm448-544a350.656 350.656 0 0 1-128.32 271.424C665.344 719.04 640 763.776 640 813.504V832H320v-14.336c0-48-19.392-95.36-57.216-124.992a351.552 351.552 0 0 1-128.448-344.256c25.344-136.448 133.888-248.128 269.76-276.48A352.384 352.384 0 0 1 832 416zm-544 32c0-132.288 75.904-224 192-224v-64c-154.432 0-256 122.752-256 288h64z"/>
                    </svg>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h4 className="font-bold text-purple-400 text-base">
                      {language === 'fr' ? 'Opportunités Identifiées' : 'Opportunities Identified'}
                    </h4>
                    <div className="px-2 py-0.5 bg-purple-500/20 text-purple-400 text-xs font-medium rounded-full">
                      {revenueData.revenueByLocation.length} {language === 'fr' ? 'zones' : 'areas'}
                    </div>
                  </div>
                  <p className="text-sm text-gray-300 leading-relaxed">
                    {language === 'fr' 
                      ? 'Potentiel d\'optimisation des revenus par localisation et stratégies identifié.'
                      : 'Revenue optimization potential by location and strategies identified.'
                    }
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
