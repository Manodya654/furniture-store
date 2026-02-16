const LeftSidebar = ({ roomDimensions, onRoomChange }) => {
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
            type="range" 
            min="10" 
            max="50" 
            value={roomDimensions.width}
            onChange={(e) => onRoomChange({ ...roomDimensions, width: parseFloat(e.target.value) })}
            style={rangeStyle}
          />
          <span style={valueStyle}>{roomDimensions.width}m</span>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Height (m)</label>
          <input 
            type="range" 
            min="8" 
            max="25" 
            value={roomDimensions.height}
            onChange={(e) => onRoomChange({ ...roomDimensions, height: parseFloat(e.target.value) })}
            style={rangeStyle}
          />
          <span style={valueStyle}>{roomDimensions.height}m</span>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Depth (m)</label>
          <input 
            type="range" 
            min="10" 
            max="50" 
            value={roomDimensions.depth}
            onChange={(e) => onRoomChange({ ...roomDimensions, depth: parseFloat(e.target.value) })}
            style={rangeStyle}
          />
          <span style={valueStyle}>{roomDimensions.depth}m</span>
        </div>

        <div style={controlGroupStyle}>
          <label style={labelStyle}>Wall Color</label>
          <input 
            type="color" 
            value={roomDimensions.color}
            onChange={(e) => onRoomChange({ ...roomDimensions, color: e.target.value })}
            style={colorInputStyle}
          />
        </div>
      </div>

      <div style={dividerStyle}></div>

      {/* Assets Section */}
      <div style={sectionStyle}>
        <h3 style={headingStyle}>
          <span style={iconStyle}>🪑</span> Add Assets
        </h3>
        <button onClick={() => window.addAsset('chair')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🪑</span> Chair
        </button>
        <button onClick={() => window.addAsset('table')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🪵</span> Table
        </button>
        <button onClick={() => window.addAsset('sofa')} style={assetBtnStyle}>
          <span style={btnIconStyle}>🛋️</span> Sofa
        </button>
      </div>

      <div style={dividerStyle}></div>

      {/* Transform Section */}
      <div style={sectionStyle}>
        <h3 style={headingStyle}>
          <span style={iconStyle}>🎯</span> Transform
        </h3>
        <button onClick={() => window.setMode('translate')} style={transformBtnStyle}>
          <span style={btnIconStyle}>↔️</span> Move <kbd style={kbdStyle}>G</kbd>
        </button>
        <button onClick={() => window.setMode('rotate')} style={transformBtnStyle}>
          <span style={btnIconStyle}>🔄</span> Rotate <kbd style={kbdStyle}>R</kbd>
        </button>
        <button onClick={() => window.setMode('scale')} style={transformBtnStyle}>
          <span style={btnIconStyle}>📏</span> Scale <kbd style={kbdStyle}>S</kbd>
        </button>
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

const rangeStyle = {
  width: '100%',
  height: '6px',
  background: '#333',
  borderRadius: '3px',
  outline: 'none',
  cursor: 'pointer',
  accentColor: '#4a9eff'
};

const valueStyle = {
  display: 'inline-block',
  marginTop: '5px',
  fontSize: '13px',
  color: '#4a9eff',
  fontWeight: '600'
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

const transformBtnStyle = {
  width: '100%',
  padding: '12px 16px',
  marginBottom: '10px',
  cursor: 'pointer',
  background: '#2a2a2a',
  color: 'white',
  border: '1px solid #444',
  borderRadius: '8px',
  fontSize: '14px',
  fontWeight: '500',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'all 0.2s ease'
};

const btnIconStyle = {
  fontSize: '16px'
};

const kbdStyle = {
  background: '#444',
  padding: '2px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold',
  border: '1px solid #555'
};

export default LeftSidebar;