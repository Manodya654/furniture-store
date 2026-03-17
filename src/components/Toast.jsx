const Toast = ({ toasts, onRemove }) => {
  const getIcon = (type) => {
    switch (type) {
      case 'success':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#1adb8a" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
            <polyline points="22 4 12 14.01 9 11.01" />
          </svg>
        );
      case 'warning':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#f0a030" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
            <line x1="12" y1="9" x2="12" y2="13" />
            <line x1="12" y1="17" x2="12.01" y2="17" />
          </svg>
        );
      case 'error':
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#ff4757" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="15" y1="9" x2="9" y2="15" />
            <line x1="9" y1="9" x2="15" y2="15" />
          </svg>
        );
      default:
        return (
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#4a9eff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="16" x2="12" y2="12" />
            <line x1="12" y1="8" x2="12.01" y2="8" />
          </svg>
        );
    }
  };

  const getBorderColor = (type) => {
    switch (type) {
      case 'success': return '#1adb8a';
      case 'warning': return '#f0a030';
      case 'error': return '#ff4757';
      default: return '#4a9eff';
    }
  };

  const getGlowColor = (type) => {
    switch (type) {
      case 'success': return 'rgba(26, 219, 138, 0.15)';
      case 'warning': return 'rgba(240, 160, 48, 0.15)';
      case 'error': return 'rgba(255, 71, 87, 0.15)';
      default: return 'rgba(74, 158, 255, 0.15)';
    }
  };

  return (
    <div style={{
      position: 'fixed',
      top: '75px',
      right: '24px',
      zIndex: 10000,
      display: 'flex',
      flexDirection: 'column',
      gap: '10px',
      pointerEvents: 'none'
    }}>
      {toasts.map((toast, index) => (
        <div
          key={toast.id}
          style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #151520 100%)',
            border: `1px solid ${getBorderColor(toast.type)}40`,
            borderLeft: `4px solid ${getBorderColor(toast.type)}`,
            borderRadius: '12px',
            padding: '14px 18px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            minWidth: '300px',
            maxWidth: '420px',
            boxShadow: `0 8px 32px rgba(0,0,0,0.4), 0 0 20px ${getGlowColor(toast.type)}`,
            pointerEvents: 'auto',
            animation: 'slideInRight 0.35s cubic-bezier(0.16, 1, 0.3, 1)',
            backdropFilter: 'blur(20px)',
            cursor: 'pointer',
          }}
          onClick={() => onRemove(toast.id)}
        >
          {/* Icon */}
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: getGlowColor(toast.type),
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0
          }}>
            {getIcon(toast.type)}
          </div>

          {/* Message */}
          <span style={{
            fontSize: '13px',
            color: '#e0e0e0',
            fontWeight: '500',
            flex: 1,
            lineHeight: '1.4'
          }}>
            {toast.message}
          </span>

          {/* Close button */}
          <button
            onClick={(e) => { e.stopPropagation(); onRemove(toast.id); }}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#555',
              cursor: 'pointer',
              padding: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '4px',
              transition: 'all 0.2s',
              flexShrink: 0
            }}
            onMouseEnter={(e) => e.currentTarget.style.color = '#fff'}
            onMouseLeave={(e) => e.currentTarget.style.color = '#555'}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Progress bar */}
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: '4px',
            right: 0,
            height: '2px',
            borderRadius: '0 0 12px 12px',
            overflow: 'hidden'
          }}>
            <div style={{
              height: '100%',
              background: getBorderColor(toast.type),
              borderRadius: '2px',
              animation: 'shrinkWidth 3.5s linear forwards',
              opacity: 0.6
            }} />
          </div>
        </div>
      ))}

      {/* Animations */}
      <style>{`
        @keyframes slideInRight {
          from {
            transform: translateX(100%);
            opacity: 0;
          }
          to {
            transform: translateX(0);
            opacity: 1;
          }
        }
        @keyframes shrinkWidth {
          from { width: 100%; }
          to { width: 0%; }
        }
      `}</style>
    </div>
  );
};

export default Toast;