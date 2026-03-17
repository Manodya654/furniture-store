import React, { useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Environment, ContactShadows, useGLTF, Center } from '@react-three/drei';

const FurnitureModel = ({ modelPath }) => {
  const { scene } = useGLTF(`/models/${modelPath}`);
  return (
    <Center>
      <primitive object={scene} scale={2.5} rotation={[0, Math.PI / 4, 0]} />
    </Center>
  );
};

const GalleryPage = ({ onSelectModel, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');
  const [viewModes, setViewModes] = useState({});

  const furnitureData = [
    { id: 'sofa', name: 'Premium Sofa', category: 'Living Room', icon: '🛋️', glb: 'sofa.glb', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=800', dim: '2.4m x 1.0m' },
    { id: 'bed', name: 'Master King Bed', category: 'Bedroom', icon: '🛏️', glb: 'bed.glb', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?auto=format&fit=crop&q=80&w=800', dim: '2.0m x 2.2m' },
    { id: 'table', name: 'Dining Table', category: 'Kitchen', icon: '🍽️', glb: 'table.glb', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?auto=format&fit=crop&q=80&w=800', dim: '1.8m x 1.8m' },
    { id: 'chair', name: 'Ergo Chair', category: 'Office', icon: '🪑', glb: 'chair.glb', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?auto=format&fit=crop&q=80&w=800', dim: '0.6m x 0.6m' },
    { id: 'lamp', name: 'Modern Lamp', category: 'Lighting', icon: '💡', glb: 'lamp.glb', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?auto=format&fit=crop&q=80&w=800', dim: '0.4m x 0.4m' },
    { id: 'cupboard', name: 'Storage Unit', category: 'Bedroom', icon: '🚪', glb: 'cupboard.glb', img: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&q=80&w=800', dim: '1.2m x 2.0m' },
    { id: 'dining_set', name: 'Family Dining Set', category: 'Kitchen', icon: '🍷', glb: 'dining_set.glb', img: 'https://images.unsplash.com/photo-1617806118233-18e16208a50a?auto=format&fit=crop&q=80&w=800', dim: '2.5m x 1.5m' },
  ];

  const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Lighting'];
  const filteredItems = activeCategory === 'All' ? furnitureData : furnitureData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-6 md:p-12 font-sans selection:bg-emerald-500/30">
      <header className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center mb-16 border-b border-white/5 pb-10 gap-6">
        <div>
          <button onClick={onBack} className="text-emerald-500 font-black text-[10px] uppercase tracking-[3px] mb-4">← Exit to Dashboard</button>
          <h1 className="text-5xl font-black tracking-tighter uppercase italic">Asset Collection</h1>
        </div>
        <div className="flex flex-wrap gap-2 bg-slate-900/50 p-2 rounded-3xl border border-white/5 shadow-2xl">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveCategory(cat)} className={`px-6 py-3 rounded-2xl text-[10px] font-black uppercase tracking-widest transition-all ${activeCategory === cat ? 'bg-emerald-600 text-white shadow-lg' : 'text-slate-500 hover:text-white'}`}>{cat}</button>
          ))}
        </div>
      </header>

      <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        {filteredItems.map(item => {
          const mode = viewModes[item.id] || '3d';
          return (
            <div key={item.id} className="group bg-slate-950/60 border border-slate-900 rounded-[48px] p-8 flex flex-col justify-between hover:bg-slate-900/80 transition-all duration-500 shadow-2xl relative overflow-hidden">
              <div className="relative h-72 rounded-[36px] mb-8 overflow-hidden bg-black/40 border border-white/5 shadow-inner">
                {mode === '3d' && (
                  <Canvas dpr={[1, 2]} camera={{ position: [0, 2, 5], fov: 40 }}>
                    <Suspense fallback={null}>
                      <ambientLight intensity={0.8} />
                      <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={2} />
                      <FurnitureModel modelPath={item.glb} />
                      <Environment preset="city" />
                      <ContactShadows position={[0, -1, 0]} opacity={0.6} scale={10} blur={2.4} far={4} />
                      <OrbitControls enableZoom={true} minDistance={3} maxDistance={item.id === 'cupboard' ? 12 : 8} makeDefault />
                    </Suspense>
                  </Canvas>
                )}
                {mode === 'default' && <img src={item.img} className="w-full h-full object-cover" />}
                {mode === '2d' && (
                  <div className="absolute inset-0 bg-[#0a0f1d] flex flex-col items-center justify-center p-8">
                     <div className="relative border-2 border-emerald-500/50 bg-emerald-500/5 w-4/5 h-4/5 flex items-center justify-center rounded-xl">
                        <span className="text-7xl opacity-20">{item.icon}</span>
                        <div className="absolute -top-4 text-[8px] font-mono text-emerald-500 uppercase tracking-widest">{item.dim}</div>
                     </div>
                  </div>
                )}
              </div>
              <div className="space-y-6">
                <h3 className="text-3xl font-black text-white leading-none">{item.name}</h3>
                <div className="flex gap-2 p-1.5 bg-black/40 rounded-[22px] border border-white/5">
                  {['default', '3d', '2d'].map(v => (
                    <button key={v} onClick={() => setViewModes(prev => ({ ...prev, [item.id]: v }))} className={`flex-1 py-3 rounded-[18px] text-[9px] font-black uppercase transition-all ${mode === v ? 'bg-emerald-600 text-white' : 'text-slate-600'}`}>{v}</button>
                  ))}
                </div>
                <button onClick={() => onSelectModel(item.id)} className="w-full bg-emerald-600/10 hover:bg-emerald-600 text-emerald-400 hover:text-white border border-emerald-500/20 py-5 rounded-2xl font-black text-[10px] uppercase tracking-[4px] transition-all">Configure in Studio →</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default GalleryPage;