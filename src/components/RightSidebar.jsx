import { PRICE_MAP } from './LeftSidebar';

const FurnitureIcons = {
  chair: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <path d="M6 20h12M6 20V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10"/>
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
    </svg>
  ),
  table: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <rect x="2" y="8" width="20" height="3" rx="1"/>
      <line x1="6" y1="11" x2="6" y2="20"/>
      <line x1="18" y1="11" x2="18" y2="20"/>
    </svg>
  ),
  sofa: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <path d="M2 14v-2a2 2 0 0 1 4 0v2"/>
      <path d="M18 14v-2a2 2 0 0 1 4 0v2"/>
      <rect x="2" y="14" width="20" height="5" rx="1"/>
      <rect x="4" y="10" width="16" height="4" rx="1"/>
    </svg>
  ),
  bed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
      <path d="M2 20h20M2 12V6"/>
      <rect x="10" y="8" width="5" height="4" rx="1"/>
      <rect x="16" y="8" width="5" height="4" rx="1"/>
    </svg>
  ),
  desk: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <rect x="2" y="9" width="20" height="3" rx="1"/>
      <line x1="5" y1="12" x2="5" y2="20"/>
      <line x1="19" y1="12" x2="19" y2="20"/>
      <rect x="12" y="9" width="5" height="3"/>
    </svg>
  ),
  lamp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <path d="M9 18h6M12 18v4"/>
      <path d="M8 6l8 8H8l8-8"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
    </svg>
  ),
  cupboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <rect x="3" y="2" width="18" height="20" rx="1"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <circle cx="9.5" cy="12" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  dining_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
      width="18" height="18">
      <rect x="4" y="9" width="16" height="2" rx="1"/>
      <line x1="7" y1="11" x2="7" y2="18"/>
      <line x1="17" y1="11" x2="17" y2="18"/>
      <circle cx="12" cy="5" r="2"/>
    </svg>
  ),
};

const FurnitureIcon = ({ type }) => {
  const Comp = FurnitureIcons[type];
  return Comp
    ? <Comp />
    : (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
        strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        width="18" height="18">
        <rect x="3" y="3" width="18" height="18" rx="2"/>
      </svg>
    );
};

