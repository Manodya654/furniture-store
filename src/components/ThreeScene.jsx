import { useEffect, useRef, useCallback } from "react";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { TransformControls } from "three/examples/jsm/controls/TransformControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

const FURNITURE_FOOTPRINTS = {
  chair:      { w: 0.7, d: 0.7 },
  table:      { w: 1.6, d: 1.1 },
  sofa:       { w: 2.1, d: 1.0 },
  bed:        { w: 2.0, d: 2.4 },
  desk:       { w: 1.3, d: 0.7 },
  lamp:       { w: 0.4, d: 0.4 },
  cupboard:   { w: 1.2, d: 0.5 },
  dining_set: { w: 2.0, d: 1.5 },
};

const TARGET_HEIGHTS = {
  chair: 0.9, table: 0.75, sofa: 0.9, bed: 0.6,
  desk: 0.75, lamp: 1.5, cupboard: 1.8, dining_set: 1.0,
};

// Pure helper — no hooks
function clampPosition(x, z, type, roomW, roomD) {
  const fp    = FURNITURE_FOOTPRINTS[type] || { w: 1, d: 1 };
  const halfW = roomW / 2 - fp.w / 2;
  const halfD = roomD / 2 - fp.d / 2;
  return {
    x: Math.max(-halfW, Math.min(halfW, isNaN(x) ? 0 : x)),
    y: 0,
    z: Math.max(-halfD, Math.min(halfD, isNaN(z) ? 0 : z)),
  };
}

const ThreeScene = ({
  onSelect, selected, roomDimensions, furniture, onUpdateFurniture
}) => {
  const mountRef        = useRef(null);
  const sceneRef        = useRef(null);
  const cameraRef       = useRef(null);
  const rendererRef     = useRef(null);
  const controlsRef     = useRef(null);
  const transformRef    = useRef(null);
  const furnitureMapRef = useRef({});
  const createdIdsRef   = useRef(new Set());
  const isDragging      = useRef(false);
  const roomDimRef      = useRef(roomDimensions);
  const onUpdateRef     = useRef(onUpdateFurniture);
  const furnitureRef    = useRef(furniture);
  const onSelectRef     = useRef(onSelect);

  // Keep refs current without re-running effects
  useEffect(() => { roomDimRef.current    = roomDimensions;     }, [roomDimensions]);
  useEffect(() => { onUpdateRef.current   = onUpdateFurniture;  }, [onUpdateFurniture]);
  useEffect(() => { furnitureRef.current  = furniture;          }, [furniture]);
  useEffect(() => { onSelectRef.current   = onSelect;           }, [onSelect]);

  // ── fallback procedural mesh ────────────────────────────────────────────────
  const makeFallback = useCallback((item) => {
    const g = new THREE.Group();
    g.userData.furnitureId   = item.id;
    g.userData.furnitureType = item.type;
    const c = item.color || '#8B7355';

    const bx = (w,h,d,col,px=0,py=0,pz=0) => {
      const m = new THREE.Mesh(
        new THREE.BoxGeometry(w,h,d),
        new THREE.MeshStandardMaterial({ color: col })
      );
      m.position.set(px,py,pz);
      m.castShadow = m.receiveShadow = true;
      g.add(m);
    };
    const cy = (r,h,col,px=0,py=0,pz=0) => {
      const m = new THREE.Mesh(
        new THREE.CylinderGeometry(r,r,h,12),
        new THREE.MeshStandardMaterial({ color: col })
      );
      m.position.set(px,py,pz);
      m.castShadow = true;
      g.add(m);
    };

    switch (item.type) {
      case 'chair':
        bx(0.5,0.05,0.5,c,0,0.45,0);
        bx(0.5,0.5,0.05,c,0,0.7,-0.225);
        [[-0.2,0.225,-0.2],[0.2,0.225,-0.2],
         [-0.2,0.225,0.2],[0.2,0.225,0.2]].forEach(([x,y,z])=>cy(0.02,0.45,'#5a4a3a',x,y,z));
        break;
      case 'table':
        bx(1.5,0.08,1,c,0,0.75,0);
        [[-0.65,0.375,-0.4],[0.65,0.375,-0.4],
         [-0.65,0.375,0.4],[0.65,0.375,0.4]].forEach(([x,y,z])=>cy(0.04,0.75,'#5a4a3a',x,y,z));
        break;
      case 'sofa':
        bx(2,0.4,0.85,c,0,0.3,0);
        bx(2,0.45,0.15,c,0,0.55,-0.35);
        bx(0.12,0.35,0.85,c,-1.06,0.4,0);
        bx(0.12,0.35,0.85,c,1.06,0.4,0);
        break;
      case 'bed':
        bx(1.9,0.2,2.3,c,0,0.15,0);
        bx(1.8,0.3,2.2,'#f0f0f0',0,0.35,0);
        bx(1.9,0.8,0.08,c,0,0.6,-1.15);
        bx(0.6,0.1,0.35,'#fff',-0.4,0.55,-0.8);
        bx(0.6,0.1,0.35,'#fff',0.4,0.55,-0.8);
        break;
      case 'desk':
        bx(1.2,0.05,0.6,c,0,0.75,0);
        bx(0.04,0.7,0.6,c,-0.58,0.375,0);
        bx(0.04,0.7,0.6,c,0.58,0.375,0);
        bx(0.5,0.15,0.55,'#6a5a4a',0.3,0.6,0);
        break;
      case 'cupboard':
        bx(1.2,1.8,0.5,c,0,0.9,0);
        bx(1.22,0.03,0.52,'#333',0,0.9,0);
        break;
      case 'dining_set':
        bx(1.5,0.08,1,c,0,0.75,0);
        [[-0.65,0.375,-0.4],[0.65,0.375,-0.4],
         [-0.65,0.375,0.4],[0.65,0.375,0.4]].forEach(([x,y,z])=>cy(0.04,0.75,'#5a4a3a',x,y,z));
        break;
      default:
        bx(0.8,0.8,0.8,c,0,0.4,0);
    }
    return g;
  }, []);

  // ── GLB loader ──────────────────────────────────────────────────────────────
  const loaderRef = useRef(new GLTFLoader());

  const loadModel = useCallback((item, onDone) => {
    loaderRef.current.load(
      `/models/${item.type}.glb`,
      (gltf) => {
        const model = gltf.scene;
        const box  = new THREE.Box3().setFromObject(model);
        const size = new THREE.Vector3();
        box.getSize(size);
        const maxDim = Math.max(size.x, size.y, size.z) || 1;
        const th = TARGET_HEIGHTS[item.type] || 1.0;
        model.scale.setScalar(th / maxDim);

        model.traverse(n => {
          if (!n.isMesh) return;
          n.castShadow = n.receiveShadow = true;
          const mats = Array.isArray(n.material) ? n.material : [n.material];
          n.material = mats.length === 1
            ? (() => { const m=mats[0].clone(); m.flatShading=false; return m; })()
            : mats.map(m => { const c=m.clone(); c.flatShading=false; return c; });
        });

        // Floor-align
        const b2 = new THREE.Box3().setFromObject(model);
        model.position.y -= b2.min.y;

        const wrapper = new THREE.Group();
        wrapper.userData.furnitureId   = item.id;
        wrapper.userData.furnitureType = item.type;
        wrapper.add(model);
        onDone(wrapper);
      },
      undefined,
      () => onDone(makeFallback(item))
    );
  }, [makeFallback]);

  // ── SCENE INIT (once) ───────────────────────────────────────────────────────
  useEffect(() => {
    const container = mountRef.current;
    if (!container) return;

    // Scene
    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x87ceeb);
    sceneRef.current = scene;

    // Camera
    const camera = new THREE.PerspectiveCamera(
      60, container.clientWidth / container.clientHeight, 0.1, 1000
    );
    camera.position.set(8, 6, 10);
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

    // Orbit
    const orbit = new OrbitControls(camera, renderer.domElement);
    orbit.enableDamping  = true;
    orbit.dampingFactor  = 0.05;
    orbit.minDistance    = 1;
    orbit.maxDistance    = 60;
    orbit.maxPolarAngle  = Math.PI / 2 - 0.015;
    controlsRef.current  = orbit;

    // Lights
    scene.add(new THREE.AmbientLight(0xffffff, 0.7));
    const sun = new THREE.DirectionalLight(0xffffff, 0.8);
    sun.position.set(10, 20, 10);
    sun.castShadow = true;
    sun.shadow.mapSize.set(2048, 2048);
    Object.assign(sun.shadow.camera, { left:-30, right:30, top:30, bottom:-30 });
    scene.add(sun);
    const fill = new THREE.DirectionalLight(0xffffff, 0.3);
    fill.position.set(-10, 15, -10);
    scene.add(fill);

    // TransformControls
    const tc = new TransformControls(camera, renderer.domElement);
    tc.setMode('translate');
    tc.showY = false;

    tc.addEventListener('dragging-changed', e => {
      orbit.enabled = !e.value;
      isDragging.current = e.value;
    });

    tc.addEventListener('objectChange', () => {
      const obj = tc.object;
      if (!obj?.userData.furnitureId) return;

      const rd = roomDimRef.current;
      const cp = clampPosition(
        obj.position.x, obj.position.z,
        obj.userData.furnitureType,
        rd.width, rd.depth
      );
      // Apply clamp immediately
      obj.position.set(cp.x, 0, cp.z);

      onUpdateRef.current(obj.userData.furnitureId, {
        position: { x: cp.x, y: 0, z: cp.z },
        rotation: obj.rotation.y * (180 / Math.PI),
        scale:    obj.scale.x,
      });
    });

    scene.add(tc);
    transformRef.current = tc;

    // Click to select
    const raycaster = new THREE.Raycaster();
    const mouse     = new THREE.Vector2();
    const onClick   = (e) => {
      if (isDragging.current) return;
      const rect = renderer.domElement.getBoundingClientRect();
      mouse.x =  ((e.clientX - rect.left) / rect.width ) * 2 - 1;
      mouse.y = -((e.clientY - rect.top ) / rect.height) * 2 + 1;
      raycaster.setFromCamera(mouse, camera);

      const hits = raycaster.intersectObjects(
        Object.values(furnitureMapRef.current), true
      );
      if (hits.length) {
        let t = hits[0].object;
        while (t.parent && !t.userData.furnitureId) t = t.parent;
        if (t.userData.furnitureId) {
          const item = furnitureRef.current.find(
            f => f.id === t.userData.furnitureId
          );
          if (item) onSelectRef.current?.(item);
        }
      } else {
        onSelectRef.current?.(null);
      }
    };
    renderer.domElement.addEventListener('click', onClick);

    // Keyboard shortcuts
    const onKey = (e) => {
      if (['INPUT','SELECT','TEXTAREA'].includes(e.target.tagName)) return;
      if (e.key === 'g' || e.key === 'G') {
        tc.setMode('translate'); tc.showX=true; tc.showY=false; tc.showZ=true;
      } else if (e.key === 'r' || e.key === 'R') {
        tc.setMode('rotate'); tc.showX=false; tc.showY=true; tc.showZ=false;
      } else if (e.key === 's' || e.key === 'S') {
        tc.setMode('scale'); tc.showX=true; tc.showY=true; tc.showZ=true;
      }
    };
    window.addEventListener('keydown', onKey);

    window.setMode = (mode) => {
      tc.setMode(mode);
      if      (mode === 'translate') { tc.showX=true;  tc.showY=false; tc.showZ=true;  }
      else if (mode === 'rotate')    { tc.showX=false; tc.showY=true;  tc.showZ=false; }
      else                           { tc.showX=true;  tc.showY=true;  tc.showZ=true;  }
    };

    // Animation
    let raf;
    const animate = () => {
      raf = requestAnimationFrame(animate);
      orbit.update();
      renderer.render(scene, camera);
    };
    animate();

    // Resize
    const onResize = () => {
      if (!container) return;
      camera.aspect = container.clientWidth / container.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(container.clientWidth, container.clientHeight);
    };
    window.addEventListener('resize', onResize);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', onResize);
      renderer.domElement.removeEventListener('click', onClick);
      tc.dispose();
      orbit.dispose();
      renderer.dispose();
      if (container.contains(renderer.domElement))
        container.removeChild(renderer.domElement);
      sceneRef.current = null;
      furnitureMapRef.current = {};
      createdIdsRef.current.clear();
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Room geometry ────────────────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    // Remove old room
    [...scene.children]
      .filter(c => c.userData.isRoom)
      .forEach(c => scene.remove(c));

    const addR = (mesh) => { mesh.userData.isRoom = true; scene.add(mesh); return mesh; };

    // Floor texture
    const makeTex = (style, color) => {
      const cv = document.createElement('canvas');
      cv.width = cv.height = 512;
      const ctx = cv.getContext('2d');
      ctx.fillStyle = color || '#d4b896';
      ctx.fillRect(0, 0, 512, 512);

      if (style === 'tiles') {
        ctx.strokeStyle = 'rgba(0,0,0,0.2)'; ctx.lineWidth = 4;
        for (let i = 0; i <= 512; i += 128) {
          ctx.beginPath(); ctx.moveTo(i,0); ctx.lineTo(i,512); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke();
        }
      } else if (style === 'wood') {
        for (let i = 0; i < 512; i += 30) {
          ctx.strokeStyle = `rgba(0,0,0,${0.08 + Math.random() * 0.1})`;
          ctx.lineWidth = 2;
          ctx.beginPath(); ctx.moveTo(0,i); ctx.lineTo(512,i); ctx.stroke();
        }
      } else if (style === 'marble') {
        for (let i = 0; i < 50; i++) {
          ctx.strokeStyle = 'rgba(255,255,255,0.12)'; ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.moveTo(Math.random()*512, Math.random()*512);
          ctx.bezierCurveTo(
            Math.random()*512,Math.random()*512,
            Math.random()*512,Math.random()*512,
            Math.random()*512,Math.random()*512
          );
          ctx.stroke();
        }
      } else if (style === 'carpet') {
        const id = ctx.getImageData(0,0,512,512);
        for (let i = 0; i < id.data.length; i += 4) {
          const n = Math.random()*20-10;
          id.data[i]+=n; id.data[i+1]+=n; id.data[i+2]+=n;
        }
        ctx.putImageData(id, 0, 0);
      }

      const t = new THREE.CanvasTexture(cv);
      t.wrapS = t.wrapT = THREE.RepeatWrapping;
      t.repeat.set(4, 4);
      return t;
    };

    // Floor
    const floorMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(roomDimensions.width, roomDimensions.depth),
      new THREE.MeshStandardMaterial({
        map: makeTex(roomDimensions.floorStyle, roomDimensions.floorColor)
      })
    );
    floorMesh.rotation.x = -Math.PI / 2;
    floorMesh.receiveShadow = true;
    addR(floorMesh);

    // Wall helper
    const wallMat = new THREE.MeshStandardMaterial({
      color: roomDimensions.wallColor || '#e8e8e8'
    });
    const mkWall = (w, h, pos, rotY = 0) => {
      const m = new THREE.Mesh(new THREE.PlaneGeometry(w, h), wallMat.clone());
      m.position.set(...pos);
      m.rotation.y = rotY;
      m.receiveShadow = true;
      m.userData.isRoom = true;
      scene.add(m);
      return m;
    };

    const W = roomDimensions.width;
    const H = roomDimensions.height;
    const D = roomDimensions.depth;

    const bk = mkWall(W, H, [0, H/2, -D/2]);
    const lw = mkWall(D, H, [-W/2, H/2, 0],  Math.PI/2);
    const rw = mkWall(D, H, [ W/2, H/2, 0], -Math.PI/2);
    const fw = mkWall(W, H, [0, H/2,  D/2],  Math.PI);

    const ceilMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(W, D),
      new THREE.MeshStandardMaterial({ color: 0xf5f5f5, side: THREE.FrontSide })
    );
    ceilMesh.rotation.x = Math.PI / 2;
    ceilMesh.position.y = H;
    addR(ceilMesh);

    // Wall visibility from camera side
    const cam  = cameraRef.current;
    const orb  = controlsRef.current;
    const updV = () => {
      if (!cam) return;
      const p = cam.position;
      fw.visible = p.z <=  D/2;
      bk.visible = p.z >= -D/2;
      rw.visible = p.x <=  W/2;
      lw.visible = p.x >= -W/2;
      ceilMesh.visible = p.y <= H;
    };
    if (orb) orb.addEventListener('change', updV);
    updV();
    return () => { if (orb) orb.removeEventListener('change', updV); };
  }, [roomDimensions]);

  // ── Sync furniture → 3-D ────────────────────────────────────────────────────
  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) return;

    const ids = new Set(furniture.map(f => f.id));

    // Remove deleted items
    Object.keys(furnitureMapRef.current).forEach(id => {
      if (!ids.has(id)) {
        const obj = furnitureMapRef.current[id];
        if (transformRef.current?.object === obj) transformRef.current.detach();
        scene.remove(obj);
        delete furnitureMapRef.current[id];
        createdIdsRef.current.delete(id);
      }
    });

    // Add / update
    furniture.forEach(item => {
      const rd = roomDimRef.current;
      const cp = clampPosition(
        item.position?.x || 0,
        item.position?.z || 0,
        item.type,
        rd.width, rd.depth
      );

      if (!createdIdsRef.current.has(item.id)) {
        createdIdsRef.current.add(item.id);

        loadModel(item, (wrapper) => {
          if (!sceneRef.current) return; // component unmounted
          wrapper.position.set(cp.x, 0, cp.z);
          if (item.rotation) wrapper.rotation.y = item.rotation * (Math.PI / 180);
          if (item.scale)    wrapper.scale.setScalar(item.scale);
          sceneRef.current.add(wrapper);
          furnitureMapRef.current[item.id] = wrapper;
        });
      } else {
        const obj = furnitureMapRef.current[item.id];
        if (!obj) return;
        obj.position.set(cp.x, 0, cp.z);
        if (item.rotation !== undefined) obj.rotation.y = item.rotation * (Math.PI / 180);
        if (item.scale    !== undefined) obj.scale.setScalar(item.scale);
        if (item.color) {
          obj.traverse(n => {
            if (n.isMesh && !n.userData.keepColor) {
              if (Array.isArray(n.material)) {
                n.material.forEach(m => m.color.set(item.color));
              } else {
                n.material.color.set(item.color);
              }
            }
          });
        }
      }
    });
  }, [furniture, loadModel]);

  // ── Selection highlight ──────────────────────────────────────────────────────
  useEffect(() => {
    const tc = transformRef.current;
    if (!tc) return;

    // Clear all
    Object.values(furnitureMapRef.current).forEach(obj => {
      obj.traverse(n => {
        if (n.isMesh) {
          if (!n.material.emissive) return;
          n.material.emissive.set(0x000000);
          n.material.emissiveIntensity = 0;
        }
      });
    });

    if (selected && furnitureMapRef.current[selected.id]) {
      const obj = furnitureMapRef.current[selected.id];
      obj.traverse(n => {
        if (n.isMesh) {
          if (!n.material.emissive) return;
          n.material.emissive.set(0x1adb8a);
          n.material.emissiveIntensity = 0.25;
        }
      });
      tc.attach(obj);
    } else {
      tc.detach();
    }
  }, [selected]);

  return <div ref={mountRef} style={{ width: '100%', height: '100%' }} />;
};

export default ThreeScene;