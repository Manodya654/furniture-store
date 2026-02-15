import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xf0f0f0);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(8, 8, 12);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // CONTROLS
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping = true;

    const transform = new TransformControls(camera, renderer.domElement);
    scene.add(transform);

    // Disable OrbitControls while using TransformControls
    transform.addEventListener("dragging-changed", (e) => {
      orbit.enabled = !e.value;
    });

    // LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // ROOM
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(15, 15),
      new THREE.MeshStandardMaterial({ color: 0xcccccc })
    );
    floor.rotation.x = -Math.PI / 2;
    floor.name = "Floor"; // Ignore selection on floor
    scene.add(floor);

    // OBJECT MANAGEMENT
    const objects = [];

    const createFurniture = (type) => {
      const group = new THREE.Group();
      let mesh;

      if (type === "chair") {
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(1.5, 1.5, 1.5),
          new THREE.MeshStandardMaterial({ color: 0x8b4513 })
        );
      } else {
        mesh = new THREE.Mesh(
          new THREE.BoxGeometry(4, 1, 2.5),
          new THREE.MeshStandardMaterial({ color: 0xdeb887 })
        );
      }

      group.add(mesh);
      group.position.set(Math.random() * 4 - 2, 1, Math.random() * 4 - 2);
      scene.add(group);
      objects.push(group);
      
      // Auto-select the new item
      transform.attach(group);
    };

    // EXPOSE TO WINDOW
    window.addFurniture = (type) => createFurniture(type);
    window.setTransformMode = (mode) => transform.setMode(mode);
    window.deleteSelected = () => {
      if (transform.object) {
        const obj = transform.object;
        transform.detach();
        scene.remove(obj);
        const index = objects.indexOf(obj);
        if (index > -1) objects.splice(index, 1);
      }
    };

    // SELECTION LOGIC (Raycaster)
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    const onPointerDown = (event) => {
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(objects, true);

      if (intersects.length > 0) {
        // Find the top-most parent group
        let target = intersects[0].object;
        while (target.parent && target.parent.type !== "Scene") {
          target = target.parent;
        }
        transform.attach(target);
      } else {
        // Only detach if we didn't click the floor or controls
        const floorIntersect = raycaster.intersectObject(floor);
        if (floorIntersect.length > 0) transform.detach();
      }
    };

    renderer.domElement.addEventListener("pointerdown", onPointerDown);

    // ANIMATION
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
    };
    animate();

    // RESIZE
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
      renderer.domElement.removeEventListener("pointerdown", onPointerDown);
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100%" }} />;
};

export default ThreeScene;