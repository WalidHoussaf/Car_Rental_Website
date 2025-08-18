import React, { useEffect } from 'react';

const FuturisticModal = ({ open, onClose, title, children, actions = [] }) => {
  const [show, setShow] = React.useState(false);
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === 'Escape') onClose?.();
    };
    if (open) document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (open) {
      // trigger enter animation on mount
      const t = requestAnimationFrame(() => setShow(true));
      return () => cancelAnimationFrame(t);
    }
  }, [open]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center pt-10 md:pt-16">
      {/* Backdrop */}
      <div
        className={`absolute inset-0 bg-black/70 backdrop-blur-sm transition-opacity duration-300 ${show ? 'opacity-100' : 'opacity-0'}`}
        onClick={onClose}
      />

      {/* Modal Card */}
      <div
        className={`relative z-[110] w-[95%] max-w-xl rounded-xl overflow-hidden border border-cyan-800/40 bg-gray-900/70 shadow-2xl transform transition-all duration-300 ease-out ${show ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-4 scale-95'}`}
      >
        <div
          className="absolute inset-0 opacity-[0.06] pointer-events-none"
          style={{
            backgroundImage:
              'linear-gradient(rgba(255,255,255,0.08) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.08) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Header */}
        <div className="relative px-5 py-4 bg-black/40 border-b border-cyan-900/40">
          <h3 className="font-['Orbitron'] text-lg md:text-xl bg-gradient-to-r from-white to-cyan-300 bg-clip-text text-transparent">
            {title}
          </h3>
          <button
            onClick={onClose}
            className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white cursor-pointer"
            aria-label="Close"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        {/* Body */}
        <div className="relative p-5 text-gray-200">
          {children}
        </div>

        {/* Footer */}
        {actions?.length ? (
          <div className="relative px-5 py-4 bg-black/40 border-t border-cyan-900/40 flex items-center justify-end gap-3">
            {actions.map((a, idx) => (
              <button
                key={idx}
                onClick={a.onClick}
                disabled={a.disabled}
                className={
                  `relative group overflow-hidden px-6 py-3 rounded-lg font-['Orbitron'] text-base transition-colors cursor-pointer flex items-center gap-2 focus:outline-none focus:ring-2 focus:ring-cyan-500/50 ` +
                  (a.variant === 'danger'
                    ? `text-red-300 border border-red-600/40 hover:bg-red-600/15 ${a.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                    : a.variant === 'success'
                    ? `text-green-300 border border-green-600/40 hover:bg-green-600/15 ${a.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                    : a.variant === 'primary'
                    ? `text-cyan-300 border border-cyan-600/40 hover:bg-cyan-600/15 ${a.disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                    : `text-gray-300 border border-gray-600/40 hover:bg-white/5 ${a.disabled ? 'opacity-50 cursor-not-allowed' : ''}`)
                }
              >
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-r from-white/0 via-white/20 to-white/0 opacity-0 transition-opacity duration-200 group-hover:opacity-10" />
                {a.icon ? a.icon : null}
                {a.label}
              </button>
            ))}
          </div>
        ) : null}

        {/* Bottom glow */}
        <div className="relative h-px w-full overflow-hidden">
          <div className="absolute inset-0 h-px w-full bg-gradient-to-r from-transparent via-cyan-500 to-transparent animate-pulse"></div>
        </div>
      </div>
    </div>
  );
};

export default FuturisticModal;