const RightSidebar = ({ selected, onUpdateFurniture, onDeleteFurniture, furniture }) => {

  const totalPrice = (furniture || []).reduce(
    (s, i) => s + (i.price || PRICE_MAP[i.type] || 0), 0
  );

  const inp = {
    width: '100%',
    background: '#0d0d1a',
    border: '1px solid #2a2a2a',
    color: 'white',
    padding: '8px 10px',
    borderRadius: '7px',
    fontSize: '13px',
    boxSizing: 'border-box',
    outline: 'none',
  };

  const Lbl = ({ text }) => (
    <span style={{
      fontSize: '11px', color: '#888', textTransform: 'uppercase',
      letterSpacing: '1px', marginBottom: '6px', display: 'block', fontWeight: '600'
    }}>
      {text}
    </span>
  );

  return (
    <aside style={{
      width: '268px',
      background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
      borderLeft: '1px solid #1a2a1a',
      padding: '16px 14px',
      flexShrink: 0,
      overflowY: 'auto',
      display: 'flex',
      flexDirection: 'column',
      gap: '14px',
    }}>

      {/* ── PRICE SUMMARY ─────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, #0d1f14 0%, #0a1510 100%)',
        border: '1px solid #1a3a2a',
        borderRadius: '12px',
        padding: '14px',
      }}>
        {/* Title */}
        <div style={{
          fontSize: '11px', color: '#1adb8a', fontWeight: '700',
          textTransform: 'uppercase', letterSpacing: '1px',
          marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '6px'
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            width="13" height="13">
            <line x1="12" y1="1" x2="12" y2="23"/>
            <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
          </svg>
          Price Summary
        </div>

        {/* Item list */}
        <div style={{
          maxHeight: '150px',
          overflowY: 'auto',
          marginBottom: '10px',
          display: 'flex',
          flexDirection: 'column',
          gap: '4px',
        }}>
          {!(furniture || []).length ? (
            <span style={{ fontSize: '12px', color: '#444', fontStyle: 'italic' }}>
              No items yet
            </span>
          ) : (
            (furniture || []).map(item => (
              <div key={item.id} style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                fontSize: '12px',
                color: '#aaa',
                padding: '4px 0',
                borderBottom: '1px solid #1a2a1a',
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  color: '#1adb8a',
                  opacity: 0.85,
                }}>
                  <FurnitureIcon type={item.type} />
                  <span style={{
                    textTransform: 'capitalize',
                    color: '#aaa',
                  }}>
                    {item.type.replace('_', ' ')}
                  </span>
                </div>
                <span style={{ color: '#e0e0e0', fontWeight: '600' }}>
                  LKR {(item.price || PRICE_MAP[item.type] || 0).toLocaleString()}
                </span>
              </div>
            ))
          )}
        </div>

        {/* Total row */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          paddingTop: '8px',
          borderTop: '1px solid #1a4a2a',
        }}>
          <span style={{ fontSize: '12px', color: '#888', fontWeight: '700' }}>
            TOTAL
          </span>
          <span style={{
            fontSize: '20px',
            fontWeight: '800',
            background: 'linear-gradient(135deg, #1adb8a 0%, #15b870 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}>
            LKR {totalPrice.toLocaleString()}
          </span>
        </div>
      </div>

      <div style={{ height: '1px', background: '#1a2a1a' }} />

      {/* ── PROPERTIES TITLE ─────────────────────────────────────────────── */}
      <div style={{
        fontSize: '12px', fontWeight: '700', color: '#fff',
        textTransform: 'uppercase', letterSpacing: '1px',
      }}>
        Properties
      </div>

      {/* ── EMPTY STATE ──────────────────────────────────────────────────── */}
      {!selected ? (
        <div style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          color: '#444',
          textAlign: 'center',
          padding: '24px 0',
        }}>
          <svg viewBox="0 0 24 24" fill="none" stroke="#2a2a2a"
            strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
            width="40" height="40">
            <rect x="3" y="3" width="18" height="18" rx="2"/>
            <path d="M9 12h6M12 9v6"/>
          </svg>
          <span style={{ fontSize: '12px', lineHeight: '1.6' }}>
            Select an item<br />to edit properties
          </span>
        </div>
      ) : (
        <>
          {/* ── SELECTED ITEM CARD ───────────────────────────────────────── */}
          <div style={{
            background: 'linear-gradient(135deg, #1a8a5c 0%, #15704a 100%)',
            borderRadius: '10px',
            padding: '12px 14px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
          }}>
            <div style={{
              width: '38px', height: '38px', borderRadius: '8px',
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', color: '#fff', flexShrink: 0,
            }}>
              <FurnitureIcon type={selected.type} />
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{
                fontWeight: '700', fontSize: '14px', textTransform: 'capitalize'
              }}>
                {selected.type.replace('_', ' ')}
              </div>
              <div style={{
                fontSize: '10px', color: 'rgba(255,255,255,0.55)',
                whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
              }}>
                {selected.id}
              </div>
            </div>
            <div style={{
              fontSize: '15px', fontWeight: '800', color: '#1adb8a',
              background: 'rgba(26,219,138,0.15)',
              padding: '4px 8px', borderRadius: '6px', flexShrink: 0,
            }}>
              LKR {(selected.price || PRICE_MAP[selected.type] || 0).toLocaleString()}
            </div>
          </div>

          {/* ── COLOR  */}
          <div>
            <Lbl text="Color" />
            <input
              type="color"
              value={selected.color || '#8B7355'}
              onChange={e => onUpdateFurniture(selected.id, { color: e.target.value })}
              style={{ ...inp, padding: '4px', height: '42px', cursor: 'pointer' }}
            />
          </div>

          {/* ── POSITION  */}
          <div>
            <Lbl text="Position" />
            <div style={{ display: 'flex', gap: '6px' }}>
              {['x', 'z'].map(ax => (
                <div key={ax} style={{ flex: 1 }}>
                  <span style={{
                    fontSize: '10px', color: '#555',
                    display: 'block', marginBottom: '3px'
                  }}>
                    {ax.toUpperCase()}-axis
                  </span>
                  <input
                    type="number"
                    value={(selected.position?.[ax] || 0).toFixed(2)}
                    onChange={e => {
                      const v = parseFloat(e.target.value) || 0;
                      onUpdateFurniture(selected.id, {
                        position: { ...selected.position, [ax]: v }
                      });
                    }}
                    style={inp}
                    step={0.1}
                  />
                </div>
              ))}
            </div>
          </div>

          {/* ── ROTATION ─────────────────────────────────────────────────── */}
          <div>
            <Lbl text="Rotation" />
            <input
              type="range"
              min={0} max={360}
              value={selected.rotation || 0}
              onChange={e => onUpdateFurniture(
                selected.id, { rotation: parseFloat(e.target.value) }
              )}
              style={{ width: '100%', accentColor: '#1adb8a', marginBottom: '4px' }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ fontSize: '10px', color: '#555' }}>0°</span>
              <span style={{ fontSize: '12px', color: '#1adb8a', fontWeight: '700' }}>
                {Math.round(selected.rotation || 0)}°
              </span>
              <span style={{ fontSize: '10px', color: '#555' }}>360°</span>
            </div>
          </div>

          {/* ── TRANSFORM MODE ───────────────────────────────────────────── */}
          <div>
            <Lbl text="Transform Mode (3D)" />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '5px' }}>
              {[
                {
                  m: 'translate', label: 'Move',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="13" height="13">
                      <path d="M5 9l-3 3 3 3M9 5l3-3 3 3M15 19l-3 3-3-3M19 9l3 3-3 3"/>
                      <line x1="3" y1="12" x2="21" y2="12"/>
                      <line x1="12" y1="3" x2="12" y2="21"/>
                    </svg>
                  )
                },
                {
                  m: 'rotate', label: 'Rotate',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="13" height="13">
                      <path d="M21.5 2v6h-6"/>
                      <path d="M2.5 22v-6h6"/>
                      <path d="M2 11.5a10 10 0 0 1 18.8-4.3"/>
                      <path d="M22 12.5a10 10 0 0 1-18.8 4.2"/>
                    </svg>
                  )
                },
                {
                  m: 'scale', label: 'Scale',
                  icon: (
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                      strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                      width="13" height="13">
                      <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7"/>
                    </svg>
                  )
                },
              ].map(({ m, label, icon }) => (
                <button
                  key={m}
                  onClick={() => window.setMode?.(m)}
                  style={{
                    padding: '8px 4px',
                    background: '#1a1a2e',
                    color: '#aaa',
                    border: '1px solid #2a2a2a',
                    borderRadius: '7px',
                    cursor: 'pointer',
                    fontSize: '11px',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '4px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(26,219,138,0.15)';
                    e.currentTarget.style.borderColor = '#1adb8a';
                    e.currentTarget.style.color = '#1adb8a';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#1a1a2e';
                    e.currentTarget.style.borderColor = '#2a2a2a';
                    e.currentTarget.style.color = '#aaa';
                  }}
                >
                  {icon}
                  {label}
                </button>
              ))}
            </div>
          </div>

          <div style={{ flex: 1 }} />
        </>
      )}

      {/* ── DELETE BUTTON ─────────────────────────────────────────────────── */}
      {selected && (
        <button
          onClick={() => onDeleteFurniture(selected.id)}
          style={{
            background: 'linear-gradient(135deg, #e74c3c 0%, #c0392b 100%)',
            color: 'white',
            border: 'none',
            borderRadius: '9px',
            padding: '13px',
            cursor: 'pointer',
            fontSize: '13px',
            fontWeight: '700',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            transition: 'all 0.2s',
            marginTop: '4px',
          }}
          onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.02)'}
          onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
            strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
            width="15" height="15">
            <polyline points="3 6 5 6 21 6"/>
            <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
          </svg>
          Delete Item
        </button>
      )}
    </aside>
  );
};

export default RightSidebar;