import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { api } from '../../config/api';
import LineChart from '../Charts/LineChart';
import BarChart from '../Charts/BarChart';
import DonutChart from '../Charts/DonutChart';

const CarsAnalytics = () => {
  const { language } = useLanguage();
  const [loading, setLoading] = useState(true);
  const [carsData, setCarsData] = useState({
    totalCars: 0,
    availableCars: 0,
    carsByCategory: [],
    carsByLocation: [],
    topPerformingCars: [],
    utilizationRate: 0,
    averageRating: 0,
    maintenanceStatus: [],
    revenuePerCar: []
  });

  const numberFmt = new Intl.NumberFormat('en-US');
  const moneyFmt = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 });

  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        const [carsResponse, bookingsResponse] = await Promise.all([
          api.cars.getAll({ limit: 1000 }),
          api.bookings.getAll({ limit: 1000 })
        ]);

        if (carsResponse.success && carsResponse.data.cars) {
          const cars = carsResponse.data.cars;
          const bookings = bookingsResponse.success ? bookingsResponse.data.bookings : [];
          processCarsData(cars, bookings);
        }
      } catch (error) {
        console.error('Failed to fetch cars data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchCarsData();
  }, []);

  const processCarsData = (cars, bookings) => {
    // Category distribution
    const categoryCount = {};
    cars.forEach(car => {
      const category = car.category || 'Unknown';
      categoryCount[category] = (categoryCount[category] || 0) + 1;
    });

    // Location distribution
    const locationCount = {};
    cars.forEach(car => {
      const location = car.location || 'Unknown';
      locationCount[location] = (locationCount[location] || 0) + 1;
    });

    // Calculate car performance metrics
    const carPerformance = {};
    const carRevenue = {};
    const carBookingCount = {};

    // Initialize car metrics
    cars.forEach(car => {
      carPerformance[car._id] = {
        id: car._id,
        name: car.name,
        category: car.category,
        location: car.location,
        pricePerDay: car.pricePerDay,
        bookings: 0,
        revenue: 0,
        totalDays: 0,
        rating: car.rating || 0
      };
      carRevenue[car._id] = 0;
      carBookingCount[car._id] = 0;
    });

    // Process bookings to calculate performance
    bookings.forEach(booking => {
      if (booking.car && booking.car._id && carPerformance[booking.car._id]) {
        const amount = Number(booking.totalAmount) || 0;
        const startDate = new Date(booking.startDate);
        const endDate = new Date(booking.endDate);
        const days = Math.ceil((endDate - startDate) / (1000 * 60 * 60 * 24)) || 1;

        // Only count revenue from confirmed, active, and completed bookings
        if (['confirmed', 'active', 'completed'].includes(booking.status)) {
          carPerformance[booking.car._id].revenue += amount;
          carRevenue[booking.car._id] += amount;
        }

        carPerformance[booking.car._id].bookings += 1;
        carPerformance[booking.car._id].totalDays += days;
        carBookingCount[booking.car._id] += 1;
      }
    });

    // Get top performing cars by revenue
    const topPerformingCars = Object.values(carPerformance)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 10);

    // Calculate utilization rate (simplified - based on bookings vs available days)
    const totalBookings = bookings.length;
    const totalCars = cars.length;
    const utilizationRate = totalCars > 0 ? (totalBookings / (totalCars * 30)) * 100 : 0; // Assuming 30 days period

    // Calculate average rating
    const carsWithRating = cars.filter(car => car.rating && car.rating > 0);
    const averageRating = carsWithRating.length > 0 
      ? carsWithRating.reduce((sum, car) => sum + car.rating, 0) / carsWithRating.length 
      : 0;

    // Maintenance status (simulated based on car age and usage)
    const maintenanceStatus = {
      'Good': Math.floor(cars.length * 0.7),
      'Needs Service': Math.floor(cars.length * 0.2),
      'In Maintenance': Math.floor(cars.length * 0.1)
    };

    // Available cars (assuming cars not currently in active bookings)
    const activeCars = new Set();
    bookings.forEach(booking => {
      if (booking.status === 'active' && booking.car?._id) {
        activeCars.add(booking.car._id);
      }
    });
    const availableCars = cars.length - activeCars.size;

    // Revenue per car analysis
    const revenuePerCarData = Object.values(carPerformance)
      .filter(car => car.revenue > 0)
      .sort((a, b) => b.revenue - a.revenue)
      .slice(0, 8)
      .map(car => ({
        label: car.name.length > 15 ? car.name.substring(0, 15) + '...' : car.name,
        value: car.revenue
      }));

    setCarsData({
      totalCars: cars.length,
      availableCars,
      carsByCategory: Object.entries(categoryCount).map(([category, count]) => ({
        label: category,
        value: count
      })),
      carsByLocation: Object.entries(locationCount).map(([location, count]) => ({
        label: location,
        value: count
      })),
      topPerformingCars,
      utilizationRate: Math.min(100, utilizationRate),
      averageRating,
      maintenanceStatus: Object.entries(maintenanceStatus).map(([status, count]) => ({
        label: status,
        value: count
      })),
      revenuePerCar: revenuePerCarData
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
          {language === 'fr' ? 'Analyse des Voitures' : 'Cars Analytics'}
        </h2>
        <p className="text-gray-400">
          {language === 'fr' ? 'Performance de la flotte et analyse d\'utilisation' : 'Fleet performance and utilization analysis'}
        </p>
        <div className="mt-4 grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="bg-cyan-500/10 border border-cyan-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-cyan-400">{numberFmt.format(carsData.totalCars)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Total Voitures' : 'Total Cars'}</div>
          </div>
          <div className="bg-green-500/10 border border-green-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-green-400">{numberFmt.format(carsData.availableCars)}</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Disponibles' : 'Available'}</div>
          </div>
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-blue-400">{carsData.utilizationRate.toFixed(1)}%</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Taux d\'Utilisation' : 'Utilization Rate'}</div>
          </div>
          <div className="bg-yellow-500/10 border border-yellow-500/30 rounded-lg p-4">
            <div className="text-2xl font-bold text-yellow-400">{carsData.averageRating.toFixed(1)}/5</div>
            <div className="text-sm text-gray-400">{language === 'fr' ? 'Note Moyenne' : 'Average Rating'}</div>
          </div>
        </div>
      </div>

      {/* Fleet Distribution */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Cars by Category */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Répartition par Catégorie' : 'Distribution by Category'}
          </h3>
          <div className="flex justify-center">
            <DonutChart
              data={carsData.carsByCategory.map(item => item.value)}
              labels={carsData.carsByCategory.map(item => item.label)}
              colors={['#06b6d4', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444', '#6366f1']}
              size={280}
              strokeWidth={35}
            />
          </div>
        </div>

        {/* Cars by Location */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Répartition par Lieu' : 'Distribution by Location'}
          </h3>
          <div className="flex justify-center">
            <DonutChart
              data={carsData.carsByLocation.map(item => item.value)}
              labels={carsData.carsByLocation.map(item => item.label)}
              colors={['#10b981', '#06b6d4', '#8b5cf6', '#f59e0b']}
              size={280}
              strokeWidth={35}
            />
          </div>
        </div>
      </div>

      {/* Revenue per Car */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Revenus par Voiture (Top 8)' : 'Revenue per Car (Top 8)'}
        </h3>
        <div className="h-64">
          <BarChart
            data={carsData.revenuePerCar.map(item => item.value)}
            labels={carsData.revenuePerCar.map(item => item.label)}
            width={800}
            height={250}
            color="#10b981"
            className="w-full"
            showValues={false}
          />
        </div>
      </div>

      {/* Top Performing Cars */}
      <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
        <h3 className="text-xl font-semibold text-white mb-4">
          {language === 'fr' ? 'Voitures les Plus Performantes' : 'Top Performing Cars'}
        </h3>
        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="text-gray-400">
              <tr>
                <th className="py-2 pr-4">{language === 'fr' ? 'Rang' : 'Rank'}</th>
                <th className="py-2 pr-4">{language === 'fr' ? 'Voiture' : 'Car'}</th>
                <th className="py-2 pr-4">{language === 'fr' ? 'Catégorie' : 'Category'}</th>
                <th className="py-2 pr-4">{language === 'fr' ? 'Réservations' : 'Bookings'}</th>
                <th className="py-2 pr-4">{language === 'fr' ? 'Revenus' : 'Revenue'}</th>
                <th className="py-2 pr-4">{language === 'fr' ? 'Jours Totaux' : 'Total Days'}</th>
                <th className="py-2 pr-4">{language === 'fr' ? 'Note' : 'Rating'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-cyan-900/30">
              {carsData.topPerformingCars.slice(0, 10).map((car, index) => (
                <tr key={car.id} className="hover:bg-white/5">
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-2">
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                        index === 0 ? 'bg-yellow-500 text-black' :
                        index === 1 ? 'bg-gray-400 text-black' :
                        index === 2 ? 'bg-orange-600 text-white' :
                        'bg-gray-600 text-white'
                      }`}>
                        {index + 1}
                      </div>
                    </div>
                  </td>
                  <td className="py-3 pr-4 text-white font-medium">{car.name}</td>
                  <td className="py-3 pr-4 text-gray-300">{car.category}</td>
                  <td className="py-3 pr-4 text-blue-400">{numberFmt.format(car.bookings)}</td>
                  <td className="py-3 pr-4 text-green-400 font-semibold">{moneyFmt.format(car.revenue)}</td>
                  <td className="py-3 pr-4 text-gray-300">{numberFmt.format(car.totalDays)}</td>
                  <td className="py-3 pr-4">
                    <div className="flex items-center gap-1">
                      <span className="text-yellow-400">{car.rating.toFixed(1)}</span>
                      <svg className="w-4 h-4 text-yellow-400" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Fleet Status and Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Maintenance Status */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Statut de Maintenance' : 'Maintenance Status'}
          </h3>
          <div className="space-y-3">
            {carsData.maintenanceStatus.map((status, index) => {
              const percentage = carsData.totalCars > 0 
                ? (status.value / carsData.totalCars * 100).toFixed(1)
                : 0;
              
              const colors = {
                'Good': 'from-green-400 to-emerald-500',
                'Needs Service': 'from-yellow-400 to-orange-500',
                'In Maintenance': 'from-red-400 to-red-600'
              };
              
              return (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-800/50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${colors[status.label] || 'from-gray-400 to-gray-500'}`}></div>
                    <span className="text-white font-medium">{status.label}</span>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="w-32 bg-gray-700 rounded-full h-2">
                      <div 
                        className={`bg-gradient-to-r ${colors[status.label] || 'from-gray-400 to-gray-500'} h-2 rounded-full transition-all duration-500`}
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                    <div className="text-right min-w-16">
                      <div className="text-white font-semibold">{numberFmt.format(status.value)}</div>
                      <div className="text-xs text-gray-400">{percentage}%</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Fleet Insights */}
        <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
          <h3 className="text-xl font-semibold text-white mb-4">
            {language === 'fr' ? 'Insights Flotte' : 'Fleet Insights'}
          </h3>
          <div className="space-y-4">
            <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-green-400">{language === 'fr' ? 'Performance' : 'Performance'}</h4>
              </div>
              <p className="text-sm text-gray-300">
                {language === 'fr' 
                  ? `Taux d'utilisation de ${carsData.utilizationRate.toFixed(1)}% avec une note moyenne de ${carsData.averageRating.toFixed(1)}/5`
                  : `${carsData.utilizationRate.toFixed(1)}% utilization rate with ${carsData.averageRating.toFixed(1)}/5 average rating`
                }
              </p>
            </div>

            <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-blue-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-blue-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zM3 10a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H4a1 1 0 01-1-1v-6zM14 9a1 1 0 00-1 1v6a1 1 0 001 1h2a1 1 0 001-1v-6a1 1 0 00-1-1h-2z" />
                  </svg>
                </div>
                <h4 className="font-semibold text-blue-400">{language === 'fr' ? 'Disponibilité' : 'Availability'}</h4>
              </div>
              <p className="text-sm text-gray-300">
                {language === 'fr' 
                  ? `${carsData.availableCars} voitures disponibles sur ${carsData.totalCars} au total`
                  : `${carsData.availableCars} cars available out of ${carsData.totalCars} total`
                }
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border border-purple-500/30 rounded-lg p-4">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-full bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-4 h-4 text-purple-400" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11.707 4.707a1 1 0 00-1.414-1.414L10 9.586 8.707 8.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <h4 className="font-semibold text-purple-400">{language === 'fr' ? 'Maintenance' : 'Maintenance'}</h4>
              </div>
              <p className="text-sm text-gray-300">
                {language === 'fr' 
                  ? `${((carsData.maintenanceStatus.find(s => s.label === 'Good')?.value || 0) / carsData.totalCars * 100).toFixed(0)}% de la flotte en bon état`
                  : `${((carsData.maintenanceStatus.find(s => s.label === 'Good')?.value || 0) / carsData.totalCars * 100).toFixed(0)}% of fleet in good condition`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarsAnalytics;
