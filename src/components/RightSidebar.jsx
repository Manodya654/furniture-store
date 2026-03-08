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

  return (
    <aside style={sideStyle}>
      <div style={headerStyle}>
        <h3 style={headingStyle}>
          <span style={iconStyle}>⚙️</span> Properties
        </h3>
      </div>

      {selected ? (
        <div style={contentStyle}>
          {/* Selected Item Info */}
          <div style={infoCardStyle}>
            <div style={labelStyle}>Selected Object</div>
            <div style={objectNameStyle}>
              <span style={objectIconStyle}>
                {selected.type === 'chair' && '🪑'}
                {selected.type === 'table' && '🪵'}
                {selected.type === 'sofa' && '🛋️'}
                {selected.type === 'bed' && '🛏️'}
                {selected.type === 'desk' && '🗄️'}
              </span>
              {selected.type}
            </div>
            <div style={idStyle}>ID: {selected.id.substring(selected.id.length - 8)}</div>
          </div>

          {/* Position Controls */}
          <div style={controlSectionStyle}>
            <div style={controlHeaderStyle}>
              <span style={controlIconStyle}>📍</span>
              <span>Position</span>
            </div>
            <div style={inputGroupStyle}>
              <div style={inputItemStyle}>
                <label style={smallLabelStyle}>X</label>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.x.toFixed(1)}
                  onChange={(e) => handlePositionChange('x', e.target.value)}
                  style={numberInputStyle}
                />
              </div>
              <div style={inputItemStyle}>
                <label style={smallLabelStyle}>Y</label>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.y.toFixed(1)}
                  onChange={(e) => handlePositionChange('y', e.target.value)}
                  style={numberInputStyle}
                />
              </div>
              <div style={inputItemStyle}>
                <label style={smallLabelStyle}>Z</label>
                <input
                  type="number"
                  step="0.1"
                  value={selected.position.z.toFixed(1)}
                  onChange={(e) => handlePositionChange('z', e.target.value)}
                  style={numberInputStyle}
                />
              </div>
            </div>
          </div>

          {/* Rotation Control */}
          <div style={controlSectionStyle}>
            <div style={controlHeaderStyle}>
              <span style={controlIconStyle}>🔄</span>
              <span>Rotation</span>
            </div>
            <input
              type="range"
              min="0"
              max="360"
              value={selected.rotation || 0}
              onChange={(e) => handleRotationChange(e.target.value)}
              style={rangeInputStyle}
            />
            <div style={valueDisplayStyle}>{(selected.rotation || 0).toFixed(0)}°</div>
          </div>

          {/* Scale Control */}
          <div style={controlSectionStyle}>
            <div style={controlHeaderStyle}>
              <span style={controlIconStyle}>📏</span>
              <span>Scale</span>
            </div>
            <input
              type="range"
              min="0.5"
              max="2"
              step="0.1"
              value={selected.scale || 1}
              onChange={(e) => handleScaleChange(e.target.value)}
              style={rangeInputStyle}
            />
            <div style={valueDisplayStyle}>{((selected.scale || 1) * 100).toFixed(0)}%</div>
          </div>

          <div style={dividerStyle}></div>

          {/* Color Control */}
          <div style={controlSectionStyle}>
            <div style={controlHeaderStyle}>
              <span style={controlIconStyle}>🎨</span>
              <span>Color</span>
            </div>
            <input 
              type="color" 
              value={selected.color || '#8B7355'}
              onChange={(e) => handleColorChange(e.target.value)} 
              style={colorInputStyle}
            />
            <div style={hintStyle}>Click to change furniture color</div>
          </div>

          <div style={dividerStyle}></div>

          {/* Actions */}
          <div style={actionsSectionStyle}>
            <button 
              onClick={() => onDeleteFurniture(selected.id)} 
              style={deleteBtnStyle}
            >
              <span style={{fontSize: '18px'}}>🗑️</span>
              Delete Item
            </button>
          </div>
        </div>
      ) : (
        <div style={emptyStateStyle}>
          <div style={emptyIconStyle}>👆</div>
          <div style={emptyTextStyle}>Select an object</div>
          <div style={emptySubtextStyle}>
            Click on furniture in the scene to view and edit its properties
          </div>
        </div>
      )}
    </aside>
  );
};

