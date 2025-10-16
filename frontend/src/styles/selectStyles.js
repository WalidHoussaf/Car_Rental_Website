// Select styles for booking location component
export const locationSelectStyles = {
  control: (provided, state) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    borderColor: state.isFocused ? '#22d3ee' : 'rgba(59, 130, 246, 0.3)',
    borderRadius: '0.75rem',
    padding: '0.5rem',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.125rem',
    minHeight: '3.5rem',
    boxShadow: state.isFocused ? '0 0 0 2px #22d3ee' : 'none',
    '&:hover': {
      borderColor: '#22d3ee',
    },
    transition: 'all 0.3s ease'
  }),
  menu: (provided) => ({
    ...provided,
    backgroundColor: 'rgba(0, 0, 0, 0.9)',
    border: '1px solid rgba(59, 130, 246, 0.3)',
    borderRadius: '0.75rem',
    padding: '0.5rem',
    zIndex: 9999,
    boxShadow: '0 4px 12px rgba(0, 200, 255, 0.15)',
    position: 'relative'
  }),
  menuPortal: (provided) => ({ 
    ...provided, 
    zIndex: 9999 
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected 
      ? 'rgba(34, 211, 238, 0.2)' 
      : state.isFocused 
        ? 'rgba(34, 211, 238, 0.1)' 
        : 'transparent',
    color: state.isSelected ? '#22d3ee' : '#ffffff',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1rem',
    cursor: 'pointer',
    transition: 'all 0.2s ease'
  }),
  singleValue: (provided) => ({
    ...provided,
    color: '#ffffff',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '1.125rem',
  }),
  input: (provided) => ({
    ...provided,
    color: '#ffffff',
    fontFamily: 'Orbitron, sans-serif',
  }),
  valueContainer: (provided) => ({
    ...provided,
    padding: '0 8px',
  }),
  placeholder: (provided) => ({
    ...provided,
    color: '#9CA3AF',
    fontFamily: 'Orbitron, sans-serif',
  }),
  noOptionsMessage: (provided) => ({
    ...provided,
    color: '#9CA3AF',
    fontFamily: 'Orbitron, sans-serif',
    fontSize: '0.875rem',
  })
};

export const timeSelectStyles = (accentColor = '#22d3ee') => ({
  ...locationSelectStyles,
  control: (provided, state) => ({
    ...locationSelectStyles.control(provided, state),
    borderColor: state.isFocused ? accentColor : 'rgba(59, 130, 246, 0.3)',
    boxShadow: state.isFocused ? `0 0 0 2px ${accentColor}` : 'none',
  }),
  menu: (provided) => ({
    ...locationSelectStyles.menu(provided),
    zIndex: 10000,
  }),
  menuPortal: (provided) => ({ 
    ...provided, 
    zIndex: 10000
  })
});

export const selectStyles = {
    control: (provided, state) => ({
      ...provided,
      height: '2.75rem',
      minHeight: '2.75rem',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      borderColor: '#374151',
      borderRadius: '0.375rem',
      fontFamily: 'Orbitron, sans-serif',
      color: 'white',
      boxShadow: state.isFocused ? '0 0 0 2px rgba(59, 130, 246, 0.5)' : 'none',
      '&:hover': {
        borderColor: '#4B5563',
      }
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: 'black',
      fontFamily: 'Orbitron, sans-serif',
      maxHeight: '240px',
      overflowY: 'hidden',
      border: '1px solid rgba(59, 130, 246, 0.3)',
      borderRadius: '0.375rem',
      zIndex: 9999,
    }),
    menuPortal: (provided) => ({
      ...provided,
      zIndex: 9999,
    }),
    menuList: (provided) => ({
      ...provided,
      maxHeight: '240px',
      overflowY: 'auto',
      paddingRight: '4px',
      '::-webkit-scrollbar': {
        width: '8px',
      },
      '::-webkit-scrollbar-track': {
        background: 'rgba(0, 0, 0, 0.3)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb': {
        background: 'rgba(59, 130, 246, 0.5)',
        borderRadius: '4px',
      },
      '::-webkit-scrollbar-thumb:hover': {
        background: 'rgba(59, 130, 246, 0.7)',
      },
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(59, 130, 246, 0.5) rgba(0, 0, 0, 0.3)',
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? 'rgba(59, 130, 246, 0.3)' : 'black',
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
      padding: '8px 12px',
      fontSize: '0.875rem',
      lineHeight: '1.2',
      cursor: 'pointer',
      '&:hover': {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
      }
    }),
    singleValue: (provided) => ({
      ...provided,
      color: 'white',
      fontFamily: 'Orbitron, sans-serif',
    }),
    placeholder: (provided) => ({
      ...provided,
      color: '#FFFFFF',
      fontFamily: 'Orbitron, sans-serif',
    }),
  };