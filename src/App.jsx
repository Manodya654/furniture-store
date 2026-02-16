import { useState } from "react";
import ThreeScene from "./components/ThreeScene";

function App() {
  const [selectedObject, setSelectedObject] = useState(null);
  const [currentColor, setCurrentColor] = useState("#4682B4");
  const [transformMode, setTransformMode] = useState("translate");

  const handleSelectObject = (obj) => {
    setSelectedObject(obj);
    if (obj && obj.userData.originalColor) {
      setCurrentColor(`#${obj.userData.originalColor.toString(16).padStart(6, '0')}`);
    }
  };

  const handleColorChange = (e) => {
    const newColor = e.target.value;
    setCurrentColor(newColor);
    window.changeObjectColor?.(newColor);
  };

  const handleDeleteSelected = () => {
    if (selectedObject) {
      const event = new KeyboardEvent('keydown', { key: 'Delete' });
      window.dispatchEvent(event);
      setSelectedObject(null);
    }
  };

  const handleModeChange = (mode) => {
    setTransformMode(mode);
    window.setTransformMode?.(mode);
  };

  return (
    <div style={{ 
      display: "flex", 
      flexDirection: "column", 
      height: "100vh",
      width: "100vw",
      overflow: "hidden",
      backgroundColor: "#1a1a1a",
      color: "white",
      fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif"
    }}>
      
      {/* TOP NAVBAR */}
      <nav style={{ 
        height: "80px", 
        display: "flex", 
        alignItems: "center", 
        justifyContent: "space-between",
        padding: "0 30px", 
        background: "#001056", 
        borderBottom: "1px solid #444",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)"
      }}>
        <h1 style={{ margin: 0, fontSize: "1.8rem", fontWeight: "600" }}>
          Furnitures 
        </h1>
        <div style={{ fontSize: "0.9rem", opacity: 0.9 }}>
          <strong>Controls:</strong> Left Click=Select/Move • Right Click+Drag=Rotate View • Scroll=Zoom • G/R/S=Transform Modes • Delete=Remove
        </div>
      </nav>

      {/* MAIN CONTENT AREA */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>
        
        {/* LEFT MENU - ASSETS */}
        <aside style={{ 
          width: "280px", 
          background: "#2a2a2a", 
          padding: "20px", 
          borderRight: "1px solid #444",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          overflowY: "auto"
        }}>
          <div>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: "15px", 
              fontSize: "1.2rem",
              borderBottom: "2px solid #011156",
              paddingBottom: "10px"
            }}>
              📦 Add Furniture
            </h3>
            
            <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
              <button onClick={() => window.addChair?.()} style={assetButtonStyle}>
                Chair
              </button>
              <button onClick={() => window.addTable?.()} style={assetButtonStyle}>
                Table
              </button>
              <button onClick={() => window.addSofa?.()} style={assetButtonStyle}>
                Sofa
              </button>
              <button onClick={() => window.addBed?.()} style={assetButtonStyle}>
                Bed
              </button>
              <button onClick={() => window.addLamp?.()} style={assetButtonStyle}>
                Lamp
              </button>
            </div>
          </div>

          <div style={{ 
            marginTop: "20px", 
            padding: "15px", 
            background: "#1a1a1a", 
            borderRadius: "8px",
            border: "1px solid #444"
          }}>
            <h4 style={{ marginTop: 0, fontSize: "0.95rem", color: "#aaa" }}>
              🎮 Controls
            </h4>
            <ul style={{ 
              margin: "10px 0 0 0", 
              padding: "0 0 0 20px", 
              fontSize: "0.85rem",
              lineHeight: "1.8",
              color: "#ccc"
            }}>
              <li><strong>Left Click:</strong> Select & move object</li>
              <li><strong>Drag Gizmo:</strong> Move/rotate/scale</li>
              <li><strong>Right Click + Drag:</strong> Rotate camera</li>
              <li><strong>Scroll:</strong> Zoom in/out</li>
              <li><strong>G Key:</strong> Move mode</li>
              <li><strong>R Key:</strong> Rotate mode</li>
              <li><strong>S Key:</strong> Scale mode</li>
              <li><strong>Delete/Backspace:</strong> Remove</li>
            </ul>
          </div>
        </aside>

        {/* CENTER - 3D VIEWPORT */}
        <main style={{ flex: 1, position: "relative", background: "#000" }}>
          <div style={{ position: "absolute", inset: 0 }}>
            <ThreeScene onSelectObject={handleSelectObject} />
          </div>

          {/* Mode selector overlay */}
          <div style={{
            position: "absolute",
            top: "20px",
            left: "20px",
            background: "rgba(0,0,0,0.7)",
            padding: "10px",
            borderRadius: "8px",
            display: "flex",
            gap: "10px",
            backdropFilter: "blur(10px)"
          }}>
            <button 
              onClick={() => handleModeChange("translate")}
              style={{
                ...modeButtonStyle,
                background: transformMode === "translate" ? "#2d326f" : "#444"
              }}
              title="Move (G)"
            >
              ↔️ Move
            </button>
            <button 
              onClick={() => handleModeChange("rotate")}
              style={{
                ...modeButtonStyle,
                background: transformMode === "rotate" ? "#2d326f" : "#444"
              }}
              title="Rotate (R)"
            >
              🔄 Rotate
            </button>
            <button 
              onClick={() => handleModeChange("scale")}
              style={{
                ...modeButtonStyle,
                background: transformMode === "scale" ? "#2d326f" : "#444"
              }}
              title="Scale (S)"
            >
              ⇔ Scale
            </button>
          </div>
        </main>

        {/* RIGHT MENU - PROPERTIES */}
        <aside style={{ 
          width: "280px", 
          background: "#2a2a2a", 
          padding: "20px", 
          borderLeft: "1px solid #444",
          display: "flex",
          flexDirection: "column",
          gap: "20px",
          overflowY: "auto"
        }}>
          <div>
            <h3 style={{ 
              marginTop: 0, 
              marginBottom: "15px",
              fontSize: "1.2rem",
              borderBottom: "2px solid #00115b",
              paddingBottom: "10px"
            }}>
              ⚙️ Properties
            </h3>
            
            {selectedObject ? (
              <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
                {/* Object Info */}
                <div style={propertyCardStyle}>
                  <label style={labelStyle}>Selected Object</label>
                  <div style={{ 
                    padding: "10px", 
                    background: "#1a1a1a", 
                    borderRadius: "4px",
                    fontSize: "0.9rem",
                    fontWeight: "500"
                  }}>
                    {selectedObject.userData.type || "Imported Model"}
                  </div>
                </div>

                {/* Color Picker */}
                <div style={propertyCardStyle}>
                  <label style={labelStyle}>Object Color</label>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <input 
                      type="color" 
                      value={currentColor}
                      onChange={handleColorChange}
                      style={{
                        width: "60px",
                        height: "40px",
                        border: "2px solid #444",
                        borderRadius: "4px",
                        cursor: "pointer",
                        background: "none"
                      }}
                    />
                    <input 
                      type="text"
                      value={currentColor.toUpperCase()}
                      onChange={(e) => {
                        const val = e.target.value;
                        if (/^#[0-9A-F]{6}$/i.test(val)) {
                          setCurrentColor(val);
                          window.changeObjectColor?.(val);
                        }
                      }}
                      style={{
                        flex: 1,
                        padding: "8px 12px",
                        background: "#1a1a1a",
                        border: "1px solid #444",
                        borderRadius: "4px",
                        color: "white",
                        fontSize: "0.9rem",
                        fontFamily: "monospace"
                      }}
                    />
                  </div>
                </div>

                {/* Transform Mode */}
                <div style={propertyCardStyle}>
                  <label style={labelStyle}>Transform Mode</label>
                  <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                    <button 
                      onClick={() => handleModeChange("translate")}
                      style={{
                        ...transformButtonStyle,
                        background: transformMode === "translate" ? "#001883" : "#444"
                      }}
                    >
                      ↔️ Move (G)
                    </button>
                    <button 
                      onClick={() => handleModeChange("rotate")}
                      style={{
                        ...transformButtonStyle,
                        background: transformMode === "rotate" ? "#001883" : "#444"
                      }}
                    >
                      🔄 Rotate (R)
                    </button>
                    <button 
                      onClick={() => handleModeChange("scale")}
                      style={{
                        ...transformButtonStyle,
                        background: transformMode === "scale" ? "#001883" : "#444"
                      }}
                    >
                      ⇔ Scale (S)
                    </button>
                  </div>
                </div>

                {/* Delete Button */}
                <button 
                  onClick={handleDeleteSelected}
                  style={{
                    padding: "12px",
                    background: "#68000a",
                    color: "white",
                    border: "none",
                    borderRadius: "6px",
                    cursor: "pointer",
                    fontWeight: "600",
                    fontSize: "0.95rem",
                    transition: "all 0.2s",
                    marginTop: "10px"
                  }}
                  onMouseEnter={(e) => e.target.style.background = "#c82333"}
                >
                  🗑️ Delete Object
                </button>
              </div>
            ) : (
              <div style={{
                padding: "20px",
                textAlign: "center",
                color: "#888",
                background: "#1a1a1a",
                borderRadius: "8px",
                border: "1px dashed #444"
              }}>
                <div style={{ fontSize: "2rem", marginBottom: "10px" }}>👆</div>
                <p style={{ margin: 0, fontSize: "0.9rem" }}>
                  Click on an object in the scene to edit its properties
                </p>
              </div>
            )}
          </div>
        </aside>

      </div>
    </div>
  );
}

// Styles
const assetButtonStyle = {
  padding: "12px 15px",
  cursor: "pointer",
  background: "#2d326f",
  color: "white",
  border: "none",
  borderRadius: "6px",
  fontWeight: "600",
  fontSize: "0.95rem",
  transition: "all 0.2s",
  textAlign: "left"
};

const modeButtonStyle = {
  padding: "8px 16px",
  cursor: "pointer",
  color: "white",
  border: "1px solid #666",
  borderRadius: "6px",
  fontWeight: "500",
  fontSize: "0.85rem",
  transition: "all 0.2s"
};

const propertyCardStyle = {
  display: "flex",
  flexDirection: "column",
  gap: "10px"
};

const labelStyle = {
  fontSize: "0.85rem",
  fontWeight: "600",
  color: "#aaa",
  textTransform: "uppercase",
  letterSpacing: "0.5px"
};

const transformButtonStyle = {
  padding: "10px",
  cursor: "pointer",
  color: "white",
  border: "none",
  borderRadius: "4px",
  fontWeight: "500",
  fontSize: "0.9rem",
  textAlign: "left",
  transition: "all 0.2s"
};

export default App;