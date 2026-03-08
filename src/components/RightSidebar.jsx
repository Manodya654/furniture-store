const RightSidebar = ({ selected, onUpdateFurniture, onDeleteFurniture }) => {
  const handlePositionChange = (axis, value) => {
    if (selected) {
      const newValue = parseFloat(value);
      if (!isNaN(newValue)) {
        onUpdateFurniture(selected.id, {
          position: { ...selected.position, [axis]: newValue }
        });
      }
    }
  };

  const handleRotationChange = (value) => {
    if (selected) {
      const newValue = parseFloat(value);
      if (!isNaN(newValue)) {
        onUpdateFurniture(selected.id, { rotation: newValue });
      }
    }
  };

  const handleScaleChange = (value) => {
    if (selected) {
      const newValue = parseFloat(value);
      if (!isNaN(newValue) && newValue > 0) {
        onUpdateFurniture(selected.id, { scale: newValue });
      }
    }
  };

  const handleColorChange = (color) => {
    if (selected) {
      onUpdateFurniture(selected.id, { color });
    }
  };

  const getFurnitureIcon = (type) => {
    const icons = {
      chair: '🪑',
      table: '🪵',
      sofa: '🛋️',
      bed: '🛏️',
      desk: '🗄️',
      lamp: '💡'
    };
    return icons[type] || '📦';
  };

  return (
    <aside style={sideStyle}>
      <div style={headerStyle}>
        <div style={headerIconBoxStyle}>⚙️</div>
        <h3 style={headingStyle}>Properties</h3>
      </div>

      {selected ? (
        <div style={contentStyle}>
          {/* Selected Item Info */}
          <div style={infoCardStyle}>
            <div style={itemHeaderStyle}>
              <div style={itemIconStyle}>{getFurnitureIcon(selected.type)}</div>
              <div>
                <div style={itemTitleStyle}>{selected.type}</div>
                <div style={itemIdStyle}>ID: {selected.id.substring(selected.id.length - 8)}</div>
              </div>
            </div>
          </div>

          {/* Position Controls */}
          <div style={controlCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardIconStyle}>📍</span>
              <span>Position</span>
            </div>
            <div style={coordsGridStyle}>
              <div style={coordInputGroupStyle}>
                <label style={coordLabelStyle}>X</label>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.x.toFixed(1)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  style={coordInputStyle}
                />
              </div>
              <div style={coordInputGroupStyle}>
                <label style={coordLabelStyle}>Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.y.toFixed(1)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  style={coordInputStyle}
                />
              </div>
              <div style={coordInputGroupStyle}>
                <label style={coordLabelStyle}>Z</label>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.z.toFixed(1)}
                  onChange={(e) => handlePositionChange('z', e.target.value)}
                  style={coordInputStyle}
                />
              </div>
            </div>
          </div>

          {/* Rotation Control */}
          <div style={controlCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardIconStyle}>🔄</span>
              <span>Rotation</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={selected.rotation || 0}
              onChange={(e) => handleRotationChange(e.target.value)}
              style={sliderStyle}
            />
            <div style={sliderValueStyle}>{(selected.rotation || 0).toFixed(0)}°</div>
          </div>

          {/* Scale Control */}
          <div style={controlCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardIconStyle}>📏</span>
              <span>Scale</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={selected.scale || 1}
              onChange={(e) => handleScaleChange(e.target.value)}
              style={sliderStyle}
            />
            <div style={sliderValueStyle}>{((selected.scale || 1) * 100).toFixed(0)}%</div>
          </div>

          {/* Color Control */}
          <div style={controlCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardIconStyle}>🎨</span>
              <span>Color</span>
            </div>
            <input 
              type="color" 
              value={selected.color || '#8B7355'}
              onChange={(e) => handleColorChange(e.target.value)} 
              style={colorPickerStyle}
            />
          </div>

          {/* Delete Action */}
          <button 
            onClick={() => onDeleteFurniture(selected.id)} 
            style={deleteBtnStyle}
          >
            <span style={{fontSize: '20px'}}>🗑️</span>
            <span>Delete Item</span>
          </button>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>👆</div>
          <div style={emptyTitleStyle}>No Selection</div>
          <div style={emptyTextStyle}>
            Click on any furniture in the scene to view and edit its properties
          </div>
        </div>
      )}
    </aside>
  );
};

