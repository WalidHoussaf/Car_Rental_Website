import React, { useState, useEffect, useCallback } from 'react';

const Field = ({ label, required, children, help, error, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide">
      {label}{required ? ' *' : ''}
    </label>
    {children}
    {help && !error ? <p className="text-sm text-gray-400 mt-1">{help}</p> : null}
    {error ? <p className="text-sm text-red-400 mt-1 flex items-center gap-2">
      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      {error}
    </p> : null}
  </div>
);

const Input = ({ error, ...props }) => (
  <input
    {...props}
    className={
      `bg-gradient-to-br from-black/50 to-black/30 border font-['Orbitron'] rounded-xl py-3.5 px-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 transition-all duration-300 ${
        error 
          ? 'border-red-500/50 focus:ring-red-500/50 focus:border-red-400/50 hover:border-red-600/40' 
          : 'border-cyan-900/30 focus:ring-cyan-500/50 focus:border-cyan-400/50 hover:border-cyan-600/40'
      } ${props.className || ''}`
    }
  />
);

const SectionTitle = ({ children }) => (
  <div className="col-span-full mt-8 mb-6 first:mt-2">
    <div className="flex items-center gap-4">
      <div className="w-2 h-2 bg-cyan-400 rounded-full animate-pulse"></div>
      <h4 className="text-base uppercase tracking-[0.2em] font-['Orbitron'] font-semibold text-transparent bg-gradient-to-r from-cyan-300 to-cyan-500 bg-clip-text flex-shrink-0">
        {children}
      </h4>
      <div className="flex-1 h-px bg-gradient-to-r from-cyan-600/50 via-cyan-800/30 to-transparent"></div>
    </div>
  </div>
);

const CreateEditUserModal = ({
  open,
  mode = 'create',
  form,
  setForm,
  processing,
  onClose,
  onSubmit,
  t
}) => {
  const title = mode === 'create' ? t('createNewUser') : t('editUser');
  
  // Validation state
  const [errors, setErrors] = useState({});

  // Validation functions
  const validateAge = useCallback((dateOfBirth) => {
    if (!dateOfBirth) return null;
    const today = new Date();
    const birthDate = new Date(dateOfBirth);
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    if (age < 18) {
      return t('mustBe18OrOlder');
    }
    return null;
  }, [t]);

  const validatePhone = (phone) => {
    if (!phone) return null;
    const phoneRegex = /^[+]?[\d\s\-()]{7,15}$/;
    if (!phoneRegex.test(phone)) {
      return 'Phone number must be 7-15 digits with optional +, spaces, dashes, or parentheses';
    }
    return null;
  };

  const validatePassword = (password) => {
    if (!password) return null;
    if (password.length < 6) {
      return 'Password must be at least 6 characters long';
    }
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password)) {
      return 'Password must contain at least one lowercase letter, one uppercase letter, and one number';
    }
    return null;
  };

  const validateZipCode = useCallback((zipCode) => {
    if (!zipCode) return null;
    if (!/^\d{5}$/.test(zipCode)) {
      return t('fiveDigitZipCode');
    }
    return null;
  }, [t]);

  const validateRequiredFields = () => {
    const requiredFields = {
      firstName: t('firstName'),
      lastName: t('lastName'),
      email: t('emailAddress'),
      dateOfBirth: t('dateOfBirth'),
      phone: t('phone'),
      password: t('password'),
      street: t('streetAddress'),
      city: t('city'),
      state: t('stateProvince'),
      zipCode: t('zipCode'),
      country: t('country')
    };

    const emptyFieldErrors = {};
    Object.keys(requiredFields).forEach(field => {
      if (!form[field] || String(form[field]).trim() === '') {
        emptyFieldErrors[field] = `${requiredFields[field]} is required`;
      }
    });

    return emptyFieldErrors;
  };

  // Submit handler with validation
  const handleSubmit = (e) => {
    e?.preventDefault?.();
    
    // Check for empty required fields
    const emptyFieldErrors = validateRequiredFields();
    
    // Check for validation errors
    const validationErrors = {};
    const ageError = validateAge(form.dateOfBirth);
    if (ageError) validationErrors.dateOfBirth = ageError;
    
    const phoneError = validatePhone(form.phone);
    if (phoneError) validationErrors.phone = phoneError;
    
    const passwordError = validatePassword(form.password);
    if (passwordError) validationErrors.password = passwordError;
    
    const zipError = validateZipCode(form.zipCode);
    if (zipError) validationErrors.zipCode = zipError;

    // Combine all errors
    const allErrors = { ...emptyFieldErrors, ...validationErrors };
    
    if (Object.keys(allErrors).length > 0) {
      setErrors(allErrors);
      return; // Don't submit if there are errors
    }

    // Clear errors and proceed with submission
    setErrors({});
    onSubmit(e);
  };

  // Real-time validation (only for format validation, not empty fields)
  useEffect(() => {
    const newErrors = {};
    
    const ageError = validateAge(form.dateOfBirth);
    if (ageError) newErrors.dateOfBirth = ageError;
    
    const phoneError = validatePhone(form.phone);
    if (phoneError) newErrors.phone = phoneError;
    
    const passwordError = validatePassword(form.password);
    if (passwordError) newErrors.password = passwordError;
    
    const zipError = validateZipCode(form.zipCode);
    if (zipError) newErrors.zipCode = zipError;
    
    setErrors(newErrors);
  }, [form.dateOfBirth, form.phone, form.password, form.zipCode, t, validateAge, validateZipCode]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-4xl max-h-[85vh] bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-8 py-6 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
            <h3 className="text-cyan-300 font-['Orbitron'] text-xl font-semibold tracking-wide">{title}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white w-12 h-12 flex items-center justify-center rounded-lg border border-transparent hover:border-cyan-600/40 hover:bg-cyan-600/10 transition-all duration-200 text-xl group cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-6 h-6 group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Body - Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-6">
            <form onSubmit={onSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
              {/* Personal Information Section */}
              <SectionTitle>{t('personalInformation')}</SectionTitle>
              
              <div className="lg:col-span-6">
                <Field label={t('firstName')} required>
                  <Input 
                    value={form.firstName} 
                    onChange={(e) => setForm({ ...form, firstName: e.target.value })} 
                    placeholder={t('firstName')}
                    autoComplete="given-name"
                  />
                </Field>
              </div>
              
              <div className="lg:col-span-6">
                <Field label={t('lastName')} required>
                  <Input 
                    value={form.lastName} 
                    onChange={(e) => setForm({ ...form, lastName: e.target.value })} 
                    placeholder={t('lastName')}
                    autoComplete="family-name"
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('emailAddress')} required>
                  <Input 
                    type="email"
                    value={form.email} 
                    onChange={(e) => setForm({ ...form, email: e.target.value })} 
                    placeholder={t('emailAddress')}
                    autoComplete="email"
                  />
                </Field>
              </div>

              <div className="lg:col-span-6 font-['Rationale']">
                <Field label={t('dateOfBirth')} required help={t('mustBe18OrOlder')} error={errors.dateOfBirth}>
                  <Input 
                    type="date"
                    value={form.dateOfBirth} 
                    onChange={(e) => setForm({ ...form, dateOfBirth: e.target.value })} 
                    error={errors.dateOfBirth}
                  />
                </Field>
              </div>

              {/* Contact & Security Section */}
              <SectionTitle>{t('contactSecurity')}</SectionTitle>

              <div className="lg:col-span-6">
                <Field label={t('phone')} required error={errors.phone}>
                  <Input 
                    type="tel"
                    value={form.phone} 
                    onChange={(e) => setForm({ ...form, phone: e.target.value })} 
                    placeholder={t('phone')}
                    autoComplete="tel"
                    error={errors.phone}
                  />
                </Field>
              </div>

              <div className="lg:col-span-6 font-['Rationale']">
                <Field label={t('password')} required help={t('passwordRequirements')} error={errors.password}>
                  <Input 
                    type="password"
                    value={form.password} 
                    onChange={(e) => setForm({ ...form, password: e.target.value })} 
                    placeholder={t('password')}
                    autoComplete="new-password"
                    error={errors.password}
                  />
                </Field>
              </div>

              {/* Address Information Section */}
              <SectionTitle>{t('addressInformation')}</SectionTitle>

              <div className="lg:col-span-12">
                <Field label={t('streetAddress')} required>
                  <Input 
                    value={form.street} 
                    onChange={(e) => setForm({ ...form, street: e.target.value })} 
                    placeholder={t('streetAddress')}
                    autoComplete="street-address"
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('city')} required>
                  <Input 
                    value={form.city} 
                    onChange={(e) => setForm({ ...form, city: e.target.value })} 
                    placeholder={t('city')}
                    autoComplete="address-level2"
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('stateProvince')} required>
                  <Input 
                    value={form.state} 
                    onChange={(e) => setForm({ ...form, state: e.target.value })} 
                    placeholder={t('stateProvince')}
                    autoComplete="address-level1"
                  />
                </Field>
              </div>

              <div className="lg:col-span-6 font-['Rationale']">
                <Field label={t('zipCode')} required help={t('fiveDigitZipCode')} error={errors.zipCode}>
                  <Input 
                    value={form.zipCode} 
                    onChange={(e) => setForm({ ...form, zipCode: e.target.value })} 
                    placeholder={t('zipCode')}
                    pattern="[0-9]{5}"
                    inputMode="numeric"
                    autoComplete="postal-code"
                    error={errors.zipCode}
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('country')} required>
                  <Input 
                    value={form.country} 
                    onChange={(e) => setForm({ ...form, country: e.target.value })} 
                    placeholder={t('country')}
                    autoComplete="country-name"
                  />
                </Field>
              </div>

            </form>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-4 px-8 py-6 border-t border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm flex-shrink-0">
          <button
            type="button"
            onClick={onClose}
            className="px-8 py-3 rounded-xl bg-transparent border-2 border-gray-600/40 text-gray-300 hover:bg-gray-600/10 hover:border-gray-500/60 hover:text-white transition-all duration-300 font-['Orbitron'] text-sm tracking-wide font-medium group cursor-pointer"
          >
            <span className="group-hover:scale-95 transition-transform duration-200 inline-block">{t('cancel')}</span>
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            disabled={processing}
            className="relative px-10 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium shadow-lg shadow-cyan-500/25 transition-all duration-300 font-['Orbitron'] text-sm tracking-wide overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative group-hover:scale-95 transition-transform duration-200 inline-block">
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('creating')}...
                </span>
              ) : t('create')}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditUserModal;
