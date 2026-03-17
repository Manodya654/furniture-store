import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = ({ onStartDesign, onOpenGallery, onLogout }) => {
  
  
  const furnitureAssets = [
    { name: 'Modern Sofa', icon: '🛋️', info: 'Luxury Velvet Fabric', id: 'sofa', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=600' },
    { name: 'Wooden Bed', icon: '🛏️', info: 'Oak Wood Frame', id: 'bed', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?auto=format&fit=crop&q=80&w=600' },
    { name: 'Dining Set', icon: '🍽️', info: 'Marble Top Table', id: 'table', img: 'https://images.unsplash.com/photo-1617806118233-18e16208a50a?auto=format&fit=crop&q=80&w=600' },
    { name: 'Floor Lamp', icon: '💡', info: 'Minimalist Gold', id: 'lamp', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=600' },
    { name: 'Office Chair', icon: '🪑', info: 'Ergonomic Support', id: 'chair', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=600' },
  ];

  return (
    <div className="min-h-screen w-full bg-[#020617] text-slate-200 font-sans selection:bg-emerald-500/30">
      <Navbar onStartDesign={onStartDesign} onOpenGallery={onOpenGallery} onLogout={onLogout} />

      
      <div className="fixed top-0 right-0 w-[600px] h-[600px] bg-emerald-600/10 blur-[150px] rounded-full -mr-32 -mt-32 pointer-events-none z-0" />
      <div className="fixed bottom-0 left-0 w-[400px] h-[400px] bg-blue-600/5 blur-[120px] rounded-full -ml-20 -mb-20 pointer-events-none z-0" />

      <main className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Hero Banner with Glass Effect */}
        <div 
          onClick={onStartDesign}
          className="group relative h-[500px] rounded-[60px] mb-20 overflow-hidden cursor-pointer border border-white/10 hover:border-emerald-500/40 transition-all duration-1000 shadow-2xl shadow-emerald-900/10"
        >
          <img 
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&q=80&w=1600" 
            className="absolute inset-0 w-full h-full object-cover transition-transform duration-1000 group-hover:scale-110 opacity-70"
            alt="Interior Background"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#020617] via-[#020617]/90 to-transparent" />
          
          <div className="relative h-full flex flex-col justify-center p-12 md:p-20 max-w-3xl">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 mb-6 w-fit">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-emerald-400 font-bold uppercase tracking-[3px] text-[10px]">Studio Pro v3.0 Is Live</span>
            </div>
            
            <h1 className="text-6xl md:text-7xl font-black text-white mb-6 leading-[1.05] tracking-tight">
              Design Your <br/> 
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-200">Perfect Space</span>
            </h1>
            
            <p className="text-slate-400 text-lg md:text-xl leading-relaxed mb-10 max-w-xl">
              Professional-grade 3D furniture placement tool. Real-time rendering, precise measurements, and interactive physics.
            </p>
            
            <div className="flex gap-4">
              <button className="group bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-xl shadow-emerald-900/40 active:scale-95 flex items-center gap-3">
                <span className="text-xs uppercase tracking-widest">Start Project</span>
                <span className="group-hover:translate-x-1 transition-transform">→</span>
              </button>
            </div>
          </div>
        </div>

        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-24 px-10">
          {[
            { label: '3D Assets', val: '500+' },
            { label: 'Render Latency', val: '14ms' },
            { label: 'Precision', val: '99.9%' },
            { label: 'Users Active', val: '2.4k' }
          ].map((stat, i) => (
            <div key={i} className="text-center">
              <div className="text-3xl font-black text-white mb-1">{stat.val}</div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Feature Grid */}
        <div className="space-y-12 mb-20">
          <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-6">
            <div className="text-center md:text-left">
              <h2 className="text-4xl font-black text-white tracking-tighter mb-2">Premium Asset Library</h2>
              <p className="text-slate-500 font-medium">Hand-picked models with high-resolution textures and physical properties.</p>
            </div>
            <button 
              onClick={onOpenGallery}
              className="bg-white/5 hover:bg-white/10 text-white border border-white/10 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all"
            >
              Explore Full Gallery
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {furnitureAssets.map((asset) => (
              <div 
                key={asset.id}
                onClick={onOpenGallery} 
                className="group bg-slate-900/20 backdrop-blur-sm border border-white/5 rounded-[45px] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 cursor-pointer shadow-xl hover:-translate-y-2"
              >
                <div className="h-52 overflow-hidden relative">
                  <img 
                    src={asset.img} 
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" 
                    alt={asset.name} 
                  />
                  <div className="absolute inset-0 bg-[#020617]/20 group-hover:bg-transparent transition-all" />
                  <div className="absolute top-5 left-5 bg-black/40 backdrop-blur-xl w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg border border-white/10">
                    {asset.icon}
                  </div>
                </div>
                
                <div className="p-8 text-center bg-gradient-to-b from-transparent to-black/20">
                  <h4 className="text-white font-bold text-lg mb-1">{asset.name}</h4>
                  <p className="text-[10px] text-emerald-500/70 font-black uppercase tracking-[2px]">{asset.info}</p>
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