const sideStyle = { 
  width: '280px', 
  background: 'linear-gradient(180deg, #1a1a1a 0%, #0f0f0f 100%)',
  borderLeft: '1px solid #333',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '-2px 0 10px rgba(0,0,0,0.3)',
  overflowY: 'auto'
};

const headerStyle = {
  padding: '20px',
  borderBottom: '1px solid #333'
};

const headingStyle = {
  margin: 0,
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

const contentStyle = {
  padding: '20px',
  flex: 1
};

const infoCardStyle = {
  background: 'linear-gradient(135deg, #1e3557 0%, #2a4a7c 100%)',
  padding: '16px',
  borderRadius: '10px',
  marginBottom: '20px',
  border: '1px solid #3a5a8c'
};

const labelStyle = {
  fontSize: '11px',
  color: '#aaa',
  textTransform: 'uppercase',
  letterSpacing: '1px',
  marginBottom: '8px'
};

const objectNameStyle = {
  fontSize: '20px',
  fontWeight: 'bold',
  color: '#fff',
  display: 'flex',
  alignItems: 'center',
  gap: '10px',
  marginBottom: '8px',
  textTransform: 'capitalize'
};

const objectIconStyle = {
  fontSize: '24px'
};

const idStyle = {
  fontSize: '11px',
  color: '#4a9eff',
  fontFamily: 'monospace'
};

const controlSectionStyle = {
  marginBottom: '20px'
};

const controlHeaderStyle = {
  fontSize: '13px',
  fontWeight: '600',
  color: '#fff',
  marginBottom: '12px',
  display: 'flex',
  alignItems: 'center',
  gap: '8px'
};

const controlIconStyle = {
  fontSize: '16px'
};

const inputGroupStyle = {
  display: 'flex',
  gap: '8px'
};

const inputItemStyle = {
  flex: 1
};

const smallLabelStyle = {
  display: 'block',
  fontSize: '10px',
  color: '#888',
  marginBottom: '4px',
  fontWeight: '600'
};

const numberInputStyle = {
  width: '100%',
  padding: '8px',
  background: '#222',
  border: '2px solid #333',
  borderRadius: '6px',
  color: '#4a9eff',
  fontSize: '13px',
  fontWeight: '600',
  outline: 'none'
};

const rangeInputStyle = {
  width: '100%',
  height: '6px',
  background: '#333',
  borderRadius: '3px',
  outline: 'none',
  cursor: 'pointer',
  accentColor: '#4a9eff'
};

const valueDisplayStyle = {
  marginTop: '8px',
  fontSize: '13px',
  color: '#4a9eff',
  fontWeight: '600',
  textAlign: 'center'
};

const colorInputStyle = {
  width: '100%',
  height: '60px',
  border: '2px solid #333',
  borderRadius: '8px',
  cursor: 'pointer',
  background: '#222',
  boxShadow: '0 2px 8px rgba(0,0,0,0.3)'
};

const hintStyle = {
  fontSize: '11px',
  color: '#777',
  marginTop: '8px',
  fontStyle: 'italic'
};

const dividerStyle = {
  height: '1px',
  background: 'linear-gradient(90deg, transparent, #333, transparent)',
  margin: '20px 0'
};

const actionsSectionStyle = {
  marginTop: '30px'
};

const deleteBtnStyle = {
  width: '100%',
  padding: '14px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #c62828 0%, #8e0000 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '600',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'all 0.2s ease',
  boxShadow: '0 4px 10px rgba(198, 40, 40, 0.3)'
};

const emptyStateStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '40px',
  textAlign: 'center'
};

const emptyIconStyle = {
  fontSize: '64px',
  marginBottom: '20px',
  opacity: 0.3
};

const emptyTextStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#fff',
  marginBottom: '10px'
};

const emptySubtextStyle = {
  fontSize: '13px',
  color: '#666',
  lineHeight: '1.6'
};

export default RightSidebar;