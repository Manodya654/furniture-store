import { useState } from 'react';

const DesignManager = ({ onSave, onLoad, onDelete, onNew, savedDesigns, currentName, showToast }) => {
  const [showSaveModal, setShowSaveModal] = useState(false);
  const [showLoadModal, setShowLoadModal] = useState(false);
  const [saveName, setSaveName] = useState('');

  const handleSave = () => {
    if (!saveName.trim()) {
      if (showToast) showToast('Please enter a design name', 'warning');
      return;
    }
    onSave(saveName.trim());
    setSaveName('');
    setShowSaveModal(false);
  };

  const buttonStyle = {
    background: '#1a1a2e',
    border: '1px solid #2a2a2a',
    color: '#aaa',
    cursor: 'pointer',
    width: '40px',
    height: '40px',
    borderRadius: '10px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'all 0.25s ease',
    padding: 0,
  };

  return (
    <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
      {/* New Design */}
      <button
        onClick={onNew}
        style={buttonStyle}
        title="New Design"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(26, 219, 138, 0.15)';
          e.currentTarget.style.borderColor = '#1adb8a';
          e.currentTarget.style.color = '#1adb8a';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#1a1a2e';
          e.currentTarget.style.borderColor = '#2a2a2a';
          e.currentTarget.style.color = '#aaa';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
          <polyline points="14 2 14 8 20 8" />
          <line x1="12" y1="18" x2="12" y2="12" />
          <line x1="9" y1="15" x2="15" y2="15" />
        </svg>
      </button>

      {/* Save Design */}
      <button
        onClick={() => { setSaveName(currentName || ''); setShowSaveModal(true); }}
        style={buttonStyle}
        title="Save Design"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(74, 158, 255, 0.15)';
          e.currentTarget.style.borderColor = '#4a9eff';
          e.currentTarget.style.color = '#4a9eff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#1a1a2e';
          e.currentTarget.style.borderColor = '#2a2a2a';
          e.currentTarget.style.color = '#aaa';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
          <polyline points="17 21 17 13 7 13 7 21" />
          <polyline points="7 3 7 8 15 8" />
        </svg>
      </button>

      {/* Load Design */}
      <button
        onClick={() => setShowLoadModal(true)}
        style={buttonStyle}
        title="Load Design"
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(240, 160, 48, 0.15)';
          e.currentTarget.style.borderColor = '#f0a030';
          e.currentTarget.style.color = '#f0a030';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = '#1a1a2e';
          e.currentTarget.style.borderColor = '#2a2a2a';
          e.currentTarget.style.color = '#aaa';
        }}
      >
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
          <line x1="12" y1="11" x2="12" y2="17" />
          <polyline points="9 14 12 11 15 14" />
        </svg>
      </button>

      {/* Save Modal */}
      {showSaveModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}
          onClick={() => setShowSaveModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #151520 100%)',
              borderRadius: '16px',
              padding: '28px',
              width: '400px',
              border: '1px solid #2a2a2a',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'slideInRight 0.3s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: 'rgba(26, 219, 138, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1adb8a" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z" />
                  <polyline points="17 21 17 13 7 13 7 21" />
                  <polyline points="7 3 7 8 15 8" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>Save Design</h3>
            </div>

            <input
              type="text"
              value={saveName}
              onChange={e => setSaveName(e.target.value)}
              placeholder="Enter design name..."
              onKeyDown={e => e.key === 'Enter' && handleSave()}
              autoFocus
              style={{
                width: '100%',
                background: '#0a0a15',
                border: '1px solid #333',
                color: 'white',
                padding: '12px 14px',
                borderRadius: '10px',
                fontSize: '14px',
                marginBottom: '20px',
                boxSizing: 'border-box',
                outline: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1adb8a'}
              onBlur={(e) => e.target.style.borderColor = '#333'}
            />

            <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setShowSaveModal(false)}
                style={{
                  padding: '10px 20px',
                  background: '#2a2a2a',
                  color: '#aaa',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '600',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = '#3a3a3a'}
                onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                style={{
                  padding: '10px 24px',
                  background: 'linear-gradient(135deg, #1adb8a 0%, #15b870 100%)',
                  color: '#000',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: '700',
                  transition: 'all 0.2s'
                }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Load Modal */}
      {showLoadModal && (
        <div style={{
          position: 'fixed',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 9999,
          backdropFilter: 'blur(8px)'
        }}
          onClick={() => setShowLoadModal(false)}
        >
          <div
            style={{
              background: 'linear-gradient(135deg, #1a1a2e 0%, #151520 100%)',
              borderRadius: '16px',
              padding: '28px',
              width: '450px',
              maxHeight: '500px',
              border: '1px solid #2a2a2a',
              boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
              animation: 'slideInRight 0.3s ease'
            }}
            onClick={e => e.stopPropagation()}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '20px' }}>
              <div style={{
                width: '40px', height: '40px',
                borderRadius: '10px',
                background: 'rgba(240, 160, 48, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#f0a030" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                </svg>
              </div>
              <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '700', color: '#fff' }}>Load Design</h3>
            </div>

            <div style={{ maxHeight: '350px', overflowY: 'auto', paddingRight: '4px' }}>
              {savedDesigns.length === 0 ? (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#555'
                }}>
                  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ marginBottom: '12px' }}>
                    <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                  </svg>
                  <p style={{ margin: 0, fontSize: '14px' }}>No saved designs yet</p>
                  <p style={{ margin: '4px 0 0', fontSize: '12px', color: '#444' }}>Save your current design to see it here</p>
                </div>
              ) : (
                savedDesigns.map(design => (
                  <div
                    key={design.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      padding: '12px 14px',
                      background: '#0a0a15',
                      borderRadius: '10px',
                      marginBottom: '8px',
                      border: '1px solid #222',
                      transition: 'all 0.2s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#333';
                      e.currentTarget.style.background = '#12121f';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = '#222';
                      e.currentTarget.style.background = '#0a0a15';
                    }}
                  >
                    <div>
                      <div style={{ fontWeight: '600', fontSize: '14px', color: '#e0e0e0' }}>
                        {design.name}
                      </div>
                      <div style={{ fontSize: '11px', color: '#555', marginTop: '4px' }}>
                        {new Date(design.timestamp).toLocaleDateString()} • {design.furniture?.length || 0} items
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '6px' }}>
                      <button
                        onClick={() => { onLoad(design); setShowLoadModal(false); }}
                        style={{
                          padding: '6px 14px',
                          background: 'linear-gradient(135deg, #1adb8a 0%, #15b870 100%)',
                          color: '#000',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          fontWeight: '700'
                        }}
                      >
                        Load
                      </button>
                      <button
                        onClick={() => onDelete(design.id)}
                        style={{
                          padding: '6px 10px',
                          background: 'rgba(255, 71, 87, 0.15)',
                          color: '#ff4757',
                          border: '1px solid rgba(255, 71, 87, 0.3)',
                          borderRadius: '6px',
                          cursor: 'pointer',
                          fontSize: '12px',
                          display: 'flex',
                          alignItems: 'center'
                        }}
                      >
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                          <polyline points="3 6 5 6 21 6" />
                          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                        </svg>
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            <button
              onClick={() => setShowLoadModal(false)}
              style={{
                width: '100%',
                padding: '10px',
                background: '#2a2a2a',
                color: '#aaa',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '600',
                marginTop: '14px',
                transition: 'all 0.2s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#3a3a3a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#2a2a2a'}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DesignManager;