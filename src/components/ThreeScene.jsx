import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // --- 1. Basic Setup ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeeeeee);

    const camera = new THREE.PerspectiveCamera(75, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(10, 8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.shadowMap.enabled = true; // Enable shadows
    container.appendChild(renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    // --- 2. Interaction Controls (The Gizmo) ---
    const transform = new TransformControls(camera, renderer.domElement);
    scene.add(transform);

    // Disable OrbitControls while dragging furniture
    transform.addEventListener("dragging-changed", (e) => {
      orbit.enabled = !e.value;
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

    // --- 5. Furniture Logic ---
    const furnitureList = [];
    const loader = new GLTFLoader();

    window.addChair = () => {
      loader.load("/models/chair.glb", (gltf) => {
        const model = gltf.scene;
        
        // Setup shadows for the model
        model.traverse((node) => {
          if (node.isMesh) {
            node.castShadow = true;
            node.receiveShadow = true;
          }
        });

        // Normalize size
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());
        
        model.position.sub(center);
        model.position.y = size.y / 2; // Sit on floor
        
        const targetHeight = 3.5;
        const scale = targetHeight / size.y;
        model.scale.setScalar(scale);

        scene.add(model);
        furnitureList.push(model);
        transform.attach(model); // Auto-select when added
      });
    };

    // --- 6. Direct Mouse Selection & Deletion ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / container.clientHeight) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(furnitureList, true);

      if (intersects.length > 0) {
        // Find the top-most object in our list
        let target = intersects[0].object;
        while (target.parent && !furnitureList.includes(target)) {
          target = target.parent;
        }
        transform.attach(target);
      } else {
        // Deselect if clicking the floor
        if (transform.object) transform.detach();
      }
    };

    const onKeyDown = (event) => {
      if (!transform.object) return;

      // Delete/Backspace to remove item
      if (event.key === "Delete" || event.key === "Backspace") {
        const selected = transform.object;
        transform.detach();
        scene.remove(selected);
        const index = furnitureList.indexOf(selected);
        if (index > -1) furnitureList.splice(index, 1);
      }

      // Hotkeys for Modes
      if (event.key === "g") transform.setMode("translate"); // Move
      if (event.key === "r") transform.setMode("rotate");    // Rotate
      if (event.key === "s") transform.setMode("scale");     // Scale
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);
    window.addEventListener("keydown", onKeyDown);

    // --- 7. Final Loop & Cleanup ---
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
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
      window.removeEventListener("keydown", onKeyDown);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%", outline: "none" }} />;
};

export default ThreeScene;