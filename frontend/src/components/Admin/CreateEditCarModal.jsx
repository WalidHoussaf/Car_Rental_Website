import React, { useState, useRef, useEffect } from 'react';
import NumberInput from '../Ui/NumberInput';

const Field = ({ label, required, children, help, className = '' }) => (
  <div className={`flex flex-col gap-2 ${className}`}>
    <label className="text-sm text-cyan-300 font-['Orbitron'] tracking-wide">
      {label}{required ? ' *' : ''}
    </label>
    {children}
    {help ? <p className="text-sm text-gray-400 mt-1">{help}</p> : null}
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
  const title = mode === 'create' ? 'Create a New Car' : 'Edit Car';

  const [openDropdown, setOpenDropdown] = useState(null); 
  const categoryRef = useRef(null);
  const transmissionRef = useRef(null);
  const fuelTypeRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown) {
        const refs = { 'category': categoryRef, 'transmission': transmissionRef, 'fuelType': fuelTypeRef };
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
    { label: 'Manual', value: 'manual' },
    { label: 'Automatic', value: 'automatic' },
  ];

  const fuelTypeOptions = [
    { label: 'Gasoline', value: 'gasoline' },
    { label: 'Diesel', value: 'diesel' },
    { label: 'Hybrid', value: 'hybrid' },
    { label: 'Electric', value: 'electric' },
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
              <SectionTitle>Basic Information</SectionTitle>
              
              <div className="lg:col-span-6">
                <Field label="Car Name" required>
                  <Input 
                    value={form.name} 
                    onChange={(e) => setForm({ ...form, name: e.target.value })} 
                    placeholder="Enter car name" 
                  />
                </Field>
              </div>
              
              <div className="lg:col-span-6">
                <Field label="Category" required>
                  <div className="relative" ref={categoryRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'category' ? null : 'category')}
                      className="w-full text-left font-['Orbitron'] bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 flex justify-between items-center"
                    >
                      <span className="capitalize">{form.category ? form.category : 'Select Category'}</span>
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
                <Field label="Make">
                  <Input 
                    value={form.make} 
                    onChange={(e) => setForm({ ...form, make: e.target.value })} 
                    placeholder="e.g., Toyota" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label="Model">
                  <Input 
                    value={form.model} 
                    onChange={(e) => setForm({ ...form, model: e.target.value })} 
                    placeholder="e.g., Camry" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label="Year">
                  <NumberInput
                    name="year"
                    min={1900}
                    max={2030}
                    step={1}
                    value={form.year}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (v === '' || (Number(v) >= 1900 && Number(v) <= 2030)) {
                        setForm({ ...form, year: v });
                      }
                    }}
                    placeholder="e.g., 2025"
                  />
                </Field>
              </div>

              {/* Pricing & Location Section */}
              <SectionTitle>Pricing & Location</SectionTitle>

              <div className="lg:col-span-6 font-['Rationale']">
                <Field label="Price per Day" required help="Enter amount in local currency">
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
                <Field label="Location" required>
                  <Input 
                    value={form.location} 
                    onChange={(e) => setForm({ ...form, location: e.target.value })} 
                    placeholder="City, Country" 
                  />
                </Field>
              </div>

              {/* Media Section */}
              <SectionTitle>Media & Images</SectionTitle>

              <div className="lg:col-span-12 font-['Rationale']">
                <Field label="Main Image URL" required help="Primary image displayed in listings">
                  <Input 
                    value={form.image} 
                    onChange={(e) => setForm({ ...form, image: e.target.value })} 
                    placeholder="https://example.com/car-image.jpg" 
                    className="w-full" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-12 font-['Rationale']">
                <Field label="Upload Images" help="Select multiple images from your device">
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
                          <span className="font-medium">Uploading...</span>
                        </span>
                      )}
                    </div>
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-12 font-['Rationale']">
                <Field label="Additional Image URLs" help="Comma-separated URLs for gallery images">
                  <Input 
                    value={form.imagesText} 
                    onChange={(e) => setForm({ ...form, imagesText: e.target.value })} 
                    placeholder="https://image1.jpg, https://image2.jpg, https://image3.jpg" 
                    className="w-full" 
                  />
                </Field>
              </div>

              {/* Vehicle Details Section */}
              <SectionTitle>Vehicle Specifications</SectionTitle>

              <div className="lg:col-span-3">
                <Field label="Transmission">
                  <div className="relative" ref={transmissionRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'transmission' ? null : 'transmission')}
                      className="w-full text-left font-['Orbitron'] bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 flex justify-between items-center"
                    >
                      {transmissionOptions.find(o => o.value === form.transmission)?.label || 'Select Type'}
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
                <Field label="Fuel Type">
                  <div className="relative" ref={fuelTypeRef}>
                    <button
                      type="button"
                      onClick={() => setOpenDropdown(openDropdown === 'fuelType' ? null : 'fuelType')}
                      className="w-full text-left font-['Orbitron'] bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 rounded-xl py-3.5 px-5 text-gray-200 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 flex justify-between items-center"
                    >
                      {fuelTypeOptions.find(o => o.value === form.fuelType)?.label || 'Select Fuel'}
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
                <Field label="Seats">
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
                <Field label="Doors">
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

              {/* Features & Description Section */}
              <SectionTitle>Features & Description</SectionTitle>

              <div className="lg:col-span-8 font-['Rationale']">
                <Field label="Features" help="Comma-separated list of car features">
                  <Input 
                    value={form.features} 
                    onChange={(e) => setForm({ ...form, features: e.target.value })} 
                    placeholder="Air Conditioning, GPS Navigation, Bluetooth, USB Ports" 
                  />
                </Field>
              </div>

              <div className="lg:col-span-4">
                <Field label="Availability Status">
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
                      <span className="text-sm font-medium">Available for booking</span>
                    </label>
                  </div>
                </Field>
              </div>

              <div className="lg:col-span-12 mb-6 font-['Rationale']">
                <Field label="Description" help="Brief description highlighting key selling points">
                  <Textarea 
                    value={form.description} 
                    onChange={(e) => setForm({ ...form, description: e.target.value })} 
                    placeholder="Describe the car's condition, unique features, or any important details customers should know..."
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
            <span className="group-hover:scale-95 transition-transform duration-200 inline-block">Cancel</span>
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
                  Saving...
                </span>
              ) : 'Save'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateEditCarModal;