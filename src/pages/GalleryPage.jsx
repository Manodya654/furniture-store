import React, { useState } from 'react';

const GalleryPage = ({ onSelectModel, onBack }) => {
  const [activeCategory, setActiveCategory] = useState('All');

  
  const furnitureData = [
    { id: 'sofa', name: 'Luxury Sofa', category: 'Living Room', icon: '🛋️', img: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?q=80&w=500' },
    { id: 'bed', name: 'King Bed', category: 'Bedroom', icon: '🛏️', img: 'https://images.unsplash.com/photo-1505693419148-9330f54cd2e3?q=80&w=500' },
    { id: 'table', name: 'Dining Table', category: 'Kitchen', icon: '🍽️', img: 'https://images.unsplash.com/photo-1530018607912-eff2df114f11?q=80&w=500' },
    { id: 'lamp', name: 'Floor Lamp', category: 'Lighting', icon: '💡', img: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?q=80&w=500' },
    { id: 'chair', name: 'Office Chair', category: 'Office', icon: '🪑', img: 'https://images.unsplash.com/photo-1505797149-43b0069ec26b?q=80&w=500' },
  ];

  const categories = ['All', 'Living Room', 'Bedroom', 'Kitchen', 'Office', 'Lighting'];

  const filteredItems = activeCategory === 'All' 
    ? furnitureData 
    : furnitureData.filter(item => item.category === activeCategory);

  return (
    <div className="min-h-screen bg-[#020617] text-white p-8 md:p-12 font-sans">
      {/* Header with Back Button - HCI Control */}
      <header className="max-w-7xl mx-auto flex justify-between items-center mb-12">
        <div className="flex items-center gap-4">
          <button onClick={onBack} className="p-2 hover:bg-emerald-500/10 rounded-full text-emerald-500 transition-all border border-emerald-500/20">
            ← Back
          </button>
          <h1 className="text-3xl font-black tracking-tight">Furniture Gallery</h1>
        </div>
        <div className="text-right">
            <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-3 py-1 rounded-full uppercase tracking-widest border border-emerald-500/20">
                {filteredItems.length} Models Available
            </span>
        </div>
      </header>

      {/* Categories Bar - HCI Efficiency */}
      <div className="max-w-7xl mx-auto flex flex-wrap gap-3 mb-12">
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={`px-6 py-2 rounded-full text-sm font-bold transition-all border ${
              activeCategory === cat 
              ? 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/40' 
              : 'bg-slate-900 border-slate-800 text-slate-400 hover:border-emerald-500/50'
            }`}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Furniture Grid - Engagement & Immersion */}
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
        {filteredItems.map(item => (
          <div 
            key={item.id}
            className="group bg-slate-900/40 border border-slate-800 rounded-[32px] overflow-hidden hover:border-emerald-500/40 transition-all duration-500 shadow-xl"
          >
            <div className="relative h-64 overflow-hidden">
              <img src={item.img} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-transparent to-transparent opacity-80" />
              <span className="absolute top-4 left-4 bg-black/50 backdrop-blur-md p-2 rounded-xl text-2xl">{item.icon}</span>
            </div>
            
            <div className="p-6">
              <h3 className="text-xl font-bold mb-1">{item.name}</h3>
              <p className="text-emerald-500/60 text-[10px] font-bold uppercase tracking-widest mb-6">{item.category}</p>
              
              <button 
                onClick={() => onSelectModel(item.id)}
                className="w-full bg-emerald-600/10 hover:bg-emerald-600 border border-emerald-500/20 text-emerald-500 hover:text-white font-bold py-3 rounded-2xl transition-all text-sm uppercase tracking-widest"
              >
                Start Designing →
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryPage;