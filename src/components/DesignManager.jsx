import { useState } from 'react';

const DesignManager = ({ onSave, onLoad, onDelete, onNew, savedDesigns, currentName }) => {
  const [showModal, setShowModal] = useState(false);
  const [showSaveDialog, setShowSaveDialog] = useState(false);
  const [designName, setDesignName] = useState('');

  const handleSave = () => {
    const name = designName.trim() || currentName;
    onSave(name);
    setDesignName('');
    setShowSaveDialog(false);
    alert(`Design "${name}" saved successfully!`);
  };

  const handleLoad = (design) => {
    if (confirm(`Load design "${design.name}"? Any unsaved changes will be lost.`)) {
      onLoad(design);
      setShowModal(false);
    }
  };

  const handleDelete = (e, design) => {
    e.stopPropagation();
    if (confirm(`Delete design "${design.name}"? This cannot be undone.`)) {
      onDelete(design.id);
    }
  };

  const handleNew = () => {
    if (confirm('Create new design? Any unsaved changes will be lost.')) {
      onNew();
      setShowModal(false);
    }
  };

  return (
    <>
      <div style={{display: 'flex', gap: '8px'}}>
        <button onClick={handleNew} style={btnStyle} title="New Design">
          <span style={{fontSize: '16px'}}>📄</span>
        </button>
        <button onClick={() => setShowSaveDialog(true)} style={btnStyle} title="Save Design">
          <span style={{fontSize: '16px'}}>💾</span>
        </button>
        <button onClick={() => setShowModal(true)} style={btnStyle} title="Load Design">
          <span style={{fontSize: '16px'}}>📂</span>
        </button>
      </div>

      {/* Save Dialog */}
      {showSaveDialog && (
        <div style={overlayStyle} onClick={() => setShowSaveDialog(false)}>
          <div style={dialogStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={dialogTitleStyle}>Save Design</h3>
            <input
              type="text"
              placeholder={currentName}
              value={designName}
              onChange={(e) => setDesignName(e.target.value)}
              style={inputStyle}
              autoFocus
            />
            <div style={dialogActionsStyle}>
              <button onClick={() => setShowSaveDialog(false)} style={cancelBtnStyle}>
                Cancel
              </button>
              <button onClick={handleSave} style={saveBtnStyle}>
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showModal && (
        <div style={overlayStyle} onClick={() => setShowModal(false)}>
          <div style={modalStyle} onClick={(e) => e.stopPropagation()}>
            <h3 style={modalTitleStyle}>Saved Designs</h3>
            
            {savedDesigns.length === 0 ? (
              <div style={emptyMessageStyle}>
                <div style={{fontSize: '48px', marginBottom: '16px'}}>📭</div>
                <div>No saved designs yet</div>
                <div style={{fontSize: '12px', color: '#666', marginTop: '8px'}}>
                  Create and save your first design!
                </div>
              </div>
            ) : (
              <div style={designListStyle}>
                {savedDesigns.map(design => (
                  <div 
                    key={design.id} 
                    style={designItemStyle}
                    onClick={() => handleLoad(design)}
                  >
                    <div style={{flex: 1}}>
                      <div style={designNameStyle}>{design.name}</div>
                      <div style={designMetaStyle}>
                        {new Date(design.timestamp).toLocaleString()}
                      </div>
                      <div style={designMetaStyle}>
                        {design.furniture.length} items • {design.roomDimensions.width}×{design.roomDimensions.depth}m
                      </div>
                    </div>
                    <button
                      onClick={(e) => handleDelete(e, design)}
                      style={deleteIconBtnStyle}
                      title="Delete"
                    >
                      🗑️
                    </button>
                  </div>
                ))}
              </div>
            )}
            
            <div style={modalActionsStyle}>
              <button onClick={() => setShowModal(false)} style={closeModalBtnStyle}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

const btnStyle = {
  padding: '8px 12px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: '6px',
  cursor: 'pointer',
  color: 'white',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center'
};

const overlayStyle = {
  position: 'fixed',
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  background: 'rgba(0,0,0,0.8)',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: 1000
};

const dialogStyle = {
  background: '#1a1a1a',
  padding: '30px',
  borderRadius: '12px',
  border: '1px solid #333',
  minWidth: '400px',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
};

const dialogTitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '20px',
  fontWeight: '600',
  color: '#fff'
};

const inputStyle = {
  width: '100%',
  padding: '12px',
  background: '#222',
  border: '2px solid #333',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '14px',
  outline: 'none',
  marginBottom: '20px'
};

const dialogActionsStyle = {
  display: 'flex',
  gap: '10px',
  justifyContent: 'flex-end'
};

const cancelBtnStyle = {
  padding: '10px 20px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px'
};

const saveBtnStyle = {
  padding: '10px 20px',
  background: 'linear-gradient(135deg, #2a4a7c 0%, #1e3557 100%)',
  border: 'none',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px',
  fontWeight: '600'
};

const modalStyle = {
  background: '#1a1a1a',
  padding: '30px',
  borderRadius: '12px',
  border: '1px solid #333',
  minWidth: '500px',
  maxWidth: '600px',
  maxHeight: '80vh',
  overflow: 'hidden',
  display: 'flex',
  flexDirection: 'column',
  boxShadow: '0 10px 40px rgba(0,0,0,0.5)'
};

const modalTitleStyle = {
  margin: '0 0 20px 0',
  fontSize: '20px',
  fontWeight: '600',
  color: '#fff'
};

const designListStyle = {
  flex: 1,
  overflowY: 'auto',
  marginBottom: '20px'
};

const designItemStyle = {
  background: '#222',
  padding: '16px',
  borderRadius: '8px',
  marginBottom: '10px',
  border: '1px solid #333',
  cursor: 'pointer',
  transition: 'all 0.2s',
  display: 'flex',
  alignItems: 'center',
  gap: '12px'
};

const designNameStyle = {
  fontSize: '16px',
  fontWeight: '600',
  color: '#fff',
  marginBottom: '6px'
};

const designMetaStyle = {
  fontSize: '12px',
  color: '#888',
  marginBottom: '2px'
};

const deleteIconBtnStyle = {
  background: 'transparent',
  border: 'none',
  fontSize: '20px',
  cursor: 'pointer',
  padding: '8px',
  borderRadius: '6px',
  transition: 'all 0.2s'
};

const emptyMessageStyle = {
  textAlign: 'center',
  padding: '60px 20px',
  color: '#666'
};

const modalActionsStyle = {
  display: 'flex',
  justifyContent: 'flex-end',
  borderTop: '1px solid #333',
  paddingTop: '20px'
};

const closeModalBtnStyle = {
  padding: '10px 24px',
  background: '#2a2a2a',
  border: '1px solid #444',
  borderRadius: '6px',
  color: 'white',
  cursor: 'pointer',
  fontSize: '14px'
};

export default DesignManager;