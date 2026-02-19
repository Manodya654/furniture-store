import React from 'react';

const HomePage = ({ onStartDesign, onLogout }) => {
  // ඔබේ repo එකේ /public/models folder එකේ ඇති models වලට අදාළ දත්ත
  const furnitureAssets = [
    { name: 'Luxury Sofa', icon: '🛋️', info: 'Living Room Sectional', id: 'sofa' },
    { name: 'King Size Bed', icon: '🛏️', info: 'Master Bedroom Suite', id: 'bed' },
    { name: 'Dining Table', icon: '🍽️', info: 'Modern 6-Seater', id: 'table' },
    { name: 'Floor Lamp', icon: '💡', info: 'Ambient Lighting', id: 'lamp' },
    { name: 'Ergo Chair', icon: '🪑', info: 'Office Workspace', id: 'chair' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-200 font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Navigation - HCI Control */}
        <header className="flex justify-between items-center mb-12 border-b border-slate-800/50 pb-8">
          <div className="flex items-center gap-4">
            <button 
              onClick={onLogout}
              className="p-2 hover:bg-slate-800 rounded-full transition-all group border border-transparent hover:border-emerald-500/20"
              title="Return to Login"
            >
              <svg className="w-6 h-6 text-emerald-500 group-hover:-translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </button>
            <div>
              <h1 className="text-3xl font-black tracking-tight text-white">Studio Dashboard</h1>
              <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-[4px]">Visualization Workspace</p>
            </div>
          </div>
        </header>

        {/* Hero Section: New Project - HCI Efficiency */}
        <div 
          onClick={onStartDesign}
          className="group relative bg-emerald-950/20 border border-emerald-500/20 rounded-[40px] p-10 mb-16 overflow-hidden cursor-pointer hover:border-emerald-500/50 transition-all shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center">
            <div className="max-w-md">
              <span className="text-emerald-400 font-bold uppercase tracking-[4px] text-[10px] mb-4 block">Ready to Design</span>
              <h2 className="text-4xl font-bold text-white mb-4">Launch 3D Floor Designer</h2>
              <p className="text-slate-400 leading-relaxed">
                Start a new project to visualize room dimensions and place high-quality furniture models from your library.
              </p>
            </div>
            <button className="mt-8 md:mt-0 bg-emerald-600 hover:bg-emerald-500 text-white font-bold px-8 py-4 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 active:scale-95 text-sm uppercase tracking-widest">
              Open Workspace →
            </button>
          </div>
          <div className="absolute right-0 top-0 text-[200px] opacity-5 -rotate-12 translate-x-1/4 translate-y-1/4 group-hover:rotate-0 transition-transform duration-700">🏠</div>
        </div>

        {/* Furniture Asset Grid - Repo Connection */}
        <div className="space-y-8">
          <div className="flex justify-between items-end">
            <div>
              <h3 className="text-xl font-bold text-white tracking-tight">Furniture Library</h3>
              <p className="text-slate-500 text-xs mt-1">Select an asset to view in the 3D scene</p>
            </div>
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full border border-emerald-500/20 uppercase tracking-widest">
              {furnitureAssets.length} Models Loaded
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {furnitureAssets.map((asset) => (
              <div 
                key={asset.id}
                onClick={onStartDesign}
                className="group bg-slate-900/40 border border-slate-800 p-6 rounded-[32px] hover:border-emerald-500/30 transition-all cursor-pointer relative overflow-hidden"
              >
                <div className="text-5xl mb-6 group-hover:scale-110 group-hover:-rotate-6 transition-transform duration-300">
                  {asset.icon}
                </div>
                <h4 className="text-white font-bold mb-1">{asset.name}</h4>
                <p className="text-[10px] text-slate-500 uppercase tracking-wider">{asset.info}</p>
                
                {/* Hover Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Stats Footer - HCI Feedback */}
        <footer className="mt-24 pt-8 border-t border-slate-800/50 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-8">
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Engine</span>
              <span className="text-xs text-emerald-400 font-medium">Three.js R182</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[10px] font-bold text-slate-600 uppercase tracking-widest">Environment</span>
              <span className="text-xs text-slate-300 font-medium">3D Visualization Mode</span>
            </div>
          </div>
          <p className="text-[9px] font-bold text-slate-700 uppercase tracking-[4px]">
            Academic Project | PUSL3122 HCI Edition
          </p>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;