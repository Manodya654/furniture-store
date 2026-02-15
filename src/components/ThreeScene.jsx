import { useEffect, useRef } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const ThreeScene = () => {
  const mountRef = useRef(null);

  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    let width = container.clientWidth;
    let height = container.clientHeight;

    // SCENE
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0xeaeaea);

    // CAMERA
    const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
    camera.position.set(8, 8, 12);

    // RENDERER
    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    // LIGHTS
    scene.add(new THREE.AmbientLight(0xffffff, 0.8));

    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    // FLOOR
    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 10),
      new THREE.MeshStandardMaterial({ color: 0xdedede })
    );
    floor.rotation.x = -Math.PI / 2;
    scene.add(floor);

    // BACK WALL
    const backWall = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 6),
      new THREE.MeshStandardMaterial({ color: 0xffffff })
    );
    backWall.position.set(0, 3, -5);
    scene.add(backWall);

    // ---------------------------
    // LOAD GLB MODEL
    // ---------------------------
    const loader = new GLTFLoader();

    loader.load(
      "/models/chair.glb", 
      (gltf) => {
        const model = gltf.scene;

        // Center the model
        const box = new THREE.Box3().setFromObject(model);
        const center = box.getCenter(new THREE.Vector3());
        model.position.sub(center);

        // Put it on floor
        const size = box.getSize(new THREE.Vector3());
        model.position.y += size.y / 2;

        // Scale if needed
        model.scale.set(1.5, 1.5, 1.5);

        // Position in room
        model.position.set(0, 0, 0);

        scene.add(model);
      },
      undefined,
      (error) => {
        console.error("GLB load error:", error);
      }
    );

    // ANIMATION LOOP
    let animationId;
    const animate = () => {
      animationId = requestAnimationFrame(animate);
      controls.update();
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
      cancelAnimationFrame(animationId);
      renderer.dispose();
      container.removeChild(renderer.domElement);
    };
  }, []);

  return <div ref={mountRef} style={{ width: "100%", height: "100vh" }} />;
};

export default ThreeScene;