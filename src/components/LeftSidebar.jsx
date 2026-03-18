import { useState } from 'react';

export const FURNITURE_CATALOGUE = [
  { type: 'chair',      label: 'Chair',      color: '#8B7355', price: 20000 },
  { type: 'table',      label: 'Table',      color: '#A0856C', price: 50000 },
  { type: 'sofa',       label: 'Sofa',       color: '#6B8E7B', price: 150000 },
  { type: 'bed',        label: 'Bed',        color: '#7B6E8E', price: 200000 },
  { type: 'desk',       label: 'Desk',       color: '#8B7355', price: 12000 },
  { type: 'vase',       label: 'Vase',       color: '#C4A86B', price:  9000 },
  { type: 'cupboard',   label: 'Cupboard',   color: '#7A6248', price: 10000 },
  { type: 'dining_set', label: 'Dining Set', color: '#A0856C', price: 25000 },
];

export const PRICE_MAP = Object.fromEntries(
  FURNITURE_CATALOGUE.map(f => [f.type, f.price])
);

// SVG icons as components to avoid JSX-in-object issues
const Icons = {
  chair: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <path d="M6 20h12M6 20V10a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v10"/>
      <path d="M9 8V5a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v3"/>
    </svg>
  ),
  table: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <rect x="2" y="8" width="20" height="3" rx="1"/>
      <line x1="6" y1="11" x2="6" y2="20"/>
      <line x1="18" y1="11" x2="18" y2="20"/>
    </svg>
  ),
  sofa: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <path d="M2 14v-2a2 2 0 0 1 4 0v2"/>
      <path d="M18 14v-2a2 2 0 0 1 4 0v2"/>
      <rect x="2" y="14" width="20" height="5" rx="1"/>
      <rect x="4" y="10" width="16" height="4" rx="1"/>
    </svg>
  ),
  bed: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <path d="M2 20v-8a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v8"/>
      <path d="M2 20h20M2 12V6"/>
      <rect x="10" y="8" width="5" height="4" rx="1"/>
      <rect x="16" y="8" width="5" height="4" rx="1"/>
    </svg>
  ),
  desk: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <rect x="2" y="9" width="20" height="3" rx="1"/>
      <line x1="5" y1="12" x2="5" y2="20"/>
      <line x1="19" y1="12" x2="19" y2="20"/>
      <rect x="12" y="9" width="5" height="3"/>
    </svg>
  ),
  lamp: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <path d="M9 18h6M12 18v4"/>
      <path d="M8 6l8 8H8l8-8"/>
      <line x1="12" y1="2" x2="12" y2="6"/>
    </svg>
  ),
  cupboard: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <rect x="3" y="2" width="18" height="20" rx="1"/>
      <line x1="12" y1="2" x2="12" y2="22"/>
      <circle cx="9.5" cy="12" r="1" fill="currentColor"/>
      <circle cx="14.5" cy="12" r="1" fill="currentColor"/>
    </svg>
  ),
  dining_set: () => (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
      strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"
      width="20" height="20">
      <rect x="4" y="9" width="16" height="2" rx="1"/>
      <line x1="7" y1="11" x2="7" y2="18"/>
      <line x1="17" y1="11" x2="17" y2="18"/>
      <circle cx="12" cy="5" r="2"/>
    </svg>
  ),
};

