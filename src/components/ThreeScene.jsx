import { useEffect, useRef, useCallback } from "react";
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
  const loaderRef = useRef(new GLTFLoader());
  const updateInProgress = useRef(false);

  const updateWallVisibility = useCallback(() => {
    if (!cameraRef.current || !roomRef.current) return;
    
    const camera = cameraRef.current;
    const { backWall, leftWall, rightWall, frontWall, ceiling } = roomRef.current;
    
    const camPos = camera.position;
    const halfWidth = roomDimensions.width / 2;
    const halfDepth = roomDimensions.depth / 2;
    
    frontWall.visible = !(camPos.z > halfDepth);
    backWall.visible = !(camPos.z < -halfDepth);
    rightWall.visible = !(camPos.x > halfWidth);
    leftWall.visible = !(camPos.x < -halfWidth);
    ceiling.visible = !(camPos.y > roomDimensions.height);
  }, [roomDimensions.width, roomDimensions.depth, roomDimensions.height]);

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
      roomDimensions.width * 1.2,
      roomDimensions.height * 1.2,
      roomDimensions.depth * 1.5
    );
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    // FIXED: Better renderer settings for smooth shadows
    const renderer = new THREE.WebGLRenderer({ 
      antialias: true,
      powerPreference: "high-performance" 
    });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit for performance
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; // Smooth shadows!
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const orbitControls = new OrbitControls(camera, renderer.domElement);
    orbitControls.enableDamping = true;
    orbitControls.dampingFactor = 0.05;
    orbitControls.minDistance = 3;
    orbitControls.maxDistance = 100;
    orbitControls.target.set(0, 0, 0);
    orbitControls.update();
    orbitControlsRef.current = orbitControls;

    orbitControls.addEventListener('change', updateWallVisibility);

    const transformControls = new TransformControls(camera, renderer.domElement);
    transformControls.setMode('translate');
    transformControls.setSpace('world');
    transformControls.setSize(1.2); // Make gizmo bigger
    scene.add(transformControls);
    transformControlsRef.current = transformControls;

    // CRITICAL: Disable orbit when dragging transform
    transformControls.addEventListener('dragging-changed', (event) => {
      orbitControls.enabled = !event.value;
      
      if (!event.value) {
        // Dragging finished - save the changes
        const obj = transformControls.object;
        if (obj && obj.userData.furnitureId && !updateInProgress.current) {
          updateInProgress.current = true;
          const id = obj.userData.furnitureId;
          
          // Batch update after a short delay
          setTimeout(() => {
            onUpdateFurniture(id, {
              position: { 
                x: parseFloat(obj.position.x.toFixed(2)), 
                y: parseFloat(obj.position.y.toFixed(2)), 
                z: parseFloat(obj.position.z.toFixed(2))
              },
              rotation: parseFloat(((obj.rotation.y * 180 / Math.PI) % 360).toFixed(1)),
              scale: parseFloat(obj.scale.x.toFixed(2))
            });
            updateInProgress.current = false;
          }, 50);
        }
      }
    });

    // Keyboard shortcuts
    const handleKeyDown = (event) => {
      const tc = transformControlsRef.current;
      if (!tc || !tc.object) return;
      
      if (event.key === 'g' || event.key === 'G') {
        event.preventDefault();
        tc.setMode('translate');
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        tc.setMode('rotate');
      } else if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        tc.setMode('scale');
      } else if (event.key === 'Delete' || event.key === 'Backspace') {
        event.preventDefault();
        if (selected) {
          tc.detach();
          onSelect(null);
          // Delete via the delete handler
          setTimeout(() => {
            onUpdateFurniture(selected.id, { _shouldDelete: true });
          }, 10);
        }
      }
    };
    window.addEventListener('keydown', handleKeyDown);

    // FIXED: Better lighting for smooth shadows
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    
    const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight1.position.set(10, 20, 10);
    dirLight1.castShadow = true;
    // FIXED: Larger shadow map for smoother shadows
    dirLight1.shadow.mapSize.width = 4096;  // Increased from 2048
    dirLight1.shadow.mapSize.height = 4096; // Increased from 2048
    dirLight1.shadow.camera.left = -50;
    dirLight1.shadow.camera.right = 50;
    dirLight1.shadow.camera.top = 50;
    dirLight1.shadow.camera.bottom = -50;
    dirLight1.shadow.camera.near = 0.5;
    dirLight1.shadow.camera.far = 100;
    dirLight1.shadow.bias = -0.0001; // Reduce shadow acne
    dirLight1.shadow.radius = 4; // Blur shadow edges
    scene.add(dirLight1);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-10, 15, -10);
    scene.add(dirLight2);

    // Floor texture
    const createFloorTexture = (style, color) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color || '#d4b896';
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
      } else if (style === 'carpet') {
        const imageData = ctx.getImageData(0, 0, 512, 512);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = Math.random() * 20 - 10;
          imageData.data[i] += noise;
          imageData.data[i + 1] += noise;
          imageData.data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        map: createFloorTexture(roomDimensions.floorStyle, roomDimensions.floorColor) 
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.DoubleSide
    });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial.clone()
    );
    backWall.position.z = -roomDimensions.depth / 2;
    backWall.position.y = roomDimensions.height / 2;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial.clone()
    );
    leftWall.position.x = -roomDimensions.width / 2;
    leftWall.position.y = roomDimensions.height / 2;
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial.clone()
    );
    rightWall.position.x = roomDimensions.width / 2;
    rightWall.position.y = roomDimensions.height / 2;
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial.clone()
    );
    frontWall.position.z = roomDimensions.depth / 2;
    frontWall.position.y = roomDimensions.height / 2;
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5, 
        side: THREE.DoubleSide
      })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomDimensions.height;
    scene.add(ceiling);

    roomRef.current = { backWall, leftWall, rightWall, frontWall, ceiling, floor };
    updateWallVisibility();

    // Mouse click to select
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    let clickStartTime = 0;

    const onMouseDown = () => {
      clickStartTime = Date.now();
    };

    const onMouseUp = (event) => {
      const clickDuration = Date.now() - clickStartTime;
      if (clickDuration > 200) return; // Was a drag, not a click
      
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
          console.log('Selected:', item);
          onSelect(item);
          transformControls.attach(obj);
          transformControls.setMode('translate');
        }
      } else {
        console.log('Deselected');
        onSelect(null);
        transformControls.detach();
      }
    };

    renderer.domElement.addEventListener('mousedown', onMouseDown);
    renderer.domElement.addEventListener('mouseup', onMouseUp);

    // Animation loop
    const animate = () => {
      requestAnimationFrame(animate);
      orbitControls.update();
      updateWallVisibility();
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
      renderer.domElement.removeEventListener('mousedown', onMouseDown);
      renderer.domElement.removeEventListener('mouseup', onMouseUp);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // Load furniture models - only when new items added
  useEffect(() => {
    if (!sceneRef.current) return;

    const scene = sceneRef.current;
    const loader = loaderRef.current;

    console.log('Furniture effect triggered. Count:', furniture.length);

    // Remove deleted items
    const currentIds = new Set(Object.keys(furnitureObjects.current));
    const newIds = new Set(furniture.filter(f => !f._shouldDelete).map(f => f.id));

    currentIds.forEach(id => {
      if (!newIds.has(id)) {
        console.log('Removing:', id);
        const obj = furnitureObjects.current[id];
        scene.remove(obj);
        delete furnitureObjects.current[id];
      }
    });

    // Load new items
    furniture.forEach(item => {
      if (item._shouldDelete) return;
      if (furnitureObjects.current[item.id]) {
        // Already loaded, just update transform
        const obj = furnitureObjects.current[item.id];
        if (!updateInProgress.current) {
          obj.position.set(item.position.x, item.position.y || 0, item.position.z);
          obj.rotation.y = (item.rotation || 0) * Math.PI / 180;
          obj.scale.setScalar(item.scale || 1);
          
          // Update color
          obj.traverse(child => {
            if (child.isMesh && item.color) {
              if (Array.isArray(child.material)) {
                child.material.forEach(mat => mat.color.set(item.color));
              } else {
                child.material.color.set(item.color);
              }
            }
          });
        }
        return;
      }
      
      console.log('Loading new item:', item.type, item.id);
      const modelPath = `/models/${item.type}.glb`;
      
      loader.load(
        modelPath,
        (gltf) => {
          console.log('Model loaded:', item.type);
          const model = gltf.scene;
          
          const wrapper = new THREE.Group();
          wrapper.userData.furnitureId = item.id;
          wrapper.add(model);

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          
          const targetHeight = 1.0;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          box.setFromObject(model);
          model.position.y = -box.min.y;

          wrapper.position.set(item.position.x, item.position.y || 0, item.position.z);
          wrapper.rotation.y = (item.rotation || 0) * Math.PI / 180;
          wrapper.scale.setScalar(item.scale || 1);

          model.traverse(child => {
            if (child.isMesh) {
              child.castShadow = true;
              child.receiveShadow = true;
              if (item.color) {
                if (Array.isArray(child.material)) {
                  child.material.forEach(mat => mat.color.set(item.color));
                } else {
                  child.material.color.set(item.color);
                }
              }
            }
          });

          scene.add(wrapper);
          furnitureObjects.current[item.id] = wrapper;
          console.log('Added to scene:', item.id);

          if (selected && selected.id === item.id && transformControlsRef.current) {
            console.log('Auto-attaching to:', item.id);
            transformControlsRef.current.attach(wrapper);
          }
        },
        undefined,
        (error) => {
          console.error(`Failed to load ${modelPath}:`, error);
        }
      );
    });
  }, [furniture, selected]);

  // Update selection highlight
  useEffect(() => {
    Object.entries(furnitureObjects.current).forEach(([id, wrapper]) => {
      const isSelected = selected?.id === id;
      wrapper.traverse(child => {
        if (child.isMesh) {
          child.material.emissive = isSelected ? new THREE.Color(0x4a9eff) : new THREE.Color(0x000000);
          child.material.emissiveIntensity = isSelected ? 0.4 : 0;
        }
      });
    });

    if (selected && furnitureObjects.current[selected.id] && transformControlsRef.current) {
      transformControlsRef.current.attach(furnitureObjects.current[selected.id]);
    } else if (!selected && transformControlsRef.current) {
      transformControlsRef.current.detach();
    }
  }, [selected]);

  // Update room
  useEffect(() => {
    if (!sceneRef.current || !roomRef.current) return;

    const scene = sceneRef.current;
    const { backWall, leftWall, rightWall, frontWall, ceiling, floor } = roomRef.current;

    scene.remove(floor);
    const createFloorTexture = (style, color) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color || '#d4b896';
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
      } else if (style === 'carpet') {
        const imageData = ctx.getImageData(0, 0, 512, 512);
        for (let i = 0; i < imageData.data.length; i += 4) {
          const noise = Math.random() * 20 - 10;
          imageData.data[i] += noise;
          imageData.data[i + 1] += noise;
          imageData.data[i + 2] += noise;
        }
        ctx.putImageData(imageData, 0, 0);
      }
      
      const texture = new THREE.CanvasTexture(canvas);
      texture.wrapS = THREE.RepeatWrapping;
      texture.wrapT = THREE.RepeatWrapping;
      texture.repeat.set(4, 4);
      return texture;
    };

    const newFloor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        map: createFloorTexture(roomDimensions.floorStyle, roomDimensions.floorColor) 
      })
    );
    newFloor.rotation.x = -Math.PI / 2;
    newFloor.receiveShadow = true;
    scene.add(newFloor);
    roomRef.current.floor = newFloor;

    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.DoubleSide
    });

    [backWall, leftWall, rightWall, frontWall].forEach(wall => {
      wall.material = wallMaterial.clone();
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

    frontWall.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height);
    frontWall.position.z = roomDimensions.depth / 2;
    frontWall.position.y = roomDimensions.height / 2;

    ceiling.geometry = new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth);
    ceiling.position.y = roomDimensions.height;

    updateWallVisibility();
  }, [roomDimensions, updateWallVisibility]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;