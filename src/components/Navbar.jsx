import React from 'react';

const Navbar = ({ onStartDesign, onOpenGallery, onLogout }) => {
  return (
    <nav className="w-full bg-slate-900/80 backdrop-blur-md border-b border-white/10 px-8 py-4 flex justify-between items-center shadow-lg">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-emerald-500/20 rounded-xl flex items-center justify-center border border-emerald-500/30">
          <span className="text-xl">🏗️</span>
        </div>
        <span className="text-xl font-black tracking-tighter text-white">STUDIO<span className="text-emerald-500">PRO</span></span>
      </div>
      
      <div className="hidden md:flex items-center gap-8 text-[11px] font-bold uppercase tracking-[2px]">
        <button onClick={onStartDesign} className="text-slate-300 hover:text-emerald-400 transition-colors">Designer</button>
        <button onClick={onOpenGallery} className="text-slate-300 hover:text-emerald-400 transition-colors">Gallery</button>
        <button className="text-slate-600 cursor-not-allowed">Saved Projects</button>
      </div>

      <button 
        onClick={onLogout}
        className="bg-red-500/10 hover:bg-red-500/20 text-red-400 px-5 py-2 rounded-xl border border-red-500/20 text-[10px] font-black uppercase tracking-widest transition-all"
      >
        Logout
      </button>
    </nav>
  );
};

export default Navbar;