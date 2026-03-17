const RightSidebar = ({ selected, onUpdateFurniture, onDeleteFurniture }) => {
  if (!selected) {
    return (
      <aside style={{
        width: '260px',
        background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
        borderLeft: '1px solid #222',
        padding: '20px 16px',
        flexShrink: 0,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <p style={{ color: '#555', fontSize: '13px', textAlign: 'center' }}>
          Click on a furniture item to see its properties
        </p>
      </aside>
    );
  }

  const icons = {
    chair: '🪑', table: '🪵', sofa: '🛋️', bed: '🛏️', desk: '🗄️', lamp: '💡'
  };

  const labelStyle = {
    fontSize: '11px',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: '1px',
    marginBottom: '6px',
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
      width: '260px',
      background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
      borderLeft: '1px solid #222',
      padding: '20px 16px',
      flexShrink: 0,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '16px'
    }}>
      <h3 style={{ margin: 0, fontSize: '14px', fontWeight: '700', color: '#fff' }}>Properties</h3>

      {/* Item Info */}
      <div style={{
        background: 'linear-gradient(135deg, #1a8a5c 0%, #15704a 100%)',
        borderRadius: '10px',
        padding: '14px',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <span style={{ fontSize: '28px' }}>{icons[selected.type] || '📦'}</span>
        <div>
          <div style={{ fontWeight: '700', fontSize: '16px', textTransform: 'capitalize' }}>
            {selected.type || selected.name}
          </div>
          <div style={{ fontSize: '11px', color: 'rgba(255,255,255,0.6)' }}>
            ID: {selected.id?.substring(0, 8)}
          </div>
        </div>
      </div>

      {/* Color */}
      <div>
        <label style={labelStyle}>🎨 COLOR</label>
        <input
          type="color"
          value={selected.color || '#8B7355'}
          onChange={(e) => onUpdateFurniture(selected.id, { color: e.target.value })}
          style={{ ...inputStyle, padding: '4px', height: '45px', cursor: 'pointer' }}
        />
        <span style={{ fontSize: '10px', color: '#555', marginTop: '4px', display: 'block' }}>
          Click to select color
        </span>
      </div>

      {/* Position */}
      <div>
        <label style={labelStyle}>📍 POSITION</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['x', 'z'].map(axis => (
            <div key={axis} style={{ flex: 1 }}>
              <label style={{ fontSize: '10px', color: '#666' }}>{axis.toUpperCase()}</label>
              <input
                type="number"
                value={(selected.position?.[axis] || 0).toFixed(2)}
                onChange={(e) => {
                  const val = parseFloat(e.target.value) || 0;
                  onUpdateFurniture(selected.id, {
                    position: {
                      ...selected.position,
                      [axis]: val
                    }
                  });
                }}
                style={inputStyle}
                step={0.1}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Rotation */}
      <div>
        <label style={labelStyle}>🔄 ROTATION</label>
        <input
          type="range"
          min={0}
          max={360}
          value={selected.rotation || 0}
          onChange={(e) => onUpdateFurniture(selected.id, { rotation: parseFloat(e.target.value) })}
          style={{ width: '100%', accentColor: '#4a9eff' }}
        />
        <span style={{ fontSize: '11px', color: '#666' }}>{Math.round(selected.rotation || 0)}°</span>
      </div>

      {/* Transform Mode Buttons (for 3D) */}
      <div>
        <label style={labelStyle}>🛠️ TRANSFORM MODE</label>
        <div style={{ display: 'flex', gap: '6px' }}>
          {['translate', 'rotate', 'scale'].map(mode => (
            <button
              key={mode}
              onClick={() => window.setMode && window.setMode(mode)}
              style={{
                flex: 1,
                padding: '8px',
                background: '#222',
                color: '#fff',
                border: '1px solid #333',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '11px',
                textTransform: 'capitalize',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.target.style.background = '#4a9eff'}
              onMouseLeave={(e) => e.target.style.background = '#222'}
            >
              {mode === 'translate' ? '↕️' : mode === 'rotate' ? '🔄' : '📏'} {mode}
            </button>
          ))}
        </div>
      </div>

      {/* Spacer */}
      <div style={{ flex: 1 }} />

      {/* Delete */}
      <button
        onClick={() => onDeleteFurniture(selected.id)}
        style={{
          background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
          color: 'white',
          border: 'none',
          borderRadius: '8px',
          padding: '14px',
          cursor: 'pointer',
          fontSize: '14px',
          fontWeight: '700',
          transition: 'all 0.2s'
        }}
        onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
        onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
      >
       Delete Item
      </button>
    </aside>
  );
};

export default RightSidebar;