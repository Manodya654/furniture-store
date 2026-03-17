import { useState, useEffect } from "react";
import ThreeScene from "./components/ThreeScene";
import TwoD_Scene from "./components/TwoD_Scene";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";

function App() {
  // පද්ධතිය Refresh වූ විට අවසානයට සිටි පිටුව මතක තබා ගනී
  const [currentPage, setCurrentPage] = useState(() => {
    return localStorage.getItem("active_view") || 'home';
  });

  const [furniture, setFurniture] = useState([]);
  const [viewMode, setViewMode] = useState('3d');
  const [selected, setSelected] = useState(null);
  const [roomDimensions, setRoomDimensions] = useState({
    width: 6, height: 3, depth: 5,
    wallColor: '#e8e8e8', floorStyle: 'tiles', floorColor: '#d4b896'
  });

  // පිටුව මාරු වන විට එය localStorage හි Save කරයි
  useEffect(() => {
    localStorage.setItem("active_view", currentPage);
  }, [currentPage]);

  // --- View Navigation ---
  if (currentPage === 'home') {
    return (
      <HomePage 
        onStartDesign={() => setCurrentPage('gallery')} 
        onOpenGallery={() => setCurrentPage('gallery')} 
        onLogout={() => setCurrentPage('login')} 
      />
    );
  }

  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('designer')} />;
  }

  if (currentPage === 'gallery') {
    return (
      <GalleryPage 
        onBack={() => setCurrentPage('home')} 
        onSelectModel={() => setCurrentPage('designer')} 
      />
    );
  }

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden text-white bg-[#020617] font-sans">
      <header className="h-[60px] bg-slate-900 flex items-center px-8 border-b border-slate-800 justify-between">
        <button onClick={() => setCurrentPage('home')} className="text-emerald-500 font-bold uppercase tracking-widest text-[10px]">⬅ Dashboard</button>
        <h2 className="text-xs font-black uppercase tracking-[3px]">Studio Pro Designer</h2>
        <div className="flex bg-slate-800 p-1 rounded-xl">
           <button onClick={() => setViewMode('2d')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${viewMode === '2d' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>2D</button>
           <button onClick={() => setViewMode('3d')} className={`px-4 py-1.5 rounded-lg text-[10px] font-bold ${viewMode === '3d' ? 'bg-emerald-600 text-white' : 'text-slate-400'}`}>3D</button>
        </div>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <LeftSidebar roomDimensions={roomDimensions} onRoomChange={setRoomDimensions} onAddFurniture={(item) => setFurniture([...furniture, item])} />
        <main className="flex-1 relative bg-[#0a0a0a]">
          {viewMode === '3d' ? (
            <ThreeScene onSelect={setSelected} selected={selected} roomDimensions={roomDimensions} furniture={furniture} />
          ) : (
            <TwoD_Scene onSelect={setSelected} selected={selected} roomDimensions={roomDimensions} furniture={furniture} />
          )}
        </main>
        <RightSidebar selected={selected} />
      </div>
    </div>
  );
}

export default App;