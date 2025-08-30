import React, { useContext, useEffect, useMemo, useRef, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../config/api';
import { useNotification } from '../../context/notificationUtils';
import FuturisticModal from '../../components/Ui/FuturisticModal';
import CreateEditCarModal from '../../components/Admin/CreateEditCarModal';
import CarViewModal from '../../components/Admin/CarViewModal';
import AuthContext from '../../context/authContext';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { locations as allLocations } from '../../assets/assets';

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
  transmission: '',
  fuelType: '',
  seats: '',
  doors: '',
  availability: true,
};

const AdminCars = () => {
  const { showSuccess, showError } = useNotification();
  const { user: currentUser, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const [uploadingImages, setUploadingImages] = useState(false);
  const [confirmAck, setConfirmAck] = useState(false);
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [cars, setCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  // filters
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [availabilityFilter, setAvailabilityFilter] = useState('all'); // 'all', 'available', 'unavailable'
  
  

  const [categories, setCategories] = useState([]);
  // dropdown state (location)
  const [isLocationDropdownOpen, setIsLocationDropdownOpen] = useState(false);
  const locationDropdownRef = useRef(null);
  // dropdown state (category)
  const [isCategoryDropdownOpen, setIsCategoryDropdownOpen] = useState(false);
  const categoryDropdownRef = useRef(null);
  // dropdown state (availability)
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

  const [modal, setModal] = useState({ type: null, car: null }); // type: 'create' | 'edit' | 'delete'
  const [form, setForm] = useState(defaultForm);
  const [processing, setProcessing] = useState(false);

  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  const loadCategories = async () => {
    try {
      const res = await api.cars.getCategories();
      if (res?.success) setCategories(res.data.categories || []);
    } catch {
      // non-blocking
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
        showSuccess('Images uploaded');
      } else {
        showError('No images returned from server');
      }
    } catch (err) {
      showError(err?.message || 'Failed to upload images');
    } finally {
      setUploadingImages(false);
      // reset the input so user can re-select same files if needed
      e.target.value = '';
    }
  };

  const fetchCars = async (opts = {}) => {
    // Build params while excluding undefined/empty values to avoid sending "undefined" strings
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

    const availability = opts.availability ?? availabilityFilter;
    if (availability === 'available') {
      params.availability = true;
    } else if (availability === 'unavailable') {
      params.availability = false;
    } else {
      // Default: show all cars (both available and unavailable)
      params.availability = 'all';
    }

    setLoading(true);
    setError('');
    try {
      const res = await api.cars.getAll(params);
      if (res?.success) {
        setCars(res.data.cars || []);
        setPage(res.data.pagination.currentPage || 1);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalItems(res.data.pagination.totalItems || 0);
      } else {
        throw new Error(res?.message || 'Failed to load cars');
      }
    } catch {
      setError('Failed to load cars');
      showError('Failed to load cars');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchCars({ page: 1 });
      loadCategories();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  // Close location dropdown on outside click / ESC
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

  // guard
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
    });
    setModal({ type: 'edit', car });
  };
  const openView = (car) => {
    setModal({ type: 'view', car });
  };
  const openDelete = (car) => {
    setConfirmAck(false);
    setModal({ type: 'delete', car });
  };

  const handleSubmit = async (e) => {
    e?.preventDefault?.();
    setProcessing(true);
    try {
      // minimal validation
      const required = ['name', 'category', 'pricePerDay', 'location', 'image'];
      for (const f of required) {
        if (!String(form[f] ?? '').trim()) {
          showError('Please fill all required fields');
          setProcessing(false);
          return;
        }
      }
      const payload = {
        name: form.name.trim(),
        make: form.make?.trim() || null,
        model: form.model?.trim() || null,
        year: form.year ? Number(form.year) : null,
        category: form.category,
        pricePerDay: Number(form.pricePerDay),
        location: form.location.trim(),
        image: form.image.trim(),
        features: form.features ? form.features.split(',').map(s => s.trim()).filter(Boolean) : [],
        images: form.imagesText ? form.imagesText.split(',').map(s => s.trim()).filter(Boolean) : [],
        description: form.description?.trim() || null,
        transmission: form.transmission || null,
        fuelType: form.fuelType || null,
        seats: form.seats ? Number(form.seats) : null,
        doors: form.doors ? Number(form.doors) : null,
        availability: form.availability,
      };

      if (modal.type === 'create') {
        payload.availability = true;
      }

      if (modal.type === 'create') {
        await api.cars.create(payload);
        showSuccess('Car created');
      } else if (modal.type === 'edit' && modal.car?._id) {
        await api.cars.update(modal.car._id, payload);
        showSuccess('Car updated');
      }
      setModal({ type: null, car: null });
      await fetchCars({ page: 1 });
    } catch {
      showError('Operation failed');
    } finally {
      setProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!modal.car?._id) return;
    setProcessing(true);
    try {
      await api.cars.delete(modal.car._id);
      showSuccess('Car deleted');
      const newPage = cars.length === 1 && page > 1 ? page - 1 : page;
      await fetchCars({ page: newPage });
      setModal({ type: null, car: null });
    } catch (e) {
      showError(e?.message || 'Failed to delete car');
    } finally {
      setProcessing(false);
    }
  };

  const onSearch = (e) => {
    e?.preventDefault?.();
    fetchCars({ page: 1, search });
  };

  const handleAvailabilityChange = (value) => {
    setAvailabilityFilter(value);
    fetchCars({ page: 1, availability: value });
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
                <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2 leading-tight">Car Management</h1>
                <p className="text-gray-400 mb-3">Create, update, and manage cars in your fleet.</p>
                <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
              </div>
              <div className="text-right flex items-end gap-4">
                <div>
                  <div className="text-2xl font-bold text-white">{totalItems}</div>
                  <div className="text-sm text-gray-400">Total Cars</div>
                </div>
                <button onClick={openCreate} className="px-6 py-3 text-base rounded-md border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/15 transition-colors cursor-pointer font-['Orbitron']">
                  <span className="inline-flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                      <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                    </svg>
                    Add Car
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
                  placeholder="Search (make, model, category)"
                  className="bg-black/40 border border-cyan-900/30 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder:text-gray-400 text-gray-200 md:col-span-2 w-full"
                />
                <button type="submit" className="px-6 py-2 text-base rounded-md border border-cyan-600/40 text-white bg-cyan-600/20 hover:bg-cyan-600/30 transition-colors cursor-pointer flex items-center justify-center gap-2 w-full md:w-auto">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  Search
                </button>
                {/* Category Dropdown */}
                <div className="relative" ref={categoryDropdownRef}>
                  <button
                    type="button"
                    onClick={() => setIsCategoryDropdownOpen(v => !v)}
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-900/30 rounded-md text-gray-200 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="truncate capitalize">{category || 'All Categories'}</span>
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
                        {["All Categories", ...categories].map((opt) => {
                          const value = opt === 'All Categories' ? '' : opt;
                          const active = (category || '') === value;
                          return (
                            <li key={opt || 'all'}>
                              <button
                                type="button"
                                onClick={() => {
                                  setCategory(value);
                                  setIsCategoryDropdownOpen(false);
                                  fetchCars({ page: 1, category: value });
                                }}
                                className={`w-full text-left px-3 py-2 text-sm capitalize ${active ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'}`}
                              >
                                {opt}
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
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-900/30 rounded-md text-gray-200 flex items-center justify-between hover:bg-white/5 transition-colors"
                  >
                    <span className="truncate capitalize">{availabilityFilter === 'all' ? 'All Statuses' : availabilityFilter}</span>
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
                                className={`w-full text-left px-3 py-2 text-sm capitalize ${active ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'}`}
                              >
                                {opt === 'all' ? 'All Statuses' : opt}
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
                    className="w-full px-3 py-2 bg-black/40 border border-cyan-900/30 rounded-md text-gray-200 flex items-center justify-between hover:bg-white/5 transition-colors"
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
                                }}
                                className={`w-full text-left px-3 py-2 text-sm ${active ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'}`}
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
                <button type="button" onClick={() => { setSearch(''); setCategory(''); setLocationFilter(''); setAvailabilityFilter('all'); fetchCars({ page: 1, search: '', category: '', location: '', availability: 'all' }); }} className="px-6 py-2 text-base rounded-md border border-gray-600/40 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer w-full md:w-auto">
                  Reset
                </button>
              </form>

              {/* Table */}
              <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
                <table className="min-w-full text-left text-sm">
                  <thead className="bg-black/60 text-gray-400">
                    <tr>
                      <th className="py-4 px-4 font-medium">Car</th>
                      <th className="py-4 px-4 font-medium">Category</th>
                      <th className="py-4 px-4 font-medium">Location</th>
                      <th className="py-4 px-4 font-medium">Price/Day</th>
                      <th className="py-4 px-4 font-medium">Availability</th>
                      <th className="py-4 px-4 text-right font-medium">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-cyan-900/30">
                    {loading ? (
                      <tr><td className="py-6 text-center text-gray-400" colSpan={6}>Loading cars...</td></tr>
                    ) : error ? (
                      <tr><td className="py-6 text-center text-red-300" colSpan={6}>Failed to load cars</td></tr>
                    ) : cars.length === 0 ? (
                      <tr><td className="py-6 text-center text-gray-400" colSpan={6}>No cars found</td></tr>
                    ) : (
                      cars.map((c) => (
                        <tr key={c._id} className="border-b border-cyan-900/20 hover:bg-white/5 transition-colors">
                          <td className="py-4 px-4">
                            <div className="flex items-center gap-3">
                              <div className="h-12 w-16 rounded bg-black/40 border border-cyan-900/30 overflow-hidden flex items-center justify-center">
                                {(() => {
                                  const src = c.image || (Array.isArray(c.images) ? c.images[0] : '') || (Array.isArray(c.gallery) ? c.gallery[0]?.path : '');
                                  return src ? (
                                    <img src={src} alt={c.name} className="h-full w-full object-cover" />
                                  ) : (
                                    <div className="text-xs text-gray-500">No Image</div>
                                  );
                                })()}
                              </div>
                              <div>
                                <div className="text-white font-medium">{c.name || `${c.make || ''} ${c.model || ''}`}</div>
                                <div className="text-gray-400 text-xs">{[c.make, c.model, c.year].filter(Boolean).join(' • ')}</div>
                              </div>
                            </div>
                          </td>
                          <td className="py-4 px-4 capitalize text-gray-300">{c.category}</td>
                          <td className="py-4 px-4 text-gray-300 capitalize">{c.location || '-'}</td>
                          <td className="py-4 px-4 text-gray-300">${c.pricePerDay ?? c.price}</td>
                          <td className="py-4 px-4">
                            <span className={`px-2 py-0.5 rounded text-xs ${c.availability ? 'bg-green-600/20 text-green-300 border border-green-500/30' : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'}`}>
                              {c.availability ? 'Available' : 'Unavailable'}
                            </span>
                          </td>
                          <td className="py-4 px-4">
                            <div className="flex items-center justify-end gap-2">
                              <button onClick={() => openView(c)} className="px-3 py-1.5 text-xs rounded-md border border-gray-600/40 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M10 3.5C5 3.5 1.73 7.11.46 9a1 1 0 000 1c1.27 1.89 4.54 5.5 9.54 5.5s8.27-3.61 9.54-5.5a1 1 0 000-1C18.27 7.11 15 3.5 10 3.5zm0 10a4.5 4.5 0 110-9 4.5 4.5 0 010 9z"/><circle cx="10" cy="9" r="2.5"/></svg>
                                View
                              </button>
                              <button onClick={() => openEdit(c)} className="px-3 py-1.5 text-xs rounded-md border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/15 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793z" /><path d="M11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.829-2.828z" /></svg>
                                Edit
                              </button>
                              <button onClick={() => openDelete(c)} className="px-3 py-1.5 text-xs rounded-md border border-red-600/40 text-red-300 hover:bg-red-600/15 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" /><path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" /></svg>
                                Delete
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
                  <div>Showing <span className="text-white font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, totalItems)}</span> to <span className="text-white font-medium">{Math.min(page * PAGE_SIZE, totalItems)}</span> of <span className="text-white font-medium">{totalItems}</span> cars</div>
                </div>
                <div className="flex items-center gap-2">
                  <button disabled={page <= 1 || loading} onClick={() => fetchCars({ page: page - 1 })} className={`px-4 py-2 rounded-md border transition-colors flex items-center gap-2 ${page <= 1 || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}>
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                    Previous
                  </button>
                  <div className="px-3 py-2 bg-cyan-600/20 border border-cyan-600/40 rounded-md text-cyan-300">
                    {page} of {totalPages}
                  </div>
                  <button disabled={page >= totalPages || loading} onClick={() => fetchCars({ page: page + 1 })} className={`px-4 py-2 rounded-md border transition-colors flex items-center gap-2 ${page >= totalPages || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}>
                    Next
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" /></svg>
                  </button>
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
      {modal.type === 'delete' && (
        <FuturisticModal
          open
          onClose={() => { setConfirmAck(false); setModal({ type: null, car: null }); }}
          title="Delete Car"
          actions={[
            { label: 'Cancel', onClick: () => { setConfirmAck(false); setModal({ type: null, car: null }); } },
            { label: processing ? 'Deleting...' : 'Delete', onClick: confirmDelete, variant: 'danger', disabled: processing || !confirmAck },
          ]}
        >
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="h-24 w-36 rounded bg-black/40 border border-red-900/40 overflow-hidden flex items-center justify-center">
                {(() => {
                  const c = modal.car || {};
                  const src = c.image || (Array.isArray(c.images) ? c.images[0] : '') || (Array.isArray(c.gallery) ? c.gallery[0]?.path : '');
                  return src ? (
                    <img src={src} alt={c.name || 'car'} className="h-full w-full object-cover" />
                  ) : (
                    <div className="text-xs text-gray-500">No Image</div>
                  );
                })()}
              </div>
              <div>
                <div className="text-lg font-semibold text-white">{modal.car?.name || `${modal.car?.make || ''} ${modal.car?.model || ''}`}</div>
                <div className="text-gray-400 text-sm">{[modal.car?.make, modal.car?.model, modal.car?.year].filter(Boolean).join(' • ')}</div>
              </div>
            </div>

            <div className="rounded-md border border-red-900/40 bg-red-950/30 p-3">
              <div className="flex items-center gap-2 text-red-400 font-medium">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5"><path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25zM10.5 8.25a1.5 1.5 0 113 0v4.5a1.5 1.5 0 11-3 0V8.25zm1.5 8.25a1.125 1.125 0 100-2.25 1.125 1.125 0 000 2.25z" clipRule="evenodd" /></svg>
                <span>Deleting this car is permanent.</span>
              </div>
              <p className="mt-2 text-sm text-gray-300">This will remove the car from listings. Existing bookings will not be deleted but may be impacted.</p>
            </div>

            <label className="flex items-start gap-2 text-sm text-gray-200 cursor-pointer">
              <input type="checkbox" checked={confirmAck} onChange={(e) => setConfirmAck(e.target.checked)} />
              <span>I understand that this action cannot be undone.</span>
            </label>
          </div>
        </FuturisticModal>
      )}
    </>
  );
};

export default AdminCars;
