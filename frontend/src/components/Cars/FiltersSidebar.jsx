return (
    <div className="w-full lg:w-80 bg-gradient-to-b from-gray-900/60 to-black/60 backdrop-blur-sm border border-gray-800 rounded-lg p-5 h-fit sticky top-24 shadow-xl shadow-cyan-900/10 relative overflow-hidden group">
      {/* Éléments décoratifs */}
      <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent"></div>
      <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-800/30 to-transparent"></div>
      <div className="absolute left-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-800/30 to-transparent"></div>
      <div className="absolute right-0 top-0 w-px h-full bg-gradient-to-b from-transparent via-cyan-800/30 to-transparent"></div>
      
      {/* Particules décorative */}
      <div className="absolute -top-10 -right-10 w-40 h-40 bg-cyan-500/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000"></div>
      
      <div className="relative z-10">
        <div className="flex justify-between items-center mb-6 relative">
          <div className="absolute left-0 bottom-0 w-10 h-px bg-gradient-to-r from-cyan-500/40 to-transparent"></div>
          <h3 className="text-lg font-semibold text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400 font-['Orbitron']">{t('filterBy')}</h3>
          <button
            onClick={resetFilters}
            className="text-sm text-gray-400 hover:text-cyan-400 transition-colors duration-300 relative group/btn"
          >
            <span>{t('resetAll')}</span>
            <span className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-cyan-500/40 to-transparent scale-x-0 group-hover/btn:scale-x-100 transition-transform duration-300 origin-left"></span>
          </button>
        </div>
      </div>
    </div>
  ) 