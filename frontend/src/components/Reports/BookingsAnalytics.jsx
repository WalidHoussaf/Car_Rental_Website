import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import DonutChart from '../Charts/DonutChart';

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

    // Status distribution
    const statusCounts = {
      pending: 0,
      confirmed: 0,
      active: 0,
      completed: 0,
      cancelled: 0
    };

    // Location distribution
    const locationCounts = {};

    // Process each booking
    bookings.forEach(booking => {
      const bookingDate = new Date(booking.createdAt || booking.startDate);
      
      // Monthly data
      const monthKey = `${bookingDate.getFullYear()}-${String(bookingDate.getMonth() + 1).padStart(2, '0')}`;
      if (Object.prototype.hasOwnProperty.call(monthlyData, monthKey)) {
        monthlyData[monthKey]++;
      }

      // Daily data
      const dayKey = bookingDate.toISOString().split('T')[0];
      if (Object.prototype.hasOwnProperty.call(dailyData, dayKey)) {
        dailyData[dayKey]++;
      }

      // Status distribution
      if (Object.prototype.hasOwnProperty.call(statusCounts, booking.status)) {
        statusCounts[booking.status]++;
      }

      // Location distribution
      const location = booking.pickupLocation?.branch || booking.pickupLocation || 'Unknown';
      locationCounts[location] = (locationCounts[location] || 0) + 1;
    });

    // Convert to arrays
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
        label: location,
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
    <div className="space-y-4">
      {/* Top Row - Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
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
          <div className="h-80 flex justify-center items-center">
            <LineChart
              data={bookingsData.monthlyBookings.data || []}
              labels={bookingsData.monthlyBookings.labels || []}
              width={600}
              height={280}
              color="#06b6d4"
              fillColor="rgba(6, 182, 212, 0.1)"
              className="w-full"
            />
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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Daily Bookings */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Activité quotidienne' : 'Daily activity'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Réservations des 30 derniers jours' : 'Bookings over last 30 days'}
              </p>
            </div>
            <div className="text-xs text-gray-500">30D</div>
          </div>
          <div className="h-48">
            <BarChart
              data={bookingsData.dailyBookings.data || []}
              labels={bookingsData.dailyBookings.labels || []}
              width={400}
              height={180}
              color="#8b5cf6"
              className="w-full"
            />
          </div>
        </div>

        {/* Location Performance */}
        <div className="bg-gray-900/80 border border-gray-700/50 rounded-lg p-4">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-white font-semibold text-base">
                {language === 'fr' ? 'Performance par lieu' : 'Location performance'}
              </h3>
              <p className="text-xs text-gray-400 mt-1">
                {language === 'fr' ? 'Top 5 des lieux de prise en charge' : 'Top 5 pickup locations'}
              </p>
            </div>
            <div className="text-xs text-gray-500">TOP 5</div>
          </div>
          <div className="space-y-3">
            {bookingsData.locationBookings.slice(0, 5).map((location, index) => {
              const percentage = bookingsData.totalBookings > 0 
                ? (location.value / bookingsData.totalBookings * 100).toFixed(1)
                : 0;
              
              return (
                <div key={index} className="flex items-center justify-between">
                  <div className="flex items-center gap-3 flex-1">
                    <div className="text-xs text-gray-500 w-4">#{index + 1}</div>
                    <div className="text-sm text-gray-300 truncate">{location.label}</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-16 bg-gray-700 rounded-full h-1.5">
                      <div 
                        className="bg-gradient-to-r from-cyan-400 to-blue-500 h-1.5 rounded-full transition-all duration-500"
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right min-w-12">
                      <div className="text-sm text-white font-medium">{location.value}</div>
                      <div className="text-xs text-gray-500">{percentage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingsAnalytics;
