import { useState } from 'react';

const LeftSidebar = ({ roomDimensions, onRoomChange, onAddFurniture }) => {
  const [expanded, setExpanded] = useState({ room: true, furniture: true });

  const furnitureTypes = [
    { type: 'chair', label: 'Chair', icon: '🪑', color: '#8B7355' },
    { type: 'table', label: 'Table', icon: '🪵', color: '#A0856C' },
    { type: 'sofa', label: 'Sofa', icon: '🛋️', color: '#6B8E7B' },
    { type: 'bed', label: 'Bed', icon: '🛏️', color: '#7B6E8E' },
    { type: 'desk', label: 'Desk', icon: '🗄️', color: '#8B7355' },
    { type: 'lamp', label: 'Lamp', icon: '💡', color: '#C4A86B' },
  ];

  const handleAddFurniture = (furnitureType) => {
    // Generate a random position within the room
    const halfW = roomDimensions.width / 2;
    const halfD = roomDimensions.depth / 2;
    
    const item = {
      id: `${furnitureType.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: furnitureType.type,
      name: furnitureType.label,
      color: furnitureType.color,
      position: {
        x: (Math.random() - 0.5) * roomDimensions.width * 0.6,
        y: 0,
        z: (Math.random() - 0.5) * roomDimensions.depth * 0.6
      },
      rotation: 0,
      scale: 1
    };

    onAddFurniture(item);
  };

  const sectionStyle = {
    marginBottom: '16px',
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '8px',
    display: 'block',
    fontWeight: '600',
  };

  const inputStyle = {
    width: '100%',
    background: '#1a1a2e',
    border: '1px solid #333',
    color: 'white',
    padding: '8px 10px',
    borderRadius: '6px',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  return (
    <aside style={{
      width: '250px',
      background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
      borderRight: '1px solid #222',
      overflowY: 'auto',
      padding: '20px 16px',
      flexShrink: 0
    }}>
      {/* Room Setup */}
      <div style={sectionStyle}>
        <div
          onClick={() => setExpanded(p => ({ ...p, room: !p.room }))}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fff' }}>
            ROOM SETUP
          </h3>
          <span style={{ color: '#666', fontSize: '12px' }}>{expanded.room ? '▼' : '▶'}</span>
        </div>

        {expanded.room && (
          <>
            {/* Dimensions */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
              {['width', 'height', 'depth'].map(dim => (
                <div key={dim} style={{ flex: 1 }}>
                  <label style={labelStyle}>{dim.toUpperCase()}</label>
                  <input
                    type="number"
                    value={roomDimensions[dim]}
                    onChange={(e) => onRoomChange({ ...roomDimensions, [dim]: parseFloat(e.target.value) || 1 })}
                    style={inputStyle}
                    min={1}
                    max={50}
                    step={0.5}
                  />
                  <span style={{ fontSize: '10px', color: '#666', marginTop: '2px', display: 'block', textAlign: 'center' }}>m</span>
                </div>
              ))}
            </div>

            {/* Wall Color */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>WALL COLOR</label>
              <input
                type="color"
                value={roomDimensions.wallColor}
                onChange={(e) => onRoomChange({ ...roomDimensions, wallColor: e.target.value })}
                style={{ ...inputStyle, padding: '4px', height: '40px', cursor: 'pointer' }}
              />
            </div>

            {/* Floor Style */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>FLOOR STYLE</label>
              <select
                value={roomDimensions.floorStyle}
                onChange={(e) => onRoomChange({ ...roomDimensions, floorStyle: e.target.value })}
                style={{ ...inputStyle, cursor: 'pointer' }}
              >
                <option value="tiles">Tiles</option>
                <option value="wood">Wood</option>
                <option value="marble">Marble</option>
                <option value="carpet">Carpet</option>
              </select>
            </div>

            {/* Floor Color */}
            <div style={{ marginBottom: '12px' }}>
              <label style={labelStyle}>FLOOR COLOR</label>
              <input
                type="color"
                value={roomDimensions.floorColor}
                onChange={(e) => onRoomChange({ ...roomDimensions, floorColor: e.target.value })}
                style={{ ...inputStyle, padding: '4px', height: '40px', cursor: 'pointer' }}
              />
            </div>
          </>
        )}
      </div>

      <div style={{ height: '1px', background: '#222', margin: '16px 0' }} />

      {/* Furniture */}
      <div style={sectionStyle}>
        <div
          onClick={() => setExpanded(p => ({ ...p, furniture: !p.furniture }))}
          style={{
            cursor: 'pointer',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: '12px'
          }}
        >
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fff' }}>
            FURNITURE
          </h3>
          <span style={{ color: '#666', fontSize: '12px' }}>{expanded.furniture ? '▼' : '▶'}</span>
        </div>

        {expanded.furniture && (
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '8px'
          }}>
            {furnitureTypes.map(ft => (
              <button
                key={ft.type}
                onClick={() => handleAddFurniture(ft)}
                style={{
                  background: 'linear-gradient(135deg, #1a8a5c 0%, #15704a 100%)',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  padding: '12px 8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  gap: '4px',
                  transition: 'all 0.2s',
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 4px 12px rgba(26,138,92,0.4)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <span style={{ fontSize: '18px' }}>{ft.icon}</span>
                {ft.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;