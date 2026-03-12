import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = ({ onStartDesign, onOpenGallery, onLogout }) => {
  
  // Real Furniture Images from Unsplash
  const furnitureAssets = [
    { name: 'Modern Sofa', icon: '🛋️', info: 'Luxury Velvet Fabric', id: 'sofa', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800' },
    { name: 'Wooden Bed', icon: '🛏️', info: 'Oak Wood Frame', id: 'bed', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?auto=format&fit=crop&q=80&w=800' },
    { name: 'Dining Set', icon: '🍽️', info: 'Marble Top Table', id: 'table', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800' },
    { name: 'Floor Lamp', icon: '💡', info: 'Minimalist Gold', id: 'lamp', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800' },
    { name: 'Office Chair', icon: '🪑', info: 'Ergonomic Support', id: 'chair', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=800' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      
      {/* Modern Sticky Navbar */}
      <Navbar onStartDesign={onStartDesign} onOpenGallery={onOpenGallery} onLogout={onLogout} />

      {/* Decorative Blur Background */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-emerald-600/10 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />

      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Hero Banner */}
        <div 
          onClick={onStartDesign}
          className="group relative h-[450px] rounded-[50px] mb-20 overflow-hidden cursor-pointer border border-white/5 hover:border-emerald-500/30 transition-all duration-700 shadow-3xl"
        >
          {/* Background Image for Hero */}
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1200" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-105 opacity-60"
            alt="Interior Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/80 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-center p-12 max-w-2xl">
            <span className="text-emerald-400 font-black uppercase tracking-[5px] text-[10px] mb-4">Interior AI Studio</span>
            <h1 className="text-6xl font-black text-white mb-6 leading-[1.1]">Transform <br/> Your <span className="text-emerald-500 underline decoration-emerald-500/30 underline-offset-8">Idea</span> Into 3D.</h1>
            <p className="text-slate-400 text-lg leading-relaxed mb-8">
              Experience the next generation of interior planning. High-fidelity 3D modeling and real-time visualization at your fingertips.
            </p>
            <button className="w-fit bg-emerald-600 hover:bg-emerald-500 text-white font-black px-12 py-5 rounded-2xl transition-all shadow-[0_20px_50px_rgba(16,185,129,0.3)] text-xs uppercase tracking-widest active:scale-95">
              Launch Workspace →
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="space-y-12 mb-20">
          <div className="flex justify-between items-end">
            <div>
              <h2 className="text-3xl font-black text-white tracking-tighter">Premium Asset Library</h2>
              <p className="text-slate-500 mt-2 font-medium">Browse our hand-picked high-quality furniture collection.</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {furnitureAssets.map((asset) => (
              <div 
                key={asset.id}
                onClick={onOpenGallery} 
                className="group bg-slate-900/40 border border-white/5 rounded-[40px] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 cursor-pointer shadow-xl"
              >
                {/* Image Container */}
                <div className="h-48 overflow-hidden relative">
                  <img 
                    src={asset.img} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={asset.name} 
                  />
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-all" />
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md w-10 h-10 rounded-xl flex items-center justify-center text-xl">
                    {asset.icon}
                  </div>
                </div>
                
                {/* Details */}
                <div className="p-6 text-center">
                  <h4 className="text-white font-bold text-base mb-1">{asset.name}</h4>
                  <p className="text-[10px] text-slate-500 uppercase tracking-widest font-black opacity-80">{asset.info}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default HomePage;