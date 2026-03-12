import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ onSelect, roomDimensions }) => {
  const mountRef = useRef(null);
  const furnitureList = useRef([]);
  const wallsRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    // Position camera OUTSIDE the room looking in
    camera.position.set(
      roomDimensions.width * 1.2,
      roomDimensions.height * 1.2,
      roomDimensions.depth * 1.5
    );
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    container.appendChild(renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;
    orbit.dampingFactor = 0.05;
    orbit.target.set(0, 0, 0);
    orbit.update();

    // Transform Controls
    const transform = new TransformControls(camera, renderer.domElement);
    transform.setMode('translate'); // Start in move mode
    transform.setSize(1.5); // Make gizmo bigger
    scene.add(transform);

    transform.addEventListener("dragging-changed", (e) => {
      orbit.enabled = !e.value;
    });

    // Also disable orbit when mouse is over transform controls
    transform.addEventListener("mouseDown", () => {
      orbit.enabled = false;
    });
    
    transform.addEventListener("mouseUp", () => {
      orbit.enabled = true;
    });

    transform.addEventListener("change", () => {
      if (transform.object) {
        const obj = transform.object;
        
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        
        const halfWidth = roomDimensions.width / 2;
        const halfDepth = roomDimensions.depth / 2;
        const roomFloor = 0;
        const roomCeiling = roomDimensions.height;

        const paddingX = size.x / 2;
        if (obj.position.x > halfWidth - paddingX) obj.position.x = halfWidth - paddingX;
        if (obj.position.x < -halfWidth + paddingX) obj.position.x = -halfWidth + paddingX;

        const paddingZ = size.z / 2;
        if (obj.position.z > halfDepth - paddingZ) obj.position.z = halfDepth - paddingZ;
        if (obj.position.z < -halfDepth + paddingZ) obj.position.z = -halfDepth + paddingZ;

        if (obj.position.y < roomFloor) obj.position.y = roomFloor;
        if (obj.position.y > roomCeiling - size.y) obj.position.y = roomCeiling - size.y;
      }
    });

    // Lighting
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 0.6);
    light.position.set(10, 20, 10);
    light.castShadow = true;
    light.shadow.mapSize.width = 2048;
    light.shadow.mapSize.height = 2048;
    light.shadow.camera.left = -30;
    light.shadow.camera.right = 30;
    light.shadow.camera.top = 30;
    light.shadow.camera.bottom = -30;
    light.shadow.bias = -0.0001;
    light.shadow.radius = 3;
    scene.add(light);

    const light2 = new THREE.DirectionalLight(0xffffff, 0.3);
    light2.position.set(-10, 15, -10);
    scene.add(light2);

    // Floor texture function
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

    // FLOOR - horizontal plane at Y=0
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        map: createFloorTexture(roomDimensions.floorStyle || 'tiles', roomDimensions.floorColor || '#d4b896')
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // INDIVIDUAL WALLS - each is a separate plane
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.FrontSide // Only show front face
    });

    // Back wall (negative Z)
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial.clone()
    );
    backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
    backWall.rotation.y = 0; // Facing positive Z (towards camera)
    backWall.receiveShadow = true;
    scene.add(backWall);

    // Left wall (negative X)
    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial.clone()
    );
    leftWall.position.set(-roomDimensions.width / 2, roomDimensions.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2; // Facing positive X (towards camera)
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    // Right wall (positive X)
    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMaterial.clone()
    );
    rightWall.position.set(roomDimensions.width / 2, roomDimensions.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2; // Facing negative X (towards camera)
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    // Front wall (positive Z) - this one is usually hidden
    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial.clone()
    );
    frontWall.position.set(0, roomDimensions.height / 2, roomDimensions.depth / 2);
    frontWall.rotation.y = Math.PI; // Facing negative Z (away from camera)
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    // Ceiling
    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        color: 0xf5f5f5, 
        side: THREE.FrontSide
      })
    );
    ceiling.rotation.x = Math.PI / 2; // Facing down
    ceiling.position.y = roomDimensions.height;
    scene.add(ceiling);

    wallsRef.current = { backWall, leftWall, rightWall, frontWall, ceiling, floor };

    // DOLLHOUSE VISIBILITY - hide walls when camera is outside them
    const updateWallVisibility = () => {
      const camPos = camera.position;
      const halfWidth = roomDimensions.width / 2;
      const halfDepth = roomDimensions.depth / 2;
      
      // Hide wall if camera is on the OUTSIDE of that wall
      frontWall.visible = !(camPos.z > halfDepth);  // Hide if camera is past front wall
      backWall.visible = !(camPos.z < -halfDepth);  // Hide if camera is past back wall
      rightWall.visible = !(camPos.x > halfWidth);  // Hide if camera is past right wall
      leftWall.visible = !(camPos.x < -halfWidth);  // Hide if camera is past left wall
      ceiling.visible = !(camPos.y > roomDimensions.height); // Hide if camera above
    };

    orbit.addEventListener('change', updateWallVisibility);
    updateWallVisibility(); // Initial call

    const loader = new GLTFLoader();

    // Add asset with proper sizing
    window.addAsset = (name) => {
      loader.load(`/models/${name}.glb`, (gltf) => {
        const model = gltf.scene;
        model.name = name;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        const targetHeight = 1.0;
        model.scale.setScalar(targetHeight / size.y);
        
        model.traverse(n => {
          if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            n.material = n.material.clone();
            n.material.flatShading = false;
            n.material.needsUpdate = true;
          }
        });

        const wrapper = new THREE.Group();
        wrapper.add(model);
        
        box.setFromObject(model);
        model.position.y = -box.min.y;

        const safeWidth = roomDimensions.width * 0.4;
        const safeDepth = roomDimensions.depth * 0.4;
        wrapper.position.set(
          (Math.random() - 0.5) * safeWidth,
          0,
          (Math.random() - 0.5) * safeDepth
        );
        
        scene.add(wrapper);
        furnitureList.current.push(wrapper);
        
        // Attach transform controls and highlight
        transform.attach(wrapper);
        transform.setMode('translate'); // Ensure we're in translate mode
        
        // Add blue glow to selected
        wrapper.traverse(n => {
          if (n.isMesh) {
            n.material.emissive = new THREE.Color(0x4a9eff);
            n.material.emissiveIntensity = 0.3;
            n.material.needsUpdate = true;
          }
        });
        
        if(onSelect) onSelect({ name, id: wrapper.uuid });
      });
    };

    window.changeColor = (hex) => {
      if (transform.object) {
        transform.object.traverse(n => {
          if (n.isMesh) {
            n.material.color.set(hex);
            n.material.needsUpdate = true;
          }
        });
      }
    };

    window.setMode = (mode) => {
      console.log('Setting transform mode to:', mode);
      transform.setMode(mode);
    };
    
    window.deleteSelected = () => {
      if (transform.object) {
        const obj = transform.object;
        transform.detach();
        scene.remove(obj);
        furnitureList.current = furnitureList.current.filter(i => i !== obj);
        if(onSelect) onSelect(null);
      }
    };

    // Selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(furnitureList.current, true);

      if (intersects.length > 0) {
        let target = intersects[0].object;
        while (target.parent && !furnitureList.current.includes(target)) {
          target = target.parent;
        }
        
        // Remove glow from all furniture first
        furnitureList.current.forEach(item => {
          item.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
              n.material.needsUpdate = true;
            }
          });
        });
        
        // Add glow to selected
        target.traverse(n => {
          if (n.isMesh) {
            n.material.emissive = new THREE.Color(0x4a9eff);
            n.material.emissiveIntensity = 0.3;
            n.material.needsUpdate = true;
          }
        });
        
        // Attach transform controls
        transform.attach(target);
        transform.setMode('translate');
        
        if(onSelect) onSelect({ name: target.children[0].name, id: target.uuid });
      } else if (!transform.dragging) {
        // Deselect - remove all glows
        furnitureList.current.forEach(item => {
          item.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
              n.material.needsUpdate = true;
            }
          });
        });
        
        transform.detach();
        if(onSelect) onSelect(null);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    const animate = () => {
      requestAnimationFrame(animate);
      orbit.update();
      updateWallVisibility();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [onSelect]);

  // Update room when dimensions change
  useEffect(() => {
    if (wallsRef.current && sceneRef.current && cameraRef.current) {
      const scene = sceneRef.current;
      const walls = wallsRef.current;

      scene.remove(walls.backWall);
      scene.remove(walls.leftWall);
      scene.remove(walls.rightWall);
      scene.remove(walls.frontWall);
      scene.remove(walls.ceiling);
      scene.remove(walls.floor);

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
          map: createFloorTexture(roomDimensions.floorStyle || 'tiles', roomDimensions.floorColor || '#d4b896')
        })
      );
      floor.rotation.x = -Math.PI / 2;
      floor.receiveShadow = true;
      scene.add(floor);

      const wallMaterial = new THREE.MeshStandardMaterial({
        color: roomDimensions.wallColor || '#e8e8e8',
        side: THREE.FrontSide
      });

      const backWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
        wallMaterial.clone()
      );
      backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
      backWall.rotation.y = 0;
      backWall.receiveShadow = true;
      scene.add(backWall);

      const leftWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
        wallMaterial.clone()
      );
      leftWall.position.set(-roomDimensions.width / 2, roomDimensions.height / 2, 0);
      leftWall.rotation.y = Math.PI / 2;
      leftWall.receiveShadow = true;
      scene.add(leftWall);

      const rightWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
        wallMaterial.clone()
      );
      rightWall.position.set(roomDimensions.width / 2, roomDimensions.height / 2, 0);
      rightWall.rotation.y = -Math.PI / 2;
      rightWall.receiveShadow = true;
      scene.add(rightWall);

      const frontWall = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
        wallMaterial.clone()
      );
      frontWall.position.set(0, roomDimensions.height / 2, roomDimensions.depth / 2);
      frontWall.rotation.y = Math.PI;
      frontWall.receiveShadow = true;
      scene.add(frontWall);

      const ceiling = new THREE.Mesh(
        new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
        new THREE.MeshStandardMaterial({ 
          color: 0xf5f5f5, 
          side: THREE.FrontSide
        })
      );
      ceiling.rotation.x = Math.PI / 2;
      ceiling.position.y = roomDimensions.height;
      scene.add(ceiling);

      wallsRef.current = { backWall, leftWall, rightWall, frontWall, ceiling, floor };
    }
  }, [roomDimensions]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;