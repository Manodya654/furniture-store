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
  const transformRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
    scene.background = new THREE.Color(0x87ceeb);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
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

    // TransformControls - create but DON'T add to scene (it will render itself)
    const control = new TransformControls(camera, renderer.domElement);
    transformRef.current = control;
    
    control.addEventListener('change', () => {
      if (control.object) {
        const obj = control.object;
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        
        const halfWidth = roomDimensions.width / 2;
        const halfDepth = roomDimensions.depth / 2;

        const paddingX = size.x / 2;
        if (obj.position.x > halfWidth - paddingX) obj.position.x = halfWidth - paddingX;
        if (obj.position.x < -halfWidth + paddingX) obj.position.x = -halfWidth + paddingX;

        const paddingZ = size.z / 2;
        if (obj.position.z > halfDepth - paddingZ) obj.position.z = halfDepth - paddingZ;
        if (obj.position.z < -halfDepth + paddingZ) obj.position.z = -halfDepth + paddingZ;

        if (obj.position.y < 0) obj.position.y = 0;
        if (obj.position.y > roomDimensions.height - size.y) {
          obj.position.y = roomDimensions.height - size.y;
        }
      }
    });

    control.addEventListener('dragging-changed', (event) => {
      orbit.enabled = !event.value;
    });

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

    // Floor
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ 
        map: createFloorTexture(roomDimensions.floorStyle || 'tiles', roomDimensions.floorColor || '#d4b896')
      })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.FrontSide
    });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMaterial.clone()
    );
    backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
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

    const updateWallVisibility = () => {
      const camPos = camera.position;
      const halfWidth = roomDimensions.width / 2;
      const halfDepth = roomDimensions.depth / 2;
      
      frontWall.visible = !(camPos.z > halfDepth);
      backWall.visible = !(camPos.z < -halfDepth);
      rightWall.visible = !(camPos.x > halfWidth);
      leftWall.visible = !(camPos.x < -halfWidth);
      ceiling.visible = !(camPos.y > roomDimensions.height);
    };

    orbit.addEventListener('change', updateWallVisibility);
    updateWallVisibility();

    const loader = new GLTFLoader();
    const spawnedPositions = [];
    
    const getRandomSpawnPosition = () => {
      const safeWidth = roomDimensions.width * 0.8;
      const safeDepth = roomDimensions.depth * 0.8;
      const minDistance = 1.5;
      
      let attempts = 0;
      let position;
      
      while (attempts < 50) {
        position = {
          x: (Math.random() - 0.5) * safeWidth,
          z: (Math.random() - 0.5) * safeDepth
        };
        
        let valid = true;
        for (let pos of spawnedPositions) {
          const dist = Math.sqrt(
            Math.pow(position.x - pos.x, 2) + 
            Math.pow(position.z - pos.z, 2)
          );
          if (dist < minDistance) {
            valid = false;
            break;
          }
        }
        
        if (valid) {
          spawnedPositions.push(position);
          return position;
        }
        
        attempts++;
      }
      
      position = {
        x: (Math.random() - 0.5) * safeWidth,
        z: (Math.random() - 0.5) * safeDepth
      };
      spawnedPositions.push(position);
      return position;
    };

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
          }
        });

        const wrapper = new THREE.Group();
        wrapper.add(model);
        
        box.setFromObject(model);
        model.position.y = -box.min.y;

        const spawnPos = getRandomSpawnPosition();
        wrapper.position.set(spawnPos.x, 0, spawnPos.z);
        
        scene.add(wrapper);
        furnitureList.current.push(wrapper);
        
        // Attach and highlight
        control.attach(wrapper);
        wrapper.traverse(n => {
          if (n.isMesh) {
            n.material.emissive = new THREE.Color(0x4a9eff);
            n.material.emissiveIntensity = 0.4;
          }
        });
        
        if(onSelect) onSelect({ name, id: wrapper.uuid });
      });
    };

    window.changeColor = (hex) => {
      if (control.object) {
        control.object.traverse(n => {
          if (n.isMesh) {
            n.material.color.set(hex);
          }
        });
      }
    };

    window.setMode = (mode) => {
      if (!control.object) {
        console.warn('Select furniture first');
        return;
      }
      control.setMode(mode);
    };
    
    window.deleteSelected = () => {
      if (control.object) {
        const obj = control.object;
        control.detach();
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
        
        furnitureList.current.forEach(item => {
          item.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
            }
          });
        });
        
        target.traverse(n => {
          if (n.isMesh) {
            n.material.emissive = new THREE.Color(0x4a9eff);
            n.material.emissiveIntensity = 0.4;
          }
        });
        
        control.attach(target);
        if(onSelect) onSelect({ name: target.children[0].name, id: target.uuid });
      } else if (!control.dragging) {
        furnitureList.current.forEach(item => {
          item.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
            }
          });
        });
        
        control.detach();
        if(onSelect) onSelect(null);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // Keyboard
    const handleKeyDown = (event) => {
      if (event.key === 'g' || event.key === 'G') {
        event.preventDefault();
        control.setMode('translate');
      } else if (event.key === 'r' || event.key === 'R') {
        event.preventDefault();
        control.setMode('rotate');
      } else if (event.key === 's' || event.key === 'S') {
        event.preventDefault();
        control.setMode('scale');
      }
    };
    window.addEventListener('keydown', handleKeyDown);

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
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener("resize", handleResize);
      renderer.dispose();
      if(container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, [onSelect]);

  // Update room
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