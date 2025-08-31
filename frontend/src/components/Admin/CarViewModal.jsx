import React from 'react';
import { getCarImage } from '../../utils/imageResolver';

const CarViewModal = ({ open, onClose, car }) => {
  if (!open || !car) return null;

  const carImageSrc = getCarImage(car);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 pt-20">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-2xl bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-cyan-400 to-cyan-600 rounded-full"></div>
            <h3 className="text-cyan-300 font-['Orbitron'] text-lg font-semibold tracking-wide">View Car</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="text-gray-400 hover:text-white w-10 h-10 flex items-center justify-center rounded-lg border border-transparent hover:border-cyan-600/40 hover:bg-cyan-600/10 transition-all duration-200 group cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-5 h-5 group-hover:rotate-90 transition-transform duration-200">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="px-6 py-6">
          {/* Car Image and Basic Info */}
          <div className="flex items-start gap-6 mb-6">
            <div className="h-32 w-48 rounded-lg bg-black/40 border border-cyan-900/30 overflow-hidden flex items-center justify-center flex-shrink-0">
              {carImageSrc ? (
                <img src={carImageSrc} alt={car.name} className="h-full w-full object-cover" />
              ) : (
                <div className="text-sm text-gray-500 font-['Orbitron']">No Image</div>
              )}
            </div>
            <div className="flex-1">
              <div className="text-xl font-semibold text-white font-['Orbitron'] mb-2">
                {car.name || `${car.make || ''} ${car.model || ''}`}
              </div>
              <div className="text-gray-400 text-sm font-['Rationale'] mb-3">
                {[car.make, car.model, car.year].filter(Boolean).join(' • ')}
              </div>
              <div className="text-gray-300 text-sm font-['Orbitron'] text-justify leading-relaxed">
                {car.description || 'No description available'}
              </div>
            </div>
          </div>

          {/* Car Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 text-sm">
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">Category</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.category || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">Location</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.location?.branch || car.location || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">Price/Day</div>
              <div className="text-white font-medium font-['Orbitron']">${car.pricePerDay ?? car.price ?? '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">Transmission</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.transmission || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">Fuel Type</div>
              <div className="text-white font-medium capitalize font-['Orbitron']">{car.fuelType || '-'}</div>
            </div>
            <div className="bg-black/30 border border-cyan-900/30 rounded-lg p-3">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-1">Seats/Doors</div>
              <div className="text-white font-medium font-['Orbitron']">{[car.seats, car.doors].filter(Boolean).join(' / ') || '-'}</div>
            </div>
          </div>

          {/* Features */}
          {car.features && car.features.length > 0 && (
            <div className="mt-6">
              <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide mb-3">Features</div>
              <div className="flex flex-wrap gap-2">
                {car.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-cyan-600/20 text-cyan-300 border border-cyan-500/30 rounded-full text-xs font-['Orbitron']"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}

          {/* Availability Status */}
          <div className="mt-6 flex items-center justify-between">
            <div className="text-gray-400 font-['Orbitron'] text-xs uppercase tracking-wide">Availability Status</div>
            <span className={`px-3 py-1 rounded-full text-xs font-['Orbitron'] ${
              car.availability 
                ? 'bg-green-600/20 text-green-300 border border-green-500/30' 
                : 'bg-yellow-600/20 text-yellow-300 border border-yellow-500/30'
            }`}>
              {car.availability ? 'Available' : 'Unavailable'}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CarViewModal;
