import React, { useState, useRef, useEffect, useMemo } from 'react';
import NumberInput from '../Ui/NumberInput';
import { useLanguage } from '../../hooks/useLanguage';
import { useTranslations } from '../../translations';
import { locations as allLocations } from '../../assets/assets';

const Field = ({ label, required, children, help, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide">
      {label}{required ? ' *' : ''}
    </label>
    {children}
    {help ? <p className="text-sm text-gray-400 mt-1 font-['Rationale']">{help}</p> : null}
  </div>
);

const Input = (props) => (
  <input
    {...props}
    className={
      `bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3.5 px-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 ${props.className || ''}`
    }
  />
);


const Textarea = (props) => (
  <textarea
    {...props}
    className={
      `bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3.5 px-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 resize-none ${props.className || ''}`
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

const CreateEditCarModal = ({
  open,
  mode = 'create',
  categories = [],
  form,
  setForm,
  uploadingImages,
  onUploadImages,
  processing,
  onClose,
  onSubmit,
}) => {
  const { language } = useLanguage();
  const t = useTranslations(language);
  
  const title = mode === 'create' ? t('adminCarsCreateCar') : t('adminCarsUpdateCar');

  // Localized locations (excluding 'all' option for form)
  const localizedLocations = useMemo(() => {
    return allLocations.filter(loc => loc.value !== 'all').map(loc => ({
      value: loc.value,
      label: loc.label?.[language] || String(loc.value || ''),
    }));
  }, [language]);

  const [openDropdown, setOpenDropdown] = useState(null); 
  const categoryRef = useRef(null);
  const transmissionRef = useRef(null);
  const fuelTypeRef = useRef(null);
  const locationRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown) {
        const refs = { 'category': categoryRef, 'transmission': transmissionRef, 'fuelType': fuelTypeRef, 'location': locationRef };
        const currentRef = refs[openDropdown];
        if (currentRef && currentRef.current && !currentRef.current.contains(event.target)) {
          setOpenDropdown(null);
        }
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [openDropdown]);

  const handleSelect = (field, value) => {
    setForm({ ...form, [field]: value });
    setOpenDropdown(null);
  };

  const transmissionOptions = [
    { label: t('adminCarsManual'), value: 'manual' },
    { label: t('adminCarsAutomatic'), value: 'automatic' },
  ];

  const fuelTypeOptions = [
    { label: t('adminCarsGasoline'), value: 'gasoline' },
    { label: t('adminCarsDiesel'), value: 'diesel' },
    { label: t('adminCarsHybrid'), value: 'hybrid' },
    { label: t('adminCarsElectric'), value: 'electric' },
  ];

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      {/* Modal Container */}
      <div className="relative w-full max-w-6xl max-h-[85vh] bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden flex flex-col backdrop-blur-md">
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
        
              {/* Basic Information Section */}
              <SectionTitle>{t('adminCarsBasicInformation')}</SectionTitle>
              
              <div className="lg:col-span-6">
                <Field label={t('adminCarsCarName')} required>
                  <Input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder={t('adminCarsEnterCarName')} 
                  />
                </Field>
              </div>
              
              <div className="lg:col-span-6">
                <Field label={t('adminCarsCategory')} required>
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                      className="w-full text-left font-['Orbitron'] bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 flex justify-between items-center"
                    >
                      <span className="capitalize">{form.category ? form.category : t('adminCarsSelectCategory')}</span>
                      <svg className={`h-5 w-5 text-cyan-400 transition-transform duration-200 ${openDropdown === 'category' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                    </button>
                    {openDropdown === 'category' && (
                      <div className="absolute right-0 mt-2 w-full rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg transition-all duration-200 z-50">
                        <div className="py-2 font-['Orbitron']">
                          {categories.map((c) => (
                            <button key={c} type="button" onClick={() => handleSelect('category', c)} className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer capitalize">
                              {c}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsMake')}>
                  <Input 
                    value={form.make} 
                    onChange={(e) => setForm({ ...form, make: e.target.value })} 
                    placeholder="e.g., Toyota" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsModel')}>
                  <Input 
                    value={form.model} 
                    onChange={(e) => setForm({ ...form, model: e.target.value })} 
                    placeholder="e.g., Camry" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsYear')}>
                  <NumberInput
                    name="year"
                    min={1900}
                    max={2030}
                    step={1}
                    value={form.year}
                    onChange={(e) => {
                      const v = e.target.value;
                      // Allow empty value or partial input (less than 4 digits) or valid complete years
                      if (v === '' || v.length < 4 || (Number(v) >= 1900 && Number(v) <= 2030)) {
                        setForm({ ...form, year: v });
                      }
                    }}
                    placeholder="e.g., 2025"
                  />
                </Field>
              </div>

              {/* Pricing & Location Section */}
              <SectionTitle>{t('adminCarsPricingLocation')}</SectionTitle>

              <div className="lg:col-span-6 font-['Rationale']">
                <Field label={t('adminCarsPricePerDay')} required help={t('adminCarsEnterAmountInLocalCurrency')}>
                  <NumberInput
                    name="pricePerDay"
                    min={0}
                    step="1"
                    value={form.pricePerDay}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || !Number.isNaN(Number(v))) {
                        setForm({ ...form, pricePerDay: v });
                      }
                    }}
                    placeholder="0.00"
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsLocation')} required>
                  <div className="relative" ref={locationRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'location' ? null : 'location')}
                      className="w-full bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 text-left flex items-center justify-between"
                    >
                      <span className="capitalize">
                        {form.location ? localizedLocations.find(loc => loc.value === form.location)?.label || form.location : t('adminCarsSelectLocation')}
                      </span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-4 w-4 ml-2 transition-transform ${openDropdown === 'location' ? 'rotate-180' : ''}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" />
                      </svg>
                    </button>
                    {openDropdown === 'location' && (
                      <div className="absolute z-30 mt-1 w-full bg-black border border-cyan-900/30 rounded-md shadow-lg overflow-hidden">
                        <ul className="max-h-60 overflow-y-auto divide-y divide-cyan-900/20">
                          {localizedLocations.map((location) => (
                            <li key={location.value}>
                              <button
                                type="button"
                                onClick={() => {
                                  setForm({ ...form, location: location.value });
                                  setOpenDropdown(null);
                                }}
                                className={`w-full text-left px-3 py-2 text-sm capitalize font-['Orbitron'] ${form.location === location.value ? 'bg-cyan-600/20 text-cyan-300' : 'text-gray-200 hover:bg-white/5'}`}
                              >
                                {location.label}
                              </button>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              {/* Media Section */}
              <SectionTitle>{t('adminCarsMediaImages')}</SectionTitle>

              <div className="lg:col-span-12 font-['Rationale']">
                <Field label={t('adminCarsMainImageUrl')} required help={t('adminCarsPrimaryImageDisplayed')}>
                  <Input 
                    value={form.image} 
                    onChange={(e) => setForm({ ...form, image: e.target.value })} 
                    placeholder={t('adminCarsImageUrlPlaceholder')} 
                    className="w-full" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-12 font-['Rationale']">
                <Field label={t('adminCarsUploadImages')} help={t('adminCarsSelectMultipleImages')}>
                  <div className="relative group">
                    <div className="flex items-center gap-4 p-6 border-2 border-dashed border-cyan-900/30 rounded-xl bg-gradient-to-br from-black/30 to-black/10 hover:border-cyan-600/50 transition-all duration-300 group-hover:bg-black/40">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-cyan-600 to-cyan-700 rounded-lg flex items-center justify-center">
                          <span className="text-white text-lg">📁</span>
                        </div>
                        <input 
                          type="file" 
                          accept="image/*" 
                          multiple 
                          onChange={onUploadImages} 
                          className="text-gray-300 font-['Orbitron'] file:mr-4 file:py-2.5 file:px-5 file:rounded-lg file:border-0 file:text-sm file:font-['Orbitron'] file:font-medium file:bg-gradient-to-r file:from-cyan-600 file:to-cyan-700 file:text-white hover:file:from-cyan-700 hover:file:to-cyan-800 file:cursor-pointer transition-all file:transition-all file:duration-200" 
                        />
                      </div>
                      {uploadingImages && (
                        <span className="text-sm text-cyan-400 flex items-center gap-3 ml-auto">
                          <div className="w-5 h-5 border-2 border-cyan-400 border-t-transparent rounded-full animate-spin"></div>
                          <span className="font-medium">{t('adminCarsUploading')}</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-12 font-['Rationale']">
                <Field label={t('adminCarsAdditionalImageUrls')} help={t('adminCarsCommaSeparatedUrls')}>
                  <Input 
                    value={form.imagesText} 
                    onChange={(e) => setForm({ ...form, imagesText: e.target.value })} 
                    placeholder={t('adminCarsMultipleImageUrlsPlaceholder')} 
                    className="w-full" 
                  />
                </Field>
              </div>

              {/* Vehicle Details Section */}
              <SectionTitle>{t('adminCarsVehicleSpecifications')}</SectionTitle>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsTransmission')}>
                  <div className="relative" ref={transmissionRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'transmission' ? null : 'transmission')}
                      className="w-full text-left font-['Orbitron'] bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 flex justify-between items-center"
                    >
                      {transmissionOptions.find(o => o.value === form.transmission)?.label || t('adminCarsSelectType')}
                      <svg className={`h-5 w-5 text-cyan-400 transition-transform duration-200 ${openDropdown === 'transmission' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                    </button>
                    {openDropdown === 'transmission' && (
                      <div className="absolute right-0 mt-2 w-full rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg transition-all duration-200 z-50">
                        <div className="py-2 font-['Orbitron']">
                          {transmissionOptions.map((opt) => (
                            <button key={opt.value} type="button" onClick={() => handleSelect('transmission', opt.value)} className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer">
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsFuelType')}>
                  <div className="relative" ref={fuelTypeRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'fuelType' ? null : 'fuelType')}
                      className="w-full text-left font-['Orbitron'] bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 flex justify-between items-center"
                    >
                      {fuelTypeOptions.find(o => o.value === form.fuelType)?.label || t('adminCarsSelectType')}
                      <svg className={`h-5 w-5 text-cyan-400 transition-transform duration-200 ${openDropdown === 'fuelType' ? 'rotate-180' : ''}`} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.24a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z" clipRule="evenodd" /></svg>
                    </button>
                    {openDropdown === 'fuelType' && (
                      <div className="absolute right-0 mt-2 w-full rounded-lg overflow-hidden border border-gray-800 bg-black backdrop-blur-xl shadow-lg transition-all duration-200 z-50">
                        <div className="py-2 font-['Orbitron']">
                          {fuelTypeOptions.map((opt) => (
                            <button key={opt.value} type="button" onClick={() => handleSelect('fuelType', opt.value)} className="w-full text-left px-4 py-2.5 text-gray-200 hover:bg-white/5 transition-colors cursor-pointer">
                              {opt.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsSeats')}>
                  <NumberInput
                    name="seats"
                    min={1}
                    max={20}
                    step={1}
                    value={form.seats}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || (Number(v) >= 1 && Number(v) <= 20)) {
                        setForm({ ...form, seats: v });
                      }
                    }}
                    placeholder="e.g., 5"
                  />
                </Field>
              </div>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsDoors')}>
                  <NumberInput
                    name="doors"
                    min={2}
                    max={6}
                    step={1}
                    value={form.doors}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || (Number(v) >= 2 && Number(v) <= 6)) {
                        setForm({ ...form, doors: v });
                      }
                    }}
                    placeholder="e.g., 4"
                  />
                </Field>
              </div>

              {/* Performance Metrics Section */}
              <SectionTitle>{t('adminCarsPerformanceMetrics')}</SectionTitle>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsEngine')} help={t('adminCarsEngineDisplacement')}>
                  <Input 
                    value={form.engine} 
                    onChange={(e) => setForm({ ...form, engine: e.target.value })} 
                    placeholder={t('adminCarsEnginePlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsHorsepower')} help={t('adminCarsHorsepowerRange')}>
                  <Input 
                    value={form.horsepower} 
                    onChange={(e) => setForm({ ...form, horsepower: e.target.value })} 
                    placeholder={t('adminCarsHorsepowerPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsAcceleration')} help={t('adminCarsAccelerationTime')}>
                  <Input 
                    value={form.acceleration} 
                    onChange={(e) => setForm({ ...form, acceleration: e.target.value })} 
                    placeholder={t('adminCarsAccelerationPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsFuelEconomy')} help={t('adminCarsFuelEconomyMpg')}>
                  <Input 
                    value={form.fuelEconomy} 
                    onChange={(e) => setForm({ ...form, fuelEconomy: e.target.value })} 
                    placeholder={t('adminCarsFuelEconomyPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsPower')} help={t('adminCarsPowerHelp')}>
                  <Input 
                    value={form.power} 
                    onChange={(e) => setForm({ ...form, power: e.target.value })} 
                    placeholder={t('adminCarsPowerPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsTorque')} help={t('adminCarsTorqueHelp')}>
                  <Input 
                    value={form.torque} 
                    onChange={(e) => setForm({ ...form, torque: e.target.value })} 
                    placeholder={t('adminCarsTorquePlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsTopSpeed')} help={t('adminCarsTopSpeedHelp')}>
                  <Input 
                    value={form.topSpeed} 
                    onChange={(e) => setForm({ ...form, topSpeed: e.target.value })} 
                    placeholder={t('adminCarsTopSpeedPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-6">
                <Field label={t('adminCarsRange')} help={t('adminCarsRangeHelp')}>
                  <Input 
                    value={form.range} 
                    onChange={(e) => setForm({ ...form, range: e.target.value })} 
                    placeholder={t('adminCarsRangePlaceholder')} 
                  />
                </Field>
              </div>

              {/* Capacity & Physical Specs Section */}
              <SectionTitle>{t('adminCarsCapacityPhysicalSpecs')}</SectionTitle>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsSeatingCapacity')} help={t('adminCarsNumberOfPassengers')}>
                  <NumberInput
                    name="seatingCapacity"
                    min={1}
                    max={20}
                    step={1}
                    value={form.seatingCapacity}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || (Number(v) >= 1 && Number(v) <= 20)) {
                        setForm({ ...form, seatingCapacity: v });
                      }
                    }}
                    placeholder="e.g., 5"
                  />
                </Field>
              </div>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsLuggageCapacity')} help={t('adminCarsTrunkCargoSpace')}>
                  <NumberInput
                    name="luggage"
                    min={0}
                    max={200}
                    step={0.1}
                    value={form.luggage}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || (Number(v) >= 0 && Number(v) <= 200)) {
                        setForm({ ...form, luggage: v });
                      }
                    }}
                    placeholder="e.g., 15.5"
                  />
                </Field>
              </div>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsSpecDoors')} help={t('adminCarsNumberOfDoorsSpecs')}>
                  <NumberInput
                    name="specDoors"
                    min={2}
                    max={6}
                    step={1}
                    value={form.specDoors}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || (Number(v) >= 2 && Number(v) <= 6)) {
                        setForm({ ...form, specDoors: v });
                      }
                    }}
                    placeholder="e.g., 4"
                  />
                </Field>
              </div>

              <div className="lg:col-span-3">
                <Field label={t('adminCarsSpecTransmission')} help={t('adminCarsDetailedTransmissionType')}>
                  <Input 
                    value={form.specTransmission} 
                    onChange={(e) => setForm({ ...form, specTransmission: e.target.value })} 
                    placeholder={t('adminCarsSpecTransmissionPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsWeight')} help={t('adminCarsVehicleWeight')}>
                  <Input 
                    value={form.weight} 
                    onChange={(e) => setForm({ ...form, weight: e.target.value })} 
                    placeholder={t('adminCarsWeightPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsLength')} help={t('adminCarsVehicleLength')}>
                  <Input 
                    value={form.length} 
                    onChange={(e) => setForm({ ...form, length: e.target.value })} 
                    placeholder={t('adminCarsLengthPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsWidth')} help={t('adminCarsVehicleWidth')}>
                  <Input 
                    value={form.width} 
                    onChange={(e) => setForm({ ...form, width: e.target.value })} 
                    placeholder={t('adminCarsWidthPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsHeight')} help={t('adminCarsVehicleHeight')}>
                  <Input 
                    value={form.height} 
                    onChange={(e) => setForm({ ...form, height: e.target.value })} 
                    placeholder={t('adminCarsHeightPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsWheelbase')} help={t('adminCarsWheelbaseHelp')}>
                  <Input 
                    value={form.wheelbase} 
                    onChange={(e) => setForm({ ...form, wheelbase: e.target.value })} 
                    placeholder={t('adminCarsWheelbasePlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsDriveType')} help={t('adminCarsDrivetrainConfiguration')}>
                  <Input 
                    value={form.driveType} 
                    onChange={(e) => setForm({ ...form, driveType: e.target.value })} 
                    placeholder={t('adminCarsDriveTypePlaceholder')} 
                  />
                </Field>
              </div>

              {/* Features & Description Section */}
              <SectionTitle>{t('adminCarsDescription')}</SectionTitle>

              <div className="lg:col-span-8 font-['Rationale']">
                <Field label={t('adminCarsCarFeatures')} help={t('adminCarsCommaSeparatedFeatures')}>
                  <Input 
                    value={form.features} 
                    onChange={(e) => setForm({ ...form, features: e.target.value })} 
                    placeholder={t('adminCarsFeaturesPlaceholder')} 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label={t('adminCarsAvailableForRent')}>
                  <div className="flex items-center h-14 px-5 bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl hover:border-cyan-600/40 transition-all duration-300 group">
                    <label className="flex items-center font-['Orbitron'] gap-4 text-gray-300 group-hover:text-gray-200 transition-colors cursor-pointer">
                      <div className="relative">
                        <input 
                          type="checkbox" 
                          checked={!!form.availability} 
                          onChange={(e) => setForm({ ...form, availability: e.target.checked })}
                          className="w-5 h-5 text-cyan-600 bg-transparent border-2 border-cyan-600 rounded focus:ring-cyan-500 focus:ring-2 transition-all duration-200"
                        />
                        {form.availability && (
                          <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-400 rounded-full animate-pulse"></div>
                        )}
                      </div>
                      <span className="text-sm font-medium">{t('adminCarsAvailableForBooking')}</span>
                    </label>
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-12 mb-6 font-['Rationale']">
                <Field label={t('adminCarsCarDescription')} help={t('adminCarsDescribeCarFeatures')}>
                  <Textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    placeholder={t('adminCarsDescriptionPlaceholder')}
                    rows={4}
                    className="w-full"
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
            <span className="group-hover:scale-95 transition-transform duration-200 inline-block">{t('adminCarsCancel')}</span>
          </button>
          <button
            type="button"
            onClick={onSubmit}
            disabled={processing}
            className="relative px-10 py-3 rounded-xl bg-gradient-to-r from-cyan-600 to-cyan-700 hover:from-cyan-700 hover:to-cyan-800 disabled:opacity-60 disabled:cursor-not-allowed text-white font-medium shadow-lg shadow-cyan-500/25 transition-all duration-300 font-['Orbitron'] text-sm tracking-wide overflow-hidden group cursor-pointer"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent -skew-x-12 -translate-x-full group-hover:translate-x-full transition-transform duration-700"></div>
            <span className="relative group-hover:scale-95 transition-transform duration-200 inline-block">
              {processing ? (
                <span className="flex items-center gap-2">
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {t('adminCarsSaving')}
                </span>
              ) : (mode === 'create' ? t('adminCarsCreateCar') : t('adminCarsUpdateCar'))}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditCarModal;