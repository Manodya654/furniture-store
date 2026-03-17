import { useState, useCallback } from "react";
import ThreeScene from "./components/ThreeScene";
import TwoD_Scene from "./components/TwoD_Scene";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";
import DesignManager from "./components/DesignManager";
import Toast from "./components/Toast";

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
 
  const [savedDesigns, setSavedDesigns] = useState([]);
  const [currentDesignName, setCurrentDesignName] = useState('Untitled Design');
  const [toasts, setToasts] = useState([]);

  const [roomDimensions, setRoomDimensions] = useState({
    width: 6,
    height: 3,
    depth: 5,
    wallColor: '#e8e8e8',
    floorStyle: 'tiles',
    floorColor: '#d4b896'
  });

  // පිටුව මාරු වන විට එය localStorage හි Save කරයි
  useEffect(() => {
    localStorage.setItem("active_view", currentPage);
  }, [currentPage]);

  // --- View Navigation ---
  if (currentPage === 'home') {
    return (
      <HomePage
        onStartDesign={() => setCurrentPage('designer')}
        onOpenGallery={() => setCurrentPage('gallery')}
        onLogout={() => setCurrentPage('login')}
      />
    );
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
      {/* Toast Container */}
      <Toast toasts={toasts} onRemove={removeToast} />

      {/* Header */}
      <header style={{
        height: '60px',
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: '0 24px',
        borderBottom: '1px solid #1a3a2a',
        boxShadow: '0 2px 15px rgba(0,0,0,0.5)',
        zIndex: 100
      }}>
        {/* Left section */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
          {/* Back Button */}
          <button
            onClick={() => setCurrentPage('gallery')}
            style={{
              background: 'rgba(26, 138, 92, 0.15)',
              border: '1px solid rgba(26, 138, 92, 0.4)',
              color: '#1adb8a',
              cursor: 'pointer',
              width: '38px',
              height: '38px',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              transition: 'all 0.25s ease',
              padding: 0,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(26, 138, 92, 0.3)';
              e.currentTarget.style.borderColor = '#1adb8a';
              e.currentTarget.style.transform = 'translateX(-2px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(26, 138, 92, 0.15)';
              e.currentTarget.style.borderColor = 'rgba(26, 138, 92, 0.4)';
              e.currentTarget.style.transform = 'translateX(0)';
            }}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M19 12H5" />
              <polyline points="12 19 5 12 12 5" />
            </svg>
          </button>

          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#1adb8a" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
            <h2 style={{
              margin: 0,
              fontSize: '20px',
              fontWeight: '800',
              background: 'linear-gradient(135deg, #1adb8a 0%, #15b870 50%, #0fa85f 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              letterSpacing: '-0.3px'
            }}>
              Furniture Studio
            </h2>
          </div>

          {/* Divider */}
          <div style={{ width: '1px', height: '24px', background: '#333', margin: '0 4px' }} />

          {/* Design Name */}
          <span style={{
            fontSize: '14px',
            color: '#777',
            fontWeight: '500'
          }}>
            {currentDesignName}
          </span>
        </div>

        {/* Right section */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          {/* Design Manager */}
          <DesignManager
            onSave={handleSaveDesign}
            onLoad={handleLoadDesign}
            onDelete={handleDeleteDesign}
            onNew={handleNewDesign}
            savedDesigns={savedDesigns}
            currentName={currentDesignName}
            showToast={showToast}
          />

          {/* View Toggle */}
          <div style={{
            background: '#1a1a1a',
            borderRadius: '10px',
            padding: '4px',
            display: 'flex',
            gap: '4px',
            border: '1px solid #2a2a2a'
          }}>
            <button
              onClick={() => setViewMode('2d')}
              style={{
                padding: '8px 18px',
                background: viewMode === '2d'
                  ? 'linear-gradient(135deg, #1adb8a 0%, #15b870 100%)'
                  : 'transparent',
                color: viewMode === '2d' ? '#000' : '#888',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="18" height="18" rx="2" />
                <line x1="3" y1="12" x2="21" y2="12" />
                <line x1="12" y1="3" x2="12" y2="21" />
              </svg>
              2D
            </button>
            <button
              onClick={() => setViewMode('3d')}
              style={{
                padding: '8px 18px',
                background: viewMode === '3d'
                  ? 'linear-gradient(135deg, #1adb8a 0%, #15b870 100%)'
                  : 'transparent',
                color: viewMode === '3d' ? '#000' : '#888',
                border: 'none',
                borderRadius: '7px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '700',
                transition: 'all 0.25s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M12 2L2 7l10 5 10-5-10-5z" />
                <path d="M2 17l10 5 10-5" />
                <path d="M2 12l10 5 10-5" />
              </svg>
              3D
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
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