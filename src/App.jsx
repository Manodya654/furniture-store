import { useState } from "react";
import ThreeScene from "./components/ThreeScene";
import TwoD_Scene from "./components/TwoD_Scene";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSideBar";
import DesignManager from "./components/DesignManager";

import LoginPage from "./pages/LoginPage";
import HomePage from "./pages/HomePage";
import GalleryPage from "./pages/GalleryPage";

function App() {
  // Navigation State
  const [currentPage, setCurrentPage] = useState('login');

  // Designer Logic State 
  const [viewMode, setViewMode] = useState('3d');
  const [selected, setSelected] = useState(null);
  const [furniture, setFurniture] = useState([]);
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [currentDesignName, setCurrentDesignName] = useState('Untitled Design');
  
  const [roomDimensions, setRoomDimensions] = useState({
    width: 6,
    height: 3,
    depth: 5,
    wallColor: '#e8e8e8',
    floorStyle: 'tiles',
    floorColor: '#d4b896'
  });

  // Handlers 
  const handleAddFurniture = (item) => {
    setFurniture(prev => [...prev, item]);
  };

  const handleUpdateFurniture = (id, updates) => {
    setFurniture(prev => prev.map(item => 
      item.id === id ? { ...item, ...updates } : item
    ));
  };

  const handleDeleteFurniture = (id) => {
    setFurniture(prev => prev.filter(item => item.id !== id));
    if (selected?.id === id) setSelected(null);
  };

  const handleSaveDesign = (name) => {
    const design = {
      id: Date.now().toString(),
      name: name || currentDesignName,
      timestamp: new Date().toISOString(),
      roomDimensions: { ...roomDimensions },
      furniture: furniture.map(item => ({ ...item }))
    };
    setSavedDesigns(prev => [...prev, design]);
    setCurrentDesignName(name || currentDesignName);
    return design;
  };

  const handleLoadDesign = (design) => {
    setRoomDimensions({ ...design.roomDimensions });
    setFurniture([...design.furniture]);
    setCurrentDesignName(design.name);
    setSelected(null);
    setCurrentPage('designer'); // Switch to designer when a design is loaded
  };

  const handleNewDesign = () => {
    setFurniture([]);
    setSelected(null);
    setCurrentDesignName('Untitled Design');
    setRoomDimensions({
      width: 6, height: 3, depth: 5, wallColor: '#e8e8e8', floorStyle: 'tiles', floorColor: '#d4b896'
    });
  };

  // --- ROUTING LOGIC ---
  
  if (currentPage === 'login') {
    return <LoginPage onLogin={() => setCurrentPage('home')} />;
  }

  if (currentPage === 'home') {
    return <HomePage onStartDesign={() => setCurrentPage('gallery')} onLogout={() => setCurrentPage('login')} />;
  }

  if (currentPage === 'gallery') {
    return (
      <GalleryPage 
        onBack={() => setCurrentPage('home')} 
        onSelectModel={() => setCurrentPage('designer')} 
      />
    );
  }

  // If page is 'designer', render the full studio 
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      color: 'white',
      background: '#0a0a0a',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <header style={{
        height: '60px', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between',
        padding: '0 30px', 
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <span style={{cursor: 'pointer'}} onClick={() => setCurrentPage('gallery')}>⬅️</span>
          <h2 style={{
            margin: 0, 
            fontSize: '20px', 
            fontWeight: '700',
            background: 'linear-gradient(135deg, #4a9eff 0%, #67b8ff 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text'
          }}>
            Furniture Studio Pro
          </h2>
          <span style={{ fontSize: '14px', color: '#888', marginLeft: '20px' }}>
            {currentDesignName}
          </span>
        </div>

        <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
          <DesignManager
            onSave={handleSaveDesign}
            onLoad={handleLoadDesign}
            onDelete={handleDeleteDesign}
            onNew={handleNewDesign}
            savedDesigns={savedDesigns}
            currentName={currentDesignName}
          />
          
          <div style={{ background: '#222', borderRadius: '8px', padding: '4px', display: 'flex', gap: '4px' }}>
            <button onClick={() => setViewMode('2d')} style={{ /* styles from your version 1 */
              padding: '8px 16px', background: viewMode === '2d' ? '#4a9eff' : 'transparent', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>2D View</button>
            <button onClick={() => setViewMode('3d')} style={{ /* styles from your version 1 */
              padding: '8px 16px', background: viewMode === '3d' ? '#4a9eff' : 'transparent', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: '600'
            }}>3D View</button>
          </div>
        </div>
      </header>
      
      <div style={{ display: "flex", flex: 1, overflow: 'hidden' }}>
        <LeftSidebar 
          roomDimensions={roomDimensions} 
          onRoomChange={setRoomDimensions}
          onAddFurniture={handleAddFurniture}
        />
        <main style={{ flex: 1, position: "relative", background: '#0a0a0a' }}>
          {viewMode === '3d' ? (
            <ThreeScene 
              onSelect={setSelected}
              selected={selected}
              roomDimensions={roomDimensions}
              furniture={furniture}
              onUpdateFurniture={handleUpdateFurniture}
            />
          ) : (
            <TwoD_Scene
              onSelect={setSelected}
              selected={selected}
              roomDimensions={roomDimensions}
              furniture={furniture}
              onUpdateFurniture={handleUpdateFurniture}
            />
          )}
        </main>
        <RightSidebar 
          selected={selected}
          onUpdateFurniture={handleUpdateFurniture}
          onDeleteFurniture={handleDeleteFurniture}
        />
      </div>
    </div>
  );
}

export default App;