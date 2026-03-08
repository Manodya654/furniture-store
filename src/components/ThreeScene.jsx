import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

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
  const loaderRef = useRef(new GLTFLoader());

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene setup
    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);

    // Camera setup - positioned to see room from front-top angle
    const camera = new THREE.PerspectiveCamera(
      60,
      container.clientWidth / container.clientHeight,
      0.1,
      1000
    );
    camera.position.set(
      roomDimensions.width * 1.2,
      roomDimensions.height * 1.2,
      roomDimensions.depth * 1.5
    );
    camera.lookAt(0, roomDimensions.height / 3, 0);
    cameraRef.current = camera;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 3;
    orbitControls.maxDistance = 100;
    orbitControls.maxPolarAngle = Math.PI / 2 - 0.05;
    orbitControls.target.set(0, roomDimensions.height / 3, 0);
    orbitControls.update();
    orbitControlsRef.current = orbitControls;

    // TransformControls
    const transformControls = new TransformControls(camera, renderer.domElement);
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
    });

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
      if (!transformControls.object) return;
      
      if (event.key === 'g' || event.key === 'G') {
        event.preventDefault();
        transformControls.setMode('translate');
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        transformControls.setMode('rotate');
      } else if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        transformControls.setMode('scale');
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        const id = transformControls.object.userData.furnitureId;
        transformControls.detach();
        onSelect(null);
        // Delete through parent
        const furnitureToDelete = furniture.find(f => f.id === id);
        if (furnitureToDelete && onUpdateFurniture) {
          // Signal deletion
          setTimeout(() => {
            const currentFurniture = furniture.filter(f => f.id !== id);
            // This assumes parent has handleDeleteFurniture
          }, 10);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // Lighting - bright from multiple angles
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.8);
    dirLight1.position.set(10, 20, 10);
    dirLight1.castShadow = true;
    dirLight1.shadow.camera.left = -30;
    dirLight1.shadow.camera.right = 30;
    dirLight1.shadow.camera.top = 30;
    dirLight1.shadow.camera.bottom = -30;
    dirLight1.shadow.mapSize.width = 2048;
    dirLight1.shadow.mapSize.height = 2048;
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.4);
    dirLight2.position.set(-10, 15, -10);
    scene.add(dirLight2);

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(
      roomDimensions.width,
      roomDimensions.depth
    );
    
    // Create floor texture
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const ctx = floorCanvas.getContext('2d');
    ctx.fillStyle = roomDimensions.floorColor || '#8B7355';
    ctx.fillRect(0, 0, 512, 512);
    
    // Add tile pattern
    if (roomDimensions.floorStyle === 'tiles') {
      const tileSize = 128;
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 3;
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
    }
    
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    
    const floor = new THREE.Mesh(
      floorGeometry,
      new THREE.MeshStandardMaterial({ map: floorTexture })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);
    floorRef.current = floor;

    // Walls - FRONT WALL IS TRANSPARENT!
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.DoubleSide,
      transparent: false
    });

    // Back wall (behind)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial.clone()
    );
    backWall.position.z = -roomDimensions.depth / 2;
    backWall.position.y = roomDimensions.height / 2;
    scene.add(backWall);

    // Left wall
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial.clone()
    );
    leftWall.position.x = -roomDimensions.width / 2;
    leftWall.position.y = roomDimensions.height / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    // Right wall
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial.clone()
    );
    rightWall.position.x = roomDimensions.width / 2;
    rightWall.position.y = roomDimensions.height / 2;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    // FRONT WALL - Make it invisible so we can see inside!
    // We don't add it or make it fully transparent

    // Ceiling - semi-transparent
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5, 
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.3
      })
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

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      orbitControls.update();
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

  // Update furniture - LOAD GLB MODELS!
  useEffect(() => {
    if (!sceneRef.current || !furniture) return;

    const scene = sceneRef.current;
    const loader = loaderRef.current;

    // Remove old furniture
    Object.values(furnitureObjects.current).forEach(obj => {
      scene.remove(obj);
    });
    furnitureObjects.current = {};

    // Add new furniture from GLB files
    furniture.forEach(item => {
      const modelPath = `/models/${item.type}.glb`;
      
      loader.load(
        modelPath,
        (gltf) => {
          const model = gltf.scene;
          
          // Create wrapper group
          const wrapper = new THREE.Group();
          wrapper.userData.furnitureId = item.id;
          wrapper.add(model);

          // Get bounding box to position on floor
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          
          // Scale model to reasonable size (about 1 meter tall)
          const targetHeight = 1.0;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          // Position model so bottom is at Y=0
          box.setFromObject(model);
          const min = box.min;
          model.position.y = -min.y;

          // Apply furniture properties
          wrapper.position.set(
            item.position.x,
            item.position.y || 0,  // Y should be 0 for floor
            item.position.z
          );
          wrapper.rotation.y = (item.rotation || 0) * Math.PI / 180;
          wrapper.scale.setScalar(item.scale || 1);

          // Apply color to all meshes
          model.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (item.color) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => {
                    mat.color.set(item.color);
                  });
                } else {
                  child.material.color.set(item.color);
                }
              }
            }
          });

          scene.add(wrapper);
          furnitureObjects.current[item.id] = wrapper;

          // If this is the selected item, attach transform controls
          if (selected && selected.id === item.id && transformControlsRef.current) {
            transformControlsRef.current.attach(wrapper);
          }
        },
        undefined,
        (error) => {
          console.error(`Error loading ${modelPath}:`, error);
          // Fallback to simple cube if model doesn't load
          const geometry = new THREE.BoxGeometry(0.5, 1, 0.5);
          const material = new THREE.MeshStandardMaterial({ color: item.color || '#8B7355' });
          const cube = new THREE.Mesh(geometry, material);
          cube.castShadow = true;
          cube.receiveShadow = true;
          
          const wrapper = new THREE.Group();
          wrapper.userData.furnitureId = item.id;
          wrapper.add(cube);
          wrapper.position.set(item.position.x, 0, item.position.z);
          wrapper.rotation.y = (item.rotation || 0) * Math.PI / 180;
          wrapper.scale.setScalar(item.scale || 1);
          
          scene.add(wrapper);
          furnitureObjects.current[item.id] = wrapper;
        }
      );
    });
  }, [furniture]);

  // Update selection highlight
  useEffect(() => {
    if (!furnitureObjects.current) return;
    
    Object.entries(furnitureObjects.current).forEach(([id, wrapper]) => {
      const isSelected = selected?.id === id;
      wrapper.traverse(child => {
        if (child.isMesh) {
          child.material.emissive = isSelected ? new THREE.Color(0x4a9eff) : new THREE.Color(0x000000);
          child.material.emissiveIntensity = isSelected ? 0.2 : 0;
        }
      });
    });

    // Attach/detach transform controls
    if (selected && furnitureObjects.current[selected.id] && transformControlsRef.current) {
      transformControlsRef.current.attach(furnitureObjects.current[selected.id]);
    } else if (!selected && transformControlsRef.current) {
      transformControlsRef.current.detach();
    }
  }, [selected]);

  // Update room when dimensions change
  useEffect(() => {
    if (!sceneRef.current || !roomRef.current || !floorRef.current) return;

    const scene = sceneRef.current;
    const { backWall, leftWall, rightWall, ceiling, floor } = roomRef.current;

    // Update floor
    scene.remove(floor);
    const floorCanvas = document.createElement('canvas');
    floorCanvas.width = 512;
    floorCanvas.height = 512;
    const ctx = floorCanvas.getContext('2d');
    ctx.fillStyle = roomDimensions.floorColor || '#8B7355';
    ctx.fillRect(0, 0, 512, 512);
    
    if (roomDimensions.floorStyle === 'tiles') {
      const tileSize = 128;
      ctx.strokeStyle = 'rgba(0,0,0,0.15)';
      ctx.lineWidth = 3;
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
    }
    
    const floorTexture = new THREE.CanvasTexture(floorCanvas);
    floorTexture.wrapS = THREE.RepeatWrapping;
    floorTexture.wrapT = THREE.RepeatWrapping;
    floorTexture.repeat.set(4, 4);
    
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

    backWall.material = wallMaterial.clone();
    backWall.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height);
    backWall.position.z = -roomDimensions.depth / 2;
    backWall.position.y = roomDimensions.height / 2;

    leftWall.material = wallMaterial.clone();
    leftWall.geometry = new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height);
    leftWall.position.x = -roomDimensions.width / 2;
    leftWall.position.y = roomDimensions.height / 2;

    rightWall.material = wallMaterial.clone();
    rightWall.geometry = new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height);
    rightWall.position.x = roomDimensions.width / 2;
    rightWall.position.y = roomDimensions.height / 2;

    ceiling.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
    ceiling.position.y = roomDimensions.height;

    // Update camera position
    if (cameraRef.current) {
      cameraRef.current.position.set(
        roomDimensions.width * 1.2,
        roomDimensions.height * 1.2,
        roomDimensions.depth * 1.5
      );
      cameraRef.current.lookAt(0, roomDimensions.height / 3, 0);
    }
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
          <strong>Keyboard:</strong> G (move) • R (rotate) • S (scale) • Del (delete)
        </div>
      </div>
    </div>
  );
};

export default ThreeScene;