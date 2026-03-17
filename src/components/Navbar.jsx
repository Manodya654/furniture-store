import React from 'react';

const Navbar = ({ onStartDesign, onOpenGallery, onLogout }) => {
  return (
    <nav className="relative z-50 flex items-center justify-between px-10 py-6 max-w-7xl mx-auto">
      <div className="flex items-center gap-2">
        <div className="w-10 h-10 bg-emerald-500 rounded-xl flex items-center justify-center shadow-lg shadow-emerald-500/20">
          <span className="text-xl">📐</span>
        </div>
        <span className="text-xl font-black tracking-tighter text-white uppercase">Studio Pro</span>
      </div>

      <div className="flex items-center gap-8">
        <button onClick={onOpenGallery} className="text-[10px] font-bold uppercase tracking-[3px] text-slate-400 hover:text-emerald-400 transition-colors">Gallery</button>
        <button onClick={onStartDesign} className="text-[10px] font-bold uppercase tracking-[3px] text-slate-400 hover:text-emerald-400 transition-colors">Editor</button>
        
       
        <button 
          onClick={onLogout}
          className="bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 px-6 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-[3px] text-emerald-400 hover:text-white transition-all flex items-center gap-2"
        >
          <span>Login</span>
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M11 16l4-4m0 0l-4-4m4 4H3m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
          </svg>
        </button>
      </div>
    </nav>
  );
};

export default Navbar;