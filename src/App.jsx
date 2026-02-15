import ThreeScene from "./components/ThreeScene";

function App() {
  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh", // Force the app to take full screen height
      width: "100vw",
      overflow: "hidden",
      backgroundColor: "#1a1a1a",
      color: "white"
    }}>
      
      {/* 1. TOP NAVBAR */}
      <nav style={{ 
        height: "60px", 
        display: "flex", 
        alignItems: "center", 
        padding: "0 20px", 
        background: "#222", 
        borderBottom: "1px solid #444" 
      }}>
        <h1 style={{ margin: 0, fontSize: "1.5rem" }}>Furniture Designer</h1>
      </nav>

      {/* 2. MAIN CONTENT AREA */}
      <div style={{ display: "flex", flex: 1 }}>
        
        {/* LEFT MENU */}
        <aside style={{ 
          width: "250px", 
          background: "#2a2a2a", 
          padding: "20px", 
          borderRight: "1px solid #444",
          display: "flex",
          flexDirection: "column",
          gap: "10px"
        }}>
          <h3>Assets</h3>
          <button 
            onClick={() => window.addChair?.()} 
            style={buttonStyle}
          >
            Add Chair
          </button>
          <button 
            onClick={() => window.addTable?.()} 
            style={buttonStyle}
          >
            Add Table
          </button>
        </aside>

        {/* MIDDLE CANVAS (The Scene) */}
        <main style={{ 
          flex: 1,      // This makes the center take up all remaining space
          position: "relative", 
          background: "#000" 
        }}>
          <ThreeScene />
        </main>

        {/* RIGHT MENU */}
        <aside style={{ 
          width: "250px", 
          background: "#2a2a2a", 
          padding: "20px", 
          borderLeft: "1px solid #444" 
        }}>
          <h3>Properties</h3>
          <p style={{ color: "#888", fontSize: "0.9rem" }}>
            Select an item to edit its properties.
          </p>
        </aside>

      </div>
    </div>
  );
}

// Simple reusable button style
const buttonStyle = {
  padding: "10px",
  cursor: "pointer",
  background: "#444",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontWeight: "bold"
};

export default App;