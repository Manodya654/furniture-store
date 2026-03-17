import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ furniture, onUpdateFurniture, onSelect, selected, roomDimensions }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const furnitureObjectsRef = useRef({});
  const transformControlRef = useRef(null);
  const loaderRef = useRef(new GLTFLoader());

  // Initialize scene once
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

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

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
    dirLight.position.set(10, 20, 10);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    scene.add(dirLight);

    // Floor
    const createFloorTexture = (style, color) => {
      const canvas = document.createElement('canvas');
      canvas.width = 512;
      canvas.height = 512;
      const ctx = canvas.getContext('2d');
      ctx.fillStyle = color;
      ctx.fillRect(0, 0, 512, 512);
      
      if (style === 'tiles') {
        ctx.strokeStyle = 'rgba(0,0,0,0.2)';
        ctx.lineWidth = 4;
        for (let i = 0; i <= 512; i += 128) {
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
    const wallMat = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor,
      side: THREE.FrontSide
    });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMat.clone()
    );
    backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMat.clone()
    );
    leftWall.position.set(-roomDimensions.width / 2, roomDimensions.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMat.clone()
    );
    rightWall.position.set(roomDimensions.width / 2, roomDimensions.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    scene.add(rightWall);

    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMat.clone()
    );
    frontWall.position.set(0, roomDimensions.height / 2, roomDimensions.depth / 2);
    frontWall.rotation.y = Math.PI;
    scene.add(frontWall);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.FrontSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomDimensions.height;
    scene.add(ceiling);

    // Transform Controls
    const transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', (e) => {
      controls.enabled = !e.value;
    });

    let isUpdating = false;
    transformControl.addEventListener('change', () => {
      if (transformControl.object && !isUpdating) {
        isUpdating = true;
        const obj = transformControl.object;
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        
        const halfW = roomDimensions.width / 2;
        const halfD = roomDimensions.depth / 2;
        
        // Clamp positions
        const maxX = halfW - size.x / 2;
        const minX = -halfW + size.x / 2;
        if (obj.position.x > maxX) obj.position.x = maxX;
        if (obj.position.x < minX) obj.position.x = minX;
        
        const maxZ = halfD - size.z / 2;
        const minZ = -halfD + size.z / 2;
        if (obj.position.z > maxZ) obj.position.z = maxZ;
        if (obj.position.z < minZ) obj.position.z = minZ;
        
        if (obj.position.y < 0) obj.position.y = 0;
        const maxY = roomDimensions.height - size.y;
        if (obj.position.y > maxY) obj.position.y = maxY;
        
        // Update state
        const itemId = obj.userData.furnitureId;
        if (itemId) {
          onUpdateFurniture(itemId, {
            position: { 
              x: obj.position.x, 
              y: obj.position.y, 
              z: obj.position.z 
            },
            rotation: obj.rotation.y,
            scale: obj.scale.x
          });
        }
        
        setTimeout(() => { isUpdating = false; }, 50);
      }
    });

    scene.add(transformControl);
    transformControlRef.current = transformControl;

    // Click selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const objects = Object.values(furnitureObjectsRef.current);
      const hits = raycaster.intersectObjects(objects, true);

      if (hits.length > 0) {
        let target = hits[0].object;
        while (target.parent && !target.userData.furnitureId) {
          target = target.parent;
        }
        
        // Remove all glows
        objects.forEach(obj => {
          obj.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
            }
          });
        });
        
        // Add glow to selected
        target.traverse(n => {
          if (n.isMesh) {
            n.material.emissive = new THREE.Color(0x4a9eff);
            n.material.emissiveIntensity = 0.4;
          }
        });
        
        transformControl.attach(target);
        const item = furniture.find(f => f.id === target.userData.furnitureId);
        if (item) onSelect(item);
      } else {
        objects.forEach(obj => {
          obj.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
            }
          });
        });
        transformControl.detach();
        onSelect(null);
      }
    };

    renderer.domElement.addEventListener('click', onClick);

    // Keyboard
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

    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onClick);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, [roomDimensions]); // Only recreate on room dimension changes

  // Handle furniture changes separately
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const loader = loaderRef.current;
    const currentObjects = furnitureObjectsRef.current;

    // Remove furniture that no longer exists
    const currentIds = furniture.map(f => f.id);
    Object.keys(currentObjects).forEach(id => {
      if (!currentIds.includes(id)) {
        scene.remove(currentObjects[id]);
        delete currentObjects[id];
      }
    });

    // Add or update furniture
    furniture.forEach(item => {
      if (currentObjects[item.id]) {
        // Update existing furniture
        const obj = currentObjects[item.id];
        obj.position.set(item.position.x, item.position.y, item.position.z);
        obj.rotation.y = item.rotation || 0;
        obj.scale.setScalar(item.scale || 1);
        
        // Update color
        obj.traverse(n => {
          if (n.isMesh && item.color) {
            n.material.color.set(item.color);
          }
        });
      } else {
        // Load new furniture
        loader.load(`/models/${item.type}.glb`, (gltf) => {
          const model = gltf.scene;
          
          // Scale to 1m
          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          model.scale.setScalar(1.0 / size.y);
          
          model.traverse(n => {
            if (n.isMesh) {
              n.castShadow = true;
              n.receiveShadow = true;
              n.material = n.material.clone();
              if (item.color) n.material.color.set(item.color);
            }
          });

          const wrapper = new THREE.Group();
          wrapper.add(model);
          wrapper.userData.furnitureId = item.id;
          
          // Position from state
          wrapper.position.set(item.position.x, item.position.y || 0, item.position.z);
          wrapper.rotation.y = item.rotation || 0;
          wrapper.scale.setScalar(item.scale || 1);
          
          scene.add(wrapper);
          currentObjects[item.id] = wrapper;
          
          // Select if this is the selected item
          if (selected?.id === item.id) {
            const transformControl = transformControlRef.current;
            if (transformControl) {
              transformControl.attach(wrapper);
              wrapper.traverse(n => {
                if (n.isMesh) {
                  n.material.emissive = new THREE.Color(0x4a9eff);
                  n.material.emissiveIntensity = 0.4;
                }
              });
            }
          }
        });
      }
    });
  }, [furniture, selected]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;