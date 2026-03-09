const LeftSidebar = ({ roomDimensions, onRoomChange, onAddFurniture }) => {
  const handleDimensionChange = (field, value) => {
    const numValue = parseFloat(value);
    if (!isNaN(numValue) && numValue > 0) {
      onRoomChange({ ...roomDimensions, [field]: numValue });
    }
  };

  const handleAddAsset = (type) => {
    const safeWidth = (roomDimensions.width - 2) * 0.8;
    const safeDepth = (roomDimensions.depth - 2) * 0.8;
    
    const randomX = (Math.random() - 0.5) * safeWidth;
    const randomZ = (Math.random() - 0.5) * safeDepth;
    
    const newItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: type,
      name: type,
      position: { x: randomX, y: 0, z: randomZ },
      rotation: Math.random() * 360,
      scale: 1,
      color: '#8B7355'
    };
    
    onAddFurniture(newItem);
  };

  return (
    <aside style={sideStyle}>
      {/* Room Configuration */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconBoxStyle}>🏠</div>
          <h3 style={headingStyle}>Room Setup</h3>
        </div>
        
        <div style={dimensionsGridStyle}>
          <div style={dimInputGroupStyle}>
            <label style={labelStyle}>Width</label>
            <div style={inputWrapperStyle}>
              <input 
                type="number" 
                min="3" max="20" step="0.5"
                value={roomDimensions.width}
                onChange={(e) => handleDimensionChange('width', e.target.value)}
                style={numberInputStyle}
              />
              <span style={unitStyle}>m</span>
            </div>
          </div>

          <div style={dimInputGroupStyle}>
            <label style={labelStyle}>Height</label>
            <div style={inputWrapperStyle}>
              <input 
                type="number" 
                min="2" max="6" step="0.1"
                value={roomDimensions.height}
                onChange={(e) => handleDimensionChange('height', e.target.value)}
                style={numberInputStyle}
              />
              <span style={unitStyle}>m</span>
            </div>
          </div>

          <div style={dimInputGroupStyle}>
            <label style={labelStyle}>Depth</label>
            <div style={inputWrapperStyle}>
              <input 
                type="number" 
                min="3" max="20" step="0.5"
                value={roomDimensions.depth}
                onChange={(e) => handleDimensionChange('depth', e.target.value)}
                style={numberInputStyle}
              />
              <span style={unitStyle}>m</span>
            </div>
          </div>
        </div>

        <div style={colorControlsStyle}>
          <div style={colorGroupStyle}>
            <label style={labelStyle}>
              <span style={labelIconStyle}>🎨</span> Wall Color
            </label>
            <input 
              type="color" 
              value={roomDimensions.wallColor}
              onChange={(e) => onRoomChange({ ...roomDimensions, wallColor: e.target.value })}
              style={colorInputStyle}
            />
          </div>

          <div style={colorGroupStyle}>
            <label style={labelStyle}>
              <span style={labelIconStyle}>⬜</span> Floor Style
            </label>
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

          <div style={colorGroupStyle}>
            <label style={labelStyle}>
              <span style={labelIconStyle}>🎨</span> Floor Color
            </label>
            <input 
              type="color" 
              value={roomDimensions.floorColor}
              onChange={(e) => onRoomChange({ ...roomDimensions, floorColor: e.target.value })}
              style={colorInputStyle}
            />
          </div>
        </div>
      </div>

      <div style={dividerStyle}></div>

      {/* Furniture */}
      <div style={sectionStyle}>
        <div style={sectionHeaderStyle}>
          <div style={iconBoxStyle}>🪑</div>
          <h3 style={headingStyle}>Add Furniture</h3>
        </div>
        
        <div style={furnitureGridStyle}>
          <button onClick={() => handleAddAsset('chair')} style={assetBtnStyle}>
            <span style={assetIconStyle}>🪑</span>
            <span>Chair</span>
          </button>
          <button onClick={() => handleAddAsset('table')} style={assetBtnStyle}>
            <span style={assetIconStyle}>🪵</span>
            <span>Table</span>
          </button>
          <button onClick={() => handleAddAsset('sofa')} style={assetBtnStyle}>
            <span style={assetIconStyle}>🛋️</span>
            <span>Sofa</span>
          </button>
          <button onClick={() => handleAddAsset('bed')} style={assetBtnStyle}>
            <span style={assetIconStyle}>🛏️</span>
            <span>Bed</span>
          </button>
          <button onClick={() => handleAddAsset('desk')} style={assetBtnStyle}>
            <span style={assetIconStyle}>🗄️</span>
            <span>Desk</span>
          </button>
          <button onClick={() => handleAddAsset('lamp')} style={assetBtnStyle}>
            <span style={assetIconStyle}>💡</span>
            <span>Lamp</span>
          </button>
        </div>
      </div>
    </aside>
  );
};

const sideStyle = { 
  width: '300px', 
  background: 'linear-gradient(180deg, #1e1e1e 0%, #121212 100%)',
  borderRight: '1px solid #2a2a2a',
  overflowY: 'auto',
  overflowX: 'hidden',
  boxShadow: '4px 0 20px rgba(0,0,0,0.3)'
};

const sectionStyle = {
  padding: '24px 20px'
};

const sectionHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  marginBottom: '20px'
};

const iconBoxStyle = {
  width: '36px',
  height: '36px',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.3)'
};

const headingStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: '700',
  color: '#fff',
  letterSpacing: '0.5px'
};

const dividerStyle = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, #2a2a2a, transparent)',
  margin: '0'
};

const dimensionsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '12px',
  marginBottom: '20px'
};

const dimInputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const labelStyle = {
  fontSize: '11px',
  color: '#999',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px',
  display: 'flex',
  alignItems: 'center',
  gap: '6px'
};

const labelIconStyle = {
  fontSize: '14px'
};

const inputWrapperStyle = {
  position: 'relative',
  display: 'flex',
  alignItems: 'center'
};

const numberInputStyle = {
  width: '100%',
  padding: '10px 32px 10px 12px',
  background: '#0a0a0a',
  border: '2px solid #2a2a2a',
  borderRadius: '8px',
  color: '#4a9eff',
  fontSize: '14px',
  fontWeight: '600',
  outline: 'none',
  transition: 'border-color 0.2s, box-shadow 0.2s'
};

const unitStyle = {
  position: 'absolute',
  right: '12px',
  fontSize: '11px',
  color: '#666',
  fontWeight: '600',
  pointerEvents: 'none'
};

const colorControlsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const colorGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const selectStyle = {
  width: '100%',
  padding: '10px 12px',
  background: '#0a0a0a',
  border: '2px solid #2a2a2a',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '13px',
  outline: 'none',
  cursor: 'pointer',
  transition: 'border-color 0.2s'
};

const colorInputStyle = {
  width: '100%',
  height: '50px',
  border: '2px solid #2a2a2a',
  borderRadius: '8px',
  cursor: 'pointer',
  background: '#0a0a0a',
  transition: 'border-color 0.2s'
};

const furnitureGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px'
};

const assetBtnStyle = {
  padding: '16px 12px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '13px',
  fontWeight: '600',
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: '8px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 12px rgba(102, 126, 234, 0.25)'
};

const assetIconStyle = {
  fontSize: '28px',
  filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.3))'
};

export default LeftSidebar;