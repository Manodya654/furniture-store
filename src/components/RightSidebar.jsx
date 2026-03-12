const RightSidebar = ({ selected }) => {
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
              <div style={itemIconStyle}>
                {selected.name === 'chair' && '🪑'}
                {selected.name === 'table' && '🪵'}
                {selected.name === 'sofa' && '🛋️'}
                {selected.name === 'bed' && '🛏️'}
                {selected.name === 'desk' && '🗄️'}
                {selected.name === 'lamp' && '💡'}
              </div>
              <div>
                <div style={itemTitleStyle}>{selected.name}</div>
                <div style={itemIdStyle}>ID: {selected.id.substring(0, 8)}</div>
              </div>
            </div>
          </div>

          {/* Color Control */}
          <div style={controlCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardIconStyle}>🎨</span>
              <span>Color</span>
            </div>
            <input 
              type="color" 
              onChange={(e) => window.changeColor(e.target.value)} 
              style={colorPickerStyle}
            />
            <div style={hintStyle}>Click to select color</div>
          </div>

          {/* Transform Guide */}
          <div style={controlCardStyle}>
            <div style={cardHeaderStyle}>
              <span style={cardIconStyle}>🎯</span>
              <span>Transform</span>
            </div>
            <div style={instructionsStyle}>
              <div style={instructionItemStyle}>
                <kbd style={kbdStyle}>G</kbd>
                <span>Move</span>
              </div>
              <div style={instructionItemStyle}>
                <kbd style={kbdStyle}>R</kbd>
                <span>Rotate</span>
              </div>
              <div style={instructionItemStyle}>
                <kbd style={kbdStyle}>S</kbd>
                <span>Scale</span>
              </div>
            </div>
          </div>

          {/* Delete Button */}
          <button 
            onClick={() => window.deleteSelected()} 
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
            Click on furniture in the scene to view and edit its properties
          </div>
        </div>
      )}
    </aside>
  );
};

const sideStyle = { 
  width: '280px', 
  background: '#000',
  borderLeft: '1px solid #1a1a1a',
  display: 'flex',
  flexDirection: 'column',
  overflowY: 'auto'
};

const headerStyle = {
  padding: '20px',
  borderBottom: '1px solid #1a1a1a',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const headerIconBoxStyle = {
  width: '40px',
  height: '40px',
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '18px',
  boxShadow: '0 2px 10px rgba(16, 185, 129, 0.4)'
};

const headingStyle = {
  margin: 0,
  fontSize: '16px',
  fontWeight: '700',
  color: '#fff'
};

const contentStyle = {
  padding: '20px',
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  gap: '16px'
};

const infoCardStyle = {
  background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
  padding: '18px',
  borderRadius: '12px',
  boxShadow: '0 2px 12px rgba(16, 185, 129, 0.3)'
};

const itemHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '14px'
};

const itemIconStyle = {
  width: '50px',
  height: '50px',
  background: 'rgba(255, 255, 255, 0.2)',
  borderRadius: '10px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  fontSize: '28px'
};

const itemTitleStyle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#fff',
  textTransform: 'capitalize',
  marginBottom: '4px'
};

const itemIdStyle = {
  fontSize: '11px',
  color: 'rgba(255, 255, 255, 0.8)',
  fontFamily: 'monospace'
};

const controlCardStyle = {
  background: '#0a0a0a',
  padding: '16px',
  borderRadius: '10px',
  border: '1px solid #1a1a1a'
};

const cardHeaderStyle = {
  fontSize: '12px',
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

const colorPickerStyle = {
  width: '100%',
  height: '55px',
  border: '1px solid #1a1a1a',
  borderRadius: '8px',
  cursor: 'pointer',
  background: '#000'
};

const hintStyle = {
  fontSize: '11px',
  color: '#666',
  marginTop: '8px',
  fontStyle: 'italic'
};

const instructionsStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px'
};

const instructionItemStyle = {
  display: 'flex',
  alignItems: 'center',
  gap: '12px',
  fontSize: '13px',
  color: '#aaa',
  padding: '10px',
  background: '#000',
  borderRadius: '6px',
  border: '1px solid #1a1a1a'
};

const kbdStyle = {
  background: '#1a1a1a',
  padding: '5px 12px',
  borderRadius: '6px',
  fontSize: '12px',
  fontWeight: 'bold',
  border: '1px solid #2a2a2a',
  color: '#10b981',
  fontFamily: 'monospace',
  minWidth: '32px',
  textAlign: 'center'
};

const deleteBtnStyle = {
  width: '100%',
  padding: '14px',
  cursor: 'pointer',
  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
  color: 'white',
  border: 'none',
  borderRadius: '10px',
  fontSize: '14px',
  fontWeight: '700',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: '10px',
  transition: 'transform 0.1s ease',
  boxShadow: '0 2px 10px rgba(239, 68, 68, 0.3)',
  marginTop: 'auto'
};

const emptyStateStyle = {
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '50px 30px',
  textAlign: 'center'
};

const emptyIconStyle = {
  fontSize: '70px',
  marginBottom: '20px',
  opacity: 0.3
};

const emptyTitleStyle = {
  fontSize: '18px',
  fontWeight: '700',
  color: '#fff',
  marginBottom: '10px'
};

const emptyTextStyle = {
  fontSize: '13px',
  color: '#666',
  lineHeight: '1.6'
};

export default RightSidebar;