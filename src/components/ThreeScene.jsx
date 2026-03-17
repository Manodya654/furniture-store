import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const ThreeScene = ({ onSelect, selected, roomDimensions, furniture, onUpdateFurniture }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const transformRef = useRef(null);
  
  // Map furniture id -> THREE.Group
  const furnitureMapRef = useRef({});
  // Track which IDs we've already created meshes for
  const createdIdsRef = useRef(new Set());
  // Flag to prevent feedback loops
  const isUpdatingFromDrag = useRef(false);

  // Create a simple mesh for a furniture type (no GLTF needed)
  const createFurnitureMesh = useCallback((item) => {
    const wrapper = new THREE.Group();
    wrapper.userData.furnitureId = item.id;
    wrapper.userData.furnitureType = item.type;

    let geometry, material, mesh;
    const color = item.color || '#8B7355';

    switch (item.type) {
      case 'chair': {
        // Seat
        const seatGeo = new THREE.BoxGeometry(0.5, 0.05, 0.5);
        const seatMat = new THREE.MeshStandardMaterial({ color });
        const seat = new THREE.Mesh(seatGeo, seatMat);
        seat.position.y = 0.45;
        seat.castShadow = true;
        seat.receiveShadow = true;
        wrapper.add(seat);

        // Back
        const backGeo = new THREE.BoxGeometry(0.5, 0.5, 0.05);
        const backMat = new THREE.MeshStandardMaterial({ color });
        const back = new THREE.Mesh(backGeo, backMat);
        back.position.set(0, 0.7, -0.225);
        back.castShadow = true;
        wrapper.add(back);

        // Legs
        const legGeo = new THREE.CylinderGeometry(0.02, 0.02, 0.45);
        const legMat = new THREE.MeshStandardMaterial({ color: '#5a4a3a' });
        const positions = [[-0.2, 0.225, -0.2], [0.2, 0.225, -0.2], [-0.2, 0.225, 0.2], [0.2, 0.225, 0.2]];
        positions.forEach(pos => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(...pos);
          leg.castShadow = true;
          wrapper.add(leg);
        });
        break;
      }
      case 'table': {
        const topGeo = new THREE.BoxGeometry(1.5, 0.08, 1.0);
        const topMat = new THREE.MeshStandardMaterial({ color });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 0.75;
        top.castShadow = true;
        top.receiveShadow = true;
        wrapper.add(top);

        const legGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.75);
        const legMat = new THREE.MeshStandardMaterial({ color: '#5a4a3a' });
        [[-0.65, 0.375, -0.4], [0.65, 0.375, -0.4], [-0.65, 0.375, 0.4], [0.65, 0.375, 0.4]].forEach(pos => {
          const leg = new THREE.Mesh(legGeo, legMat);
          leg.position.set(...pos);
          leg.castShadow = true;
          wrapper.add(leg);
        });
        break;
      }
      case 'sofa': {
        // Base
        const baseGeo = new THREE.BoxGeometry(2.0, 0.4, 0.85);
        const baseMat = new THREE.MeshStandardMaterial({ color });
        const base = new THREE.Mesh(baseGeo, baseMat);
        base.position.y = 0.3;
        base.castShadow = true;
        base.receiveShadow = true;
        wrapper.add(base);

        // Back cushion
        const backGeo = new THREE.BoxGeometry(2.0, 0.45, 0.15);
        const backMat = new THREE.MeshStandardMaterial({ color });
        const backCushion = new THREE.Mesh(backGeo, backMat);
        backCushion.position.set(0, 0.55, -0.35);
        backCushion.castShadow = true;
        wrapper.add(backCushion);

        // Armrests
        const armGeo = new THREE.BoxGeometry(0.12, 0.35, 0.85);
        const armMat = new THREE.MeshStandardMaterial({ color });
        [-1.06, 1.06].forEach(x => {
          const arm = new THREE.Mesh(armGeo, armMat);
          arm.position.set(x, 0.4, 0);
          arm.castShadow = true;
          wrapper.add(arm);
        });
        break;
      }
      case 'bed': {
        // Mattress
        const mattGeo = new THREE.BoxGeometry(1.8, 0.3, 2.2);
        const mattMat = new THREE.MeshStandardMaterial({ color: '#f0f0f0' });
        const mattress = new THREE.Mesh(mattGeo, mattMat);
        mattress.position.y = 0.35;
        mattress.castShadow = true;
        mattress.receiveShadow = true;
        wrapper.add(mattress);

        // Frame
        const frameGeo = new THREE.BoxGeometry(1.9, 0.2, 2.3);
        const frameMat = new THREE.MeshStandardMaterial({ color });
        const frame = new THREE.Mesh(frameGeo, frameMat);
        frame.position.y = 0.15;
        frame.castShadow = true;
        wrapper.add(frame);

        // Headboard
        const headGeo = new THREE.BoxGeometry(1.9, 0.8, 0.08);
        const headMat = new THREE.MeshStandardMaterial({ color });
        const headboard = new THREE.Mesh(headGeo, headMat);
        headboard.position.set(0, 0.6, -1.15);
        headboard.castShadow = true;
        wrapper.add(headboard);

        // Pillow
        const pillowGeo = new THREE.BoxGeometry(0.6, 0.1, 0.35);
        const pillowMat = new THREE.MeshStandardMaterial({ color: '#ffffff' });
        [-0.4, 0.4].forEach(x => {
          const pillow = new THREE.Mesh(pillowGeo, pillowMat);
          pillow.position.set(x, 0.55, -0.8);
          pillow.castShadow = true;
          wrapper.add(pillow);
        });
        break;
      }
      case 'desk': {
        const topGeo = new THREE.BoxGeometry(1.2, 0.05, 0.6);
        const topMat = new THREE.MeshStandardMaterial({ color });
        const top = new THREE.Mesh(topGeo, topMat);
        top.position.y = 0.75;
        top.castShadow = true;
        top.receiveShadow = true;
        wrapper.add(top);

        // Side panels
        const sideGeo = new THREE.BoxGeometry(0.04, 0.7, 0.6);
        const sideMat = new THREE.MeshStandardMaterial({ color });
        [-0.58, 0.58].forEach(x => {
          const side = new THREE.Mesh(sideGeo, sideMat);
          side.position.set(x, 0.375, 0);
          side.castShadow = true;
          wrapper.add(side);
        });

        // Drawer
        const drawerGeo = new THREE.BoxGeometry(0.5, 0.15, 0.55);
        const drawerMat = new THREE.MeshStandardMaterial({ color: '#6a5a4a' });
        const drawer = new THREE.Mesh(drawerGeo, drawerMat);
        drawer.position.set(0.3, 0.6, 0);
        drawer.castShadow = true;
        wrapper.add(drawer);
        break;
      }
      case 'lamp': {
        // Base
        const baseGeo = new THREE.CylinderGeometry(0.15, 0.2, 0.05, 16);
        const baseMat = new THREE.MeshStandardMaterial({ color: '#333' });
        const lampBase = new THREE.Mesh(baseGeo, baseMat);
        lampBase.position.y = 0.025;
        lampBase.castShadow = true;
        wrapper.add(lampBase);

        // Pole
        const poleGeo = new THREE.CylinderGeometry(0.02, 0.02, 1.2, 8);
        const poleMat = new THREE.MeshStandardMaterial({ color: '#666' });
        const pole = new THREE.Mesh(poleGeo, poleMat);
        pole.position.y = 0.65;
        pole.castShadow = true;
        wrapper.add(pole);

        // Shade
        const shadeGeo = new THREE.ConeGeometry(0.25, 0.3, 16, 1, true);
        const shadeMat = new THREE.MeshStandardMaterial({ color: color || '#f5e6d3', side: THREE.DoubleSide });
        const shade = new THREE.Mesh(shadeGeo, shadeMat);
        shade.position.y = 1.3;
        shade.castShadow = true;
        wrapper.add(shade);

        // Light bulb glow
        const bulbGeo = new THREE.SphereGeometry(0.05, 8, 8);
        const bulbMat = new THREE.MeshStandardMaterial({ color: '#fff9e6', emissive: '#fff9e6', emissiveIntensity: 0.5 });
        const bulb = new THREE.Mesh(bulbGeo, bulbMat);
        bulb.position.y = 1.18;
        wrapper.add(bulb);
        break;
      }
      default: {
        geometry = new THREE.BoxGeometry(0.8, 0.8, 0.8);
        material = new THREE.MeshStandardMaterial({ color });
        mesh = new THREE.Mesh(geometry, material);
        mesh.position.y = 0.4;
        mesh.castShadow = true;
        mesh.receiveShadow = true;
        wrapper.add(mesh);
      }
    }

    return wrapper;
  }, []);

  // Initialize the scene ONCE
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      75,
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

    // Renderer
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    // OrbitControls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controlsRef.current = controls;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));

    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.left = -30;
    dirLight.shadow.camera.right = 30;
    dirLight.shadow.camera.top = 30;
    dirLight.shadow.camera.bottom = -30;
    scene.add(dirLight);

    const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.3);
    dirLight2.position.set(-10, 15, -10);
    scene.add(dirLight2);

    // TransformControls
    const transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    
    // When user finishes dragging in 3D, update the React state
    transformControl.addEventListener('objectChange', () => {
      const obj = transformControl.object;
      if (obj && obj.userData.furnitureId) {
        isUpdatingFromDrag.current = true;
        onUpdateFurniture(obj.userData.furnitureId, {
          position: {
            x: obj.position.x,
            y: obj.position.y,
            z: obj.position.z
          },
          rotation: obj.rotation.y * (180 / Math.PI),
          scale: obj.scale.x
        });
        // Reset flag after a tick
        requestAnimationFrame(() => {
          isUpdatingFromDrag.current = false;
        });
      }
    });
    
    scene.add(transformControl);
    transformRef.current = transformControl;

    // Animation
    let animFrameId;
    const animate = () => {
      animFrameId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    // Keyboard shortcuts
    const onKey = (e) => {
      if (e.key === 'g' || e.key === 'G') {
        e.preventDefault();
        transformControl.setMode('translate');
      } else if (e.key === 'r' || e.key === 'R') {
        e.preventDefault();
        transformControl.setMode('rotate');
      } else if (e.key === 's' || e.key === 'S') {
        e.preventDefault();
        transformControl.setMode('scale');
      }
    };
    window.addEventListener('keydown', onKey);

    // Expose mode setter
    window.setMode = (mode) => {
      transformControl.setMode(mode);
    };

    return () => {
      cancelAnimationFrame(animFrameId);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      transformControl.dispose();
      controls.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      sceneRef.current = null;
      furnitureMapRef.current = {};
      createdIdsRef.current.clear();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Rebuild room (walls/floor) when roomDimensions change
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old room elements
    const toRemove = [];
    scene.children.forEach(child => {
      if (child.userData.isRoom) toRemove.push(child);
    });
    toRemove.forEach(child => scene.remove(child));

    // Floor texture helper
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
          ctx.beginPath(); ctx.moveTo(i, 0); ctx.lineTo(i, 512); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
        }
      } else if (style === 'wood') {
        for (let i = 0; i < 512; i += 30) {
          ctx.strokeStyle = `rgba(0,0,0,${0.1 + Math.random() * 0.1})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0, i); ctx.lineTo(512, i); ctx.stroke();
        }
      } else if (style === 'marble') {
        for (let i = 0; i < 50; i++) {
          ctx.strokeStyle = 'rgba(255,255,255,0.15)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(Math.random() * 512, Math.random() * 512);
          ctx.bezierCurveTo(Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512, Math.random() * 512);
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

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({
        map: createFloorTexture(roomDimensions.floorStyle || 'tiles', roomDimensions.floorColor || '#d4b896')
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    floor.userData.isRoom = true;
    scene.add(floor);

    // Walls
    const wallMat = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.FrontSide
    });

    const makeWall = (w, h, pos, rotY = 0) => {
      const wall = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat.clone());
      wall.position.set(...pos);
      wall.rotation.y = rotY;
      wall.receiveShadow = true;
      wall.userData.isRoom = true;
      wall.userData.wallType = true;
      scene.add(wall);
      return wall;
    };

    const backWall = makeWall(roomDimensions.width, roomDimensions.height, [0, roomDimensions.height / 2, -roomDimensions.depth / 2]);
    const leftWall = makeWall(roomDimensions.depth, roomDimensions.height, [-roomDimensions.width / 2, roomDimensions.height / 2, 0], Math.PI / 2);
    const rightWall = makeWall(roomDimensions.depth, roomDimensions.height, [roomDimensions.width / 2, roomDimensions.height / 2, 0], -Math.PI / 2);
    const frontWall = makeWall(roomDimensions.width, roomDimensions.height, [0, roomDimensions.height / 2, roomDimensions.depth / 2], Math.PI);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.FrontSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomDimensions.height;
    ceiling.userData.isRoom = true;
    scene.add(ceiling);

    // Wall visibility based on camera
    const camera = cameraRef.current;
    const controls = controlsRef.current;
    const updateWalls = () => {
      if (!camera) return;
      const pos = camera.position;
      const hw = roomDimensions.width / 2;
      const hd = roomDimensions.depth / 2;
      frontWall.visible = !(pos.z > hd);
      backWall.visible = !(pos.z < -hd);
      rightWall.visible = !(pos.x > hw);
      leftWall.visible = !(pos.x < -hw);
      ceiling.visible = !(pos.y > roomDimensions.height);
    };

    if (controls) {
      controls.addEventListener('change', updateWalls);
    }
    updateWalls();

    return () => {
      if (controls) {
        controls.removeEventListener('change', updateWalls);
      }
    };
  }, [roomDimensions]);

  // Sync furniture from React state -> 3D scene
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // If the update came from a 3D drag, skip re-positioning to avoid jitter
    if (isUpdatingFromDrag.current) return;

    const currentIds = new Set(furniture.map(f => f.id));

    // Remove 3D objects that are no longer in state
    Object.keys(furnitureMapRef.current).forEach(id => {
      if (!currentIds.has(id)) {
        const obj = furnitureMapRef.current[id];
        if (transformRef.current && transformRef.current.object === obj) {
          transformRef.current.detach();
        }
        scene.remove(obj);
        delete furnitureMapRef.current[id];
        createdIdsRef.current.delete(id);
      }
    });

    // Add or update furniture
    furniture.forEach(item => {
      if (!createdIdsRef.current.has(item.id)) {
        // Create new mesh
        const wrapper = createFurnitureMesh(item);
        wrapper.position.set(
          item.position?.x || 0,
          item.position?.y || 0,
          item.position?.z || 0
        );
        if (item.rotation) {
          wrapper.rotation.y = item.rotation * (Math.PI / 180);
        }
        if (item.scale) {
          wrapper.scale.setScalar(item.scale);
        }
        scene.add(wrapper);
        furnitureMapRef.current[item.id] = wrapper;
        createdIdsRef.current.add(item.id);
      } else {
        // Update existing
        const obj = furnitureMapRef.current[item.id];
        if (obj) {
          obj.position.set(
            item.position?.x || 0,
            item.position?.y || 0,
            item.position?.z || 0
          );
          if (item.rotation !== undefined) {
            obj.rotation.y = item.rotation * (Math.PI / 180);
          }
          if (item.scale !== undefined) {
            obj.scale.setScalar(item.scale);
          }
          // Update color
          if (item.color) {
            obj.traverse(n => {
              if (n.isMesh && !n.userData.keepColor) {
                n.material.color.set(item.color);
              }
            });
          }
        }
      }
    });
  }, [furniture, createFurnitureMesh]);

  // Handle selection highlight and click
  useEffect(() => {
    const scene = sceneRef.current;
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const transformControl = transformRef.current;
    if (!scene || !renderer || !camera || !transformControl) return;

    // Update highlight based on selected
    Object.values(furnitureMapRef.current).forEach(obj => {
      obj.traverse(n => {
        if (n.isMesh) {
          n.material.emissive = new THREE.Color(0x000000);
          n.material.emissiveIntensity = 0;
        }
      });
    });

    if (selected && furnitureMapRef.current[selected.id]) {
      const selectedObj = furnitureMapRef.current[selected.id];
      selectedObj.traverse(n => {
        if (n.isMesh) {
          n.material.emissive = new THREE.Color(0x4a9eff);
          n.material.emissiveIntensity = 0.4;
        }
      });
      transformControl.attach(selectedObj);
    } else {
      transformControl.detach();
    }
  }, [selected]);

  // Click handler for selection
  useEffect(() => {
    const renderer = rendererRef.current;
    const camera = cameraRef.current;
    const transformControl = transformRef.current;
    if (!renderer || !camera || !transformControl) return;

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Collect all furniture objects
      const allFurniture = Object.values(furnitureMapRef.current);
      const hits = raycaster.intersectObjects(allFurniture, true);

      if (hits.length > 0) {
        let target = hits[0].object;
        // Walk up to the wrapper group
        while (target.parent && !target.userData.furnitureId) {
          target = target.parent;
        }

        if (target.userData.furnitureId) {
          const item = furniture.find(f => f.id === target.userData.furnitureId);
          if (item && onSelect) {
            onSelect(item);
          }
        }
      } else {
        if (onSelect) onSelect(null);
      }
    };

    renderer.domElement.addEventListener('click', onClick);
    return () => {
      renderer.domElement.removeEventListener('click', onClick);
    };
  }, [furniture, onSelect]);

  // Expose global helpers for color change and delete
  useEffect(() => {
    window.changeColor = (hex) => {
      if (selected && selected.id) {
        onUpdateFurniture(selected.id, { color: hex });
      }
    };

    window.deleteSelected = () => {
      if (selected && selected.id) {
        onUpdateFurniture(selected.id, { _shouldDelete: true });
      }
    };
  }, [selected, onUpdateFurniture]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;