import React from 'react';

const CreditCardIcon = () => (
  <svg width="48" height="32" viewBox="0 0 48 32" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
    {/* Card background */}
    <rect x="2" y="2" width="44" height="28" rx="4" fill="#1e293b" stroke="#22d3ee" strokeWidth="1.5"/>
    {/* Magnetic stripe */}
    <rect x="2" y="10" width="44" height="6" fill="#22d3ee" opacity="0.8"/>
    {/* Chip */}
    <rect x="6" y="16" width="6" height="4" rx="1" fill="#22d3ee" opacity="0.9"/>
    {/* Card number placeholders */}
    <rect x="15" y="17" width="12" height="2" rx="1" fill="#64748b"/>
    <rect x="29" y="17" width="8" height="2" rx="1" fill="#64748b"/>
    {/* CVV */}
    <rect x="39" y="21" width="6" height="2" rx="1" fill="#64748b"/>
  </svg>
);

export default CreditCardIcon;
