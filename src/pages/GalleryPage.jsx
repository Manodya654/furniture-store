import React, { useState } from 'react';

const GalleryPage = ({ onSelectModel, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewModes, setViewModes] = useState({});

  const furnitureData = [
    { id: 'sofa', name: 'Luxury Sofa', category: 'Living Room', icon: '🛋️', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500', dim: '2.4m x 1.0m' },
    { id: 'bed', name: 'King Bed', category: 'Bedroom', icon: '🛏️', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?q=80&w=500', dim: '2.0m x 2.2m' },
    { id: 'table', name: 'Dining Table', category: 'Kitchen', icon: '🍽️', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=500', dim: '1.8m x 0.9m' },
    { id: 'lamp', name: 'Floor Lamp', category: 'Lighting', icon: '💡', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500', dim: '0.4m x 0.4m' },
    { id: 'chair', name: 'Office Chair', category: 'Office', icon: '🪑', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=500', dim: '0.6m x 0.6m' },
  ];

  const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Lighting'];

  const filteredItems = activeCategory === 'All' 
    ? furnitureData 
    : furnitureData.filter(item => item.category === activeCategory);

  const toggleView = (id, mode) => {
    setViewModes(prev => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-10 font-sans">
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-8">
        <div>
          <button onClick={onBack} className="text-emerald-500 text-sm font-bold mb-2 flex items-center gap-2 hover:translate-x-[-4px] transition-transform">
             ← Back to Home
          </button>
          <h1 className="text-4xl font-black tracking-tight">Object Visualization</h1>
        </div>
        <div className="text-right hidden md:block">
          <p className="text-[10px] text-slate-500 uppercase tracking-[4px]">HCI Graphics Engine</p>
          <p className="text-xs text-emerald-500 font-mono">Render Mode: Stable</p>
        </div>
      </header>

      {/* Grid */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => {
          const mode = viewModes[item.id] || 'default';

          return (
            <div key={item.id} className="bg-slate-900/40 border border-white/5 rounded-[40px] p-6 transition-all duration-500 hover:bg-slate-900/60">
              
              {/* Perfected Viewport Area */}
              <div className="relative h-64 rounded-[30px] overflow-hidden bg-[#050a18] flex items-center justify-center mb-6 shadow-inner">
                
                {/* 3D Render Style */}
                <div className={`w-full h-full transition-all duration-1000 ease-out flex items-center justify-center ${mode === '3d' ? 'scale-110' : ''}`}
                     style={{
                       perspective: '1200px',
                       transformStyle: 'preserve-3d'
                     }}>
                  <img 
                    src={item.img} 
                    className={`w-full h-full object-cover transition-all duration-1000 ${
                      mode === '3d' ? 'rotate-y-12 rotate-x-6 brightness-110 shadow-2xl' : 
                      mode === '2d' ? 'brightness-50 grayscale opacity-40 scale-75' : 'scale-100'
                    }`}
                    style={{
                      transform: mode === '3d' ? 'rotateY(-25deg) rotateX(10deg)' : 'none',
                      boxShadow: mode === '3d' ? '20px 20px 50px rgba(0,0,0,0.7)' : 'none'
                    }}
                  />
                </div>

                {/* 2D Blueprint Overlay (More Perfected) */}
                {mode === '2d' && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center animate-fadeIn">
                    {/* Grid Lines */}
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#4a9eff 0.5px, transparent 0.5px)', backgroundSize: '15px 15px' }} />
                    
                    {/* Measurement Lines */}
                    <div className="relative border-2 border-emerald-500/50 w-40 h-40 flex items-center justify-center">
                       <div className="absolute -top-6 left-0 right-0 text-center text-[10px] font-mono text-emerald-400">{item.dim.split('x')[0]}</div>
                       <div className="absolute -right-12 top-0 bottom-0 flex items-center text-[10px] font-mono text-emerald-400 rotate-90">{item.dim.split('x')[1]}</div>
                       <span className="text-4xl opacity-80">{item.icon}</span>
                    </div>
                  </div>
                )}

                {/* Floating Icon for 3D/Default */}
                {mode !== '2d' && (
                  <div className="absolute bottom-4 left-6 bg-white/10 backdrop-blur-md px-4 py-2 rounded-2xl border border-white/10">
                    <span className="text-2xl">{item.icon}</span>
                  </div>
                )}
              </div>

              {/* Controls */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <h3 className="text-xl font-bold">{item.name}</h3>
                  <span className="text-[10px] font-mono text-slate-500">{item.category}</span>
                </div>

                <div className="flex gap-2 p-1 bg-black/40 rounded-2xl border border-white/5">
                  <button 
                    onClick={() => toggleView(item.id, '3d')}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === '3d' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-500'}`}
                  >
                    3D Perspective
                  </button>
                  <button 
                    onClick={() => toggleView(item.id, '2d')}
                    className={`flex-1 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${mode === '2d' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-500'}`}
                  >
                    2D Blueprint
                  </button>
                </div>

                <button 
                   onClick={() => onSelectModel(item.id)}
                   className="w-full bg-emerald-500/10 hover:bg-emerald-500 text-emerald-500 hover:text-white border border-emerald-500/20 py-3 rounded-2xl font-bold text-[11px] uppercase tracking-[2px] transition-all"
                >
                  Configure in Studio
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryPage;