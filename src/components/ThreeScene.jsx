import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const ThreeScene = ({ onSelect, selected, roomDimensions, furniture, onUpdateFurniture }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const orbitControlsRef = useRef(null);
  const transformControlsRef = useRef(null);
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
      },
      lamp: () => {
        const group = new THREE.Group();
        const base = new THREE.Mesh(
          new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16),
          new THREE.MeshStandardMaterial()
        );
        base.position.y = 0.05;
        const pole = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.8, 8),
          new THREE.MeshStandardMaterial()
        );
        pole.position.y = 0.45;
        const shade = new THREE.Mesh(
          new THREE.ConeGeometry(0.2, 0.3, 16),
          new THREE.MeshStandardMaterial()
        );
        shade.position.y = 0.95;
        group.add(base, pole, shade);
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

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);

    // Camera setup - STATIC POSITION, NO AUTO-ROTATION
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(8, 6, 8);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // Renderer setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls - USER CONTROLS THE CAMERA
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 3;
    orbitControls.maxDistance = 50;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.1;
    orbitControls.target.set(0, 1, 0);
    orbitControls.update();
    orbitControlsRef.current = orbitControls;

    // TransformControls - FOR MOVING FURNITURE
    const transformControls = new TransformControls(camera, renderer.domElement);
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    // Disable orbit when using transform
    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
    });

    // Update furniture when transforming
    transformControls.addEventListener('objectChange', () => {
      if (transformControls.object && transformControls.object.userData.furnitureId) {
        const id = transformControls.object.userData.furnitureId;
        const pos = transformControls.object.position;
        const rot = transformControls.object.rotation;
        const scl = transformControls.object.scale;
        
        onUpdateFurniture(id, {
          position: { x: pos.x, y: pos.y, z: pos.z },
          rotation: (rot.y * 180 / Math.PI) % 360,
          scale: scl.x
        });
      }
    });

    // Keyboard shortcuts
    const handleKeyDown = (event) => {
      if (event.key === 'g' || event.key === 'G') {
        transformControls.setMode('translate');
      } else if (event.key === 'r' || event.key === 'R') {
        transformControls.setMode('rotate');
      } else if (event.key === 's' || event.key === 'S') {
        transformControls.setMode('scale');
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        if (transformControls.object && transformControls.object.userData.furnitureId) {
          const id = transformControls.object.userData.furnitureId;
          onUpdateFurniture(id, null);
          transformControls.detach();
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.camera.left = -20;
    dirLight.shadow.camera.right = 20;
    dirLight.shadow.camera.top = 20;
    dirLight.shadow.camera.bottom = -20;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Floor
    const floorTexture = createFloorTexture(
      roomDimensions.floorStyle || 'tiles',
      roomDimensions.floorColor || '#d4b896'
    );
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
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.DoubleSide
    });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial
    );
    backWall.position.z = -roomDimensions.depth / 2;
    backWall.position.y = roomDimensions.height / 2;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial
    );
    leftWall.position.x = -roomDimensions.width / 2;
    leftWall.position.y = roomDimensions.height / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial
    );
    rightWall.position.x = roomDimensions.width / 2;
    rightWall.position.y = roomDimensions.height / 2;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

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
          transformControls.attach(obj);
        }
      } else {
        onSelect(null);
        transformControls.detach();
      }
    };

    renderer.domElement.addEventListener('click', onMouseClick);

    // Animation loop - NO AUTO-ROTATION, ONLY UPDATE CONTROLS
    const animate = () => {
      requestAnimationFrame(animate);
      orbitControls.update(); // Only update orbit controls
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
      window.removeEventListener('keydown', handleKeyDown);
      renderer.domElement.removeEventListener('click', onMouseClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Update furniture
  useEffect(() => {
    if (!sceneRef.current || !furniture) return;

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
    if (!selected || !furnitureObjects.current) return;
    
    Object.entries(furnitureObjects.current).forEach(([id, obj]) => {
      const isSelected = selected?.id === id;
      obj.traverse(child => {
        if (child.isMesh) {
          child.material.emissive = isSelected ? new THREE.Color(0x4a9eff) : new THREE.Color(0x000000);
          child.material.emissiveIntensity = isSelected ? 0.3 : 0;
        }
      });
    });

    // Attach transform controls to selected object
    if (selected && furnitureObjects.current[selected.id] && transformControlsRef.current) {
      transformControlsRef.current.attach(furnitureObjects.current[selected.id]);
    }
  }, [selected]);

  // Update room
  useEffect(() => {
    if (!sceneRef.current || !roomRef.current || !floorRef.current) return;

    const scene = sceneRef.current;
    const { backWall, leftWall, rightWall, ceiling, floor } = roomRef.current;

    // Update floor
    scene.remove(floor);
    const floorTexture = createFloorTexture(
      roomDimensions.floorStyle || 'tiles',
      roomDimensions.floorColor || '#d4b896'
    );
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
      color: roomDimensions.wallColor || '#e8e8e8',
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
  }, [roomDimensions]);

  return (
    <div ref={mountRef} style={{ width: "100%", height: "100%" }}>
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '20px',
        background: 'rgba(0,0,0,0.85)',
        padding: '18px 22px',
        borderRadius: '12px',
        fontSize: '12px',
        color: '#aaa',
        zIndex: 10,
        border: '1px solid #333',
        backdropFilter: 'blur(10px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
      }}>
        <div style={{fontWeight: 'bold', color: '#4a9eff', marginBottom: '12px', fontSize: '14px'}}>
          🎮 3D View Controls
        </div>
        <div style={{marginBottom: '5px'}}>• <strong>Left Drag:</strong> Rotate view</div>
        <div style={{marginBottom: '5px'}}>• <strong>Right Drag:</strong> Pan view</div>
        <div style={{marginBottom: '5px'}}>• <strong>Scroll:</strong> Zoom</div>
        <div style={{marginBottom: '5px'}}>• <strong>Click Object:</strong> Select</div>
        <div style={{marginTop: '12px', paddingTop: '12px', borderTop: '1px solid #444', fontSize: '11px'}}>
          <strong>Keyboard:</strong> G (move) • R (rotate) • S (scale)
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;