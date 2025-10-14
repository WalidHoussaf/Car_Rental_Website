import React, { useEffect, useMemo, useState, useContext, useRef } from 'react';
import { Navigate } from 'react-router-dom';
import { api } from '../../config/api';
import { useNotification } from '../../context/notificationUtils';
import AuthContext from '../../context/authContext';
import CreateEditUserModal from '../../components/Admin/CreateEditUserModal';
import VerifyModal from '../../components/Admin/VerifyModal';
import RoleChangeModal from '../../components/Admin/RoleChangeModal';
import DeleteModal from '../../components/Admin/DeleteModal';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';

const PAGE_SIZE = 10;

const AdminUsers = () => {
  const { showSuccess, showError } = useNotification();
  const { user: currentUser, isAuthenticated, loading: authLoading } = useContext(AuthContext);
  const { language } = useLanguage();
  const t = useTranslations(language);

  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [modal, setModal] = useState({ type: null, user: null });
  const [processing, setProcessing] = useState(false);
  const [roleChoice, setRoleChoice] = useState('customer');
  const [createForm, setCreateForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    dateOfBirth: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalItems, setTotalItems] = useState(0);

  const [search, setSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('');
  const [isRoleDropdownOpen, setIsRoleDropdownOpen] = useState(false);
  const roleDropdownRef = useRef(null);

  const isAdmin = useMemo(() => currentUser?.role === 'admin', [currentUser]);

  useEffect(() => {
    if (!isAuthenticated || !isAdmin) {
      setError(t('notAuthorized'));
    }
  }, [isAuthenticated, isAdmin, t]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (roleDropdownRef.current && !roleDropdownRef.current.contains(e.target)) {
        setIsRoleDropdownOpen(false);
      }
    };
    const handleEsc = (e) => {
      if (e.key === 'Escape') setIsRoleDropdownOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleEsc);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEsc);
    };
  }, []);

  const fetchUsers = async (opts = {}) => {
    const { page: p = page, search: s = search, role: r = roleFilter } = opts;
    setLoading(true);
    setError('');
    try {
      const res = await api.users.getAll({ page: p, limit: PAGE_SIZE, search: s || undefined, role: r || undefined });
      if (res?.success) {
        setUsers(res.data.users || []);
        setPage(res.data.pagination.currentPage || 1);
        setTotalPages(res.data.pagination.totalPages || 1);
        setTotalItems(res.data.pagination.totalItems || 0);
      } else {
        throw new Error(res?.message || t('failedToLoadUsers'));
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError(t('failedToLoadUsers'));
      showError(t('failedToLoadUsers'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isAuthenticated && isAdmin) {
      fetchUsers({ page: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isAuthenticated, isAdmin]);

  const onSearch = (e) => {
    e.preventDefault();
    fetchUsers({ page: 1, search });
  };

  const onChangeRole = async (id, nextRole) => {
    if (id === currentUser?._id) {
      showError(t('cannotChangeOwnRole'));
      return;
    }
    try {
      setLoading(true);
      await api.users.updateRole(id, nextRole);
      showSuccess(t('roleUpdated'));
      await fetchUsers();
    } catch (error) {
      console.error('Failed to update role:', error);
      showError(t('failedToUpdateRole'));
    } finally {
      setLoading(false);
    }
  };

  const onVerify = async (id) => {
    try {
      setLoading(true);
      await api.users.verify(id);
      showSuccess(t('userVerified'));
      await fetchUsers();
    } catch (error) {
      console.error('Failed to verify user:', error);
      showError(t('failedToVerifyUser'));
    } finally {
      setLoading(false);
    }
  };

  const onDelete = async (id) => {
    if (id === currentUser?._id) {
      showError(t('cannotDeleteOwnAccount'));
      return;
    }
    try {
      setLoading(true);
      await api.users.delete(id);
      showSuccess(t('userDeleted'));
      const newPage = users.length === 1 && page > 1 ? page - 1 : page;
      await fetchUsers({ page: newPage });
    } catch (error) {
      console.error('Failed to delete user:', error);
      showError(t('failedToDeleteUser'));
    } finally {
      setLoading(false);
    }
  };

  const openVerify = (user) => setModal({ type: 'verify', user });
  const openRole = (user) => {
    setRoleChoice(user?.role === 'admin' ? 'customer' : 'admin');
    setModal({ type: 'role', user });
  };
  const openDelete = (user) => setModal({ type: 'delete', user });
  const openCreate = () => setModal({ type: 'create', user: null });

  const confirmVerify = async () => {
    if (!modal.user) return;
    setProcessing(true);
    try {
      await onVerify(modal.user._id);
      setModal({ type: null, user: null });
    } finally {
      setProcessing(false);
    }
  };

  const confirmRoleChange = async () => {
    if (!modal.user) return;
    if (modal.user._id === currentUser?._id) {
      showError(t('cannotChangeOwnRole'));
      return;
    }
    setProcessing(true);
    try {
      await onChangeRole(modal.user._id, roleChoice);
      setModal({ type: null, user: null });
    } finally {
      setProcessing(false);
    }
  };

  const confirmDelete = async () => {
    if (!modal.user) return;
    setProcessing(true);
    try {
      await onDelete(modal.user._id);
      setModal({ type: null, user: null });
    } finally {
      setProcessing(false);
    }
  };

  const submitCreate = async (e) => {
    console.log('🚀 submitCreate called', { processing, createForm });
    e?.preventDefault?.();
    setProcessing(true);
    try {
      const requiredFields = ['firstName', 'lastName', 'email', 'phone', 'password', 'dateOfBirth', 'street', 'city', 'state', 'zipCode', 'country'];
      for (const f of requiredFields) {
        if (!String(createForm[f] || '').trim()) {
          setProcessing(false);
          showError(t('fillRequiredFields'));
          return;
        }
      }
      // Validate email format
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(createForm.email.trim())) {
        setProcessing(false);
        showError('Please provide a valid email address');
        return;
      }
      // Validate age (must be 18+)
      if (createForm.dateOfBirth) {
        const birthDate = new Date(createForm.dateOfBirth);
        const today = new Date();
        const age = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        const dayDiff = today.getDate() - birthDate.getDate();
        const actualAge = monthDiff < 0 || (monthDiff === 0 && dayDiff < 0) ? age - 1 : age;
        
        if (actualAge < 18) {
          setProcessing(false);
          showError('User must be at least 18 years old');
          return;
        }
      }
      // Validate phone number format
      if (!/^[+]?[\d\s\-()]{7,15}$/.test(createForm.phone.trim())) {
        setProcessing(false);
        showError('Please provide a valid phone number (7-15 digits with optional +, spaces, dashes, or parentheses)');
        return;
      }
      // Validate zip code
      const zipCodeValue = createForm.zipCode.trim();
      console.log('Validating zip code:', { value: zipCodeValue, length: zipCodeValue.length, test: /^\d{5}$/.test(zipCodeValue) });
      if (!/^\d{5}$/.test(zipCodeValue)) {
        setProcessing(false);
        showError(t('invalidZipCode'));
        return;
      }
      // Password must be at least 8 characters with lowercase, uppercase, number, and special character
      if (!/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&#^()_+\-=[\]{};':"\\|,.<>/?]).{8,}$/.test(createForm.password)) {
        setProcessing(false);
        showError('Password must be at least 8 characters and contain uppercase, lowercase, number, and special character');
        return;
      }

      const payload = {
        firstName: createForm.firstName.trim(),
        lastName: createForm.lastName.trim(),
        email: createForm.email.trim().toLowerCase(),
        password: createForm.password,
        phone: createForm.phone.trim(),
        dateOfBirth: createForm.dateOfBirth, 
        address: {
          street: createForm.street.trim(),
          city: createForm.city.trim(),
          state: createForm.state.trim(),
          zipCode: createForm.zipCode.trim(),
          country: createForm.country.trim(),
        },
      };

      await api.users.create(payload);
      showSuccess(t('userCreated'));
      setCreateForm({
        firstName: '', lastName: '', email: '', phone: '', password: '',
        dateOfBirth: '', street: '', city: '', state: '', zipCode: '', country: ''
      });
      setModal({ type: null, user: null });
      await fetchUsers({ page: 1 });
    } catch (error) {
      console.error('Failed to create user:', error);
      showError(t('failedToCreateUser'));
    } finally {
      setProcessing(false);
    }
  };

  const RoleBadge = ({ role }) => (
    <span className={`px-2 py-0.5 rounded text-xs ${role === 'admin' ? 'bg-purple-600/20 text-purple-300 border border-purple-500/30' : 'bg-cyan-600/20 text-cyan-300 border border-cyan-500/30'}`}>
      {role === 'admin' ? t('admin') : t('customer')}
    </span>
  );

  const VerifiedBadge = ({ ok }) => (
    <span className={`px-2 py-0.5 rounded text-xs ${ok ? 'bg-green-600/20 text-green-300 border border-green-500/30' : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'}`}>
      {ok ? t('verified') : t('unverified')}
    </span>
  );

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

  return (
    <>
    <div className="bg-black text-white min-h-screen font-['Orbitron'] relative overflow-hidden">
      {/* Background Effects */}
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
              <h1 className="text-4xl font-bold bg-gradient-to-r from-white to-cyan-400 bg-clip-text text-transparent mb-2 leading-tight">{t('userManagement')}</h1>
              <p className="text-gray-400 mb-3">{t('userdescription')}</p>
              <div className="w-24 h-1 bg-gradient-to-r from-transparent via-cyan-400 to-transparent"></div>
            </div>
            <div className="text-right flex items-end gap-4">
              <div>
                <div className="text-2xl font-bold text-white">{totalItems}</div>
                <div className="text-sm text-gray-400">{t('totalUsers')}</div>
              </div>
              <button
                onClick={openCreate}
                className="px-6 py-3 text-base rounded-md border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/15 transition-colors cursor-pointer font-['Orbitron']"
              >
                <span className="inline-flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
                    <path d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" />
                  </svg>
                  {t('createUser')}
                </span>
              </button>
            </div>
          </div>

          {/* Card: Filters + Table */}
          <div className="bg-gray-900/50 backdrop-blur-sm border border-cyan-800/30 rounded-xl p-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-black/40 border border-cyan-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM3.75 20.1a8.25 8.25 0 0116.5 0 .9.9 0 01-.9.9H4.65a.9.9 0 01-.9-.9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{users.filter(u => u.role === 'customer').length}</div>
                    <div className="text-sm text-gray-400">{t('customers')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-purple-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M12.516 2.17a.75.75 0 00-1.032 0 11.209 11.209 0 01-7.877 3.08.75.75 0 00-.722.515A12.74 12.74 0 002.25 9.75c0 5.814 3.903 10.708 9.227 12.21a.75.75 0 00.546 0C17.347 20.458 21.25 15.564 21.25 9.75a12.74 12.74 0 00-.635-4.235.75.75 0 00-.722-.515 11.209 11.209 0 01-7.877-3.08z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{users.filter(u => u.role === 'admin').length}</div>
                    <div className="text-sm text-gray-400">{t('admins')}</div>
                  </div>
                </div>
              </div>
              <div className="bg-black/40 border border-green-900/30 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-lg bg-green-500/15 border border-green-500/30 flex items-center justify-center text-green-300">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-5 w-5">
                      <path fillRule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <div className="text-xl font-bold text-white">{users.filter(u => u.isVerified).length}</div>
                    <div className="text-sm text-gray-400">{t('verified')}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Filters */}
            <form onSubmit={onSearch} className="mb-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder={t('searchfield')}
                className="bg-black/40 border border-cyan-900/30 rounded-md py-2 px-3 focus:ring-2 focus:ring-cyan-500 focus:outline-none placeholder:text-gray-400 font-['Orbitron'] text-gray-200"
              />
              <div className="relative" ref={roleDropdownRef}>
                <button
                  type="button"
                  onClick={() => setIsRoleDropdownOpen(!isRoleDropdownOpen)}
                  className="w-full text-left font-['Orbitron'] bg-black/40 border border-cyan-900/30 rounded-md py-2 pl-3 pr-9 focus:ring-2 focus:ring-cyan-500 focus:outline-none text-gray-200 hover:border-cyan-600/40 transition-colors cursor-pointer"
                >
                  {roleFilter === '' ? t('allRoles') : roleFilter === 'customer' ? t('customers') : t('admins')}
                </button>
                <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-cyan-300">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className={`h-4 w-4 transition-transform ${isRoleDropdownOpen ? 'rotate-180' : ''}`}>
                    <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.17l3.71-2.94a.75.75 0 11.94 1.16l-4.18 3.31a.75.75 0 01-.94 0L5.21 8.39a.75.75 0 01.02-1.18z" clipRule="evenodd" />
                  </svg>
                </span>
                
                {/* Dropdown Menu */}
                <div
                  className={`absolute right-0 mt-2 w-full rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg transition-all duration-200 z-50 ${isRoleDropdownOpen ? 'opacity-100 translate-y-0 pointer-events-auto' : 'opacity-0 -translate-y-2 pointer-events-none'}`}
                >
                  <div className="py-2 font-['Orbitron']">
                    <button
                      onClick={() => { setRoleFilter(''); setPage(1); fetchUsers({ page: 1, role: '' }); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('allRoles')}
                    </button>
                    <button
                      onClick={() => { setRoleFilter('customer'); setPage(1); fetchUsers({ page: 1, role: 'customer' }); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('customers')}
                    </button>
                    <button
                      onClick={() => { setRoleFilter('admin'); setPage(1); fetchUsers({ page: 1, role: 'admin' }); setIsRoleDropdownOpen(false); }}
                      className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer"
                    >
                      {t('admins')}
                    </button>
                  </div>
                </div>
              </div>
              <button type="submit" className="px-4 py-2 text-sm font-['Orbitron'] text-white bg-cyan-600/20 hover:bg-cyan-600/30 border border-cyan-600/40 rounded-md transition-colors cursor-pointer flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                {t('search')}
              </button>
            </form>

            {/* Table */}
            <div className="overflow-x-auto rounded-lg border border-cyan-900/30">
              <table className="min-w-full text-left text-sm">
                <thead className="bg-black/60 text-gray-400 font-['Orbitron']">
                  <tr>
                    <th className="py-4 px-4 font-medium">{t('user')}</th>
                    <th className="py-4 px-4 font-medium">{t('contact')}</th>
                    <th className="py-4 px-4 font-medium">{t('role')}</th>
                    <th className="py-4 px-4 font-medium">{t('status')}</th>
                    <th className="py-4 px-4 font-medium">{t('joined')}</th>
                    <th className="py-4 px-4 text-right font-medium">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-cyan-900/30">
                  {loading ? (
                    <tr><td className="py-6 text-center text-gray-400" colSpan={6}>{t('loadingUsers')}</td></tr>
                  ) : error ? (
                    <tr><td className="py-6 text-center text-red-300" colSpan={6}>{t('errorLoadingUsers')}</td></tr>
                  ) : users.length === 0 ? (
                    <tr><td className="py-6 text-center text-gray-400" colSpan={6}>{t('noUsers')}</td></tr>
                  ) : (
                    users.map(u => (
                      <tr key={u._id} className="border-b border-cyan-900/20 hover:bg-white/5 transition-colors">
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="h-10 w-10 rounded-full bg-gradient-to-r from-cyan-500/20 to-purple-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 font-['Orbitron'] font-bold">
                              {u.firstName?.[0]?.toUpperCase()}{u.lastName?.[0]?.toUpperCase()}
                            </div>
                            <div>
                              <div className="text-white font-medium">{u.firstName} {u.lastName}</div>
                              <div className="text-gray-400 text-sm font-['Rationale']">#{u._id.slice(-8)}</div>
                            </div>
                          </div>
                        </td>
                        <td className="py-4 px-4">
                          <div>
                            <div className="text-gray-200">{u.email}</div>
                            <div className="text-gray-400 text-xs">{u.phone || 'No phone'}</div>
                          </div>
                        </td>
                        <td className="py-4 px-4 uppercase"><RoleBadge role={u.role} /></td>
                        <td className="py-4 px-4 uppercase"><VerifiedBadge ok={u.isVerified} /></td>
                        <td className="py-4 px-4">
                          <div className="text-gray-300">{new Date(u.createdAt).toLocaleDateString()}</div>
                          <div className="text-gray-500 text-xs">{new Date(u.createdAt).toLocaleTimeString()}</div>
                        </td>
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-end gap-2">
                            {!u.isVerified && (
                              <button onClick={() => openVerify(u)} className="px-3 py-1.5 text-xs font-['Orbitron'] rounded-md border border-green-600/40 text-green-300 hover:bg-green-600/15 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                {t('verify')}
                              </button>
                            )}
                            <button onClick={() => openRole(u)} className="px-3 py-1.5 text-xs font-['Orbitron'] rounded-md border border-cyan-600/40 text-cyan-300 hover:bg-cyan-600/15 transition-colors cursor-pointer flex items-center gap-1 uppercase">
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                              </svg>
                              {t('changeRole')}
                            </button>
                            <button
                              onClick={() => openDelete(u)}
                              disabled={u.role === 'admin'}
                              aria-disabled={u.role === 'admin'}
                              title={u.role === 'admin' ? t('adminsCannotBeDeleted') : t('deleteUser')}
                              className={`px-3 py-1.5 text-xs font-['Orbitron'] rounded-md border transition-colors flex items-center gap-1 uppercase ${
                                u.role === 'admin'
                                  ? 'border-red-900/30 text-red-700/60 cursor-not-allowed opacity-60'
                                  : 'border-red-600/40 text-red-300 hover:bg-red-600/15 cursor-pointer'
                              }`}
                            >
                              <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" viewBox="0 0 20 20" fill="currentColor">
                                <path fillRule="evenodd" d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" clipRule="evenodd" />
                                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                              </svg>
                              {t('delete')}
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
                <div>{t('showing')} <span className="text-white font-medium">{Math.min((page - 1) * PAGE_SIZE + 1, totalItems)}</span> {t('to')} <span className="text-white font-medium">{Math.min(page * PAGE_SIZE, totalItems)}</span> {t('of')} <span className="text-white font-medium">{totalItems}</span> {t('users')} </div>
              </div>
              <div className="flex items-center gap-2">
                <button 
                  disabled={page <= 1 || loading} 
                  onClick={() => fetchUsers({ page: page - 1 })} 
                  className={`px-4 py-2 rounded-md border font-['Orbitron'] transition-colors flex items-center gap-2 ${page <= 1 || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  {t('previous')}
                </button>
                <div className="px-3 py-2 bg-cyan-600/20 border border-cyan-600/40 rounded-md text-cyan-300 font-['Orbitron']">
                  {page} {t('of')} {totalPages}
                </div>
                <button 
                  disabled={page >= totalPages || loading} 
                  onClick={() => fetchUsers({ page: page + 1 })} 
                  className={`px-4 py-2 rounded-md border font-['Orbitron'] transition-colors flex items-center gap-2 ${page >= totalPages || loading ? 'border-cyan-900/30 text-gray-500 cursor-not-allowed' : 'border-cyan-800/30 hover:bg-white/5 cursor-pointer'}`}
                >
                  {t('next')}
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
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
    
    {/* Modals */}
    <VerifyModal
      open={modal.type === 'verify'}
      onClose={() => setModal({ type: null, user: null })}
      user={modal.user}
      onConfirm={confirmVerify}
      processing={processing}
      t={t}
    />

    <RoleChangeModal
      open={modal.type === 'role'}
      onClose={() => setModal({ type: null, user: null })}
      user={modal.user}
      onConfirm={confirmRoleChange}
      processing={processing}
      roleChoice={roleChoice}
      setRoleChoice={setRoleChoice}
      t={t}
    />

    <DeleteModal
      open={modal.type === 'delete'}
      onClose={() => setModal({ type: null, user: null })}
      user={modal.user}
      onConfirm={confirmDelete}
      processing={processing}
      t={t}
    />

    {modal.type === 'create' && (
      <CreateEditUserModal
        open
        mode="create"
        form={createForm}
        setForm={setCreateForm}
        processing={processing}
        onClose={() => setModal({ type: null, user: null })}
        onSubmit={submitCreate}
        t={t}
      />
    )}
  </>
);
}
export default AdminUsers;
