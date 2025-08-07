import React from 'react';

const GpsIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-7 h-7">
    <circle cx="12" cy="12" r="9" className="fill-transparent stroke-current stroke-1" strokeWidth="1.2" />
    <circle cx="12" cy="12" r="3" className="fill-current" />
    <path d="M12 2v3M12 19v3M2 12h3M19 12h3" className="stroke-current stroke-1" strokeWidth="1.2" strokeLinecap="round" />
    <path d="M4.93 4.93l2.12 2.12M16.95 16.95l2.12 2.12M4.93 19.07l2.12-2.12M16.95 7.05l2.12-2.12" className="stroke-current stroke-1" strokeWidth="1" strokeLinecap="round" />
  </svg>
);

export default GpsIcon;
