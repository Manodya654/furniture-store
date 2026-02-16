import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ onSelect }) => {
  const mountRef = useRef(null);
  const furnitureList = useRef([]); 

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(15, 15, 15);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    container.appendChild(renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    // --- Transform Controls (MOVEMENT GIZMO) ---
    const transform = new TransformControls(camera, renderer.domElement);
    
    // THE FIX: Add the gizmo safely to avoid the "Blank Screen" crash
    const gizmo = transform.getHelper ? transform.getHelper() : transform;
    scene.add(gizmo);

    transform.addEventListener("dragging-changed", (e) => {
      orbit.enabled = !e.value;
    });

    // --- Inside useEffect, after creating 'transform' ---

transform.addEventListener("change", () => {
  if (transform.object) {
    const obj = transform.object;
    
    // 1. Calculate the actual size of the object to keep it inside
    const box = new THREE.Box3().setFromObject(obj);
    const size = box.getSize(new THREE.Vector3());
    
    // 2. Set Room Boundaries (based on your BoxGeometry(30, 15, 30))
    const halfWidth = 15;
    const halfDepth = 15;
    const roomFloor = 0;
    const roomCeiling = 15;

    // 3. Constrain X (Left/Right Walls)
    const paddingX = size.x / 2;
    if (obj.position.x > halfWidth - paddingX) obj.position.x = halfWidth - paddingX;
    if (obj.position.x < -halfWidth + paddingX) obj.position.x = -halfWidth + paddingX;

    // 4. Constrain Z (Front/Back Walls)
    const paddingZ = size.z / 2;
    if (obj.position.z > halfDepth - paddingZ) obj.position.z = halfDepth - paddingZ;
    if (obj.position.z < -halfDepth + paddingZ) obj.position.z = -halfDepth + paddingZ;

    // 5. Constrain Y (Floor/Ceiling)
    // This stops it from passing through the floor
    if (obj.position.y < roomFloor) obj.position.y = roomFloor;
    if (obj.position.y > roomCeiling - size.y) obj.position.y = roomCeiling - size.y;
  }
});

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    light.castShadow = true;
    scene.add(light);

    // --- Studio Box ---
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(30, 15, 30),
      new THREE.MeshStandardMaterial({ color: 0xdddddd, side: THREE.BackSide })
    );
    room.position.y = 7.4; 
    room.receiveShadow = true;
    scene.add(room);

    const loader = new GLTFLoader();

    // --- Global Logic ---
    window.addAsset = (name) => {
      loader.load(`/models/${name}.glb`, (gltf) => {
        const model = gltf.scene;
        model.name = name;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        const targetHeight = 8; // Increase this (e.g., 8, 10, or 12) to make furniture bigger
        model.scale.setScalar(targetHeight / size.y);
        
        model.traverse(n => {
          if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            n.material = n.material.clone();
          }
        });

        // Wrapper to fix "Can't Move" issues with odd GLB origins
        const wrapper = new THREE.Group();
        wrapper.add(model);
        scene.add(wrapper);

        model.position.y = -box.min.y; 

        scene.add(wrapper);
        
        furnitureList.current.push(wrapper);
        transform.attach(wrapper);
        if(onSelect) onSelect({ name, id: wrapper.uuid });
      });
    };

    window.changeColor = (hex) => {
      if (transform.object) {
        transform.object.traverse(n => {
          if (n.isMesh) n.material.color.set(hex);
        });
      }
    };

    window.setMode = (mode) => transform.setMode(mode);
    window.deleteSelected = () => {
      if (transform.object) {
        const obj = transform.object;
        transform.detach();
        scene.remove(obj);
        furnitureList.current = furnitureList.current.filter(i => i !== obj);
        if(onSelect) onSelect(null);
      }
    };

    // --- Selection ---
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
        transform.attach(target);
        if(onSelect) onSelect({ name: target.children[0].name, id: target.uuid });
      } else if (!transform.dragging) {
        transform.detach();
        if(onSelect) onSelect(null);
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    const animate = () => {
      requestAnimationFrame(animate);
      orbit.update();
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

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;