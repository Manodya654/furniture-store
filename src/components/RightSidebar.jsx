const RightSidebar = ({ selected }) => {
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
                {selected.name === 'chair' && '🪑'}
                {selected.name === 'table' && '🪵'}
                {selected.name === 'sofa' && '🛋️'}
              </span>
              {selected.name}
            </div>
            <div style={idStyle}>ID: {selected.id.substring(0, 8)}...</div>
          </div>

          {/* Color Control */}
          <div style={controlSectionStyle}>
            <div style={controlHeaderStyle}>
              <span style={controlIconStyle}>🎨</span>
              <span>Color</span>
            </div>
            <input 
              type="color" 
              onChange={(e) => window.changeColor(e.target.value)} 
              style={colorInputStyle}
            />
            <div style={hintStyle}>Click to change furniture color</div>
          </div>

          <div style={dividerStyle}></div>

          {/* Transform Info */}
          <div style={controlSectionStyle}>
            <div style={controlHeaderStyle}>
              <span style={controlIconStyle}>📐</span>
              <span>Transform Tools</span>
            </div>
            <div style={toolTipStyle}>
              <kbd style={kbdStyle}>G</kbd> Move • <kbd style={kbdStyle}>R</kbd> Rotate • <kbd style={kbdStyle}>S</kbd> Scale
            </div>
          </div>

          <div style={dividerStyle}></div>

          {/* Actions */}
          <div style={actionsSectionStyle}>
            <button 
              onClick={() => window.deleteSelected()} 
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
  boxShadow: '-2px 0 10px rgba(0,0,0,0.3)'
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

const toolTipStyle = {
  background: '#222',
  padding: '12px',
  borderRadius: '6px',
  fontSize: '12px',
  color: '#aaa',
  border: '1px solid #333',
  textAlign: 'center'
};

const kbdStyle = {
  background: '#444',
  padding: '3px 8px',
  borderRadius: '4px',
  fontSize: '11px',
  fontWeight: 'bold',
  border: '1px solid #555',
  color: '#4a9eff'
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