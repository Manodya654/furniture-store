import { useEffect, useRef, useState, useCallback } from 'react';

const TwoD_Scene = ({ onSelect, selected, roomDimensions, furniture, onUpdateFurniture }) => {
  const canvasRef = useRef(null);
  const [scale, setScale] = useState(40);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const [dragging, setDragging] = useState(null);
  const [dragStart, setDragStart] = useState(null);
  const [panning, setPanning] = useState(false);
  const [panStart, setPanStart] = useState(null); 

  const getFurnitureSize = (type) => {
    const sizes = {
      chair: { width: 0.6, depth: 0.6 },
      table: { width: 1.5, depth: 1.0 },
      sofa: { width: 2.0, depth: 0.9 },
      bed: { width: 1.8, depth: 2.2 },
      desk: { width: 1.2, depth: 0.6 },
      vase: { width: 0.4, depth: 0.4 }

    };
    return sizes[type] || { width: 1, depth: 1 };
  };

  const getFurnitureIcon = (type) => {
    const icons = {
      chair: '🪑',
      table: '🪑',
      sofa: '🛋️',
      bed: '🛏️',
      desk: '🗄️',
      vase: '🏺'
    };
    return icons[type] || '📦';
  };

  const getFloorPattern = useCallback((ctx, style, color) => {
    const patternCanvas = document.createElement('canvas');
    const patternCtx = patternCanvas.getContext('2d');

    if (style === 'tiles') {
      patternCanvas.width = 80;
      patternCanvas.height = 80;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 80, 80);
      patternCtx.strokeStyle = 'rgba(0,0,0,0.1)';
      patternCtx.lineWidth = 1;
      patternCtx.strokeRect(0, 0, 80, 80);
    } else if (style === 'wood') {
      patternCanvas.width = 150;
      patternCanvas.height = 30;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 150, 30);
      patternCtx.strokeStyle = 'rgba(0,0,0,0.15)';
      patternCtx.lineWidth = 1;
      patternCtx.strokeRect(0, 0, 150, 30);
    } else if (style === 'marble') {
      patternCanvas.width = 100;
      patternCanvas.height = 100;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 100, 100);
      for (let i = 0; i < 5; i++) {
        patternCtx.strokeStyle = 'rgba(255,255,255,0.15)';
        patternCtx.beginPath();
        patternCtx.moveTo(Math.random() * 100, Math.random() * 100);
        patternCtx.bezierCurveTo(
          Math.random() * 100, Math.random() * 100,
          Math.random() * 100, Math.random() * 100,
          Math.random() * 100, Math.random() * 100
        );
        patternCtx.stroke();
      }
    } else if (style === 'carpet') {
      patternCanvas.width = 10;
      patternCanvas.height = 10;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 10, 10);
      const imageData = patternCtx.getImageData(0, 0, 10, 10);
      for (let i = 0; i < imageData.data.length; i += 4) {
        const noise = Math.random() * 20 - 10;
        imageData.data[i] = Math.min(255, Math.max(0, imageData.data[i] + noise));
        imageData.data[i + 1] = Math.min(255, Math.max(0, imageData.data[i + 1] + noise));
        imageData.data[i + 2] = Math.min(255, Math.max(0, imageData.data[i + 2] + noise));
      }
      patternCtx.putImageData(imageData, 0, 0);
    } else {
      patternCanvas.width = 10;
      patternCanvas.height = 10;
      patternCtx.fillStyle = color;
      patternCtx.fillRect(0, 0, 10, 10);
    }
    return ctx.createPattern(patternCanvas, 'repeat');
  }, []);

  const drawScene = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // Clear
    ctx.fillStyle = '#1a1a1a';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    const centerX = canvas.width / 2 + offset.x;
    const centerY = canvas.height / 2 + offset.y;
    const floorWidth = roomDimensions.width * scale;
    const floorDepth = roomDimensions.depth * scale;
    const floorX = centerX - floorWidth / 2;
    const floorY = centerY - floorDepth / 2;

    // Floor
    const pattern = getFloorPattern(ctx, roomDimensions.floorStyle, roomDimensions.floorColor);
    ctx.fillStyle = pattern;
    ctx.fillRect(floorX, floorY, floorWidth, floorDepth);

    // Grid
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

    // Walls
    ctx.strokeStyle = roomDimensions.wallColor || '#e8e8e8';
    ctx.lineWidth = 8;
    ctx.strokeRect(floorX, floorY, floorWidth, floorDepth);

    // Dimension labels
    ctx.fillStyle = '#4a9eff';
    ctx.font = 'bold 12px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText(`${roomDimensions.width}m`, centerX, floorY - 15);
    ctx.save();
    ctx.translate(floorX - 15, centerY);
    ctx.rotate(-Math.PI / 2);
    ctx.fillText(`${roomDimensions.depth}m`, 0, 0);
    ctx.restore();

    // Draw furniture
    furniture.forEach(item => {
      const size = getFurnitureSize(item.type);
      const itemWidth = size.width * scale;
      const itemDepth = size.depth * scale;
      // item.position.x and item.position.z map to 2D (x, y from top)
      const x = centerX + (item.position?.x || 0) * scale;
      const y = centerY + (item.position?.z || 0) * scale;

      ctx.save();
      ctx.translate(x, y);
      ctx.rotate((item.rotation || 0) * Math.PI / 180);

      const isSelected = selected?.id === item.id;

      // Shadow
      ctx.fillStyle = 'rgba(0,0,0,0.2)';
      ctx.fillRect(-itemWidth / 2 + 3, -itemDepth / 2 + 3, itemWidth, itemDepth);

      // Body
      ctx.fillStyle = item.color || '#8B7355';
      ctx.fillRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);

      // Border
      ctx.strokeStyle = isSelected ? '#4a9eff' : 'rgba(0,0,0,0.3)';
      ctx.lineWidth = isSelected ? 3 : 1;
      ctx.strokeRect(-itemWidth / 2, -itemDepth / 2, itemWidth, itemDepth);

      // Selection glow
      if (isSelected) {
        ctx.shadowColor = '#4a9eff';
        ctx.shadowBlur = 15;
        ctx.strokeStyle = '#4a9eff';
        ctx.lineWidth = 2;
        ctx.strokeRect(-itemWidth / 2 - 2, -itemDepth / 2 - 2, itemWidth + 4, itemDepth + 4);
        ctx.shadowBlur = 0;
      }

      // Icon
      ctx.font = `${Math.max(14, Math.min(itemWidth, itemDepth) * 0.5)}px sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(getFurnitureIcon(item.type), 0, 0);

      // Label
      ctx.fillStyle = isSelected ? '#4a9eff' : 'rgba(255,255,255,0.7)';
      ctx.font = '10px sans-serif';
      ctx.fillText(item.type, 0, itemDepth / 2 + 12);

      ctx.restore();
    });

    // Compass
    const compassX = canvas.width - 50;
    const compassY = 50;
    ctx.fillStyle = 'rgba(255,255,255,0.1)';
    ctx.beginPath();
    ctx.arc(compassX, compassY, 20, 0, Math.PI * 2);
    ctx.fill();
    ctx.fillStyle = '#4a9eff';
    ctx.font = 'bold 10px sans-serif';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillText('N', compassX, compassY - 10);
    ctx.fillStyle = '#888';
    ctx.fillText('S', compassX, compassY + 10);
    ctx.fillText('W', compassX - 12, compassY);
    ctx.fillText('E', compassX + 12, compassY);

  }, [roomDimensions, furniture, selected, scale, offset, getFloorPattern]);

  // Resize canvas
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const container = canvas.parentElement;
      canvas.width = container.clientWidth;
      canvas.height = container.clientHeight;

      const scaleX = (canvas.width - 100) / roomDimensions.width;
      const scaleY = (canvas.height - 100) / roomDimensions.depth;
      setScale(Math.min(scaleX, scaleY, 80));
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [roomDimensions.width, roomDimensions.depth]);

  // Redraw
  useEffect(() => {
    drawScene();
  }, [drawScene]);

  const handleMouseDown = (e) => {
    // Middle mouse or right-click for panning
    if (e.button === 1 || e.button === 2) {
      setPanning(true);
      setPanStart({ x: e.clientX - offset.x, y: e.clientY - offset.y });
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const mx = e.clientX - rect.left;
    const my = e.clientY - rect.top;
    const centerX = canvasRef.current.width / 2 + offset.x;
    const centerY = canvasRef.current.height / 2 + offset.y;

    // Check furniture (reverse order for top-most first)
    for (let i = furniture.length - 1; i >= 0; i--) {
      const item = furniture[i];
      const size = getFurnitureSize(item.type);
      const itemW = size.width * scale;
      const itemD = size.depth * scale;
      const ix = centerX + (item.position?.x || 0) * scale;
      const iy = centerY + (item.position?.z || 0) * scale;

      // Simple AABB check (ignoring rotation for simplicity)
      if (
        mx >= ix - itemW / 2 &&
        mx <= ix + itemW / 2 &&
        my >= iy - itemD / 2 &&
        my <= iy + itemD / 2
      ) {
        if (onSelect) onSelect(item);
        setDragging(item.id);
        setDragStart({
          x: e.clientX,
          y: e.clientY,
          itemPos: { ...(item.position || { x: 0, y: 0, z: 0 }) }
        });
        return;
      }
    }

    // Clicked empty space
    if (onSelect) onSelect(null);
  };

  const handleMouseMove = (e) => {
    if (panning && panStart) {
      setOffset({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y
      });
      return;
    }

    if (dragging && dragStart) {
      const dx = (e.clientX - dragStart.x) / scale;
      const dz = (e.clientY - dragStart.y) / scale;

      const newX = dragStart.itemPos.x + dx;
      const newZ = dragStart.itemPos.z + dz;

      // Clamp to room bounds
      const halfW = roomDimensions.width / 2;
      const halfD = roomDimensions.depth / 2;
      const clampedX = Math.max(-halfW + 0.3, Math.min(halfW - 0.3, newX));
      const clampedZ = Math.max(-halfD + 0.3, Math.min(halfD - 0.3, newZ));

      onUpdateFurniture(dragging, {
        position: {
          x: clampedX,
          y: dragStart.itemPos.y || 0,
          z: clampedZ
        }
      });
    }
  };

  const handleMouseUp = () => {
    setDragging(null);
    setDragStart(null);
    setPanning(false);
    setPanStart(null);
  };

  const handleWheel = (e) => {
    e.preventDefault();
    const zoom = e.deltaY > 0 ? 0.9 : 1.1;
    setScale(prev => Math.min(Math.max(prev * zoom, 15), 200));
  };

  const handleContextMenu = (e) => e.preventDefault();

  return (
    <div style={{ width: '100%', height: '100%', position: 'relative', overflow: 'hidden' }}>
      <canvas
        ref={canvasRef}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onWheel={handleWheel}
        onContextMenu={handleContextMenu}
        style={{
          display: 'block',
          cursor: dragging ? 'grabbing' : panning ? 'move' : 'default'
        }}
      />

      {/* Furniture count indicator */}
      <div style={{
        position: 'absolute',
        bottom: 15,
        left: 15,
        background: 'rgba(0,0,0,0.7)',
        color: '#aaa',
        padding: '6px 12px',
        borderRadius: '6px',
        fontSize: '12px'
      }}>
        📦 {furniture.length} items | Scroll to zoom | Drag to move
      </div>
    </div>
  );
};

export default TwoD_Scene;