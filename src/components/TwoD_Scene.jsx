import { useEffect, useRef, useState } from 'react';

const TwoD_Scene = ({ onSelect, selected, roomDimensions, furniture, onUpdateFurniture }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(40); 
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  const getFurnitureSize = (type) => {
    const sizes = {
      chair: { width: 0.6, depth: 0.6 },
      table: { width: 1.5, depth: 1.0 },
      sofa: { width: 2.0, depth: 0.9 },
      bed: { width: 2.0, depth: 1.5 },
      desk: { width: 1.2, depth: 0.6 }
    };
    return sizes[type] || { width: 1, depth: 1 };
  };

  // RESTORED: Your original pattern logic
  const getFloorPattern = (ctx, style, color) => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    
    if (style === 'tiles') {
      patternCanvas.width = 80;
      patternCanvas.height = 80;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 80, 80);
      patternCtx.strokeStyle = 'rgba(0,0,0,0.1)';
      patternCtx.strokeRect(0, 0, 80, 80);
    } else if (style === 'wood') {
      patternCanvas.width = 150;
      patternCanvas.height = 30;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 150, 30);
      patternCtx.strokeStyle = 'rgba(0,0,0,0.15)';
      patternCtx.strokeRect(0, 0, 150, 30);
    } else {
      patternCanvas.width = 10;
      patternCanvas.height = 10;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 10, 10);
    }
    return ctx.createPattern(patternCanvas, 'repeat');
  };

  const drawScene = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    
    // Fill entire background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2 + offset.x;
    const centerY = canvas.height / 2 + offset.y;
    const floorWidth = roomDimensions.width * scale;
    const floorDepth = roomDimensions.depth * scale;
    const floorX = centerX - floorWidth / 2;
    const floorY = centerY - floorDepth / 2;

    // Draw Floor
    const pattern = getFloorPattern(ctx, roomDimensions.floorStyle, roomDimensions.floorColor);
    ctx.fillStyle = pattern;
    ctx.fillRect(floorX, floorY, floorWidth, floorDepth);

    // Draw Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= roomDimensions.width; i++) {
      const x = floorX + i * scale;
      ctx.beginPath(); ctx.moveTo(x, floorY); ctx.lineTo(x, floorY + floorDepth); ctx.stroke();
    }
    for (let i = 0; i <= roomDimensions.depth; i++) {
      const y = floorY + i * scale;
      ctx.beginPath(); ctx.moveTo(floorX, y); ctx.lineTo(floorX + floorWidth, y); ctx.stroke();
    }

    // Draw Walls
    ctx.strokeStyle = roomDimensions.wallColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(floorX, floorY, floorWidth, floorDepth);

    // RESTORED: Dimension Labels
    ctx.fillStyle = '#4a9eff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomDimensions.width}m`, centerX, floorY - 10);
    ctx.fillText(`${roomDimensions.depth}m`, floorX - 25, centerY);

    // Draw Furniture
    furniture.forEach(item => {
      const size = getFurnitureSize(item.type);
      const itemWidth = size.width * scale;
      const itemDepth = size.depth * scale;
      const x = centerX + (item.position.x * scale) - itemWidth / 2;
      const y = centerY + (item.position.z * scale) - itemDepth / 2;

      ctx.save();
      ctx.translate(x + itemWidth / 2, y + itemDepth / 2);
      ctx.rotate((item.rotation || 0) * Math.PI / 180);

      const isSelected = selected?.id === item.id;
      ctx.fillStyle = item.color || '#8B7355';
      ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
      
      if (isSelected) {
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 3;
        ctx.strokeRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
      }

      // RESTORED: Emojis
      ctx.font = '16px sans-serif';
      const icons = { chair: '🪑', table: '🪵', sofa: ' Couch', bed: '🛏️', desk: '🗄️' };
      ctx.fillText(icons[item.type] || '📦', 0, 5);
      ctx.restore();
    });
  };

  // FIX: Proper container-aware resizing
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Auto-scale to fit
      const scaleX = (canvas.width - 100) / roomDimensions.width;
      const scaleY = (canvas.height - 100) / roomDimensions.depth;
      setScale(Math.min(scaleX, scaleY, 60)); // Max scale 60 for initial fit
      drawScene();
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [roomDimensions.width, roomDimensions.depth]);

  useEffect(() => {
    drawScene();
  }, [roomDimensions, furniture, selected, scale, offset]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvasRef.current.width / 2 + offset.x;
    const centerY = canvasRef.current.height / 2 + offset.y;

    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const size = getFurnitureSize(item.type);
      const itemX = centerX + item.position.x * scale - (size.width * scale) / 2;
      const itemY = centerY + item.position.z * scale - (size.depth * scale) / 2;

      if (x >= itemX && x <= itemX + size.width * scale && y >= itemY && y <= itemY + size.depth * scale) {
        onSelect(item);
        setDragging(item.id);
        setDragStart({ x: e.clientX, y: e.clientY, itemPos: { ...item.position } });
        return;
      }
    }
    onSelect(null);
  };

  const handleMouseMove = (e) => {
    if (dragging && dragStart) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dz = (e.clientY - dragStart.y) / scale;
      onUpdateFurniture(dragging, {
        position: { 
          x: dragStart.itemPos.x + dx, 
          y: dragStart.itemPos.y, 
          z: dragStart.itemPos.z + dz 
        }
      });
    }
  };

  const handleMouseUp = () => { setDragging(null); setDragStart(null); };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * zoom, 10), 200));
  };

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ display: 'block', cursor: dragging ? 'grabbing' : 'default' }}
      />
      
      {/* RESTORED: The Info Box Overlay */}
      <div style={{
        position: 'absolute', top: '20px', right: '20px',
        background: 'rgba(0,0,0,0.8)', padding: '15px', borderRadius: '8px',
        fontSize: '12px', color: '#aaa', pointerEvents: 'none'
      }}>
        <div style={{fontWeight: 'bold', color: '#4a9eff', marginBottom: '8px'}}>2D Floor Plan</div>
        <div>• Click to select furniture</div>
        <div>• Drag to move</div>
        <div>• Scroll to zoom</div>
      </div>
    </div>
  );
};

export default TwoD_Scene;