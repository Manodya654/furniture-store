import { useState } from "react";
import ThreeScene from "./components/ThreeScene";
import LeftSidebar from "./components/LeftSidebar";
import RightSidebar from "./components/RightSidebar";

function App() {
  const [selected, setSelected] = useState(null);
  const [roomDimensions, setRoomDimensions] = useState({
    width: 30,
    height: 15,
    depth: 30,
    color: '#dddddd'
  });

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", 
      width: "100vw", 
      overflow: "hidden", 
      color: 'white',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif'
    }}>
      <header style={{
        height: '60px', 
        background: 'linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%)',
        display: 'flex', 
        alignItems: 'center', 
        padding: '0 30px', 
        borderBottom: '1px solid #333',
        boxShadow: '0 2px 10px rgba(0,0,0,0.5)'
      }}>
        <div style={{display: 'flex', alignItems: 'center', gap: '12px'}}>
          <span style={{fontSize: '28px'}}>🏗️</span>
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
          <span style={{
            background: '#2a4a7c',
            padding: '4px 10px',
            borderRadius: '12px',
            fontSize: '11px',
            fontWeight: '600',
            marginLeft: '8px'
          }}>
            v2.0
          </span>
        </div>
      </header>
      
      <div style={{ display: "flex", flex: 1, overflow: 'hidden' }}>
        <LeftSidebar 
          roomDimensions={roomDimensions} 
          onRoomChange={setRoomDimensions}
        />
        <main style={{ flex: 1, position: "relative", background: '#0a0a0a' }}>
          <ThreeScene 
            onSelect={setSelected} 
            roomDimensions={roomDimensions}
          />
        </main>
        <RightSidebar selected={selected} />
      </div>
    </div>
  );
}

export default App;