const LeftSidebar = ({ roomDimensions, onRoomChange, onAddFurniture }) => {
  const [expandRoom,      setExpandRoom]      = useState(true);
  const [expandFurniture, setExpandFurniture] = useState(true);

  const handleAdd = (ft) => {
    onAddFurniture({
      id:       `${ft.type}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type:     ft.type,
      name:     ft.label,
      color:    ft.color,
      price:    ft.price,
      position: {
        x: (Math.random() - 0.5) * roomDimensions.width  * 0.55,
        y: 0,
        z: (Math.random() - 0.5) * roomDimensions.depth  * 0.55,
      },
      rotation: 0,
      scale:    1,
    });
  };

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
      letterSpacing: '1px', display: 'block', fontWeight: '600', marginBottom: '7px'
    }}>
      {text}
    </span>
  );

  const SectionBtn = ({ label, open, onToggle }) => (
    <button
      onClick={onToggle}
      style={{
        background: 'none', border: 'none', color: '#fff', cursor: 'pointer',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        width: '100%', padding: 0, marginBottom: '12px',
        fontSize: '13px', fontWeight: '700',
      }}
    >
      {label}
      <span style={{ color: '#555', fontSize: '11px' }}>{open ? '▼' : '▶'}</span>
    </button>
  );

  return (
    <aside style={{
      width: '252px',
      background: 'linear-gradient(180deg, #111 0%, #0a0a0a 100%)',
      borderRight: '1px solid #1a2a1a',
      overflowY: 'auto',
      padding: '18px 14px',
      flexShrink: 0,
    }}>

      {/* ROOM SETUP */}
      <div style={{ marginBottom: '16px' }}>
        <SectionBtn
          label="ROOM SETUP"
          open={expandRoom}
          onToggle={() => setExpandRoom(p => !p)}
        />

        {expandRoom && (
          <>
            {/* Dimensions */}
            <div style={{ display: 'flex', gap: '7px', marginBottom: '12px' }}>
              {['width', 'height', 'depth'].map(d => (
                <div key={d} style={{ flex: 1 }}>
                  <Lbl text={d[0].toUpperCase()} />
                  <input
                    type="number"
                    value={roomDimensions[d]}
                    onChange={e => onRoomChange({
                      ...roomDimensions,
                      [d]: parseFloat(e.target.value) || 1
                    })}
                    style={inp}
                    min={1} max={50} step={0.5}
                  />
                  <span style={{
                    fontSize: '10px', color: '#555',
                    display: 'block', textAlign: 'center', marginTop: '2px'
                  }}>m</span>
                </div>
              ))}
            </div>

            {/* Wall color */}
            <div style={{ marginBottom: '11px' }}>
              <Lbl text="WALL COLOR" />
              <input
                type="color"
                value={roomDimensions.wallColor}
                onChange={e => onRoomChange({ ...roomDimensions, wallColor: e.target.value })}
                style={{ ...inp, padding: '4px', height: '38px', cursor: 'pointer' }}
              />
            </div>

            {/* Floor style */}
            <div style={{ marginBottom: '11px' }}>
              <Lbl text="FLOOR STYLE" />
              <select
                value={roomDimensions.floorStyle}
                onChange={e => onRoomChange({ ...roomDimensions, floorStyle: e.target.value })}
                style={{ ...inp, cursor: 'pointer' }}
              >
                <option value="tiles">Tiles</option>
                <option value="wood">Wood</option>
                <option value="marble">Marble</option>
                <option value="carpet">Carpet</option>
              </select>
            </div>

            {/* Floor color */}
            <div style={{ marginBottom: '11px' }}>
              <Lbl text="FLOOR COLOR" />
              <input
                type="color"
                value={roomDimensions.floorColor}
                onChange={e => onRoomChange({ ...roomDimensions, floorColor: e.target.value })}
                style={{ ...inp, padding: '4px', height: '38px', cursor: 'pointer' }}
              />
            </div>
          </>
        )}
      </div>

      <div style={{ height: '1px', background: '#1a2a1a', margin: '4px 0 16px' }} />

      {/* FURNITURE */}
      <div>
        <SectionBtn
          label="FURNITURE"
          open={expandFurniture}
          onToggle={() => setExpandFurniture(p => !p)}
        />

        {expandFurniture && (
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            {FURNITURE_CATALOGUE.map(ft => {
              const IconComp = Icons[ft.type];
              return (
                <button
                  key={ft.type}
                  onClick={() => handleAdd(ft)}
                  style={{
                    background: 'linear-gradient(135deg, #1a3a2a 0%, #122a1e 100%)',
                    color: 'white',
                    border: '1px solid #1a4a2a',
                    borderRadius: '10px',
                    padding: '12px 6px',
                    cursor: 'pointer',
                    fontSize: '12px',
                    fontWeight: '600',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: '5px',
                    transition: 'all 0.2s',
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, rgba(26,219,138,0.15) 0%, #1a4a2a 100%)';
                    e.currentTarget.style.borderColor = '#1adb8a';
                    e.currentTarget.style.transform   = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow   =
                      '0 6px 16px rgba(26,219,138,0.2)';
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background =
                      'linear-gradient(135deg, #1a3a2a 0%, #122a1e 100%)';
                    e.currentTarget.style.borderColor = '#1a4a2a';
                    e.currentTarget.style.transform   = 'translateY(0)';
                    e.currentTarget.style.boxShadow   = 'none';
                  }}
                >
                  <span style={{ color: '#1adb8a' }}>
                    {IconComp && <IconComp />}
                  </span>
                  <span>{ft.label}</span>
                  <span style={{ fontSize: '11px', color: '#1adb8a', fontWeight: '700' }}>
                    LKR {ft.price}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>
    </aside>
  );
};

export default LeftSidebar;