import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float } from '@react-three/drei';


const FurniturePlaceholder3D = ({ type }) => {
  return (
    <Float speed={2} rotationIntensity={0.5} floatIntensity={1}>
      <mesh castShadow receiveShadow>
       
        {type === 'sofa' ? <boxGeometry args={[2, 0.8, 1]} /> : 
         type === 'table' ? <cylinderGeometry args={[1, 1, 0.1, 32]} /> :
         type === 'lamp' ? <coneGeometry args={[0.5, 2, 16]} /> :
         <boxGeometry args={[1, 1, 1]} />}
         
        <meshPhysicalMaterial 
          color="#10b981" 
          metalness={0.2} 
          roughness={0.1} 
          transmission={0.5} // Glass effect
          thickness={0.5}
        />
      </mesh>
    </Float>
  );
};

const GalleryPage = ({ onSelectModel, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewModes, setViewModes] = useState({});

  const furnitureData = [
    { id: 'sofa', name: 'Luxury Sofa', category: 'Living Room', icon: '🛋️', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500', dim: '2.4m x 1.0m' },
    { id: 'bed', name: 'King Size Bed', category: 'Bedroom', icon: '🛏️', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?q=80&w=500', dim: '2.0m x 2.2m' },
    { id: 'table', name: 'Dining Table', category: 'Kitchen', icon: '🍽️', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=500', dim: '1.8m x 0.9m' },
    { id: 'lamp', name: 'Modern Lamp', category: 'Lighting', icon: '💡', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500', dim: '0.4m x 0.4m' },
    { id: 'chair', name: 'Ergo Chair', category: 'Office', icon: '🪑', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=500', dim: '0.6m x 0.6m' },
  ];

  const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office'];

  const filteredItems = activeCategory === 'All' 
    ? furnitureData 
    : furnitureData.filter(item => item.category === activeCategory);

  const toggleView = (id, mode) => {
    setViewModes(prev => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#020617] via-[#050b14] to-[#020617] text-white p-6 md:p-10 font-sans overflow-x-hidden selection:bg-emerald-500/30">
      
      {/* Header */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-10 border-b border-white/5 pb-8 relative z-10">
        <div>
          <button onClick={onBack} className="text-emerald-500 text-sm font-bold mb-3 flex items-center gap-2 hover:-translate-x-1 transition-transform">
             ← Back to Dashboard
          </button>
          <h1 className="text-4xl font-black tracking-tight">Interactive Gallery</h1>
        </div>
      </header>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-10 relative z-10">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-[11px] font-black uppercase tracking-wider transition-all border ${
              activeCategory === cat 
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-600/30' 
              : 'bg-slate-900/50 border-white/5 text-slate-400 hover:border-emerald-500/50 hover:text-white'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Gallery Cards */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10 relative z-10">
        {filteredItems.map(item => {
          const mode = viewModes[item.id] || 'default';

          return (
            <div key={item.id} className="group bg-slate-900/60 border border-white/5 rounded-[40px] p-6 transition-all duration-500 hover:border-emerald-500/30 hover:bg-slate-900/80 shadow-2xl flex flex-col justify-between">
              
              {/* Dynamic Viewport Area */}
              <div className="relative h-64 rounded-[30px] mb-6 shadow-inner flex items-center justify-center overflow-hidden bg-[#050a18]">
                
                {/* 1. Real Image View (Default) */}
                {mode === 'default' && (
                  <div className="absolute inset-0 w-full h-full">
                    <img src={item.img} alt={item.name} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-80" />
                  </div>
                )}

                {/* 2. Actual 3D Canvas View (Interactive) */}
                {mode === '3d' && (
                  <div className="absolute inset-0 w-full h-full cursor-grab active:cursor-grabbing">
                    <Canvas camera={{ position: [0, 2, 5], fov: 45 }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
                        
                        {/* Here goes the Real 3D Model */}
                        <FurniturePlaceholder3D type={item.id} />
                        
                        <Environment preset="city" />
                        <ContactShadows position={[0, -1, 0]} opacity={0.4} scale={10} blur={2} far={4} />
                        <OrbitControls autoRotate autoRotateSpeed={2} enableZoom={false} />
                      </Suspense>
                    </Canvas>
                  </div>
                )}

                {/* 3. 2D Blueprint View */}
                {mode === '2d' && (
                  <div className="absolute inset-0 w-full h-full flex items-center justify-center">
                    <img src={item.img} alt={item.name} className="absolute inset-0 w-full h-full object-cover scale-75 opacity-30 grayscale sepia-[0.3] hue-rotate-[130deg] brightness-150 blur-[2px]" />
                    <div className="absolute inset-0 opacity-20" style={{ backgroundImage: 'radial-gradient(#10b981 1px, transparent 1px)', backgroundSize: '20px 20px' }} />
                    <div className="relative z-10 w-40 h-40 border border-emerald-500/50 rounded-xl flex items-center justify-center bg-emerald-500/10 backdrop-blur-sm">
                       <div className="absolute -top-6 left-0 right-0 text-center text-[10px] font-mono text-emerald-400 font-bold">{item.dim.split('x')[0]} W</div>
                       <div className="absolute -right-12 top-0 bottom-0 flex items-center text-[10px] font-mono text-emerald-400 rotate-90 font-bold">{item.dim.split('x')[1]} D</div>
                       <span className="text-4xl opacity-50 drop-shadow-lg">{item.icon}</span>
                    </div>
                  </div>
                )}

                {/* Status Badge */}
                <div className="absolute top-4 right-4 z-40 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-xl border border-white/10 text-[9px] font-black uppercase tracking-widest text-slate-300">
                  {mode === '3d' ? '👆 Drag to Rotate (Real 3D)' : mode === '2d' ? '📐 Blueprint 2D' : '📷 Real Photo'}
                </div>
              </div>

              {/* Card Details & View Controls */}
              <div className="space-y-5">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{item.name}</h3>
                  <span className="text-[10px] font-black text-emerald-400 uppercase tracking-[3px] bg-emerald-500/10 px-3 py-1 rounded-lg">
                    {item.category}
                  </span>
                </div>

                <div className="flex gap-2 p-1.5 bg-black/40 rounded-2xl border border-white/5">
                  <button onClick={() => toggleView(item.id, 'default')} className={`flex-1 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${mode === 'default' ? 'bg-slate-700 text-white' : 'hover:bg-white/5 text-slate-400'}`}>
                    Photo
                  </button>
                  <button onClick={() => toggleView(item.id, '3d')} className={`flex-1 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${mode === '3d' ? 'bg-emerald-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
                    Real 3D
                  </button>
                  <button onClick={() => toggleView(item.id, '2d')} className={`flex-1 py-3 rounded-[14px] text-[10px] font-black uppercase tracking-widest transition-all ${mode === '2d' ? 'bg-blue-600 text-white shadow-lg' : 'hover:bg-white/5 text-slate-400'}`}>
                    2D Plan
                  </button>
                </div>

                <button 
                   onClick={() => onSelectModel(item.id)}
                   className="w-full bg-white/5 hover:bg-emerald-600 text-white border border-white/10 hover:border-emerald-500 py-3.5 rounded-2xl font-bold text-[11px] uppercase tracking-[3px] transition-all"
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