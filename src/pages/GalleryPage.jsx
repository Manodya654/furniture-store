import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, Float, PresentationControls } from '@react-three/drei';


const FurniturePlaceholder3D = ({ type }) => {
  return (
    <PresentationControls global config={{ mass: 2, tension: 500 }} snap={{ mass: 4, tension: 1500 }} rotation={[0, 0.3, 0]} polar={[-Math.PI / 3, Math.PI / 3]} azim={[-Math.PI / 1.4, Math.PI / 1.4]}>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh castShadow receiveShadow>
          {type === 'sofa' && <boxGeometry args={[2.5, 0.8, 1.2]} />}
          {type === 'bed' && <boxGeometry args={[2, 0.5, 2.4]} />}
          {type === 'table' && <cylinderGeometry args={[1.2, 1.2, 0.15, 32]} />}
          {type === 'lamp' && <cylinderGeometry args={[0.05, 0.2, 2.5, 16]} />}
          {type === 'chair' && <boxGeometry args={[0.8, 1, 0.8]} />}
          {!['sofa', 'bed', 'table', 'lamp', 'chair'].includes(type) && <boxGeometry args={[1, 1, 1]} />}
           
          <meshPhysicalMaterial 
            color="#10b981" 
            metalness={0.7} 
            roughness={0.2} 
            transmission={0.4} 
            thickness={1.5}
            envMapIntensity={1}
          />
        </mesh>
      </Float>
    </PresentationControls>
  );
};

