import React from 'react';

const CallToAction = () => {
  return (
    <section className="relative py-16 overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-900/5 to-cyan-900/5 pointer-events-none"></div>
      <div className="absolute inset-0 overflow-hidden opacity-30 pointer-events-none">
        <div className="h-full w-full" style={{
          backgroundImage: 'linear-gradient(to right, #3B82F6 1px, transparent 1px), linear-gradient(to bottom, #8B5CF6 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 relative">
        {/* Content */}
        <div className="bg-gradient-to-r from-gray-900/80 via-black/90 to-gray-900/80 backdrop-blur-sm border border-gray-800 rounded-xl p-8 lg:p-12 relative overflow-hidden">
          {/* Decorative Elements */}
          <div className="absolute top-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-cyan-500 to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-0 w-full h-px bg-gradient-to-r from-transparent via-white to-transparent opacity-50"></div>
          <div className="absolute -left-4 top-0 w-8 h-8 rounded-full bg-cyan-500 blur-xl opacity-20"></div>
          <div className="absolute -right-4 bottom-0 w-8 h-8 rounded-full bg-white blur-xl opacity-20"></div>
          
          <div className="relative z-10 flex flex-col lg:flex-row items-center justify-between gap-8">
            <div className="max-w-2xl">
              <div className="inline-block mb-3 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/20">
                <span className="text-xs text-cyan-400 font-['Orbitron'] tracking-widest">PREMIUM EXPERIENCE</span>
              </div>
              <h2 className="text-3xl md:text-4xl font-bold text-white font-['Orbitron'] mb-4 leading-tight">
                Ready to Experience the <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-cyan-400">Future of Transportation?</span>
              </h2>
              <p className="text-gray-300 text-lg mb-8 max-w-xl font-['Orbitron'] text-justify">
                Join thousands of satisfied customers who have chosen our fleet for their transportation needs. Book your ride today and experience luxury like never before.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button 
                onClick={() => window.location.href = '/faq'} 
                className="px-8 py-4 bg-gradient-to-r from-white to-cyan-400 hover:from-cyan-400 hover:to-white text-black font-['Orbitron'] transition-all duration-300 shadow-lg shadow-blue-600/20 hover:shadow-blue-500/30 rounded-md cursor-pointer"
              >
                NEED HELP ?
              </button>
              <button 
                onClick={() => window.location.href = '/contact'} 
                className="px-8 py-4 bg-transparent border border-cyan-500/50 hover:border-cyan-400 text-cyan-400 hover:text-cyan-300 font-['Orbitron'] transition-all duration-300 rounded-md cursor-pointer"
              >
                CONTACT US
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CallToAction;