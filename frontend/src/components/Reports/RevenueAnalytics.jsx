import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import DonutChart from '../Charts/DonutChart';
import AreaChart from '../Charts/AreaChart';

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
      {/* Header */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h2 className="text-2xl font-bold text-cyan-400 mb-2">
          {language === 'fr' ? 'Analyse des Revenus' : 'Revenue Analytics'}
        </h2>
        <p className="text-gray-400">
          {language === 'fr' ? 'Analyse détaillée des revenus et tendances financières' : 'Detailed revenue analysis and financial trends'}
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{moneyFmt.format(revenueData.totalRevenue)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Revenus Totaux' : 'Total Revenue'}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{moneyFmt.format(revenueData.averageBookingValue)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Valeur Moyenne' : 'Average Booking'}</div>
          </div>
          <div className="bg-purple-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-purple-400">{moneyFmt.format(revenueData.projectedRevenue)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Projection Mensuelle' : 'Monthly Projection'}</div>
          </div>
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">
              {revenueData.monthlyRevenue.data && revenueData.monthlyRevenue.data.length > 0
                ? moneyFmt.format(revenueData.monthlyRevenue.data.reduce((a, b) => a + b, 0) / 12)
                : '$0'
              }
            </div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Moyenne Mensuelle' : 'Monthly Average'}</div>
          </div>
        </div>
      </div>

      {/* Monthly Revenue Trend */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Tendance Mensuelle des Revenus' : 'Monthly Revenue Trend'}
        </h3>
        <div className="h-64">
          <AreaChart
            data={revenueData.monthlyRevenue.data || []}
            labels={revenueData.monthlyRevenue.labels || []}
            width={800}
            height={250}
            color="#10b981"
            fillColor="rgba(16, 185, 129, 0.2)"
            className="w-full"
          />
        </div>
      </div>

      {/* Revenue by Status and Growth Rate */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue by Status */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Revenus par Statut' : 'Revenue by Status'}
          </h3>
          <div className="flex justify-center">
            <DonutChart
              data={revenueData.revenueByStatus.map(item => item.value)}
              labels={revenueData.revenueByStatus.map(item => item.label)}
              colors={['#f59e0b', '#06b6d4', '#10b981', '#8b5cf6', '#ef4444']}
              size={280}
              strokeWidth={35}
            />
          </div>
        </div>

        {/* Revenue Growth Rate */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Taux de Croissance (%)' : 'Growth Rate (%)'}
          </h3>
          <div className="h-64">
            <LineChart
              data={revenueData.revenueGrowth.data || []}
              labels={revenueData.revenueGrowth.labels || []}
              width={400}
              height={250}
              color="#8b5cf6"
              fillColor="rgba(139, 92, 246, 0.1)"
              className="w-full"
            />
          </div>
        </div>
      </div>

      {/* Revenue by Location */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Revenus par Lieu' : 'Revenue by Location'}
        </h3>
        <div className="space-y-3">
          {revenueData.revenueByLocation.map((location, index) => {
            const percentage = revenueData.totalRevenue > 0 
              ? (location.value / revenueData.totalRevenue * 100).toFixed(1)
              : 0;
            
            return (
              <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <div className="w-3 h-3 rounded-full bg-gradient-to-r from-green-400 to-emerald-500"></div>
                  <span className="text-white font-medium">{location.label}</span>
                </div>
                <div className="flex items-center gap-4">
                  <div className="w-32 bg-gray-700 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-green-400 to-emerald-500 h-2 rounded-full transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    ></div>
                  </div>
                  <div className="text-right min-w-24">
                    <div className="text-white font-semibold">{moneyFmt.format(location.value)}</div>
                    <div className="text-xs text-gray-400">{percentage}%</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Revenue Months */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Meilleurs Mois par Revenus' : 'Top Revenue Months'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
          {revenueData.topRevenueMonths.map((month, index) => (
            <div key={index} className="bg-gray-800/50 rounded-lg p-4 text-center">
              <div className="text-lg font-bold text-white mb-1">#{index + 1}</div>
              <div className="text-sm text-gray-400 mb-2">{month.month}</div>
              <div className="text-xl font-semibold text-green-400">{moneyFmt.format(month.revenue)}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Revenue Insights */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Insights Revenus' : 'Revenue Insights'}
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M3.293 9.707a1 1 0 010-1.414l6-6a1 1 0 011.414 0l6 6a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L4.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-green-400">{language === 'fr' ? 'Croissance' : 'Growth'}</h4>
            </div>
            <p className="text-sm text-gray-300">
              {language === 'fr' 
                ? 'Revenus en croissance constante avec une projection positive pour le mois en cours.'
                : 'Revenue showing consistent growth with positive projection for current month.'
              }
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="font-semibold text-blue-400">{language === 'fr' ? 'Performance' : 'Performance'}</h4>
            </div>
            <p className="text-sm text-gray-300">
              {language === 'fr' 
                ? 'Valeur moyenne par réservation maintenue à un niveau optimal.'
                : 'Average booking value maintained at optimal level.'
              }
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.293l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z" clipRule="evenodd" />
                </svg>
              </div>
              <h4 className="font-semibold text-purple-400">{language === 'fr' ? 'Opportunité' : 'Opportunity'}</h4>
            </div>
            <p className="text-sm text-gray-300">
              {language === 'fr' 
                ? 'Potentiel d\'optimisation des revenus par localisation identifié.'
                : 'Revenue optimization potential by location identified.'
              }
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RevenueAnalytics;