const GalleryPage = ({ onSelectModel, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewModes, setViewModes] = useState({});

  const furnitureData = [
    { id: 'sofa', name: 'Luxury Sofa', category: 'Living Room', icon: '🛋️', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', dim: '2.4m x 1.0m' },
    { id: 'bed', name: 'King Size Bed', category: 'Bedroom', icon: '🛏️', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?auto=format&fit=crop&q=80&w=800', dim: '2.0m x 2.2m' },
    { id: 'table', name: 'Dining Table', category: 'Kitchen', icon: '🍽️', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800', dim: '1.8m x 0.9m' },
    { id: 'lamp', name: 'Modern Lamp', category: 'Lighting', icon: '💡', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', dim: '0.4m x 0.4m' },
    { id: 'chair', name: 'Ergo Chair', category: 'Office', icon: '🪑', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=800', dim: '0.6m x 0.6m' },
  ];

  const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office'];
  const filteredItems = activeCategory === 'All' ? furnitureData : furnitureData.filter(item => item.category === activeCategory);

  const toggleView = (id, mode) => {
    setViewModes(prev => ({ ...prev, [id]: mode }));
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-center mb-16 border-b border-white/5 pb-10 gap-6">
        <div>
          <button onClick={onBack} className="group flex items-center gap-3 text-emerald-500 font-black text-[10px] uppercase tracking-[3px] mb-4 hover:text-emerald-400 transition-all">
             <span className="bg-emerald-500/10 p-2 rounded-lg group-hover:-translate-x-1 transition-transform">←</span> 
             Exit to Dashboard
          </button>
          <h1 className="text-5xl font-black tracking-tighter">Interactive <span className="text-emerald-500">Assets.</span></h1>
        </div>
        
       
        <div className="flex flex-wrap gap-2 bg-slate-900/50 p-2 rounded-[24px] border border-white/5">
          {categories.map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${
                activeCategory === cat 
                ? 'bg-emerald-600 text-white shadow-lg shadow-emerald-600/20' 
                : 'text-slate-500 hover:text-white hover:bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </header>

      
      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.map(item => {
          const mode = viewModes[item.id] || 'default';

          return (
            <div key={item.id} className="group bg-slate-900/40 border border-white/5 rounded-[48px] p-8 flex flex-col justify-between hover:bg-slate-900/60 transition-all duration-500 shadow-2xl relative overflow-hidden">
              
              
              <div className="absolute top-6 left-6 z-20 bg-emerald-500/10 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/20 text-[8px] font-black text-emerald-400 uppercase tracking-widest">
                {item.category}
              </div>

             
              <div className="relative h-72 rounded-[36px] mb-8 overflow-hidden bg-black/40 border border-white/5 shadow-inner group/viewport">
                
                
                {mode === 'default' && (
                  <img src={item.img} alt={item.name} className="w-full h-full object-cover animate-in fade-in zoom-in-110 duration-1000" />
                )}

               
                {mode === '3d' && (
                  <div className="w-full h-full cursor-grab active:cursor-grabbing">
                    <Canvas camera={{ position: [0, 2, 5], fov: 40 }}>
                      <Suspense fallback={null}>
                        <ambientLight intensity={0.5} />
                        <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1.5} castShadow />
                        <FurniturePlaceholder3D type={item.id} />
                        <Environment preset="apartment" />
                        <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2} far={4} />
                        <OrbitControls enableZoom={false} makeDefault />
                      </Suspense>
                    </Canvas>
                  </div>
                )}

                
                {mode === '2d' && (
                  <div className="absolute inset-0 bg-[#0a0f1d] flex items-center justify-center p-12 animate-in zoom-in-95 duration-500">
                    <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)', backgroundSize: '25px 25px' }} />
                    <div className="relative z-10 w-full h-full border-2 border-dashed border-emerald-500/30 rounded-2xl flex items-center justify-center bg-emerald-500/5">
                        <div className="absolute -top-4 w-full flex justify-center">
                            <span className="bg-[#0a0f1d] px-3 text-[10px] font-mono text-emerald-500 font-bold border border-emerald-500/20 rounded-md tracking-tighter uppercase">Width: {item.dim.split('x')[0]}</span>
                        </div>
                        <div className="absolute -left-10 h-full flex items-center">
                            <span className="bg-[#0a0f1d] px-3 text-[10px] font-mono text-emerald-500 font-bold border border-emerald-500/20 rounded-md tracking-tighter uppercase -rotate-90">Depth: {item.dim.split('x')[1]}</span>
                        </div>
                        <span className="text-7xl opacity-40 grayscale group-hover/viewport:grayscale-0 transition-all">{item.icon}</span>
                    </div>
                  </div>
                )}
                
               
                <div className="absolute bottom-4 right-4 z-20 flex gap-2">
                   <div className="bg-black/60 backdrop-blur-md px-4 py-2 rounded-xl text-[8px] font-black uppercase tracking-[2px] text-slate-300 border border-white/5">
                    {mode === '3d' ? 'Interactive 3D' : mode === '2d' ? 'Blueprint Mode' : 'Product Photo'}
                  </div>
                </div>
              </div>

             
              <div className="space-y-6">
                <div>
                  <h3 className="text-3xl font-black text-white leading-none">{item.name}</h3>
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-mono text-emerald-500 font-bold">{item.dim}</span>
                    <span className="w-1 h-1 bg-slate-700 rounded-full"></span>
                    <span className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Premium Mesh</span>
                  </div>
                </div>

   
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-[22px] border border-white/5">
                  {['default', '3d', '2d'].map(v => (
                    <button 
                      key={v}
                      onClick={() => toggleView(item.id, v)} 
                      className={`flex-1 py-3 rounded-[18px] text-[9px] font-black uppercase tracking-widest transition-all ${
                        mode === v ? 'bg-emerald-600 text-white shadow-xl' : 'text-slate-500 hover:text-slate-300'
                      }`}
                    >
                      {v === 'default' ? 'Photo' : v}
                    </button>
                  ))}
                </div>

                <button 
                   onClick={() => onSelectModel(item.id)}
                   className="w-full bg-emerald-500/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 hover:border-emerald-500 py-4 rounded-2xl font-black text-[10px] uppercase tracking-[4px] transition-all active:scale-95 shadow-lg hover:shadow-emerald-600/20"
                >
                  Configure in Designer
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