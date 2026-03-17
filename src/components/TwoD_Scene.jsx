import { useEffect, useRef, useState } from 'react';

const TwoD_Scene = ({ furniture, onUpdateFurniture, onSelect, selected, roomDimensions }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(40);
  const [dragging, setDragging] = useState(null);
  const [dragStart, setDragStart] = useState(null);

  const getFurnitureSize = (type) => {
    const sizes = {
      chair: { width: 0.6, depth: 0.6 },
      table: { width: 1.5, depth: 1.0 },
      sofa: { width: 2.0, depth: 0.9 },
      bed: { width: 2.0, depth: 1.5 },
      desk: { width: 1.2, depth: 0.6 },
      lamp: { width: 0.4, depth: 0.4 }
    };
    return sizes[type] || { width: 1, depth: 1 };
  };

  const getFurnitureColor = (type) => {
    const colors = {
      chair: '#8B4513',
      table: '#A0522D',
      sofa: '#6B8E23',
      bed: '#4682B4',
      desk: '#CD853F',
      lamp: '#FFD700'
    };
    return colors[type] || '#8B7355';
  };

  const lightenColor = (color, percent) => {
    const num = parseInt(color.replace('#', ''), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.min(255, (num >> 16) + amt);
    const G = Math.min(255, (num >> 8 & 0x00FF) + amt);
    const B = Math.min(255, (num & 0x0000FF) + amt);
    return '#' + (0x1000000 + (R << 16) + (G << 8) + B).toString(16).slice(1);
  };

  const getFloorPattern = (ctx, style, color) => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');
    
    if (style === 'tiles') {
      patternCanvas.width = 80;
      patternCanvas.height = 80;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 80, 80);
      patternCtx.strokeStyle = 'rgba(0,0,0,0.15)';
      patternCtx.lineWidth = 2;
      patternCtx.strokeRect(0, 0, 80, 80);
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
    
    // Clear with dark background
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2;
    const centerY = canvas.height / 2;
    const floorWidth = roomDimensions.width * scale;
    const floorDepth = roomDimensions.depth * scale;
    const floorX = centerX - floorWidth / 2;
    const floorY = centerY - floorDepth / 2;

    // Floor
    const pattern = getFloorPattern(ctx, roomDimensions.floorStyle, roomDimensions.floorColor);
    ctx.fillStyle = pattern;
    ctx.fillRect(floorX, floorY, floorWidth, floorDepth);

    // Grid
    ctx.strokeStyle = 'rgba(255,255,255,0.08)';
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

    // Walls
    ctx.strokeStyle = roomDimensions.wallColor;
    ctx.lineWidth = 8;
    ctx.strokeRect(floorX, floorY, floorWidth, floorDepth);

    // Dimensions
    ctx.fillStyle = '#4a9eff';
    ctx.font = 'bold 14px sans-serif';
    ctx.textAlign = 'center';
    ctx.fillText(`${roomDimensions.width}m`, centerX, floorY - 15);
    ctx.save();
    ctx.translate(floorX - 30, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${roomDimensions.depth}m`, 0, 0);
    ctx.restore();

    // Draw Furniture
    furniture.forEach(item => {
      const size = getFurnitureSize(item.type);
      const itemWidth = size.width * scale;
      const itemDepth = size.depth * scale;
      const x = centerX + (item.position.x * scale) - itemWidth / 2;
      const y = centerY + (item.position.z * scale) - itemDepth / 2;

      ctx.save();
      ctx.translate(x + itemWidth / 2, y + itemDepth / 2);
      ctx.rotate(item.rotation || 0);

      const isSelected = selected?.id === item.id;
      const baseColor = item.color || getFurnitureColor(item.type);
      
      // Draw realistic top-down furniture views
      if (item.type === 'chair') {
        // Chair seat
        ctx.fillStyle = baseColor;
        const seatW = itemWidth * 0.8;
        const seatD = itemDepth * 0.6;
        ctx.fillRect(-seatW / 2, -seatD / 2, seatW, seatD);
        
        // Chair back
        ctx.fillStyle = lightenColor(baseColor, -10);
        ctx.fillRect(-seatW / 2, -itemDepth / 2, seatW, itemDepth * 0.15);
        
        // Chair legs (4 circles)
        ctx.fillStyle = lightenColor(baseColor, -20);
        const legSize = 4;
        ctx.beginPath();
        ctx.arc(-seatW / 2 + legSize, -seatD / 2 + legSize, legSize, 0, Math.PI * 2);
        ctx.arc(seatW / 2 - legSize, -seatD / 2 + legSize, legSize, 0, Math.PI * 2);
        ctx.arc(-seatW / 2 + legSize, seatD / 2 - legSize, legSize, 0, Math.PI * 2);
        ctx.arc(seatW / 2 - legSize, seatD / 2 - legSize, legSize, 0, Math.PI * 2);
        ctx.fill();
        
      } else if (item.type === 'table') {
        // Table top with wood grain effect
        ctx.fillStyle = baseColor;
        ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
        
        // Wood grain lines
        ctx.strokeStyle = 'rgba(0,0,0,0.15)';
        ctx.lineWidth = 1;
        for (let i = -itemWidth / 2; i < itemWidth / 2; i += 8) {
          ctx.beginPath();
          ctx.moveTo(i, -itemDepth / 2);
          ctx.lineTo(i, itemDepth / 2);
          ctx.stroke();
        }
        
        // Table edge shadow
        ctx.strokeStyle = 'rgba(0,0,0,0.3)';
        ctx.lineWidth = 3;
        ctx.strokeRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
        
        // Table legs
        ctx.fillStyle = lightenColor(baseColor, -25);
        const legW = 6;
        ctx.fillRect(-itemWidth / 2 + 5, -itemDepth / 2 + 5, legW, legW);
        ctx.fillRect(itemWidth / 2 - 5 - legW, -itemDepth / 2 + 5, legW, legW);
        ctx.fillRect(-itemWidth / 2 + 5, itemDepth / 2 - 5 - legW, legW, legW);
        ctx.fillRect(itemWidth / 2 - 5 - legW, itemDepth / 2 - 5 - legW, legW, legW);
        
      } else if (item.type === 'sofa') {
        // Sofa base
        ctx.fillStyle = baseColor;
        ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
        
        // 3 seat cushions with gaps
        const cushionW = (itemWidth - 16) / 3;
        ctx.fillStyle = lightenColor(baseColor, 15);
        for (let i = 0; i < 3; i++) {
          const cushionX = -itemWidth / 2 + 8 + i * (cushionW + 4);
          ctx.fillRect(cushionX, -itemDepth / 2 + 8, cushionW, itemDepth * 0.5);
        }
        
        // Backrest cushions
        ctx.fillStyle = lightenColor(baseColor, 10);
        for (let i = 0; i < 3; i++) {
          const cushionX = -itemWidth / 2 + 8 + i * (cushionW + 4);
          ctx.fillRect(cushionX, itemDepth / 2 - itemDepth * 0.35, cushionW, itemDepth * 0.3);
        }
        
        // Armrests
        ctx.fillStyle = lightenColor(baseColor, -10);
        ctx.fillRect(-itemWidth / 2, -itemDepth / 2, 8, itemDepth);
        ctx.fillRect(itemWidth / 2 - 8, -itemDepth / 2, 8, itemDepth);
        
      } else if (item.type === 'bed') {
        // Bed frame
        ctx.fillStyle = lightenColor(baseColor, -15);
        ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
        
        // Mattress (slightly smaller)
        ctx.fillStyle = baseColor;
        ctx.fillRect(-itemWidth / 2 + 4, -itemDepth / 2 + 4, itemWidth - 8, itemDepth - 8);
        
        // Pillow area (quilted pattern)
        ctx.fillStyle = lightenColor(baseColor, 25);
        const pillowH = itemDepth * 0.25;
        ctx.fillRect(-itemWidth / 2 + 10, -itemDepth / 2 + 10, itemWidth - 20, pillowH);
        
        // Quilted diamond pattern
        ctx.strokeStyle = 'rgba(255,255,255,0.3)';
        ctx.lineWidth = 1;
        const quiltSize = 15;
        for (let qx = -itemWidth / 2 + 10; qx < itemWidth / 2 - 10; qx += quiltSize) {
          for (let qy = -itemDepth / 2 + 10; qy < itemDepth / 2 - 10; qy += quiltSize) {
            ctx.beginPath();
            ctx.moveTo(qx, qy);
            ctx.lineTo(qx + quiltSize / 2, qy + quiltSize / 2);
            ctx.lineTo(qx, qy + quiltSize);
            ctx.lineTo(qx - quiltSize / 2, qy + quiltSize / 2);
            ctx.closePath();
            ctx.stroke();
          }
        }
        
      } else if (item.type === 'desk') {
        // Desk surface
        ctx.fillStyle = baseColor;
        ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
        
        // Desk top highlight
        ctx.fillStyle = lightenColor(baseColor, 20);
        ctx.fillRect(-itemWidth / 2 + 5, -itemDepth / 2 + 5, itemWidth - 10, itemDepth - 10);
        
        // Drawer sections on one side
        ctx.fillStyle = lightenColor(baseColor, -10);
        const drawerW = itemWidth * 0.25;
        const drawerH = itemDepth * 0.2;
        ctx.fillRect(-itemWidth / 2 + 5, -itemDepth / 2 + 5, drawerW, drawerH);
        ctx.fillRect(-itemWidth / 2 + 5, -itemDepth / 2 + 5 + drawerH + 3, drawerW, drawerH);
        ctx.fillRect(-itemWidth / 2 + 5, itemDepth / 2 - 5 - drawerH, drawerW, drawerH);
        
        // Drawer handles
        ctx.fillStyle = '#333';
        ctx.fillRect(-itemWidth / 2 + drawerW / 2 - 3, -itemDepth / 2 + 5 + drawerH / 2 - 1, 6, 2);
        ctx.fillRect(-itemWidth / 2 + drawerW / 2 - 3, -itemDepth / 2 + 5 + drawerH + 3 + drawerH / 2 - 1, 6, 2);
        ctx.fillRect(-itemWidth / 2 + drawerW / 2 - 3, itemDepth / 2 - 5 - drawerH / 2 - 1, 6, 2);
        
      } else if (item.type === 'lamp') {
        // Lamp base (circle)
        ctx.fillStyle = lightenColor(baseColor, -20);
        ctx.beginPath();
        ctx.arc(0, 0, itemWidth / 2, 0, Math.PI * 2);
        ctx.fill();
        
        // Lamp shade (smaller circle on top)
        ctx.fillStyle = baseColor;
        ctx.beginPath();
        ctx.arc(0, 0, itemWidth / 3, 0, Math.PI * 2);
        ctx.fill();
        
        // Light glow effect
        const gradient = ctx.createRadialGradient(0, 0, itemWidth / 4, 0, 0, itemWidth / 2 + 10);
        gradient.addColorStop(0, 'rgba(255, 215, 0, 0.6)');
        gradient.addColorStop(1, 'rgba(255, 215, 0, 0)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(0, 0, itemWidth / 2 + 10, 0, Math.PI * 2);
        ctx.fill();
        
      } else {
        // Fallback for unknown types
        ctx.fillStyle = baseColor;
        ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);
      }
      
      // Selection outline (dashed blue line)
      if (isSelected) {
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 3;
        ctx.setLineDash([8, 4]);
        ctx.strokeRect(-itemWidth / 2 - 6, -itemDepth / 2 - 6, itemWidth + 12, itemDepth + 12);
        ctx.setLineDash([]);
        
        // Selection glow
        ctx.shadowColor = 'rgba(74, 158, 255, 0.4)';
        ctx.shadowBlur = 10;
        ctx.strokeRect(-itemWidth / 2 - 6, -itemDepth / 2 - 6, itemWidth + 12, itemDepth + 12);
        ctx.shadowBlur = 0;
      }

      // Small type label (bottom)
      ctx.fillStyle = isSelected ? '#4a9eff' : '#999';
      ctx.font = 'bold 9px sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(item.type.toUpperCase(), 0, itemDepth / 2 + 14);
      
      ctx.restore();
    });
  };

  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;
      
      // Better scaling with margins
      const marginX = 120;
      const marginY = 120;
      const scaleX = (canvas.width - marginX) / roomDimensions.width;
      const scaleY = (canvas.height - marginY) / roomDimensions.depth;
      setScale(Math.min(scaleX, scaleY, 70));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [roomDimensions.width, roomDimensions.depth]);

  useEffect(() => {
    drawScene();
  }, [roomDimensions, furniture, selected, scale]);

  const handleMouseDown = (e) => {
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = canvasRef.current.width / 2;
    const centerY = canvasRef.current.height / 2;

    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const size = getFurnitureSize(item.type);
      const itemX = centerX + item.position.x * scale - (size.width * scale) / 2;
      const itemY = centerY + item.position.z * scale - (size.depth * scale) / 2;

      if (x >= itemX && x <= itemX + size.width * scale && 
          y >= itemY && y <= itemY + size.depth * scale) {
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
      
      let newX = dragStart.itemPos.x + dx;
      let newZ = dragStart.itemPos.z + dz;
      
      // Boundary constraints
      const item = furniture.find(f => f.id === dragging);
      if (item) {
        const size = getFurnitureSize(item.type);
        const halfW = roomDimensions.width / 2;
        const halfD = roomDimensions.depth / 2;
        
        const maxX = halfW - size.width / 2;
        const minX = -halfW + size.width / 2;
        const maxZ = halfD - size.depth / 2;
        const minZ = -halfD + size.depth / 2;
        
        if (newX > maxX) newX = maxX;
        if (newX < minX) newX = minX;
        if (newZ > maxZ) newZ = maxZ;
        if (newZ < minZ) newZ = minZ;
      }
      
      onUpdateFurniture(dragging, {
        position: { x: newX, y: dragStart.itemPos.y || 0, z: newZ }
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setDragStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * zoom, 20), 120));
  };

  return (
    <div style={{ 
      width: '100%', 
      height: '100%', 
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#0a0a0a',
      overflow: 'hidden'
    }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        style={{ 
          cursor: dragging ? 'grabbing' : 'default',
          display: 'block'
        }}
      />
    </div>
  );
};

export default TwoD_Scene;