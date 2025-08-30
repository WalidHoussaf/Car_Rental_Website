import React from 'react';

const RoleChangeModal = ({ open, onClose, user, onConfirm, processing, roleChoice, setRoleChoice, t }) => {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />

      {/* Modal Container */}
      <div className="relative w-full max-w-lg bg-gradient-to-br from-[#0b0f19] via-[#0f1419] to-[#0b0f19] border border-cyan-900/40 rounded-2xl shadow-2xl shadow-cyan-500/10 overflow-hidden backdrop-blur-md">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-cyan-900/30 bg-gradient-to-r from-black/30 via-black/20 to-black/30 backdrop-blur-sm">
          <div className="flex items-center gap-3">
            <div className="w-1 h-6 bg-gradient-to-b from-purple-400 to-purple-600 rounded-full"></div>
            <h3 className="text-purple-300 font-['Orbitron'] text-lg font-semibold tracking-wide">{t('changeUserRole')}</h3>
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
          <div className="flex items-center gap-4 mb-4">
            <div className="h-12 w-12 rounded-full bg-gradient-to-r from-purple-500/20 to-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-300">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
              </svg>
            </div>
            <div>
              <div className="text-white font-medium font-['Orbitron']">{user?.firstName} {user?.lastName}</div>
              <div className="text-gray-400 text-sm font-['Rationale']">#{user?._id?.slice(-8)}</div>
            </div>
          </div>
          
          <p className="text-gray-300 font-['Orbitron'] text-sm leading-relaxed text-justify mb-4">
            {t('changeUserRoleText')} <span className="text-yellow-400 font-medium">{user?.firstName} {user?.lastName}</span>.
          </p>

          {/* Role Selection */}
          <div className="grid grid-cols-2 gap-3">
            <button
              onClick={() => setRoleChoice('customer')}
              className={`px-4 py-3 rounded-md border text-sm font-['Orbitron'] cursor-pointer transition-colors ${
                roleChoice === 'customer' 
                  ? 'border-cyan-400 text-cyan-300 bg-cyan-600/10' 
                  : 'border-cyan-900/40 text-gray-300 hover:bg-white/5'
              }`}
            >
              {t('customer')}
            </button>
            <button
              onClick={() => setRoleChoice('admin')}
              className={`px-4 py-3 rounded-md border text-sm font-['Orbitron'] cursor-pointer transition-colors ${
                roleChoice === 'admin' 
                  ? 'border-purple-400 text-purple-300 bg-purple-600/10' 
                  : 'border-purple-900/40 text-gray-300 hover:bg-white/5'
              }`}
            >
              {t('admin')}
            </button>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 bg-black/30 border-t border-cyan-900/30">
          <button
            type="button"
            onClick={onClose}
            disabled={processing}
            className="px-4 py-2 text-sm font-['Orbitron'] text-gray-300 border border-gray-600/40 rounded-lg hover:bg-gray-600/10 hover:border-gray-500/50 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            {t('cancel')}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={processing}
            className="px-4 py-2 text-sm font-['Orbitron'] text-white bg-gradient-to-r from-purple-600/80 to-purple-700/80 border border-purple-500/50 rounded-lg hover:from-purple-500/90 hover:to-purple-600/90 hover:border-purple-400/60 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer flex items-center gap-2"
          >
            {processing ? (
              <>
                <svg className="h-4 w-4 animate-spin" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"></path>
                </svg>
                {t('updating')}
              </>
            ) : (
              <>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zm0 4a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
                </svg>
                {t('setRoleTo', { role: t(roleChoice) })}
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
};

export default RoleChangeModal;
