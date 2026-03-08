const LeftSidebar = ({ roomDimensions, onRoomChange, onAddFurniture }) => {
  const handleDimensionChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onRoomChange({ ...roomDimensions, [field]: numValue });
    }
  };

  const handleAddAsset = (type) => {
    const newItem = {
      id: `${type}_${Date.now()}`,
      type: type,
      name: type,
      position: { x: 0, y: 0, z: 0 },
      rotation: 0,
      scale: 1,
      color: '#8B7355'
    };
    onAddFurniture(newItem);
  };

  return (
    <aside style={sideStyle}>
      {/* Room Configuration Section */}
      <div style={sectionStyle}>
        <h3 style={headingStyle}>
          <span style={iconStyle}>🏠</span> Room Setup
        </h3>
        
        <div style={controlGroupStyle}>
          <label style={labelStyle}>Width (m)</label>
          <input 
            type="number" 
            min="5" 
            max="100" 
            step="0.5"
            value={roomDimensions.width}
            onChange={(e) => handleDimensionChange('width', e.target.value)}
            style={numberInputStyle}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Height (m)</label>
          <input 
            type="number" 
            min="2.5" 
            max="50" 
            step="0.5"
            value={roomDimensions.height}
            onChange={(e) => handleDimensionChange('height', e.target.value)}
            style={numberInputStyle}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Depth (m)</label>
          <input 
            type="number" 
            min="5" 
            max="100" 
            step="0.5"
            value={roomDimensions.depth}
            onChange={(e) => handleDimensionChange('depth', e.target.value)}
            style={numberInputStyle}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Wall Color</label>
          <input 
            type="color" 
            value={roomDimensions.wallColor}
            onChange={(e) => onRoomChange({ ...roomDimensions, wallColor: e.target.value })}
            style={colorInputStyle}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Floor Style</label>
          <select
            value={roomDimensions.floorStyle}
            onChange={(e) => onRoomChange({ ...roomDimensions, floorStyle: e.target.value })}
            style={selectStyle}
          >
            <option value="tiles">Tiles Pattern</option>
            <option value="wood">Wood Planks</option>
            <option value="marble">Marble</option>
            <option value="carpet">Carpet</option>
            <option value="solid">Solid Color</option>
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Floor Color</label>
          <input 
            type="color" 
            value={roomDimensions.floorColor}
            onChange={(e) => onRoomChange({ ...roomDimensions, floorColor: e.target.value })}
            style={colorInputStyle}
          />
        </div>
      </div>

      <div style={dividerStyle}></div>

      {/* Assets Section */}
      <div style={sectionStyle}>
        <h3 style={headingStyle}>
          <span style={iconStyle}>🪑</span> Add Furniture
        </h3>
        <button onClick={() => handleAddAsset('chair')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🪑</span> Chair
        </button>
        <button onClick={() => handleAddAsset('table')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🪵</span> Table
        </button>
        <button onClick={() => handleAddAsset('sofa')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🛋️</span> Sofa
        </button>
        <button onClick={() => handleAddAsset('bed')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🛏️</span> Bed
        </button>
        <button onClick={() => handleAddAsset('desk')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🗄️</span> Desk
        </button>
      </div>

      <div style={dividerStyle}></div>

      {/* Transform Section */}
      <div style={sectionStyle}>
        <h3 style={headingStyle}>
          <span style={iconStyle}>💡</span> Tips
        </h3>
        <div style={tipBoxStyle}>
          <div style={{fontSize: '12px', color: '#aaa', lineHeight: '1.6'}}>
            • Click furniture to select<br/>
            • Drag to move in 2D view<br/>
            • Use properties panel to adjust<br/>
            • Switch between 2D/3D views
          </div>
        </div>
      </div>
    </aside>
  );
};

const sideStyle = { 
  width: '280px', 
  background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
  padding: '0',
  borderRight: '1px solid #333',
  overflowY: 'auto',
  boxShadow: '2px 0 10px rgba(0,0,0,0.3)'
};

const sectionStyle = {
  padding: '20px'
};

const headingStyle = {
  margin: '0 0 15px 0',
  fontSize: '14px',
  fontWeight: '600',
  color: '#fff',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const iconStyle = {
  fontSize: '16px'
};

const dividerStyle = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, #333, transparent)',
  margin: '0'
};

const controlGroupStyle = {
  marginBottom: '18px'
};

const labelStyle = {
  display: 'block',
  fontSize: '12px',
  color: '#aaa',
  marginBottom: '8px',
  fontWeight: '500'
};

const numberInputStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#222',
  border: '2px solid #333',
  borderRadius: '6px',
  color: '#4a9eff',
  fontSize: '14px',
  fontWeight: '600',
  outline: 'none',
  transition: 'border-color 0.2s'
};

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#222',
  border: '2px solid #333',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  cursor: 'pointer'
};

const colorInputStyle = {
  width: '100%',
  height: '45px',
  border: '2px solid #333',
  borderRadius: '6px',
  cursor: 'pointer',
  background: '#222'
};

const assetBtnStyle = {
  width: '100%',
  padding: '12px 16px',
  marginBottom: '10px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #2a4a7c 0%, #1e3557 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  transition: 'all 0.2s ease',
  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
};

const btnIconStyle = {
  fontSize: '16px'
};

const tipBoxStyle = {
  background: '#1a1a2e',
  padding: '14px',
  borderRadius: '8px',
  border: '1px solid #2a2a4e'
};

export default LeftSidebar;