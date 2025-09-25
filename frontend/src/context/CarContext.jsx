import React, { createContext, useState, useEffect } from 'react';
import { api } from '../config/api.js';

const CarContext = createContext();


export const CarProvider = ({ children }) => {
  const [cars, setCars] = useState([]);
  const [featuredCars, setFeaturedCars] = useState([]);
  const [selectedCar, setSelectedCar] = useState(null);
  const [categories, setCategories] = useState([]);
  const [locations, setLocations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [filters, setFilters] = useState({
    category: '',
    minPrice: '',
    maxPrice: '',
    transmission: '',
    fuelType: '',
    seats: '',
    location: '',
    search: ''
  });
  const [pagination, setPagination] = useState({
    currentPage: 1,
    totalPages: 1,
    totalItems: 0,
    itemsPerPage: 50
  });

  const fetchCars = async (searchFilters = filters, page = 1) => {
    setLoading(true);
    setError(null);
    
    try {
      const params = {
        page,
        limit: 50, 
        ...searchFilters
      };

      Object.keys(params).forEach(key => {
        if (params[key] === '' || params[key] === null || params[key] === undefined) {
          delete params[key];
        }
      });

      const response = await api.cars.getAll(params);
      
      if (response.success) {
        setCars(response.data.cars);
        setPagination(response.data.pagination);
      } else {
        setError(response.message || 'Failed to fetch cars');
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch cars');
      setCars([]);
    } finally {
      setLoading(false);
    }
  };

  const getCarById = async (carId) => {
    try {
      const response = await api.cars.getById(carId);
      
      if (response.success) {
        setSelectedCar(response.data.car);
        return response.data.car;
      } else {
        throw new Error(response.message || 'Car not found');
      }
    } catch (error) {
      setError(error.message);
      throw error;
    }
  };

  // Check car availability
  const checkAvailability = async (carId, startDate, endDate) => {
    try {
      const response = await api.cars.checkAvailability(carId, startDate, endDate);
      return response.success ? response.data : null;
    } catch (error) {
      setError(error.message);
      return null;
    }
  };

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const response = await api.cars.getCategories();
      if (response.success) {
        setCategories(response.data.categories);
      }
    } catch (error) {
      console.error('Failed to fetch categories:', error);
    }
  };

  // Fetch locations
  const fetchLocations = async () => {
    try {
      const response = await api.cars.getLocations();
      if (response.success) {
        setLocations(response.data.locations);
      }
    } catch (error) {
      console.error('Failed to fetch locations:', error);
    }
  };

  // Fetch featured cars (unfiltered)
  const fetchFeaturedCars = async () => {
    try {
      const response = await api.cars.getAll({ limit: 6 }); 
      if (response.success) {
        setFeaturedCars(response.data.cars);
      }
    } catch (error) {
      console.error('Failed to fetch featured cars:', error);
    }
  };

  // Update filters
  const updateFilters = (newFilters) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    // Refetch cars with new filters
    fetchCars(updatedFilters);
  };

  // Clear filters
  const clearFilters = () => {
    const clearedFilters = {
      category: '',
      minPrice: '',
      maxPrice: '',
      transmission: '',
      fuelType: '',
      seats: '',
      location: '',
      search: ''
    };
    setFilters(clearedFilters);
    // Refetch cars with cleared filters
    fetchCars(clearedFilters);
  };

  // Load initial data
  useEffect(() => {
    const loadInitialData = async () => {
      await fetchCars();
      await fetchCategories();
      await fetchLocations();
      await fetchFeaturedCars();
    };
    
    loadInitialData();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const value = {
    cars,
    featuredCars,
    selectedCar,
    categories,
    locations,
    loading,
    error,
    filters,
    pagination,
    fetchCars,
    fetchFeaturedCars,
    getCarById,
    checkAvailability,
    updateFilters,
    clearFilters,
    setSelectedCar
  };

  return (
    <CarContext.Provider value={value}>
      {children}
    </CarContext.Provider>
  );
};

export default CarContext;