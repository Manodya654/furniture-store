import React from 'react';
import Navbar from '../components/Navbar';

const HomePage = ({ onStartDesign, onOpenGallery, onLogout }) => {
  
  const furnitureAssets = [
    { name: 'Luxury Sofa', icon: '🛋️', info: 'Living Room Sectional', id: 'sofa', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=400' },
    { name: 'King Size Bed', icon: '🛏️', info: 'Master Bedroom Suite', id: 'bed', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?q=80&w=400' },
    { name: 'Dining Table', icon: '🍽️', info: 'Modern 6-Seater', id: 'table', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=400' },
    { name: 'Floor Lamp', icon: '💡', info: 'Ambient Lighting', id: 'lamp', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=400' },
    { name: 'Ergo Chair', icon: '🪑', info: 'Office Workspace', id: 'chair', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=400' },
  ];

  return (
    <div className="relative min-h-screen w-full bg-[#020617] text-slate-200 font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Navbar Integration */}
      <Navbar 
        onStartDesign={onStartDesign} 
        onOpenGallery={onOpenGallery} 
        onLogout={onLogout} 
      />

      {/* Background Decor */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-emerald-600/5 blur-[120px] rounded-full -mr-32 -mt-32 pointer-events-none" />
      
      <div className="relative z-10 max-w-7xl mx-auto p-6 md:p-12">
        
        {/* Hero Section - HCI Principle: Aesthetic & Minimalist Design */}
        <div 
          onClick={onStartDesign}
          className="group relative bg-gradient-to-br from-emerald-950/20 to-slate-900/20 border border-white/5 rounded-[48px] p-10 mb-16 overflow-hidden cursor-pointer hover:border-emerald-500/30 transition-all shadow-2xl"
        >
          <div className="relative z-10 flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="max-w-xl">
              <span className="bg-emerald-500/10 text-emerald-400 px-4 py-1 rounded-full font-bold uppercase tracking-[4px] text-[9px] mb-4 inline-block border border-emerald-500/20">Design Workspace</span>
              <h2 className="text-5xl font-black text-white mb-6 leading-tight">Create your <br/> dream space in <span className="text-emerald-500">3D.</span></h2>
              <p className="text-slate-400 leading-relaxed text-lg">
                Drag and drop high-quality furniture pieces into your custom floor plan with real-time lighting configuration.
              </p>
            </div>
            <button className="bg-emerald-600 hover:bg-emerald-500 text-white font-black px-10 py-5 rounded-2xl transition-all shadow-[0_10px_40px_rgba(16,185,129,0.3)] text-xs uppercase tracking-widest active:scale-95">
              Start New Project →
            </button>
          </div>
          <div className="absolute -right-20 -bottom-20 text-[280px] opacity-[0.03] rotate-12 group-hover:rotate-0 transition-all duration-1000">🏠</div>
        </div>

        {/* Furniture Asset Grid */}
        <div className="space-y-10">
          <div className="flex justify-between items-end px-2">
            <div>
              <h3 className="text-2xl font-black text-white tracking-tight">Curated Assets</h3>
              <p className="text-slate-500 text-sm mt-1">Select an asset to view details in the Gallery</p>
            </div>
            <button 
              onClick={onOpenGallery}
              className="text-[10px] font-black text-emerald-400 bg-emerald-500/5 px-6 py-3 rounded-2xl border border-emerald-500/20 uppercase tracking-widest hover:bg-emerald-500 hover:text-white transition-all shadow-lg"
            >
              Explore Full Library →
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
            {furnitureAssets.map((asset) => (
              <div 
                key={asset.id}
                onClick={onOpenGallery} 
                className="group bg-slate-900/40 border border-white/5 p-4 rounded-[32px] hover:border-emerald-500/40 transition-all cursor-pointer relative overflow-hidden flex flex-col items-center"
              >
                <div className="w-full h-44 rounded-2xl overflow-hidden mb-5 relative bg-slate-950">
                    <img 
                      src={asset.img} 
                      className="w-full h-full object-cover grayscale opacity-40 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-700" 
                      alt={asset.name} 
                    />
                    <div className="absolute inset-0 flex items-center justify-center text-5xl group-hover:scale-125 transition-transform duration-500">
                      {asset.icon}
                    </div>
                </div>
                <div className="text-center">
                    <h4 className="text-white font-bold text-sm mb-1">{asset.name}</h4>
                    <p className="text-[9px] text-slate-500 uppercase tracking-widest font-black opacity-60">{asset.info}</p>
                </div>
                {/* HCI Status Indicator */}
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <div className="w-2 h-2 bg-emerald-500 rounded-full animate-ping" />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Stats Footer */}
        <footer className="mt-24 pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex gap-10">
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[2px]">Engine Status</span>
              <span className="text-[11px] text-emerald-400 font-bold">Three.js R182 Active</span>
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-[9px] font-black text-slate-600 uppercase tracking-[2px]">Core Platform</span>
              
            </div>
          </div>
          <div className="text-[10px] text-slate-700 font-bold uppercase tracking-widest">
            © 2026 StudioPro Visualization Labs
          </div>
        </footer>
      </div>
    </div>
  );
};

export default HomePage;