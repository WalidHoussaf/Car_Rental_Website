import React from 'react';

const CalendarStepIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
    <path className="stroke-current stroke-1" strokeLinecap="round" d="M6 2v4M18 2v4" />
    <rect x="2" y="4" width="20" height="18" rx="2" className="fill-transparent stroke-current stroke-1" />
    <path d="M2 10h20" className="stroke-current stroke-1" />
    <circle cx="8" cy="15" r="1.5" fill="currentColor" />
    <circle cx="16" cy="15" r="1.5" fill="currentColor" />
    <circle cx="8" cy="19" r="1.5" fill="currentColor" />
    <circle cx="16" cy="19" r="1.5" fill="currentColor" />
    <path d="M10 3L14 3" className="stroke-current stroke-1" />
  </svg>
);

export default CalendarStepIcon;
