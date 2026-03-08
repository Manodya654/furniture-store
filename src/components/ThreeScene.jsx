import { useEffect, useRef } from "react";
import * as THREE from "three";

const ThreeScene = ({ onSelect, selected, roomDimensions, furniture, onUpdateFurniture }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const furnitureObjects = useRef({});
  const roomRef = useRef(null);
  const floorRef = useRef(null);

  const createFurnitureGeometry = (type) => {
    const geometries = {
      chair: () => {
        const group = new THREE.Group();
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.1, 0.6),
          new THREE.MeshStandardMaterial()
        );
        seat.position.y = 0.5;
        const back = new THREE.Mesh(
          new THREE.BoxGeometry(0.6, 0.8, 0.1),
          new THREE.MeshStandardMaterial()
        );
        back.position.y = 0.9;
        back.position.z = -0.25;
        group.add(seat, back);
        return group;
      },
      table: () => {
        const group = new THREE.Group();
        const top = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 0.1, 1.0),
          new THREE.MeshStandardMaterial()
        );
        top.position.y = 0.8;
        group.add(top);
        for (let x of [-0.6, 0.6]) {
          for (let z of [-0.4, 0.4]) {
            const leg = new THREE.Mesh(
              new THREE.BoxGeometry(0.1, 0.8, 0.1),
              new THREE.MeshStandardMaterial()
            );
            leg.position.set(x, 0.4, z);
            group.add(leg);
          }
        }
        return group;
      },
      sofa: () => {
        const group = new THREE.Group();
        const seat = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 0.5, 0.9),
          new THREE.MeshStandardMaterial()
        );
        seat.position.y = 0.4;
        const back = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 0.8, 0.2),
          new THREE.MeshStandardMaterial()
        );
        back.position.y = 0.8;
        back.position.z = -0.35;
        group.add(seat, back);
        return group;
      },
      bed: () => {
        const group = new THREE.Group();
        const mattress = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 0.4, 1.5),
          new THREE.MeshStandardMaterial()
        );
        mattress.position.y = 0.5;
        const headboard = new THREE.Mesh(
          new THREE.BoxGeometry(2.0, 1.0, 0.1),
          new THREE.MeshStandardMaterial()
        );
        headboard.position.y = 0.9;
        headboard.position.z = -0.7;
        group.add(mattress, headboard);
        return group;
      },
      desk: () => {
        const group = new THREE.Group();
        const top = new THREE.Mesh(
          new THREE.BoxGeometry(1.2, 0.05, 0.6),
          new THREE.MeshStandardMaterial()
        );
        top.position.y = 0.75;
        group.add(top);
        for (let x of [-0.5, 0.5]) {
          const leg = new THREE.Mesh(
            new THREE.BoxGeometry(0.1, 0.75, 0.5),
            new THREE.MeshStandardMaterial()
          );
          leg.position.set(x, 0.375, 0);
          group.add(leg);
        }
        return group;
      }
    };
    
    return geometries[type] ? geometries[type]() : new THREE.Mesh(
      new THREE.BoxGeometry(1, 1, 1),
      new THREE.MeshStandardMaterial()
    );
  };

  const createFloorTexture = (style, color) => {
    const canvas = document.createElement('canvas');
    canvas.width = 512;
    canvas.height = 512;
    const ctx = canvas.getContext('2d');
    
    ctx.fillStyle = color;
    ctx.fillRect(0, 0, 512, 512);
    
    if (style === 'tiles') {
      const tileSize = 128;
      ctx.strokeStyle = 'rgba(0,0,0,0.2)';
      ctx.lineWidth = 4;
      for (let i = 0; i <= 512; i += tileSize) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, 512);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
    } else if (style === 'wood') {
      for (let i = 0; i < 512; i += 30) {
        ctx.strokeStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.1})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(512, i);
        ctx.stroke();
      }
    } else if (style === 'marble') {
      for (let i = 0; i < 50; i++) {
        ctx.strokeStyle = 'rgba(255,255,255,0.15)';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(Math.random() * 512, Math.random() * 512);
        ctx.bezierCurveTo(
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512,
          Math.random() * 512, Math.random() * 512
        );
        ctx.stroke();
      }
    }
    
    const texture = new THREE.CanvasTexture(canvas);
    texture.wrapS = THREE.RepeatWrapping;
    texture.wrapT = THREE.RepeatWrapping;
    texture.repeat.set(4, 4);
    return texture;
  };

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(
      roomDimensions.width * 0.8,
      roomDimensions.height * 0.8,
      roomDimensions.depth * 0.8
    );
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.8);
    light.position.set(10, 20, 10);
    light.castShadow = true;
    light.shadow.camera.left = -50;
    light.shadow.camera.right = 50;
    light.shadow.camera.top = 50;
    light.shadow.camera.bottom = -50;
    scene.add(light);

    // Floor
    const floorTexture = createFloorTexture(roomDimensions.floorStyle, roomDimensions.floorColor);
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ map: floorTexture })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    floorRef.current = floor;

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor,
      side: THREE.DoubleSide
    });

    // Back wall
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial
    );
    backWall.position.z = -roomDimensions.depth / 2;
    backWall.position.y = roomDimensions.height / 2;
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial
    );
    leftWall.position.x = -roomDimensions.width / 2;
    leftWall.position.y = roomDimensions.height / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial
    );
    rightWall.position.x = roomDimensions.width / 2;
    rightWall.position.y = roomDimensions.height / 2;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.DoubleSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomDimensions.height;
    scene.add(ceiling);

    roomRef.current = { backWall, leftWall, rightWall, ceiling, floor };

    // Mouse interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onMouseClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objects = Object.values(furnitureObjects.current);
      const intersects = raycaster.intersectObjects(objects, true);

      if (intersects.length > 0) {
        let obj = intersects[0].object;
        while (obj.parent && !obj.userData.furnitureId) {
          obj = obj.parent;
        }
        if (obj.userData.furnitureId) {
          const item = furniture.find(f => f.id === obj.userData.furnitureId);
          onSelect(item);
        }
      } else {
        onSelect(null);
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop
    let angle = 0;
    const animate = () => {
      requestAnimationFrame(animate);
      
      angle += 0.002;
      camera.position.x = Math.cos(angle) * roomDimensions.width * 0.8;
      camera.position.z = Math.sin(angle) * roomDimensions.depth * 0.8;
      camera.lookAt(0, roomDimensions.height / 3, 0);
      
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      window.removeEventListener('resize', handleResize);
      renderer.domElement.removeEventListener('click', onMouseClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update furniture
  useEffect(() => {
    if (!sceneRef.current) return;

    // Remove old furniture
    Object.values(furnitureObjects.current).forEach(obj => {
      sceneRef.current.remove(obj);
    });
    furnitureObjects.current = {};

    // Add new furniture
    furniture.forEach(item => {
      const obj = createFurnitureGeometry(item.type);
      obj.userData.furnitureId = item.id;
      
      obj.traverse(child => {
        if (child.isMesh) {
          child.material.color.set(item.color);
          child.castShadow = true;
          child.receiveShadow = true;
        }
      });

      obj.position.set(item.position.x, item.position.y, item.position.z);
      obj.rotation.y = (item.rotation || 0) * Math.PI / 180;
      obj.scale.setScalar(item.scale || 1);

      sceneRef.current.add(obj);
      furnitureObjects.current[item.id] = obj;
    });
  }, [furniture]);

  // Update selection highlight
  useEffect(() => {
    Object.entries(furnitureObjects.current).forEach(([id, obj]) => {
      const isSelected = selected?.id === id;
      obj.traverse(child => {
        if (child.isMesh) {
          child.material.emissive = isSelected ? new THREE.Color(0x4a9eff) : new THREE.Color(0x000000);
          child.material.emissiveIntensity = isSelected ? 0.3 : 0;
        }
      });
    });
  }, [selected]);

  // Update room
  useEffect(() => {
    if (!sceneRef.current || !roomRef.current || !floorRef.current) return;

    const scene = sceneRef.current;
    const { backWall, leftWall, rightWall, ceiling, floor } = roomRef.current;

    // Update floor
    scene.remove(floor);
    const floorTexture = createFloorTexture(roomDimensions.floorStyle, roomDimensions.floorColor);
    const newFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ map: floorTexture })
    );
    newFloor.rotation.x = -Math.PI / 2;
    newFloor.receiveShadow = true;
    scene.add(newFloor);
    roomRef.current.floor = newFloor;
    floorRef.current = newFloor;

    // Update walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor,
      side: THREE.DoubleSide
    });

    [backWall, leftWall, rightWall].forEach(wall => {
      wall.material = wallMaterial;
    });

    backWall.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height);
    backWall.position.z = -roomDimensions.depth / 2;
    backWall.position.y = roomDimensions.height / 2;

    leftWall.geometry = new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height);
    leftWall.position.x = -roomDimensions.width / 2;
    leftWall.position.y = roomDimensions.height / 2;

    rightWall.geometry = new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height);
    rightWall.position.x = roomDimensions.width / 2;
    rightWall.position.y = roomDimensions.height / 2;

    ceiling.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
    ceiling.position.y = roomDimensions.height;

    // Update camera position
    if (cameraRef.current) {
      const angle = Math.atan2(cameraRef.current.position.z, cameraRef.current.position.x);
      cameraRef.current.position.x = Math.cos(angle) * roomDimensions.width * 0.8;
      cameraRef.current.position.y = roomDimensions.height * 0.8;
      cameraRef.current.position.z = Math.sin(angle) * roomDimensions.depth * 0.8;
    }
  }, [roomDimensions]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.8)',
        padding: '15px',
        borderRadius: '8px',
        fontSize: '12px',
        color: '#aaa',
        zIndex: 10
      }}>
        <div style={{fontWeight: 'bold', color: '#4a9eff', marginBottom: '8px'}}>3D View</div>
        <div>• Auto-rotating camera</div>
        <div>• Click to select furniture</div>
        <div>• Switch to 2D for editing</div>
      </div>
    </div>
  );
};

export default ThreeScene;