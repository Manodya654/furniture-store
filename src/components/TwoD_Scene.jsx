import { useEffect, useRef, useState } from 'react';

const TwoD_Scene = ({ onSelect, selected, roomDimensions, furniture, onUpdateFurniture }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(10); // pixels per meter
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

  const getFloorPattern = (ctx, style, color) => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    
    if (style === 'tiles') {
      patternCanvas.width = 100;
      patternCanvas.height = 100;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 100, 100);
      patternCtx.strokeStyle = 'rgba(0,0,0,0.1)';
      patternCtx.lineWidth = 2;
      patternCtx.strokeRect(0, 0, 100, 100);
    } else if (style === 'wood') {
      patternCanvas.width = 200;
      patternCanvas.height = 30;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 200, 30);
      for (let i = 0; i < 5; i++) {
        patternCtx.strokeStyle = 'rgba(0,0,0,0.15)';
        patternCtx.lineWidth = 1;
        patternCtx.beginPath();
        patternCtx.moveTo(0, i * 6);
        patternCtx.lineTo(200, i * 6);
        patternCtx.stroke();
      }
      patternCtx.strokeStyle = 'rgba(0,0,0,0.3)';
      patternCtx.lineWidth = 2;
      patternCtx.strokeRect(0, 0, 200, 30);
    } else if (style === 'marble') {
      patternCanvas.width = 150;
      patternCanvas.height = 150;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 150, 150);
      patternCtx.strokeStyle = 'rgba(255,255,255,0.2)';
      for (let i = 0; i < 20; i++) {
        patternCtx.beginPath();
        patternCtx.moveTo(Math.random() * 150, Math.random() * 150);
        patternCtx.lineTo(Math.random() * 150, Math.random() * 150);
        patternCtx.stroke();
      }
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
    const { width: canvasWidth, height: canvasHeight } = canvas;
    
    // Clear canvas
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvasWidth, canvasHeight);
    
    // Calculate center offset
    const centerX = canvasWidth / 2 + offset.x;
    const centerY = canvasHeight / 2 + offset.y;
    
    // Draw floor
    const floorWidth = roomDimensions.width * scale;
    const floorDepth = roomDimensions.depth * scale;
    const floorX = centerX - floorWidth / 2;
    const floorY = centerY - floorDepth / 2;
    
    const pattern = getFloorPattern(ctx, roomDimensions.floorStyle, roomDimensions.floorColor);
    ctx.fillStyle = pattern;
    ctx.fillRect(floorX, floorY, floorWidth, floorDepth);
    
    // Draw walls
    ctx.strokeStyle = roomDimensions.wallColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(floorX, floorY, floorWidth, floorDepth);
    
    // Draw grid
    ctx.strokeStyle = 'rgba(255,255,255,0.05)';
    ctx.lineWidth = 1;
    for (let i = 0; i <= roomDimensions.width; i++) {
      const x = floorX + i * scale;
      ctx.beginPath();
      ctx.moveTo(x, floorY);
      ctx.lineTo(x, floorY + floorDepth);
      ctx.stroke();
    }
    for (let i = 0; i <= roomDimensions.depth; i++) {
      const y = floorY + i * scale;
      ctx.beginPath();
      ctx.moveTo(floorX, y);
      ctx.lineTo(floorX + floorWidth, y);
      ctx.stroke();
    }
    
    // Draw dimensions
    ctx.fillStyle = '#4a9eff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomDimensions.width}m`, centerX, floorY - 10);
    ctx.fillText(`${roomDimensions.depth}m`, floorX - 20, centerY);
    
    // Draw furniture
    furniture.forEach(item => {
      const size = getFurnitureSize(item.type);
      const itemWidth = size.width * scale;
      const itemDepth = size.depth * scale;
      
      const x = centerX + item.position.x * scale - itemWidth / 2;
      const y = centerY + item.position.z * scale - itemDepth / 2;
      
      ctx.save();
      ctx.translate(x + itemWidth / 2, y + itemDepth / 2);
      ctx.rotate((item.rotation || 0) * Math.PI / 180);
      
      // Draw furniture rectangle
      const isSelected = selected?.id === item.id;
      ctx.fillStyle = item.color || '#8B7355';
      ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
      
      // Draw border
      if (isSelected) {
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 3;
      } else {
        ctx.strokeStyle = '#333';
        ctx.lineWidth = 2;
      }
      ctx.strokeRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
      
      // Draw icon
      ctx.fillStyle = isSelected ? '#ffffff' : '#cccccc';
      ctx.font = 'bold 16px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      const icons = {
        chair: '🪑',
        table: '🪵',
        sofa: '🛋️',
        bed: '🛏️',
        desk: '🗄️'
      };
      ctx.fillText(icons[item.type] || '📦', 0, 0);
      
      ctx.restore();
      
      // Draw label
      if (isSelected) {
        ctx.fillStyle = '#4a9eff';
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.fillText(item.type.toUpperCase(), x + itemWidth / 2, y - 8);
      }
    });
    
    // Draw scale indicator
    ctx.fillStyle = '#fff';
    ctx.font = '12px sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`Scale: ${scale} px/m`, 10, canvasHeight - 10);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const resizeCanvas = () => {
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      drawScene();
    };
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  useEffect(() => {
    drawScene();
  }, [roomDimensions, furniture, selected, scale, offset]);

  const handleMouseDown = (e) => {
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const centerX = canvas.width / 2 + offset.x;
    const centerY = canvas.height / 2 + offset.y;
    
    // Check if clicked on furniture
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const size = getFurnitureSize(item.type);
      const itemWidth = size.width * scale;
      const itemDepth = size.depth * scale;
      
      const itemX = centerX + item.position.x * scale - itemWidth / 2;
      const itemY = centerY + item.position.z * scale - itemDepth / 2;
      
      if (x >= itemX && x <= itemX + itemWidth && y >= itemY && y <= itemY + itemDepth) {
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
      const dy = (e.clientY - dragStart.y) / scale;
      
      const newX = dragStart.itemPos.x + dx;
      const newZ = dragStart.itemPos.z + dy;
      
      // Constrain to room bounds
      const item = furniture.find(f => f.id === dragging);
      if (item) {
        const size = getFurnitureSize(item.type);
        const maxX = roomDimensions.width / 2 - size.width / 2;
        const maxZ = roomDimensions.depth / 2 - size.depth / 2;
        
        const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
        const constrainedZ = Math.max(-maxZ, Math.min(maxZ, newZ));
        
        onUpdateFurniture(dragging, {
          position: { x: constrainedX, y: item.position.y, z: constrainedZ }
        });
      }
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -1 : 1;
    setScale(prev => Math.max(5, Math.min(30, prev + delta)));
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
        style={{ cursor: dragging ? 'grabbing' : 'default' }}
      />
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#aaa'
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