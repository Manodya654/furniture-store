import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ onSelect, roomDimensions }) => {
  const mountRef = useRef(null);
  const sceneRef = useRef(null);
  const cameraRef = useRef(null);
  const rendererRef = useRef(null);
  const controlsRef = useRef(null);
  const transformRef = useRef(null);
  const furnitureList = useRef([]);

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

    // TransformControls - CLEAN setup for r168
    const transformControl = new TransformControls(camera, renderer.domElement);
    transformControl.addEventListener('dragging-changed', (event) => {
      controls.enabled = !event.value;
    });
    scene.add(transformControl);
    transformRef.current = transformControl;

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
    const wallMat = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8',
      side: THREE.FrontSide
    });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMat.clone()
    );
    backWall.position.set(0, roomDimensions.height / 2, -roomDimensions.depth / 2);
    backWall.receiveShadow = true;
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMat.clone()
    );
    leftWall.position.set(-roomDimensions.width / 2, roomDimensions.height / 2, 0);
    leftWall.rotation.y = Math.PI / 2;
    leftWall.receiveShadow = true;
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.depth, roomDimensions.height),
      wallMat.clone()
    );
    rightWall.position.set(roomDimensions.width / 2, roomDimensions.height / 2, 0);
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.receiveShadow = true;
    scene.add(rightWall);

    const frontWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.height),
      wallMat.clone()
    );
    frontWall.position.set(0, roomDimensions.height / 2, roomDimensions.depth / 2);
    frontWall.rotation.y = Math.PI;
    frontWall.receiveShadow = true;
    scene.add(frontWall);

    const ceiling = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.FrontSide })
    );
    ceiling.rotation.x = Math.PI / 2;
    ceiling.position.y = roomDimensions.height;
    scene.add(ceiling);

    // Wall visibility
    const updateWalls = () => {
      const pos = camera.position;
      const hw = roomDimensions.width / 2;
      const hd = roomDimensions.depth / 2;
      
      frontWall.visible = !(pos.z > hd);
      backWall.visible = !(pos.z < -hd);
      rightWall.visible = !(pos.x > hw);
      leftWall.visible = !(pos.x < -hw);
      ceiling.visible = !(pos.y > roomDimensions.height);
    };
    controls.addEventListener('change', updateWalls);

    // Furniture loader
    const loader = new GLTFLoader();
    const positions = [];
    
    window.addAsset = (name) => {
      loader.load(`/models/${name}.glb`, (gltf) => {
        const model = gltf.scene;
        
        // Scale to 1m
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        model.scale.setScalar(1.0 / size.y);
        
        // Enable shadows & smooth shading
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
        
        // Position on floor
        box.setFromObject(model);
        model.position.y = -box.min.y;

        // Random spawn with collision
        let pos;
        let attempts = 0;
        while (attempts < 50) {
          pos = {
            x: (Math.random() - 0.5) * roomDimensions.width * 0.8,
            z: (Math.random() - 0.5) * roomDimensions.depth * 0.8
          };
          
          let valid = true;
          for (let p of positions) {
            const dist = Math.sqrt((pos.x - p.x) ** 2 + (pos.z - p.z) ** 2);
            if (dist < 1.5) {
              valid = false;
              break;
            }
          }
          
          if (valid) break;
          attempts++;
        }
        
        positions.push(pos);
        wrapper.position.set(pos.x, 0, pos.z);
        
        scene.add(wrapper);
        furnitureList.current.push(wrapper);
        
        // Select and highlight
        transformControl.attach(wrapper);
        wrapper.traverse(n => {
          if (n.isMesh) {
            n.material.emissive = new THREE.Color(0x4a9eff);
            n.material.emissiveIntensity = 0.4;
          }
        });
        
        if (onSelect) onSelect({ name, id: wrapper.uuid });
      });
    };

    window.changeColor = (hex) => {
      if (transformControl.object) {
        transformControl.object.traverse(n => {
          if (n.isMesh) n.material.color.set(hex);
        });
      }
    };

    window.setMode = (mode) => {
      transformControl.setMode(mode);
    };

    window.deleteSelected = () => {
      if (transformControl.object) {
        const obj = transformControl.object;
        transformControl.detach();
        scene.remove(obj);
        furnitureList.current = furnitureList.current.filter(i => i !== obj);
        if (onSelect) onSelect(null);
      }
    };

    // Click selection
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onClick = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const hits = raycaster.intersectObjects(furnitureList.current, true);

      if (hits.length > 0) {
        let target = hits[0].object;
        while (target.parent && !furnitureList.current.includes(target)) {
          target = target.parent;
        }
        
        // Remove all glows
        furnitureList.current.forEach(item => {
          item.traverse(n => {
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
        if (onSelect) onSelect({ name: target.children[0].name, id: target.uuid });
      } else {
        // Deselect
        furnitureList.current.forEach(item => {
          item.traverse(n => {
            if (n.isMesh) {
              n.material.emissive = new THREE.Color(0x000000);
              n.material.emissiveIntensity = 0;
            }
          });
        });
        
        transformControl.detach();
        if (onSelect) onSelect(null);
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

    // Animation
    const animate = () => {
      requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
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
  }, [onSelect, roomDimensions]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;