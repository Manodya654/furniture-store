import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // 1. Initial Dimensions
    let width = container.clientWidth;
    let height = container.clientHeight;

    // 2. Scene Setup
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaeaea);

    // 3. Camera Setup
    const camera = new THREE.PerspectiveCamera(
      75,
      width / height,
      0.1,
      1000
    );
    camera.position.set(0, 5, 10);

    // 4. Renderer Setup
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    // 5. Controls Setup (MUST be after camera and renderer)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enablePan = true;
    controls.enableZoom = true;

    // 6. Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(5, 10, 5);
    scene.add(directionalLight);

    // 7. Room dimensions
    const roomWidth = 12;
    const roomHeight = 6;
    const roomDepth = 10;

    // Floor
    const floorGeometry = new THREE.PlaneGeometry(roomWidth, roomDepth);
    const floorMaterial = new THREE.MeshStandardMaterial({ color: 0xdedede });
    const floor = new THREE.Mesh(floorGeometry, floorMaterial);
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // Walls
    const wallMaterial = new THREE.MeshStandardMaterial({ color: 0xffffff });

    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomWidth, roomHeight),
      wallMaterial
    );
    backWall.position.set(0, roomHeight / 2, -roomDepth / 2);
    scene.add(backWall);

    const leftWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDepth, roomHeight),
      wallMaterial
    );
    leftWall.rotation.y = Math.PI / 2;
    leftWall.position.set(-roomWidth / 2, roomHeight / 2, 0);
    scene.add(leftWall);

    const rightWall = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDepth, roomHeight),
      wallMaterial
    );
    rightWall.rotation.y = -Math.PI / 2;
    rightWall.position.set(roomWidth / 2, roomHeight / 2, 0);
    scene.add(rightWall);

    // 8. Test cube
    const cubeGeometry = new THREE.BoxGeometry(2, 2, 2);
    const cubeMaterial = new THREE.MeshStandardMaterial({ color: 0x8b4513 });
    const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
    cube.position.y = 1;
    scene.add(cube);

    // 9. Resize Handler
    const handleResize = () => {
      width = container.clientWidth;
      height = container.clientHeight;
      
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      
      renderer.setSize(width, height);
    };
    window.addEventListener("resize", handleResize);

    // 10. Animation Loop
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);

      cube.rotation.y += 0.01;

      controls.update(); 
      renderer.render(scene, camera);
    };

    animate();

    // 11. Cleanup
    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationId);
      
      // Dispose of geometries and materials to prevent memory leaks
      cubeGeometry.dispose();
      cubeMaterial.dispose();
      floorGeometry.dispose();
      floorMaterial.dispose();
      // ... dispose other walls similarly if needed
      
      renderer.dispose();

      if (container && renderer.domElement.parentNode === container) {
        container.removeChild(renderer.domElement);
      }
    };
  }, []);

  return (
    <div 
      ref={mountRef} 
      style={{ 
        width: "100%", 
        height: "80vh", 
        overflow: "hidden",
        backgroundColor: "#000" // Helps see if the div itself is rendering
      }} 
    />
  );
};

export default ThreeScene;