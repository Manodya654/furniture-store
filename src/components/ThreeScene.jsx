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
    camera.position.set(12, 12, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap; 
    container.appendChild(renderer.domElement);

    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    const transform = new TransformControls(camera, renderer.domElement);
    scene.add(transform);
    transform.addEventListener("dragging-changed", (e) => (orbit.enabled = !e.value));

    // --- Lights for that "Shaded" look ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const mainLight = new THREE.DirectionalLight(0xffffff, 1);
    mainLight.position.set(10, 20, 10);
    mainLight.castShadow = true;
    // Improve shadow quality
    mainLight.shadow.mapSize.width = 1024;
    mainLight.shadow.mapSize.height = 1024;
    scene.add(mainLight);

    // --- The Studio Box ---
    const roomSize = 25;
    const roomGeo = new THREE.BoxGeometry(roomSize, 12, roomSize);
    const roomMat = new THREE.MeshStandardMaterial({ color: 0xffffff, side: THREE.BackSide });
    const room = new THREE.Mesh(roomGeo, roomMat);
    room.position.y = 5.95; // Lifted so the "floor" of the box is at y=0
    room.receiveShadow = true;
    scene.add(room);

    const loader = new GLTFLoader();

    // EXPOSE METHODS TO WINDOW
    window.addAsset = (name) => {
      loader.load(`/models/${name}.glb`, (gltf) => {
        const model = gltf.scene;
        model.name = name;
        
        model.traverse(n => {
          if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            // Ensure material is unique so we can change colors individually
            n.material = n.material.clone();
          }
        });

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        
        // Auto-scale to a visible size
        const targetHeight = 4; 
        model.scale.setScalar(targetHeight / size.y);
        
        // Position on the floor
        model.position.set(0, 0, 0);
        
        scene.add(model);
        furnitureList.current.push(model);
        transform.attach(model);
        if(onSelect) onSelect({ name, id: model.uuid });
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

    // --- Interaction ---
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(furnitureList.current, true);

      if (intersects.length > 0) {
        let root = intersects[0].object;
        while (root.parent && !furnitureList.current.includes(root)) root = root.parent;
        transform.attach(root);
        if(onSelect) onSelect({ name: root.name, id: root.uuid });
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