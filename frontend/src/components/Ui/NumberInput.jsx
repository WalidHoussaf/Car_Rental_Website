import React from 'react';

const NumberInput = ({ value, onChange, ...props }) => {
  const handleStep = (amount) => {
    const currentValue = Number(value) || 0;
    const step = Number(props.step) || 1;
    const min = props.min !== undefined ? Number(props.min) : -Infinity;
    const max = props.max !== undefined ? Number(props.max) : Infinity;

    let newValue = currentValue + amount * step;
    newValue = Math.max(min, Math.min(max, newValue));

    if (newValue === currentValue) return;

    const event = {
      target: {
        name: props.name,
        value: String(newValue),
        type: 'number',
      },
    };
    onChange(event);
  };

  return (
    <div className="relative flex items-center">
      <input
        type="number"
        value={value}
        onChange={onChange}
        {...props}
        className={
          `bg-gradient-to-br from-black/50 to-black/30 border border-cyan-900/30 font-['Orbitron'] rounded-xl py-3.5 px-5 text-gray-200 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 focus:border-cyan-400/50 transition-all duration-300 hover:border-cyan-600/40 w-full pr-12 ${props.className || ''}`
        }
      />
      <div className="absolute right-2 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => handleStep(1)}
          className="w-7 h-5 flex items-center justify-center bg-cyan-900/20 hover:bg-cyan-800/40 rounded-t-md text-cyan-300 transition-colors duration-200"
          tabIndex="-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M5 15l7-7 7 7" />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => handleStep(-1)}
          className="w-7 h-5 flex items-center justify-center bg-cyan-900/20 hover:bg-cyan-800/40 rounded-b-md text-cyan-300 transition-colors duration-200"
          tabIndex="-1"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default NumberInput;
