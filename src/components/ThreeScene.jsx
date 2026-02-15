import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // --- 1. Scene & Camera ---
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaeaea);

    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(8, 8, 12); // Moved back to see the whole room

    // --- 2. Renderer ---
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // --- 3. Lights ---
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // --- 4. Furniture Creator Functions ---
    // Defined inside useEffect so they have access to 'scene'
    const createChair = (x = 0, z = 0) => {
      const chairGroup = new THREE.Group();
      const seat = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 0.3, 1.5),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      seat.position.y = 1;
      chairGroup.add(seat);

      const backrest = new THREE.Mesh(
        new THREE.BoxGeometry(1.5, 1.5, 0.3),
        new THREE.MeshStandardMaterial({ color: 0x8b4513 })
      );
      backrest.position.set(0, 1.8, -0.6);
      chairGroup.add(backrest);

      const legGeo = new THREE.BoxGeometry(0.2, 1, 0.2);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x654321 });
      [[-0.6, 0.5, -0.6], [0.6, 0.5, -0.6], [-0.6, 0.5, 0.6], [0.6, 0.5, 0.6]].forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(...pos);
        chairGroup.add(leg);
      });

      chairGroup.position.set(x, 0, z);
      scene.add(chairGroup);
      return chairGroup;
    };

    const createTable = (x = 2, z = 0) => {
      const tableGroup = new THREE.Group();
      const top = new THREE.Mesh(
        new THREE.BoxGeometry(4, 0.3, 2.5),
        new THREE.MeshStandardMaterial({ color: 0xdeb887 })
      );
      top.position.y = 2;
      tableGroup.add(top);

      const legGeo = new THREE.BoxGeometry(0.3, 2, 0.3);
      const legMat = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
      [[-1.8, 1, -1], [1.8, 1, -1], [-1.8, 1, 1], [1.8, 1, 1]].forEach(pos => {
        const leg = new THREE.Mesh(legGeo, legMat);
        leg.position.set(...pos);
        tableGroup.add(leg);
      });

      tableGroup.position.set(x, 0, z);
      scene.add(tableGroup);
    };

    // --- 5. Build Room & Add Furniture ---
    const roomWidth = 12;
    const roomHeight = 6;
    const roomDepth = 10;

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomDepth),
      new THREE.MeshStandardMaterial({ color: 0xdedede })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Back wall
    const backWall = new THREE.Mesh(new THREE.PlaneGeometry(roomWidth, roomHeight), new THREE.MeshStandardMaterial({ color: 0xffffff }));
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    scene.add(backWall);

    // Call functions to actually show items
    createTable(0, 0);
    createChair(-3, 0);

    // Expose to window if you want to call them from console
    window.addChair = () => createChair(Math.random() * 5, Math.random() * 5);

    // --- 6. Animation ---
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    // --- 7. Resize & Cleanup ---
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
      cancelAnimationFrame(animationId);
      renderer.dispose();
      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  // inside ThreeScene.jsx
return (
  <div 
    ref={mountRef} 
    style={{ width: "100%", height: "100%" }} 
  />
);
};

export default ThreeScene;