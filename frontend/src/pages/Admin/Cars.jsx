import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../config/api';
import { useNotification } from '../../context/notificationUtils';
import CreateEditCarModal from '../../components/Admin/CreateEditCarModal';
import CarViewModal from '../../components/Admin/CarViewModal';
import DeleteCarModal from '../../components/Admin/DeleteCarModal';
import AuthContext from '../../context/authContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { locations as allLocations } from '../../assets/assets';
import { getCarImage } from '../../utils/imageResolver';
import { getMultipleCarAvailability } from '../../utils/carAvailability';
import logger from '../../utils/logger';

const PAGE_SIZE = 10;

const defaultForm = {
  name: '',
  make: '',
  model: '',
  year: '',
  category: '',
  pricePerDay: '',
  location: '',
  image: '',
  imagesText: '',
  features: '', 
  description: '',
  transmission: 'automatic',
  fuelType: 'gasoline',
  seats: '5',
  doors: '4',
  availability: true,
  engine: '',
  power: '',
  torque: '',
  acceleration: '',
  fuelEconomy: '',
  range: '',
  seatingCapacity: '',
  luggage: '',
  specDoors: '',
  specTransmission: '',
  horsepower: '',
  topSpeed: '',
  weight: '',
  length: '',
  width: '',
  height: '',
  wheelbase: '',
  driveType: '',
};

