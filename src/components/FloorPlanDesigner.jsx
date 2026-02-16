import { useState, useRef, useEffect } from 'react';

const FloorPlanDesigner = () => {
  const canvasRef = useRef(null);
  const [furniture, setFurniture] = useState([]);
  const [selectedItem, setSelectedItem] = useState(null);
  const [draggingItem, setDraggingItem] = useState(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [roomConfig, setRoomConfig] = useState({
    width: 16,
    depth: 16,
    color: '#f5f5f5',
    wallColor: '#cccccc'
  });

  // Furniture templates with sizes (in meters)
  const furnitureTemplates = {
    chair: { width: 0.6, depth: 0.6, color: '#4682B4', icon: '🪑', name: 'Chair' },
    table: { width: 2, depth: 1, color: '#8B4513', icon: '🪵', name: 'Table' },
    sofa: { width: 2.5, depth: 1, color: '#4169E1', icon: '🛋️', name: 'Sofa' },
    bed: { width: 2, depth: 3, color: '#FFFFFF', icon: '🛏️', name: 'Bed' },
    lamp: { width: 0.4, depth: 0.4, color: '#FFF8DC', icon: '💡', name: 'Lamp' }
  };

  // Scale factor: pixels per meter
  const scale = 30;

  // Add furniture to the room
  const addFurniture = (type) => {
    const template = furnitureTemplates[type];
    const newItem = {
      id: Date.now(),
      type,
      x: roomConfig.width / 2 - template.width / 2, // Center of room
      y: roomConfig.depth / 2 - template.depth / 2,
      width: template.width,
      depth: template.depth,
      color: template.color,
      rotation: 0, // 0, 90, 180, 270 degrees
      name: `${template.name} ${furniture.length + 1}`
    };
    setFurniture([...furniture, newItem]);
  };

  // Delete selected furniture
  const deleteSelected = () => {
    if (selectedItem) {
      setFurniture(furniture.filter(item => item.id !== selectedItem.id));
      setSelectedItem(null);
    }
  };

  // Rotate selected furniture
  const rotateSelected = () => {
    if (selectedItem) {
      const updated = furniture.map(item => 
        item.id === selectedItem.id 
          ? { ...item, rotation: (item.rotation + 90) % 360 }
          : item
      );
      setFurniture(updated);
      setSelectedItem({ ...selectedItem, rotation: (selectedItem.rotation + 90) % 360 });
    }
  };

  // Change color of selected furniture
  const changeColor = (color) => {
    if (selectedItem) {
      const updated = furniture.map(item =>
        item.id === selectedItem.id ? { ...item, color } : item
      );
      setFurniture(updated);
      setSelectedItem({ ...selectedItem, color });
    }
  };

  // Canvas drawing
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    const roomWidth = roomConfig.width * scale;
    const roomDepth = roomConfig.depth * scale;

    // Set canvas size
    canvas.width = roomWidth + 100;
    canvas.height = roomDepth + 100;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const offsetX = 50;
    const offsetY = 50;

    // Draw room
    ctx.fillStyle = roomConfig.color;
    ctx.fillRect(offsetX, offsetY, roomWidth, roomDepth);
    
    // Draw walls
    ctx.strokeStyle = roomConfig.wallColor;
    ctx.lineWidth = 4;
    ctx.strokeRect(offsetX, offsetY, roomWidth, roomDepth);

    // Draw grid
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 0; i <= roomConfig.width; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX + i * scale, offsetY);
      ctx.lineTo(offsetX + i * scale, offsetY + roomDepth);
      ctx.stroke();
    }
    for (let i = 0; i <= roomConfig.depth; i++) {
      ctx.beginPath();
      ctx.moveTo(offsetX, offsetY + i * scale);
      ctx.lineTo(offsetX + roomWidth, offsetY + i * scale);
      ctx.stroke();
    }

    // Draw dimensions
    ctx.fillStyle = '#666';
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomConfig.width}m`, offsetX + roomWidth / 2, offsetY - 10);
    ctx.save();
    ctx.translate(offsetX - 10, offsetY + roomDepth / 2);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${roomConfig.depth}m`, 0, 0);
    ctx.restore();

    // Draw furniture
    furniture.forEach(item => {
      const x = offsetX + item.x * scale;
      const y = offsetY + item.y * scale;
      const w = item.width * scale;
      const h = item.depth * scale;

      ctx.save();
      ctx.translate(x + w / 2, y + h / 2);
      ctx.rotate((item.rotation * Math.PI) / 180);

      // Draw furniture rectangle
      ctx.fillStyle = item.color;
      ctx.fillRect(-w / 2, -h / 2, w, h);

      // Draw border (thicker if selected)
      if (selectedItem && selectedItem.id === item.id) {
        ctx.strokeStyle = '#FF6B6B';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 1;
      }
      ctx.strokeRect(-w / 2, -h / 2, w, h);

      // Draw icon
      ctx.font = `${Math.min(w, h) * 0.6}px Arial`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillStyle = '#000';
      const template = furnitureTemplates[item.type];
      ctx.fillText(template.icon, 0, 0);

      // Draw rotation indicator (small arrow)
      if (item.rotation !== 0) {
        ctx.beginPath();
        ctx.moveTo(0, -h / 2 + 5);
        ctx.lineTo(-3, -h / 2 + 10);
        ctx.lineTo(3, -h / 2 + 10);
        ctx.closePath();
        ctx.fillStyle = '#FF6B6B';
        ctx.fill();
      }

      ctx.restore();

      // Draw label
      ctx.fillStyle = '#333';
      ctx.font = '10px Arial';
      ctx.textAlign = 'center';
      ctx.fillText(item.name, x + w / 2, y + h + 12);
    });

  }, [furniture, selectedItem, roomConfig]);

  // Mouse handlers
  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) - 50) / scale;
    const mouseY = ((e.clientY - rect.top) - 50) / scale;

    // Check if clicked on furniture
    const clickedItem = furniture.find(item => {
      const centerX = item.x + item.width / 2;
      const centerY = item.y + item.depth / 2;
      
      // Rotate point back to check if it's inside the rectangle
      const angle = (-item.rotation * Math.PI) / 180;
      const cos = Math.cos(angle);
      const sin = Math.sin(angle);
      const dx = mouseX - centerX;
      const dy = mouseY - centerY;
      const rotatedX = dx * cos - dy * sin;
      const rotatedY = dx * sin + dy * cos;
      
      return Math.abs(rotatedX) <= item.width / 2 && 
             Math.abs(rotatedY) <= item.depth / 2;
    });

    if (clickedItem) {
      setSelectedItem(clickedItem);
      setDraggingItem(clickedItem);
      setDragOffset({
        x: mouseX - clickedItem.x,
        y: mouseY - clickedItem.y
      });
    } else {
      setSelectedItem(null);
    }
  };

  const handleMouseMove = (e) => {
    if (!draggingItem) return;

    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const mouseX = ((e.clientX - rect.left) - 50) / scale;
    const mouseY = ((e.clientY - rect.top) - 50) / scale;

    let newX = mouseX - dragOffset.x;
    let newY = mouseY - dragOffset.y;

    // Keep within room bounds
    newX = Math.max(0, Math.min(roomConfig.width - draggingItem.width, newX));
    newY = Math.max(0, Math.min(roomConfig.depth - draggingItem.depth, newY));

    const updated = furniture.map(item =>
      item.id === draggingItem.id ? { ...item, x: newX, y: newY } : item
    );
    setFurniture(updated);
    setSelectedItem({ ...draggingItem, x: newX, y: newY });
  };

  const handleMouseUp = () => {
    setDraggingItem(null);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Delete' || e.key === 'Backspace') {
        deleteSelected();
      } else if (e.key === 'r' || e.key === 'R') {
        rotateSelected();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedItem, furniture]);

  return (
    <div style={{ 
      display: 'flex', 
      height: '100vh', 
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#1a1a1a'
    }}>
      {/* Left Sidebar - Add Furniture */}
      <div style={{
        width: '250px',
        backgroundColor: '#2a2a2a',
        padding: '20px',
        color: 'white',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginTop: 0, borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
          📦 Add Furniture
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          {Object.entries(furnitureTemplates).map(([type, template]) => (
            <button
              key={type}
              onClick={() => addFurniture(type)}
              style={{
                padding: '12px',
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'left'
              }}
            >
              {template.icon} Add {template.name}
            </button>
          ))}
        </div>

        <h3 style={{ marginTop: '30px', borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
          🏠 Room Settings
        </h3>
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa' }}>
            Width (meters)
          </label>
          <input
            type="number"
            min="4"
            max="30"
            value={roomConfig.width}
            onChange={(e) => setRoomConfig({ ...roomConfig, width: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              color: 'white',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa' }}>
            Depth (meters)
          </label>
          <input
            type="number"
            min="4"
            max="30"
            value={roomConfig.depth}
            onChange={(e) => setRoomConfig({ ...roomConfig, depth: parseInt(e.target.value) })}
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#1a1a1a',
              border: '1px solid #444',
              color: 'white',
              borderRadius: '4px'
            }}
          />
        </div>
        <div style={{ marginTop: '15px' }}>
          <label style={{ display: 'block', marginBottom: '5px', fontSize: '12px', color: '#aaa' }}>
            Floor Color
          </label>
          <input
            type="color"
            value={roomConfig.color}
            onChange={(e) => setRoomConfig({ ...roomConfig, color: e.target.value })}
            style={{
              width: '100%',
              height: '40px',
              border: '1px solid #444',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          />
        </div>
      </div>

      {/* Center - Canvas */}
      <div style={{
        flex: 1,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0a0a0a',
        overflow: 'auto',
        padding: '20px'
      }}>
        <h1 style={{ color: 'white', marginBottom: '20px' }}>
          🏠 2D Floor Plan Designer
        </h1>
        <div style={{
          backgroundColor: 'white',
          borderRadius: '8px',
          padding: '10px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
        }}>
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            style={{ cursor: draggingItem ? 'grabbing' : 'default' }}
          />
        </div>
        <div style={{ 
          marginTop: '15px', 
          color: '#aaa', 
          fontSize: '14px',
          textAlign: 'center'
        }}>
          💡 Click furniture to select • Drag to move • Press R to rotate • Delete to remove
        </div>
      </div>

      {/* Right Sidebar - Properties */}
      <div style={{
        width: '250px',
        backgroundColor: '#2a2a2a',
        padding: '20px',
        color: 'white',
        overflowY: 'auto'
      }}>
        <h2 style={{ marginTop: 0, borderBottom: '2px solid #667eea', paddingBottom: '10px' }}>
          ⚙️ Properties
        </h2>

        {selectedItem ? (
          <div>
            <div style={{
              padding: '15px',
              backgroundColor: '#1a1a1a',
              borderRadius: '6px',
              marginBottom: '15px'
            }}>
              <div style={{ fontSize: '18px', marginBottom: '10px' }}>
                {furnitureTemplates[selectedItem.type].icon} {selectedItem.name}
              </div>
              <div style={{ fontSize: '12px', color: '#aaa' }}>
                Position: ({selectedItem.x.toFixed(1)}m, {selectedItem.y.toFixed(1)}m)
                <br />
                Size: {selectedItem.width}m × {selectedItem.depth}m
                <br />
                Rotation: {selectedItem.rotation}°
              </div>
            </div>

            <div style={{ marginBottom: '15px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontSize: '12px', color: '#aaa' }}>
                Furniture Color
              </label>
              <input
                type="color"
                value={selectedItem.color}
                onChange={(e) => changeColor(e.target.value)}
                style={{
                  width: '100%',
                  height: '40px',
                  border: '1px solid #444',
                  borderRadius: '4px',
                  cursor: 'pointer'
                }}
              />
            </div>

            <button
              onClick={rotateSelected}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#667eea',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600',
                marginBottom: '10px'
              }}
            >
              🔄 Rotate 90°
            </button>

            <button
              onClick={deleteSelected}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#dc3545',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🗑️ Delete
            </button>
          </div>
        ) : (
          <div style={{
            padding: '20px',
            textAlign: 'center',
            color: '#888',
            backgroundColor: '#1a1a1a',
            borderRadius: '8px',
            border: '1px dashed #444'
          }}>
            <div style={{ fontSize: '2rem', marginBottom: '10px' }}>👆</div>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Click on furniture to edit properties
            </p>
          </div>
        )}

        <div style={{
          marginTop: '30px',
          padding: '15px',
          backgroundColor: '#1a1a1a',
          borderRadius: '6px',
          fontSize: '12px',
          color: '#aaa'
        }}>
          <h4 style={{ marginTop: 0, color: '#fff' }}>📊 Summary</h4>
          <div>Total Items: {furniture.length}</div>
          <div>Room Size: {roomConfig.width}m × {roomConfig.depth}m</div>
          <div>Area: {(roomConfig.width * roomConfig.depth).toFixed(1)}m²</div>
        </div>
      </div>
    </div>
  );
};

export default FloorPlanDesigner;