const sideStyle = { 
  width: '300px', 
  background: 'linear-gradient(180deg, #1e1e1e 0%, #121212 100%)',
  borderLeft: '1px solid #2a2a2a',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-4px 0 20px rgba(0,0,0,0.3)',
  overflowY: 'auto'
};

const headerStyle = {
  padding: '24px 20px',
  borderBottom: '1px solid #2a2a2a',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const headerIconBoxStyle = {
  width: '36px',
  height: '36px',
  background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  boxShadow: '0 4px 12px rgba(240, 147, 251, 0.3)'
};

const headingStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: '700',
  color: '#fff',
  letterSpacing: '0.5px'
};

const contentStyle = {
  padding: '20px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const infoCardStyle = {
  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
  padding: '20px',
  borderRadius: '12px',
  boxShadow: '0 4px 16px rgba(102, 126, 234, 0.3)'
};

const itemHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '16px'
};

const itemIconStyle = {
  width: '56px',
  height: '56px',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '12px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '32px',
  backdropFilter: 'blur(10px)'
};

const itemTitleStyle = {
  fontSize: '20px',
  fontWeight: '700',
  color: '#fff',
  textTransform: 'capitalize',
  marginBottom: '4px'
};

const itemIdStyle = {
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.7)',
  fontFamily: 'monospace',
  letterSpacing: '0.5px'
};

const controlCardStyle = {
  background: '#0a0a0a',
  padding: '16px',
  borderRadius: '12px',
  border: '1px solid #2a2a2a'
};

const cardHeaderStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#fff',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const cardIconStyle = {
  fontSize: '16px'
};

const coordsGridStyle = {
  display: 'grid',
  gridTemplateColumns: 'repeat(3, 1fr)',
  gap: '10px'
};

const coordInputGroupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '6px'
};

const coordLabelStyle = {
  fontSize: '10px',
  color: '#888',
  fontWeight: '600',
  textTransform: 'uppercase',
  letterSpacing: '0.5px'
};

const coordInputStyle = {
  width: '100%',
  padding: '8px',
  background: '#1a1a1a',
  border: '1px solid #2a2a2a',
  borderRadius: '6px',
  color: '#4a9eff',
  fontSize: '13px',
  fontWeight: '600',
  outline: 'none',
  textAlign: 'center'
};

const sliderStyle = {
  width: '100%',
  height: '6px',
  background: '#2a2a2a',
  borderRadius: '3px',
  outline: 'none',
  cursor: 'pointer',
  accentColor: '#667eea',
  marginBottom: '8px'
};

const sliderValueStyle = {
  fontSize: '14px',
  color: '#4a9eff',
  fontWeight: '700',
  textAlign: 'center',
  padding: '4px',
  background: '#1a1a1a',
  borderRadius: '6px'
};

const colorPickerStyle = {
  width: '100%',
  height: '60px',
  border: '2px solid #2a2a2a',
  borderRadius: '10px',
  cursor: 'pointer',
  background: '#1a1a1a',
  transition: 'border-color 0.2s'
};

const deleteBtnStyle = {
  width: '100%',
  padding: '16px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #ff6b6b 0%, #ee5a6f 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '12px',
  fontSize: '14px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'all 0.3s ease',
  boxShadow: '0 4px 16px rgba(255, 107, 107, 0.3)',
  marginTop: 'auto'
};

const emptyStateStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '60px 40px',
  textAlign: 'center'
};

const emptyIconStyle = {
  fontSize: '80px',
  marginBottom: '24px',
  opacity: 0.3,
  filter: 'grayscale(1)'
};

const emptyTitleStyle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#fff',
  marginBottom: '12px'
};

const emptyTextStyle = {
  fontSize: '13px',
  color: '#666',
  lineHeight: '1.8',
  maxWidth: '220px'
};

export default RightSidebar;