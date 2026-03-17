const LeftSidebar = ({ roomDimensions, onRoomChange, onAddFurniture }) => {
  
  const addFurnitureItem = (type) => {
    const newItem = {
      id: `${type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type,
      position: {
        x: (Math.random() - 0.5) * roomDimensions.width * 0.6,
        y: 0,
        z: (Math.random() - 0.5) * roomDimensions.depth * 0.6
      },
      rotation: 0,
      scale: 1,
      color: '#8B7355'
    };
    onAddFurniture(newItem);
  };

  return (
    <aside style={sideStyle}>
      <div style={sectionStyle}>
        <h3 style={headingStyle}>ROOM SETUP</h3>
        
        <div style={gridStyle}>
          <div style={controlStyle}>
            <label style={labelStyle}>Width</label>
            <input 
              type="number" 
              min="3" 
              max="20" 
              step="0.5"
              value={roomDimensions.width}
              onChange={(e) => onRoomChange({ ...roomDimensions, width: parseFloat(e.target.value) || 6 })}
              style={inputStyle}
            />
            <span style={unitStyle}>m</span>
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Height</label>
            <input 
              type="number" 
              min="2" 
              max="6" 
              step="0.5"
              value={roomDimensions.height}
              onChange={(e) => onRoomChange({ ...roomDimensions, height: parseFloat(e.target.value) || 3 })}
              style={inputStyle}
            />
            <span style={unitStyle}>m</span>
          </div>

          <div style={controlStyle}>
            <label style={labelStyle}>Depth</label>
            <input 
              type="number" 
              min="3" 
              max="20" 
              step="0.5"
              value={roomDimensions.depth}
              onChange={(e) => onRoomChange({ ...roomDimensions, depth: parseFloat(e.target.value) || 5 })}
              style={inputStyle}
            />
            <span style={unitStyle}>m</span>
          </div>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Wall Color</label>
          <input 
            type="color" 
            value={roomDimensions.wallColor || '#e8e8e8'}
            onChange={(e) => onRoomChange({ ...roomDimensions, wallColor: e.target.value })}
            style={colorInputStyle}
          />
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Floor Style</label>
          <select 
            value={roomDimensions.floorStyle || 'tiles'}
            onChange={(e) => onRoomChange({ ...roomDimensions, floorStyle: e.target.value })}
            style={selectStyle}
          >
            <option value="tiles">Tiles</option>
            <option value="wood">Wood</option>
            <option value="marble">Marble</option>
            <option value="carpet">Carpet</option>
            <option value="solid">Solid</option>
          </select>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Floor Color</label>
          <input 
            type="color" 
            value={roomDimensions.floorColor || '#d4b896'}
            onChange={(e) => onRoomChange({ ...roomDimensions, floorColor: e.target.value })}
            style={colorInputStyle}
          />
        </div>
      </div>

      <div style={dividerStyle}></div>

      <label style={{...labelStyle, padding: '0 20px', marginTop: '10px'}}>FURNITURE LIBRARY</label>
      <div style={furnitureGridStyle}>
        <button onClick={() => addFurnitureItem('chair')} style={assetBtnStyle}>
          <span>Chair</span>
        </button>
        <button onClick={() => addFurnitureItem('table')} style={assetBtnStyle}>
          <span>Table</span>
        </button>
        <button onClick={() => addFurnitureItem('sofa')} style={assetBtnStyle}>
          <span>Sofa</span>
        </button>
        <button onClick={() => addFurnitureItem('bed')} style={assetBtnStyle}>
          <span>Bed</span>
        </button>
        <button onClick={() => addFurnitureItem('desk')} style={assetBtnStyle}>
          <span>Desk</span>
        </button>
        <button onClick={() => addFurnitureItem('lamp')} style={assetBtnStyle}>
          <span>Lamp</span>
        </button>
      </div>
    </aside>
  );
};

const sideStyle = { 
  width: '270px', 
  background: '#000',
  borderRight: '1px solid #1a1a1a',
  overflowY: 'auto',
  display: 'flex',
  flexDirection: 'column'
};

const sectionStyle = {
  padding: '20px'
};

const headingStyle = {
  margin: '0 0 18px 0',
  fontSize: '14px',
  fontWeight: '700',
  color: '#fff',
  textTransform: 'uppercase'
};

const dividerStyle = {
  height: '1px',
  background: '#1a1a1a',
  margin: '10px 0'
};

const gridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px',
  marginBottom: '16px'
};

const controlStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const labelStyle = {
  fontSize: '10px',
  color: '#888',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const inputStyle = {
  width: '100%',
  padding: '8px 6px',
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#10b981',
  fontSize: '13px',
  fontWeight: '600',
  outline: 'none',
  textAlign: 'center'
};

const unitStyle = {
  fontSize: '10px',
  color: '#666',
  textAlign: 'center'
};

const controlGroupStyle = {
  marginBottom: '14px'
};

const colorInputStyle = {
  width: '100%',
  height: '45px',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  cursor: 'pointer',
  background: '#0a0a0a'
};

const selectStyle = {
  width: '100%',
  padding: '10px',
  background: '#0a0a0a',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#fff',
  fontSize: '12px',
  fontWeight: '500',
  cursor: 'pointer',
  outline: 'none'
};

const furnitureGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(2, 1fr)',
  gap: '12px',
  padding: '20px'
};

const assetBtnStyle = {
  padding: '14px 8px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '12px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  transition: 'transform 0.1s ease',
  boxShadow: '0 2px 8px rgba(16, 185, 129, 0.3)'
};

export default LeftSidebar;