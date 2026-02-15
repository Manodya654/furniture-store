import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ onSelectObject }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const transformRef = useRef(null);
  const furnitureListRef = useRef([]);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;
    
    // Skip if already initialized (canvas exists)
    const existingCanvas = container.querySelector('canvas');
    if (existingCanvas) {
      console.log("⏭️ Skipping re-initialization (canvas exists)");
      
      // Reconnect to existing scene if refs are empty
      if (!sceneRef.current && window.threeScene) {
        sceneRef.current = window.threeScene;
        transformRef.current = window.threeTransform;
        furnitureListRef.current = window.threeFurniture || [];
        console.log("🔗 Reconnected to existing scene");
        
        // Make sure transform is in the scene
        if (window.threeTransform && window.threeScene) {
          if (!window.threeScene.children.includes(window.threeTransform)) {
            window.threeScene.add(window.threeTransform);
            console.log("✅ Re-added transform controls to scene");
          }
        }
        
        // Restart animation loop if needed
        if (window.threeAnimationId) {
          console.log("🎬 Animation already running");
        }
      }
      return;
    }
    
    console.log("🎬 Initializing Three.js scene...");

    // --- 1. Basic Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);
    sceneRef.current = scene;
    
    // Store globally to persist through React strict mode
    window.threeScene = scene;

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(10, 8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    
    // Store globally
    window.threeOrbit = orbit;
    window.threeCamera = camera;
    window.threeRenderer = renderer;

    // --- 2. Interaction Controls (The Gizmo) ---
    const transform = new TransformControls(camera, renderer.domElement);
    transform.setMode("translate"); // Start with move mode
    scene.add(transform); // Add the control gizmo to scene
    transformRef.current = transform;
    
    // Store globally to persist through React strict mode
    window.threeTransform = transform;

    // Disable OrbitControls while dragging furniture
    transform.addEventListener("dragging-changed", (e) => {
      orbit.enabled = !e.value;
    });

    // Notify parent when object is attached/detached
    transform.addEventListener("objectChange", () => {
      if (transform.object && onSelectObject) {
        onSelectObject(transform.object);
      }
    });

    // --- 3. Lights & Shadows ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.6);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 12, 8);
    dirLight.castShadow = true;
    dirLight.shadow.camera.top = 10;
    dirLight.shadow.camera.bottom = -10;
    dirLight.shadow.camera.left = -10;
    dirLight.shadow.camera.right = 10;
    scene.add(dirLight);

    // --- 4. The Room (Floor, 4 Walls, Ceiling) ---
    const roomSize = { w: 16, h: 8, d: 16 };
    const wallMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide });

    const roomGeo = new THREE.BoxGeometry(roomSize.w, roomSize.h, roomSize.d);
    const room = new THREE.Mesh(roomGeo, wallMat);
    room.position.y = roomSize.h / 2 - 0.05;
    room.receiveShadow = true;
    scene.add(room);

    // Real Floor (for better shadow receiving)
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomSize.w, roomSize.d),
      new THREE.MeshStandardMaterial({ color: 0xdedede })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // --- 5. Furniture Creation Functions ---
    const loader = new GLTFLoader();
    
    // Store globally to persist through React strict mode  
    if (!window.threeFurniture) {
      window.threeFurniture = [];
    }
    furnitureListRef.current = window.threeFurniture;

    // Helper function to get active scene references
    const getSceneRefs = () => {
      return {
        scene: window.threeScene || scene,
        transform: window.threeTransform || transform,
        onSelectObject
      };
    };
    
    // Helper to generate random position for new furniture
    const getRandomPosition = () => {
      const spread = 6; // How far apart to spawn items
      return {
        x: (Math.random() - 0.5) * spread,
        z: (Math.random() - 0.5) * spread
      };
    };

    // Create a simple table (fallback if GLB doesn't exist)
    const createTable = () => {
      const group = new THREE.Group();
      
      // Table top
      const topGeo = new THREE.BoxGeometry(4, 0.2, 2);
      const topMat = new THREE.MeshStandardMaterial({ color: 0x8B4513 });
      const top = new THREE.Mesh(topGeo, topMat);
      top.position.y = 1.5;
      top.castShadow = true;
      top.receiveShadow = true;
      group.add(top);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.2, 1.5, 0.2);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
      const positions = [
        [-1.8, 0.75, -0.8],
        [1.8, 0.75, -0.8],
        [-1.8, 0.75, 0.8],
        [1.8, 0.75, 0.8]
      ];

      positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(...pos);
        leg.castShadow = true;
        leg.receiveShadow = true;
        group.add(leg);
      });

      group.userData.type = "table";
      group.userData.originalColor = 0x8B4513;
      return group;
    };

    // Create a simple sofa
    const createSofa = () => {
      const group = new THREE.Group();
      
      // Seat
      const seatGeo = new THREE.BoxGeometry(5, 0.8, 2);
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.y = 0.8;
      seat.castShadow = true;
      seat.receiveShadow = true;
      group.add(seat);

      // Backrest
      const backGeo = new THREE.BoxGeometry(5, 1.5, 0.4);
      const backMat = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
      const back = new THREE.Mesh(backGeo, backMat);
      back.position.set(0, 1.55, -0.8);
      back.castShadow = true;
      back.receiveShadow = true;
      group.add(back);

      // Armrests
      const armGeo = new THREE.BoxGeometry(0.4, 1.2, 2);
      const armMat = new THREE.MeshStandardMaterial({ color: 0x4169E1 });
      
      const leftArm = new THREE.Mesh(armGeo, armMat);
      leftArm.position.set(-2.5, 1.2, 0);
      leftArm.castShadow = true;
      leftArm.receiveShadow = true;
      group.add(leftArm);

      const rightArm = new THREE.Mesh(armGeo, armMat.clone());
      rightArm.position.set(2.5, 1.2, 0);
      rightArm.castShadow = true;
      rightArm.receiveShadow = true;
      group.add(rightArm);

      group.userData.type = "sofa";
      group.userData.originalColor = 0x4169E1;
      return group;
    };

    // Create a bed
    const createBed = () => {
      const group = new THREE.Group();
      
      // Mattress
      const mattressGeo = new THREE.BoxGeometry(4, 0.6, 6);
      const mattressMat = new THREE.MeshStandardMaterial({ color: 0xFFFFFF });
      const mattress = new THREE.Mesh(mattressGeo, mattressMat);
      mattress.position.y = 1;
      mattress.castShadow = true;
      mattress.receiveShadow = true;
      group.add(mattress);

      // Headboard
      const headGeo = new THREE.BoxGeometry(4.2, 2, 0.3);
      const headMat = new THREE.MeshStandardMaterial({ color: 0x8B7355 });
      const headboard = new THREE.Mesh(headGeo, headMat);
      headboard.position.set(0, 1.7, -3);
      headboard.castShadow = true;
      headboard.receiveShadow = true;
      group.add(headboard);

      // Base
      const baseGeo = new THREE.BoxGeometry(4, 0.4, 6);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.5;
      base.castShadow = true;
      base.receiveShadow = true;
      group.add(base);

      group.userData.type = "bed";
      group.userData.originalColor = 0xFFFFFF;
      return group;
    };

    // Create a lamp
    const createLamp = () => {
      const group = new THREE.Group();
      
      // Base
      const baseGeo = new THREE.CylinderGeometry(0.3, 0.4, 0.2, 16);
      const baseMat = new THREE.MeshStandardMaterial({ color: 0x333333 });
      const base = new THREE.Mesh(baseGeo, baseMat);
      base.position.y = 0.1;
      base.castShadow = true;
      group.add(base);

      // Stand
      const standGeo = new THREE.CylinderGeometry(0.05, 0.05, 2, 8);
      const standMat = new THREE.MeshStandardMaterial({ color: 0x444444 });
      const stand = new THREE.Mesh(standGeo, standMat);
      stand.position.y = 1.1;
      stand.castShadow = true;
      group.add(stand);

      // Lampshade
      const shadeGeo = new THREE.CylinderGeometry(0.5, 0.7, 0.8, 16, 1, true);
      const shadeMat = new THREE.MeshStandardMaterial({ 
        color: 0xFFF8DC, 
        side: THREE.DoubleSide,
        emissive: 0xFFE4B5,
        emissiveIntensity: 0.3
      });
      const shade = new THREE.Mesh(shadeGeo, shadeMat);
      shade.position.y = 2.5;
      shade.castShadow = true;
      group.add(shade);

      group.userData.type = "lamp";
      group.userData.originalColor = 0xFFF8DC;
      return group;
    };

    // Create a simple chair (fallback)
    const createChair = () => {
      const group = new THREE.Group();
      
      // Seat
      const seatGeo = new THREE.BoxGeometry(1.5, 0.2, 1.5);
      const seatMat = new THREE.MeshStandardMaterial({ color: 0x4682B4 });
      const seat = new THREE.Mesh(seatGeo, seatMat);
      seat.position.y = 1;
      seat.castShadow = true;
      seat.receiveShadow = true;
      group.add(seat);

      // Backrest
      const backGeo = new THREE.BoxGeometry(1.5, 1.5, 0.2);
      const backMat = new THREE.MeshStandardMaterial({ color: 0x4682B4 });
      const back = new THREE.Mesh(backGeo, backMat);
      back.position.set(0, 1.85, -0.65);
      back.castShadow = true;
      back.receiveShadow = true;
      group.add(back);

      // Legs
      const legGeo = new THREE.BoxGeometry(0.15, 1, 0.15);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
      const positions = [
        [-0.6, 0.5, -0.6],
        [0.6, 0.5, -0.6],
        [-0.6, 0.5, 0.6],
        [0.6, 0.5, 0.6]
      ];

      positions.forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(...pos);
        leg.castShadow = true;
        leg.receiveShadow = true;
        group.add(leg);
      });

      group.userData.type = "chair";
      group.userData.originalColor = 0x4682B4;
      return group;
    };

    // Add furniture functions
    window.addChair = () => {
      console.log("🔵 Add Chair button clicked");
      const refs = getSceneRefs();
      
      // Try to load GLB first, fallback to simple chair if it fails
      loader.load(
        "/models/chair.glb", 
        (gltf) => {
          console.log("✅ Chair GLB loaded successfully");
          const model = gltf.scene;
          
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          model.position.sub(center);
          model.position.y = size.y / 2;
          
          // Add random offset so furniture doesn't stack
          const randomPos = getRandomPosition();
          model.position.x += randomPos.x;
          model.position.z += randomPos.z;
          
          const targetHeight = 3.5;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          model.userData.type = "chair";
          model.userData.originalColor = 0x4682B4;

          // IMPORTANT: Add to scene first, then to list, then attach transform
          refs.scene.add(model);
          console.log("✅ Chair added to scene");
          
          window.threeFurniture.push(model);
          furnitureListRef.current = window.threeFurniture;
          console.log("✅ Chair added to furniture list, total items:", window.threeFurniture.length);
          
          // Small delay before attaching transform to ensure scene is ready
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(model)) {
              refs.transform.attach(model);
              if (refs.onSelectObject) refs.onSelectObject(model);
              console.log("✅ Transform attached to chair");
            }
          }, 10);
        }, 
        (progress) => {
          const percent = progress.total > 0 ? (progress.loaded / progress.total * 100).toFixed(0) : 0;
          console.log("⏳ Loading chair:", percent + '%');
        },
        (error) => {
          console.warn("⚠️ Could not load chair.glb, using fallback chair model");
          console.error("Error details:", error);
          // Use fallback chair
          const chair = createChair();
          refs.scene.add(chair);
          window.threeFurniture.push(chair);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(chair)) {
              refs.transform.attach(chair);
              if (refs.onSelectObject) refs.onSelectObject(chair);
            }
          }, 10);
        }
      );
    };

    window.addTable = () => {
      const refs = getSceneRefs();
      console.log("🔵 Add Table button clicked");
      
      loader.load(
        "/models/table.glb",
        (gltf) => {
          console.log("✅ Table GLB loaded successfully");
          const model = gltf.scene;
          
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          model.position.sub(center);
          model.position.y = size.y / 2;
          
          // Add random offset so furniture doesn't stack
          const randomPos = getRandomPosition();
          model.position.x += randomPos.x;
          model.position.z += randomPos.z;
          
          const targetHeight = 2;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          model.userData.type = "table";
          model.userData.originalColor = 0x8B4513;

          refs.scene.add(model);
          console.log("✅ Table added to scene");
          window.threeFurniture.push(model);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(model)) {
              refs.transform.attach(model);
              if (refs.onSelectObject) refs.onSelectObject(model);
            }
          }, 10);
        },
        undefined,
        (error) => {
          console.warn("⚠️ Could not load table.glb, using fallback table model");
          const table = createTable();
          refs.scene.add(table);
          window.threeFurniture.push(table);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(table)) {
              refs.transform.attach(table);
              if (refs.onSelectObject) refs.onSelectObject(table);
            }
          }, 10);
        }
      );
    };

    window.addSofa = () => {
      const refs = getSceneRefs();
      console.log("🔵 Add Sofa button clicked");
      
      loader.load(
        "/models/sofa.glb",
        (gltf) => {
          console.log("✅ Sofa GLB loaded successfully");
          const model = gltf.scene;
          
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          model.position.sub(center);
          model.position.y = size.y / 2;
          
          // Add random offset so furniture doesn't stack
          const randomPos = getRandomPosition();
          model.position.x += randomPos.x;
          model.position.z += randomPos.z;
          
          const targetHeight = 2.5;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          model.userData.type = "sofa";
          model.userData.originalColor = 0x4169E1;

          refs.scene.add(model);
          console.log("✅ Sofa added to scene");
          window.threeFurniture.push(model);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(model)) {
              refs.transform.attach(model);
              if (refs.onSelectObject) refs.onSelectObject(model);
            }
          }, 10);
        },
        undefined,
        (error) => {
          console.warn("⚠️ Could not load sofa.glb, using fallback sofa model");
          const sofa = createSofa();
          refs.scene.add(sofa);
          window.threeFurniture.push(sofa);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(sofa)) {
              refs.transform.attach(sofa);
              if (refs.onSelectObject) refs.onSelectObject(sofa);
            }
          }, 10);
        }
      );
    };

    window.addBed = () => {
      const refs = getSceneRefs();
      console.log("🔵 Add Bed button clicked");
      
      loader.load(
        "/models/bed.glb",
        (gltf) => {
          console.log("✅ Bed GLB loaded successfully");
          const model = gltf.scene;
          
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          model.position.sub(center);
          model.position.y = size.y / 2;
          
          // Add random offset so furniture doesn't stack
          const randomPos = getRandomPosition();
          model.position.x += randomPos.x;
          model.position.z += randomPos.z;
          
          const targetHeight = 2;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          model.userData.type = "bed";
          model.userData.originalColor = 0xFFFFFF;

          refs.scene.add(model);
          console.log("✅ Bed added to scene");
          window.threeFurniture.push(model);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(model)) {
              refs.transform.attach(model);
              if (refs.onSelectObject) refs.onSelectObject(model);
            }
          }, 10);
        },
        undefined,
        (error) => {
          console.warn("⚠️ Could not load bed.glb, using fallback bed model");
          const bed = createBed();
          refs.scene.add(bed);
          window.threeFurniture.push(bed);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(bed)) {
              refs.transform.attach(bed);
              if (refs.onSelectObject) refs.onSelectObject(bed);
            }
          }, 10);
        }
      );
    };

    window.addLamp = () => {
      const refs = getSceneRefs();
      console.log("🔵 Add Lamp button clicked");
      
      loader.load(
        "/models/lamp.glb",
        (gltf) => {
          console.log("✅ Lamp GLB loaded successfully");
          const model = gltf.scene;
          
          model.traverse((node) => {
            if (node.isMesh) {
              node.castShadow = true;
              node.receiveShadow = true;
            }
          });

          const box = new THREE.Box3().setFromObject(model);
          const size = box.getSize(new THREE.Vector3());
          const center = box.getCenter(new THREE.Vector3());
          
          model.position.sub(center);
          model.position.y = size.y / 2;
          
          // Add random offset so furniture doesn't stack
          const randomPos = getRandomPosition();
          model.position.x += randomPos.x;
          model.position.z += randomPos.z;
          
          const targetHeight = 2.5;
          const scale = targetHeight / size.y;
          model.scale.setScalar(scale);

          model.userData.type = "lamp";
          model.userData.originalColor = 0xFFF8DC;

          refs.scene.add(model);
          console.log("✅ Lamp added to scene");
          window.threeFurniture.push(model);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(model)) {
              refs.transform.attach(model);
              if (refs.onSelectObject) refs.onSelectObject(model);
            }
          }, 10);
        },
        undefined,
        (error) => {
          console.warn("⚠️ Could not load lamp.glb, using fallback lamp model");
          const lamp = createLamp();
          refs.scene.add(lamp);
          window.threeFurniture.push(lamp);
          
          setTimeout(() => {
            if (refs.transform && refs.scene.children.includes(lamp)) {
              refs.transform.attach(lamp);
              if (refs.onSelectObject) refs.onSelectObject(lamp);
            }
          }, 10);
        }
      );
    };

    // Change color of selected object
    window.changeObjectColor = (color) => {
      if (!transform.object) return;
      
      const colorValue = typeof color === 'string' ? parseInt(color.replace('#', '0x'), 16) : color;
      
      transform.object.traverse((node) => {
        if (node.isMesh && node.material) {
          if (Array.isArray(node.material)) {
            node.material.forEach(mat => {
              mat.color.setHex(colorValue);
            });
          } else {
            node.material.color.setHex(colorValue);
          }
        }
      });
    };

    // Get current selected object
    window.getSelectedObject = () => {
      return transform.object;
    };

    // Set transform mode
    window.setTransformMode = (mode) => {
      transform.setMode(mode);
    };

    // --- 6. Direct Mouse Selection & Deletion ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const transform = window.threeTransform;
      if (!transform) {
        console.warn("⚠️ Transform controls not available");
        return;
      }
      
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const furnitureList = window.threeFurniture || [];
      const intersects = raycaster.intersectObjects(furnitureList, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && !furnitureList.includes(target)) {
          target = target.parent;
        }
        console.log("🎯 Selected:", target.userData.type);
        transform.attach(target);
        if (onSelectObject) onSelectObject(target);
      } else {
        if (transform.object) {
          transform.detach();
          if (onSelectObject) onSelectObject(null);
        }
      }
    };

    const onKeyDown = (event) => {
      const transform = window.threeTransform;
      const scene = window.threeScene;
      if (!transform || !transform.object) return;

      // Delete/Backspace to remove item
      if (event.key === "Delete" || event.key === "Backspace") {
        const selected = transform.object;
        transform.detach();
        scene.remove(selected);
        const furnitureList = window.threeFurniture || [];
        const index = furnitureList.indexOf(selected);
        if (index > -1) furnitureList.splice(index, 1);
        if (onSelectObject) onSelectObject(null);
      }

      // Hotkeys for Modes
      if (event.key === "g") transform.setMode("translate");
      if (event.key === "r") transform.setMode("rotate");
      if (event.key === "s") transform.setMode("scale");
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    // --- 7. Final Loop & Cleanup ---
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
      window.threeAnimationId = animationId; // Store globally
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      console.log("🧹 Cleaning up Three.js scene...");
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("keydown", onKeyDown);
      if (renderer.domElement) {
        renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      }
      
      // Don't cancel animation or cleanup in development mode
      // This keeps everything running through React strict mode
      const shouldFullCleanup = process.env.NODE_ENV === 'production';
      if (shouldFullCleanup) {
        cancelAnimationFrame(animationId);
        renderer.dispose();
        if (container && renderer.domElement && container.contains(renderer.domElement)) {
          container.removeChild(renderer.domElement);
        }
      }
    };
  }, [onSelectObject]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", outline: "none" }} />;
};

export default ThreeScene;