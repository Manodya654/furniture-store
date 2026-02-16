import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = ({ onSelect, roomDimensions }) => {
  const mountRef = useRef(null);
  const furnitureList = useRef([]);
  const roomRef = useRef(null);
  const sceneRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    const scene = new THREE.Scene();
    sceneRef.current = scene;
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
    
    const gizmo = transform.getHelper ? transform.getHelper() : transform;
    scene.add(gizmo);

    transform.addEventListener("dragging-changed", (e) => {
      orbit.enabled = !e.value;
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

    // --- Lighting ---
    scene.add(new THREE.AmbientLight(0xffffff, 0.6));
    const light = new THREE.DirectionalLight(0xffffff, 1);
    light.position.set(10, 20, 10);
    light.castShadow = true;
    scene.add(light);

    // --- Studio Box ---
    const room = new THREE.Mesh(
      new THREE.BoxGeometry(roomDimensions.width, roomDimensions.height, roomDimensions.depth),
      new THREE.MeshStandardMaterial({ color: roomDimensions.color, side: THREE.BackSide })
    );
    room.position.y = roomDimensions.height / 2;
    room.receiveShadow = true;
    scene.add(room);
    roomRef.current = room;

    const loader = new GLTFLoader();

    // --- Global Logic ---
    window.addAsset = (name) => {
      loader.load(`/models/${name}.glb`, (gltf) => {
        const model = gltf.scene;
        model.name = name;

        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());

        const targetHeight = 8;
        model.scale.setScalar(targetHeight / size.y);
        
        model.traverse(n => {
          if (n.isMesh) {
            n.castShadow = true;
            n.receiveShadow = true;
            n.material = n.material.clone();
          }
        });

        const wrapper = new THREE.Group();
        wrapper.add(model);
        scene.add(wrapper);

        model.position.y = -box.min.y;
        
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

  // Update room dimensions when they change
  useEffect(() => {
    if (roomRef.current && sceneRef.current) {
      sceneRef.current.remove(roomRef.current);
      
      const room = new THREE.Mesh(
        new THREE.BoxGeometry(roomDimensions.width, roomDimensions.height, roomDimensions.depth),
        new THREE.MeshStandardMaterial({ color: roomDimensions.color, side: THREE.BackSide })
      );
      room.position.y = roomDimensions.height / 2;
      room.receiveShadow = true;
      sceneRef.current.add(room);
      roomRef.current = room;
    }
  }, [roomDimensions]);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;