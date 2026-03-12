import React from 'react';

const Navbar = ({ onStartDesign, onOpenGallery, onLogout }) => {
  return (
    <nav className="w-full bg-slate-950/70 backdrop-blur-xl border-b border-white/5 px-8 py-4 flex justify-between items-center sticky top-0 z-[100] shadow-2xl transition-all duration-300">
      {/* Logo Section */}
      <div className="flex items-center gap-3 group cursor-pointer">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30 group-hover:rotate-[360deg] transition-all duration-700">
          <span className="text-xl">🏠</span>
        </div>
        <span className="text-xl font-black tracking-tighter text-white uppercase">
          Studio<span className="text-emerald-500">Pro</span>
        </span>
      </div>
      
      {/* Desktop Links */}
      <div className="hidden md:flex items-center gap-10 text-[10px] font-black uppercase tracking-[3px]">
        <button onClick={onStartDesign} className="text-slate-400 hover:text-emerald-400 transition-all relative group">
          Designer
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full"></span>
        </button>
        <button onClick={onOpenGallery} className="text-slate-400 hover:text-emerald-400 transition-all relative group">
          Gallery
          <span className="absolute -bottom-1 left-0 w-0 h-[2px] bg-emerald-500 transition-all group-hover:w-full"></span>
        </button>
        <button className="text-slate-700 cursor-not-allowed">Projects</button>
      </div>

      {/* Logout Action */}
      <button 
        onClick={onLogout}
        className="bg-emerald-500/10 hover:bg-red-500/20 text-emerald-500 hover:text-red-400 px-6 py-2.5 rounded-2xl border border-emerald-500/20 hover:border-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all active:scale-95"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;