const AdminCars = () => {
  const { showSuccess, showError } = useNotification();
  const { user: currentUser, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [uploadingImages, setUploadingImages] = useState(false);
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [cars, setCars] = useState([]);
  const [carAvailability, setCarAvailability] = useState({});
  const [globalAvailabilityStats, setGlobalAvailabilityStats] = useState({ available: 0, unavailable: 0, total: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all');
  const [categories, setCategories] = useState([]);
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef(null);
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  const [isAvailabilityDropdownOpen, setIsAvailabilityDropdownOpen] = useState(false);
  const availabilityDropdownRef = useRef(null);

  const localizedLocations = useMemo(() => {
    return (allLocations || []).map(loc => ({
      value: loc.value,
      label: loc.label?.[language] || String(loc.value || ''),
    }));
  }, [language]);

  const selectedLocationLabel = useMemo(() => {
    if (!locationFilter) return (localizedLocations.find(l => l.value === 'all')?.label) || 'All Locations';
    return localizedLocations.find(l => l.value === locationFilter)?.label || 'Location';
  }, [locationFilter, localizedLocations]);

  const filteredCars = useMemo(() => {
    
    if (availabilityFilter === 'all') {
      return cars;
    }
    
    const hasAvailabilityData = cars.length > 0 && Object.keys(carAvailability).length > 0;
    if (!hasAvailabilityData) {
      return cars;
    }
    
    const filtered = cars.filter(car => {
      const availability = carAvailability[car._id];
      
      if (!availability) {
        return availabilityFilter === 'all';
      }
      
      const isAvailable = availability.available;
      
      
      if (availabilityFilter === 'available') {
        return isAvailable;
      } else if (availabilityFilter === 'unavailable') {
        return !isAvailable;
      }
      
      return true;
    });
    
    return filtered;
  }, [cars, carAvailability, availabilityFilter]);

  const paginatedCars = useMemo(() => {
    if (availabilityFilter === 'all') {
      return filteredCars;
    } else {
      const startIndex = (page - 1) * PAGE_SIZE;
      const endIndex = startIndex + PAGE_SIZE;
      return filteredCars.slice(startIndex, endIndex);
    }
  }, [filteredCars, page, availabilityFilter]);

  const paginationInfo = useMemo(() => {
    if (availabilityFilter === 'all') {
      return {
        currentPage: page,
        totalPages: totalPages,
        totalItems: globalAvailabilityStats.total,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1
      };
    } else {
      const totalFilteredPages = Math.ceil(filteredCars.length / PAGE_SIZE);
      return {
        currentPage: page,
        totalPages: totalFilteredPages,
        totalItems: filteredCars.length,
        hasNextPage: page < totalFilteredPages,
        hasPrevPage: page > 1
      };
    }
  }, [filteredCars.length, page, totalPages, availabilityFilter, globalAvailabilityStats.total]);

  const getTranslatedCategory = (categoryName) => {
    if (!categoryName) return t('adminCarsAllCategories');
      const translationKey = categoryName.toLowerCase();
    const translated = t(translationKey);
    return translated !== translationKey ? translated : categoryName;
  };

  const [modal, setModal] = useState({ type: null, car: null }); 
  const [form, setForm] = useState(defaultForm);
  const [processing, setProcessing] = useState(false);

  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  const loadCategories = async () => {
    try {
      const res = await api.cars.getCategories();
      if (res?.success) setCategories(res.data.categories || []);
    } catch (error) {
      logger.error('Failed to load categories:', error);
    }
  };

  const loadGlobalAvailabilityStats = async (filterParams = {}) => {
    try {
        const baseParams = {
        search: filterParams.search ?? search,
        category: filterParams.category ?? category,
        location: filterParams.location ?? locationFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const cleanParams = Object.fromEntries(
        Object.entries(baseParams).filter(([, v]) => v !== undefined && v !== null && v !== '')
      );
      
      let allCars = [];
      let totalPages = 1;
      
      const firstRes = await api.cars.getAll({ ...cleanParams, limit: 50, page: 1 });
      if (!firstRes?.success) {
        throw new Error('Failed to fetch cars for global stats');
      }
      
      allCars = firstRes.data.cars || [];
      totalPages = firstRes.data.pagination?.totalPages || 1;
      
      for (let page = 2; page <= totalPages; page++) {
        const res = await api.cars.getAll({ ...cleanParams, limit: 50, page });
        if (res?.success) {
          allCars = [...allCars, ...(res.data.cars || [])];
        }
      }
      
        const availabilityMap = await getMultipleCarAvailability(allCars);
      
        const stats = {
        total: allCars.length,
        available: 0,
        unavailable: 0
      };
      
      Object.values(availabilityMap).forEach(availability => {
        if (availability.available) {
          stats.available++;
        } else {
          stats.unavailable++;
        }
      });
      
      setGlobalAvailabilityStats(stats);
    } catch (error) {
      logger.error('Error loading global availability stats:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    try {
      setUploadingImages(true);
      const res = await api.cars.upload(files);
      const urls = res?.data?.files?.map(f => f.url) || [];
      if (urls.length) {
        setForm(prev => ({
          ...prev,
          image: prev.image || urls[0],
          imagesText: [...(prev.imagesText ? prev.imagesText.split(',').map(s => s.trim()).filter(Boolean) : []), ...urls].join(', ')
        }));
        showSuccess(t('adminCarsImagesUploaded'));
      } else {
        showError(t('adminCarsNoImagesReturned'));
      }
    } catch (err) {
      showError(err?.message || t('adminCarsFailedToUploadImages'));
    } finally {
      setUploadingImages(false);
      e.target.value = '';
    }
  };

  const fetchCars = async (opts = {}) => {
    const needsAllCars = availabilityFilter !== 'all';
    
    let fetchedCars = [];
    let paginationInfo = {};
    
    if (needsAllCars) {
      let allCars = [];
      let totalPages = 1;
      
      const baseParams = {
        search: opts.search ?? search,
        category: opts.category ?? category,
        location: opts.location ?? locationFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const cleanParams = Object.fromEntries(
        Object.entries(baseParams).filter(([, v]) => v !== undefined && v !== null && v !== '')
      );
      
      const firstRes = await api.cars.getAll({ ...cleanParams, limit: 50, page: 1 });
      if (!firstRes?.success) {
        throw new Error('Failed to fetch cars');
      }
      
      allCars = firstRes.data.cars || [];
      totalPages = firstRes.data.pagination?.totalPages || 1;
      
      for (let page = 2; page <= totalPages; page++) {
        const res = await api.cars.getAll({ ...cleanParams, limit: 50, page });
        if (res?.success) {
          allCars = [...allCars, ...(res.data.cars || [])];
        }
      }
      
      fetchedCars = allCars;
      paginationInfo = {
        currentPage: 1,
        totalPages: 1, 
        totalItems: allCars.length
      };
      
    } else {
      const raw = {
        page: opts.page || page,
        limit: PAGE_SIZE,
        search: opts.search ?? search,
        category: opts.category ?? category,
        location: opts.location ?? locationFilter,
        sortBy: 'createdAt',
        sortOrder: 'desc',
      };
      const params = Object.fromEntries(
        Object.entries(raw).filter(([, v]) => v !== undefined && v !== null && v !== '')
      );

      const res = await api.cars.getAll(params);
      if (!res?.success) {
        throw new Error('Failed to fetch cars');
      }
      
      fetchedCars = res.data.cars || [];
      paginationInfo = res.data.pagination || {};
    }

    setLoading(true);
    setError('');
    try {
      setCars(fetchedCars);
      setPage(paginationInfo.currentPage || 1);
      setTotalPages(paginationInfo.totalPages || 1);
      
      const availabilityMap = await getMultipleCarAvailability(fetchedCars);
      setCarAvailability(availabilityMap);
      
    } catch (error) {
      logger.error('Error in fetchCars:', error);
      setError(t('adminCarsFailedToLoadCars'));
      showError(t('adminCarsFailedToLoadCars'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCars({ page: 1 });
      loadCategories();
      loadGlobalAvailabilityStats();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (locationDropdownRef.current && !locationDropdownRef.current.contains(e.target)) setIsLocationDropdownOpen(false);
      if (categoryDropdownRef.current && !categoryDropdownRef.current.contains(e.target)) setIsCategoryDropdownOpen(false);
      if (availabilityDropdownRef.current && !availabilityDropdownRef.current.contains(e.target)) setIsAvailabilityDropdownOpen(false);
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') {
        setIsLocationDropdownOpen(false);
        setIsCategoryDropdownOpen(false);
        setIsAvailabilityDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  if (authLoading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <div className="flex items-center gap-3 text-cyan-300 font-['Orbitron']">
          <svg className="h-5 w-5 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
          </svg>
          <span>{t('checkingAuthentication')}</span>
        </div>
      </div>
    );
  }
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  if (isAuthenticated && !isAdmin) return <Navigate to="/" replace />;

  const openCreate = () => {
    setForm({ ...defaultForm, availability: true });
    setModal({ type: 'create', car: null });
  };
  const openEdit = (car) => {
    setForm({
      ...defaultForm,
      ...car,
      features: Array.isArray(car.features) ? car.features.join(', ') : (car.features || ''),
      imagesText: Array.isArray(car.images) ? car.images.join(', ') : '',
      engine: car.specifications?.engine || '',
      power: car.specifications?.power || '',
      torque: car.specifications?.torque || '',
      acceleration: car.specifications?.acceleration || '',
      fuelEconomy: car.specifications?.fuelEconomy || '',
      range: car.specifications?.range || '',
      seatingCapacity: car.specifications?.seatingCapacity || '',
      luggage: car.specifications?.luggage || '',
      specDoors: car.specifications?.doors || '',
      specTransmission: car.specifications?.transmission || '',
      horsepower: car.specifications?.horsepower || '',
      topSpeed: car.specifications?.topSpeed || '',
      weight: car.specifications?.weight || '',
      length: car.specifications?.length || '',
      width: car.specifications?.width || '',
      height: car.specifications?.height || '',
      wheelbase: car.specifications?.wheelbase || '',
      driveType: car.specifications?.driveType || '',
    });
    setModal({ type: 'edit', car });
  };
  const openView = (car) => {
    setModal({ type: 'view', car });
  };
  const openDelete = (car) => {
    setModal({ type: 'delete', car });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setProcessing(true);
    try {
      const required = ['name', 'make', 'model', 'category', 'pricePerDay', 'location', 'image'];
      for (const f of required) {
        if (!String(form[f] ?? '').trim()) {
          showError(t('adminCarsPleaseFilAllRequiredFields').replace('{field}', f));
          setProcessing(false);
          return;
        }
      }
      const payload = {
        name: form.name.trim(),
        make: form.make.trim(),
        model: form.model.trim(),
        year: Number(form.year),
        category: form.category,
        pricePerDay: Number(form.pricePerDay),
        location: form.location.trim(),
        image: form.image.trim(),
        features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: form.imagesText ? form.imagesText.split(',').map(s => s.trim()).filter(Boolean) : [],
        description: form.description?.trim() || '',
        transmission: form.transmission,
        fuelType: form.fuelType,
        seats: Number(form.seats),
        doors: Number(form.doors),
        availability: form.availability,
        specifications: {
          engine: form.engine?.trim() || '',
          power: form.power?.trim() || '',
          torque: form.torque?.trim() || '',
          acceleration: form.acceleration?.trim() || '',
          fuelEconomy: form.fuelEconomy?.trim() || '',
          range: form.range?.trim() || '',
          seatingCapacity: form.seatingCapacity ? Number(form.seatingCapacity) : null,
          luggage: form.luggage ? Number(form.luggage) : null,
          doors: form.specDoors ? Number(form.specDoors) : null,
          transmission: form.specTransmission?.trim() || '',
          horsepower: form.horsepower?.trim() || '',
          topSpeed: form.topSpeed?.trim() || '',
          weight: form.weight?.trim() || '',
          length: form.length?.trim() || '',
          width: form.width?.trim() || '',
          height: form.height?.trim() || '',
          wheelbase: form.wheelbase?.trim() || '',
          driveType: form.driveType?.trim() || '',
        },
      };

      if (modal.type === 'create') {
        payload.availability = true;
      }

      if (modal.type === 'create') {
        await api.cars.create(payload);
        showSuccess(t('adminCarsCarCreated'));
      } else if (modal.type === 'edit' && modal.car?._id) {
        await api.cars.update(modal.car._id, payload);
        showSuccess(t('adminCarsCarUpdated'));
      }
      setModal({ type: null, car: null });
      await fetchCars({ page: 1 });
      loadGlobalAvailabilityStats();
    } catch {
      showError(t('adminCarsOperationFailed'));
    } finally {
      setProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!modal.car?._id) return;
    setProcessing(true);
    try {
      await api.cars.delete(modal.car._id);
      showSuccess(t('adminCarsCarDeleted'));
      const newPage = cars.length === 1 && page > 1 ? page - 1 : page;
      await fetchCars({ page: newPage });
      setModal({ type: null, car: null });
      loadGlobalAvailabilityStats();
    } catch (e) {
      showError(e?.message || t('adminCarsFailedToDeleteCar'));
    } finally {
      setProcessing(false);
    }
  };

  const onSearch = (e) => {
    e?.preventDefault?.();
    fetchCars({ page: 1, search });
    loadGlobalAvailabilityStats({ search });
  };

  const handleAvailabilityChange = (value) => {
    setAvailabilityFilter(value);
    setPage(1);
    fetchCars({ page: 1 });
    loadGlobalAvailabilityStats();
  };

  return (
    <>
      <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
        {/* Background */}
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-gradient-to-b from-black/95 via-black/80 to-black/95" />
          <div
            className="absolute inset-0 opacity-[0.08]"
            style={{
              backgroundImage:
                'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        <div className="relative z-20 container mx-auto px-4 py-12">
          <div className="max-w-7xl mx-auto">
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2 leading-tight">{t('adminCarsManagement')}</h1>
                <p className="text-gray-400 mb-3">{t('adminCarsManagementDescription')}</p>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>
              <div className="text-right flex items-end gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">
                    {availabilityFilter === 'all' 
                      ? globalAvailabilityStats.total 
                      : availabilityFilter === 'available' 
                        ? globalAvailabilityStats.available 
                        : globalAvailabilityStats.unavailable
                    }
                  </div>
                  <div className="text-sm text-gray-400">
                    {availabilityFilter === 'all' 
                      ? t('adminCarsTotalCars')
                      : `${availabilityFilter === 'available' ? t('adminCarsAvailable') : t('adminCarsUnavailable')} ${t('adminCarsCars')}`
                    }
                  </div>
                </div>
                <button onClick={openCreate} className="px-6 py-3 text-base rounded-md border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/15 transition-colors cursor-pointer font-['Orbitron']">
                  <span className="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                    </svg>
                    {t('adminCarsAddCar')}
                  </span>
                </button>
              </div>
            </div>

            {/* Card: Filters + Table */}
            <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
              {/* Filters */}
              <form onSubmit={onSearch} className="mb-6 grid grid-cols-1 md:grid-cols-6 gap-3">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder={t('adminCarsSearchPlaceholder')}
                  className="bg-black/40 border border-cyan-900/30 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder:text-gray-400 text-gray-200 md:col-span-2 w-full"
                />
                <button type="submit" className="px-6 py-2 text-base rounded-md border border-cyan-600/40 text-white bg-cyan-600/20 hover:bg-cyan-600/30 transition-colors cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {t('adminCarsSearch')}
                </button>
                {/* Category Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(v => !v)}
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-900/30 rounded-md text-gray-200 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="truncate capitalize">{getTranslatedCategory(category)}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-2 transition-transform ${isCategoryDropdownOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isCategoryDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full bg-black border border-cyan-900/30 rounded-md shadow-lg overflow-hidden">
                      <ul className="max-h-60 overflow-y-auto divide-y divide-cyan-900/20">
                        {[t('adminCarsAllCategories'), ...categories].map((opt) => {
                          const value = opt === t('adminCarsAllCategories') ? '' : opt;
                          const active = (category || '') === value;
                          return (
                            <li key={opt || 'all'}>
                              <button
                                type="button"
                                onClick={() => {
                                  setCategory(value);
                                  setIsCategoryDropdownOpen(false);
                                  fetchCars({ page: 1, category: value });
                                  loadGlobalAvailabilityStats({ category: value });
                                }}
                                className={`w-full text-left px-3 py-2 text-sm capitalize ${active ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'} cursor-pointer`}
                              >
                                {opt === t('adminCarsAllCategories') ? opt : getTranslatedCategory(opt)}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                {/* Availability Dropdown */}
                <div className="relative" ref={availabilityDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsAvailabilityDropdownOpen(v => !v)}
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-900/30 rounded-md text-gray-200 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="truncate capitalize">{
                      availabilityFilter === 'all' ? t('adminCarsAllStatuses') : 
                      availabilityFilter === 'available' ? t('adminCarsAvailable') : 
                      availabilityFilter === 'unavailable' ? t('adminCarsUnavailable') : 
                      availabilityFilter
                    }</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-2 transition-transform ${isAvailabilityDropdownOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isAvailabilityDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full bg-black border border-cyan-900/30 rounded-md shadow-lg overflow-hidden">
                      <ul className="max-h-60 overflow-y-auto divide-y divide-cyan-900/20">
                        {['all', 'available', 'unavailable'].map((opt) => {
                          const active = availabilityFilter === opt;
                          return (
                            <li key={opt}>
                              <button
                                type="button"
                                onClick={() => {
                                  handleAvailabilityChange(opt);
                                  setIsAvailabilityDropdownOpen(false);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm capitalize ${active ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'} cursor-pointer`}
                              >
                                {opt === 'all' ? t('adminCarsAllStatuses') : 
                                 opt === 'available' ? t('adminCarsAvailable') : 
                                 opt === 'unavailable' ? t('adminCarsUnavailable') : opt}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>

                {/* Location Dropdown */}
                <div className="relative" ref={locationDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsLocationDropdownOpen(v => !v)}
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-900/30 rounded-md text-gray-200 flex items-center justify-between hover:bg-white/5 transition-colors cursor-pointer"
                  >
                    <span className="truncate">{selectedLocationLabel}</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className={`h-4 w-4 ml-2 transition-transform ${isLocationDropdownOpen ? 'rotate-180' : ''}`}
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                    </svg>
                  </button>
                  {isLocationDropdownOpen && (
                    <div className="absolute z-30 mt-1 w-full bg-black border border-cyan-900/30 rounded-md shadow-lg overflow-hidden">
                      <ul className="max-h-60 overflow-y-auto divide-y divide-cyan-900/20">
                        {localizedLocations.map((opt) => {
                          const value = opt.value === 'all' ? '' : opt.value;
                          const active = (locationFilter || '') === value;
                          return (
                            <li key={opt.value}>
                              <button
                                type="button"
                                onClick={() => {
                                  setLocationFilter(value);
                                  setIsLocationDropdownOpen(false);
                                  fetchCars({ page: 1, location: value });
                                  loadGlobalAvailabilityStats({ location: value });
                                }}
                                className={`w-full text-left px-3 py-2 text-sm ${active ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'} cursor-pointer`}
                              >
                                {opt.label}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    </div>
                  )}
                </div>
                <button type="button" onClick={() => { setSearch(''); setCategory(''); setLocationFilter(''); setAvailabilityFilter('all'); fetchCars({ page: 1, search: '', category: '', location: '' }); loadGlobalAvailabilityStats({ search: '', category: '', location: '' }); }} className="px-6 py-2 text-base rounded-md border border-gray-600/40 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer w-full md:w-auto">
                  {t('adminCarsReset')}
                </button>
              </form>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-black/60 text-gray-400">
                    <tr>
                      <th className="py-4 px-4 font-medium">{t('adminCarsTableCar')}</th>
                      <th className="py-4 px-4 font-medium">{t('adminCarsTableCategory')}</th>
                      <th className="py-4 px-4 font-medium">{t('adminCarsTableLocation')}</th>
                      <th className="py-4 px-4 font-medium">{t('adminCarsTablePricePerDay')}</th>
                      <th className="py-4 px-4 font-medium">{t('adminCarsTableAvailability')}</th>
                      <th className="py-4 px-4 text-right font-medium">{t('adminCarsTableActions')}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-900/30">
                    {loading ? (
                      <tr><td className="py-6 text-center text-gray-400" colSpan={6}>{t('adminCarsLoadingCars')}</td></tr>
                    ) : error ? (
                      <tr><td className="py-6 text-center text-red-300" colSpan={6}>{t('adminCarsFailedToLoadCars')}</td></tr>
                    ) : paginatedCars.length === 0 ? (
                      <tr><td className="py-6 text-center text-gray-400" colSpan={6}>{t('adminCarsNoCarsFound')}</td></tr>
                    ) : (
                      paginatedCars.map((c) => (
                        <tr key={c._id} className="border-b border-cyan-900/20 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-16 rounded bg-black/40 border border-cyan-900/30 overflow-hidden flex items-center justify-center">
                                {(() => {
                                  const src = getCarImage(c);
                                  return src ? (
                                    <img src={src} alt={c.name} className="h-full w-full object-cover" onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }} />
                                  ) : (
                                    <div className="text-xs text-gray-500">{t('adminCarsNoImage')}</div>
                                  );
                                })()}
                              </div>
                              <div>
                                <div className="text-white font-medium">{c.name || `${c.make || ''} ${c.model || ''}`}</div>
                                <div className="text-gray-400 text-xs">{[c.make, c.model, c.year].filter(Boolean).join(' • ')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 capitalize text-gray-300">{getTranslatedCategory(c.category)}</td>
                          <td className="py-4 px-4 text-gray-300 capitalize">{c.location || '-'}</td>
                          <td className="py-4 px-4 text-gray-300">${c.pricePerDay ?? c.price}</td>
                          <td className="py-4 px-4">
                            {(() => {
                              const availability = carAvailability[c._id];
                              const isAvailable = availability?.available ?? c.availability; 
                              
                              return (
                                <div className="flex flex-col gap-2">
                                  {/* Main Status Badge */}
                                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg text-sm font-medium border ${
                                    isAvailable 
                                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30 shadow-emerald-500/20' 
                                      : 'bg-red-500/10 text-red-400 border-red-500/30 shadow-red-500/20'
                                  } shadow-sm`}>
                                    {/* Status Icon */}
                                    <div className={`w-2 h-2 rounded-full ${
                                      isAvailable ? 'bg-emerald-400' : 'bg-red-400'
                                    } animate-pulse`}></div>
                                    
                                    {/* Status Text */}
                                    <span className="font-semibold text-sm">
                                      {isAvailable ? t('adminCarsAvailable') : t('adminCarsUnavailable')}
                                    </span>
                                  </div>
                                  
                                  {/* Booking Details for Unavailable Cars */}
                                  {!isAvailable && availability && (
                                    <div className="flex flex-col gap-1">
                                      {availability.activeBookings > 0 && (
                                        <div className="flex items-center gap-2 px-2 py-1 bg-orange-500/10 border border-orange-500/20 rounded-md">
                                          <div className="w-1.5 h-1.5 bg-orange-400 rounded-full"></div>
                                          <span className="text-xs text-orange-300 font-medium">
                                            {availability.activeBookings} active booking{availability.activeBookings > 1 ? 's' : ''}
                                          </span>
                                        </div>
                                      )}
                                      
                                      {availability.confirmedBookings > 0 && (
                                        <div className="flex items-center gap-2 px-2 py-1 bg-blue-500/10 border border-blue-500/20 rounded-md">
                                          <div className="w-1.5 h-1.5 bg-blue-400 rounded-full"></div>
                                          <span className="text-xs text-blue-300 font-medium">
                                            {availability.confirmedBookings} confirmed booking{availability.confirmedBookings > 1 ? 's' : ''}
                                          </span>
                                        </div>
                                      )}
                                      
                                      {/* Next Available Date */}
                                      {availability.nextAvailableDate && (
                                        <div className="text-xs text-gray-400 mt-1">
                                          <span className="text-gray-500">Available:</span> {new Date(availability.nextAvailableDate).toLocaleDateString()}
                                        </div>
                                      )}
                                    </div>
                                  )}
                                  
                                  {/* Available Cars - Show Ready Status */}
                                  {isAvailable && (
                                    <div className="flex items-center gap-2 px-2 py-1 bg-emerald-500/5 border border-emerald-500/10 rounded-md">
                                      <svg className="w-3 h-3 text-emerald-400" fill="currentColor" viewBox="0 0 20 20">
                                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                      </svg>
                                      <span className="text-xs text-emerald-300 font-medium">
                                        Ready to rent
                                      </span>
                                    </div>
                                  )}
                                </div>
                              );
                            })()}
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openView(c)} className="px-3 py-1.5 text-xs rounded-md border border-gray-600/40 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5C5 3.5 1.73 7.11.46 9a1 1 0 000 1c1.27 1.89 4.54 5.5 9.54 5.5s8.27-3.61 9.54-5.5a1 1 0 000-1C18.27 7.11 15 3.5 10 3.5zm0 10a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/><circle cx="10" cy="9" r="2.5"/></svg>
                                {t('adminCarsView')}
                              </button>
                              <button onClick={() => openEdit(c)} className="px-3 py-1.5 text-xs rounded-md border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/15 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" /><path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.829-2.828z" /></svg>
                                {t('adminCarsEdit')}
                              </button>
                              <button onClick={() => openDelete(c)} className="px-3 py-1.5 text-xs rounded-md border border-red-600/40 text-red-300 hover:bg-red-600/15 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                {t('adminCarsDelete')}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              <div className="mt-6 flex items-center justify-between text-sm text-gray-300 bg-black/40 rounded-lg p-4 border border-cyan-900/30">
                <div className="flex items-center gap-4">
                  <div>{t('adminCarsShowing')} <span className="text-white font-medium">{Math.min((paginationInfo.currentPage - 1) * PAGE_SIZE + 1, paginatedCars.length > 0 ? paginatedCars.length : 1)}</span> {t('adminCarsTo')} <span className="text-white font-medium">{Math.min(paginationInfo.currentPage * PAGE_SIZE, paginationInfo.totalItems)}</span> {t('adminCarsOf')} <span className="text-white font-medium">{
                    availabilityFilter === 'all' 
                      ? globalAvailabilityStats.total 
                      : availabilityFilter === 'available' 
                        ? globalAvailabilityStats.available 
                        : globalAvailabilityStats.unavailable
                  }</span> {t('adminCarsCars')}</div>
                </div>
                <div className="flex items-center gap-2">
                  {paginationInfo.totalPages > 1 ? (
                    <>
                      <button 
                        disabled={!paginationInfo.hasPrevPage || loading} 
                        onClick={() => {
                          const newPage = page - 1;
                          setPage(newPage);
                          if (availabilityFilter === 'all') {
                            fetchCars({ page: newPage });
                          }
                        }} 
                        className={`px-4 py-2 rounded-md border transition-colors flex items-center gap-2 ${!paginationInfo.hasPrevPage || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                        {t('adminCarsPrevious')}
                      </button>
                      <div className="px-3 py-2 bg-cyan-600/20 border border-cyan-600/40 rounded-md text-cyan-300">
                        {paginationInfo.currentPage} of {paginationInfo.totalPages}
                      </div>
                      <button 
                        disabled={!paginationInfo.hasNextPage || loading} 
                        onClick={() => {
                          const newPage = page + 1;
                          setPage(newPage);
                          if (availabilityFilter === 'all') {
                            fetchCars({ page: newPage });
                          }
                        }} 
                        className={`px-4 py-2 rounded-md border transition-colors flex items-center gap-2 ${!paginationInfo.hasNextPage || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                      >
                        {t('adminCarsNext')}
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                      </button>
                    </>
                  ) : (
                    <div className="px-3 py-2 bg-gray-600/20 border border-gray-600/40 rounded-md text-gray-400">
                      {availabilityFilter === 'all' ? 'All cars' : `All ${availabilityFilter} cars`}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Border Glow */}
        <div className="relative h-px w-full overflow-hidden">
          <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        </div>
      </div>

      {/* Create/Edit Modal */}
      {['create', 'edit'].includes(modal.type) && (
        <CreateEditCarModal
          open
          mode={modal.type}
          categories={categories}
          form={form}
          setForm={setForm}
          uploadingImages={uploadingImages}
          onUploadImages={handleImageUpload}
          processing={processing}
          onClose={() => setModal({ type: null, car: null })}
          onSubmit={handleSubmit}
        />
      )}

      {/* View Modal */}
      <CarViewModal
        open={modal.type === 'view'}
        onClose={() => setModal({ type: null, car: null })}
        car={modal.car}
      />

      {/* Delete Modal */}
      <DeleteCarModal
        open={modal.type === 'delete'}
        onClose={() => setModal({ type: null, car: null })}
        car={modal.car}
        onConfirm={confirmDelete}
        processing={processing}
      />
    </>
  );
};

export default AdminCars;
