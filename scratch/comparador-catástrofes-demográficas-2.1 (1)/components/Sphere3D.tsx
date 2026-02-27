import React, { useMemo, useRef, useState, useEffect } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

interface Sphere3DProps {
  deaths: number;
  color: string;
  maxComparisonDeaths: number; // The max deaths of the two currently selected (for scaling)
  resetTrigger: number; // Increment to trigger reset
  zoomLevel: number; // Unified zoom level (1.0 = 100%, 1.6 = 160%)
  shape: 'cube' | 'sphere'; // New prop for shape toggling
}

// Controls the camera movement based on props (External buttons + Auto Reset)
const CameraController = ({
  maxComparisonDeaths,
  resetTrigger,
  zoomLevel
}: {
  maxComparisonDeaths: number;
  resetTrigger: number;
  zoomLevel: number;
}) => {
  const { camera, gl } = useThree();
  const controlsRef = useRef<any>(null);

  // Calculate the base ideal distance to fit the LARGEST of the two datasets.
  const maxVolumeSide = Math.cbrt(maxComparisonDeaths);
  const spreadScale = maxVolumeSide / 25;
  // Base distance factor.
  // Increased from 2.2 to 2.8 to ensure the sphere doesn't touch the borders with default zoom (1.6)
  const baseDistance = Math.max(12, spreadScale * 2.8);

  // Calculate actual target distance based on zoom level.
  // Higher zoom level = Lower distance (closer camera).
  const targetDistance = baseDistance / zoomLevel;

  // UseFrame for smooth interpolation of zoom to keep it synchronized smoothly
  useFrame(() => {
    if (controlsRef.current) {
      const currentPos = camera.position;
      const currentDist = currentPos.length();

      // Simple lerp for distance if significantly different
      // This coordinates the zoom nicely when driven by external state
      if (Math.abs(currentDist - targetDistance) > 0.05) {
        const dir = currentPos.clone().normalize();
        // Lerp factor
        const newDist = THREE.MathUtils.lerp(currentDist, targetDistance, 0.1);
        camera.position.copy(dir.multiplyScalar(newDist));
        controlsRef.current.update();
      }
    }
  });

  // Handle Reset and Initial Scale
  useEffect(() => {
    if (controlsRef.current && resetTrigger > 0) {
      controlsRef.current.reset();

      // Move camera to the calculated position immediately on reset
      // We assume a nice angle like (0.7, 0.7, 1) normalized
      const dir = new THREE.Vector3(0.7, 0.7, 1).normalize();
      camera.position.copy(dir.multiplyScalar(targetDistance));
      camera.lookAt(0, 0, 0);
      controlsRef.current.update();
    }
  }, [resetTrigger, maxComparisonDeaths]); // Only reset on explicit trigger

  return (
    <OrbitControls
      ref={controlsRef}
      enablePan={true}
      enableZoom={false} // Disable internal zoom to enforce unified synchronization via props
      enableRotate={true}
      autoRotate={false}
      enableDamping={true}
      dampingFactor={0.1}
    />
  );
};

// Create a highly optimized human silhouette (bathroom sign style) procedurally
const createSilhouetteTexture = () => {
  const canvas = document.createElement('canvas');
  // Points in Three.js are always square. Making the canvas 128x128 prevents stretching!
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  if (ctx) {
    // Translate x by +32 to center the originally 64-width drawing into the 128-width canvas
    ctx.translate(32, 0);
    ctx.fillStyle = '#ffffff';

    // 1. Head
    ctx.beginPath();
    ctx.arc(32, 18, 12, 0, Math.PI * 2);
    ctx.fill();

    // 2. Shoulders and Upper Torso
    ctx.beginPath();
    ctx.moveTo(16, 42);
    ctx.quadraticCurveTo(16, 32, 24, 32);
    ctx.lineTo(40, 32);
    ctx.quadraticCurveTo(48, 32, 48, 42);
    ctx.lineTo(48, 75);
    ctx.lineTo(16, 75);
    ctx.fill();

    // 3. Round bottoms of arms
    ctx.beginPath();
    ctx.arc(19, 75, 3, 0, Math.PI);
    ctx.arc(45, 75, 3, 0, Math.PI);
    ctx.fill();

    // 4. Lower Torso
    ctx.fillRect(24, 75, 16, 10);

    // 5. Legs
    ctx.fillRect(24, 85, 6, 35); // Left leg
    ctx.fillRect(34, 85, 6, 35); // Right leg

    // 6. Round bottoms of legs
    ctx.beginPath();
    ctx.arc(27, 120, 3, 0, Math.PI);
    ctx.arc(37, 120, 3, 0, Math.PI);
    ctx.fill();

    // 7. Cut out gaps to separate arms from torso
    ctx.globalCompositeOperation = 'destination-out';
    ctx.fillRect(22, 42, 2, 40);
    ctx.fillRect(40, 42, 2, 40);
    ctx.globalCompositeOperation = 'source-over';
  }

  const texture = new THREE.CanvasTexture(canvas);
  // Usar NearestFilter quita el anti-aliasing suavizado y elimina el "halo gris o blanco" en los bordes.
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  return texture;
};

const PointsCloud = ({ count, color, shape }: { count: number; color: string; shape: 'cube' | 'sphere' }) => {
  const meshRef = useRef<THREE.Points>(null!);

  // Guarantee the texture is perfectly ready on mount instantly
  const silhouetteTexture = useMemo(() => createSilhouetteTexture(), []);

  // Create particles with physically-based aesthetic lighting
  // Renderizar la figura total literalmente y con todo su impacto.
  const renderCount = count;

  // The visual size is determined by the cubic root of the ACTUAL death count.
  // This maintains the "Comparative Scale" even if we cap the drawn points.
  const volumeScale = Math.cbrt(count);
  const spread = volumeScale / 25; // Scale down to Scene Units (represents side of cube or diameter of sphere)

  const pos = new Float32Array(renderCount * 3);
  const cols = new Float32Array(renderCount * 3);

  const baseColor = new THREE.Color(color);
  // Light Vector: coming from Top-Right-Front
  const lightDir = new THREE.Vector3(1, 1, 1).normalize();

  for (let i = 0; i < renderCount; i++) {
    let x, y, z;

    if (i === 0) {
      // Garantizar que siempre haya un muñeco en el centro exacto para el close up máximo
      x = 0;
      y = 0;
      z = 0;
    } else if (shape === 'cube') {
      // Distribute points inside a cube
      x = (Math.random() - 0.5) * spread;
      y = (Math.random() - 0.5) * spread;
      z = (Math.random() - 0.5) * spread;
    } else {
      // Distribute points inside a sphere
      // Use spherical coordinates with cubic root of random for uniform volume distribution
      const u = Math.random();
      const v = Math.random();
      const theta = 2 * Math.PI * u;
      const phi = Math.acos(2 * v - 1);
      const r = (spread / 2) * Math.cbrt(Math.random());

      x = r * Math.sin(phi) * Math.cos(theta);
      y = r * Math.sin(phi) * Math.sin(theta);
      z = r * Math.cos(phi);
    }

    pos[i * 3] = x;
    pos[i * 3 + 1] = y;
    pos[i * 3 + 2] = z;

    // --- Custom Lighting Calculation ---
    // Instead of white gradient, we calculate a "Normal" based on position from center.
    // This treats the cloud like a volumetric object.
    const normal = new THREE.Vector3(x, y, z).normalize();

    // Dot product determines how much "light" hits this face of the cloud.
    // Range -1 to 1.
    const lightIntensity = normal.dot(lightDir);

    // We map this intensity to color brightness.
    // Shadow areas: darker version of base color.
    // Lit areas: standard base color (maybe slightly brighter, but NOT white).

    // UPDATE: Softer lighting calculation for better realism/legibility.
    // remap -1..1 to 0..1
    const val = (lightIntensity + 1) * 0.5;
    // Output intensity range 0.6 to 1.0. This prevents pitch black shadows and avoids over-bright clipping.
    const intensity = 0.6 + val * 0.4;

    cols[i * 3] = baseColor.r * intensity;
    cols[i * 3 + 1] = baseColor.g * intensity;
    cols[i * 3 + 2] = baseColor.b * intensity;
  }

  return { positions: pos, colors: cols };
}, [count, color, shape]);

useFrame((state, delta) => {
  if (meshRef.current) {
    // Elegant, slow rotation
    meshRef.current.rotation.y += delta * 0.05;
  }
});

return (
  <points ref={meshRef}>
    <bufferGeometry>
      <bufferAttribute
        attach="attributes-position"
        count={positions.length / 3}
        array={positions}
        itemSize={3}
      />
      <bufferAttribute
        attach="attributes-color"
        count={colors.length / 3}
        array={colors}
        itemSize={3}
      />
    </bufferGeometry>
    <pointsMaterial
      size={0.040} // Un poco más grande para mejor definición
      map={silhouetteTexture}
      vertexColors
      transparent={true}
      opacity={1.0} // Totalmente sólidas para taparse unas a otras
      sizeAttenuation={true}
      depthWrite={true} // CLAVE: Permite oclusión 3D real por hardware (los de enfrente tapan a los de atrás)
      alphaTest={0.85} // Recortar la transparencia del canvas con agresividad para matar por completo las franjas blancas / grises del anti-aliasing
      blending={THREE.NormalBlending}
    />
  </points>
);
};

export const Sphere3D: React.FC<Sphere3DProps> = ({
  deaths,
  color,
  maxComparisonDeaths,
  resetTrigger,
  zoomLevel,
  shape
}) => {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    // Smooth loading
    setIsReady(false);
    const delay = deaths > 2000000 ? 100 : 50;
    const timer = setTimeout(() => setIsReady(true), delay);
    return () => clearTimeout(timer);
  }, [deaths, shape]); // Reload when shape changes

  // Container sizing
  const containerSize = 350;

  return (
    <div className="flex flex-col items-center justify-center h-full w-full relative group">

      {/* Background Glow for aesthetic depth */}
      <div
        className="absolute inset-0 rounded-xl opacity-20 pointer-events-none transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle at center, ${color}, transparent 70%)`
        }}
      />

      <div
        className="relative transition-all duration-1000 ease-out flex items-center justify-center z-10 w-full h-full"
      >
        {!isReady && (
          <div className="flex flex-col items-center gap-2 animate-pulse z-20 absolute">
            <div className="w-6 h-6 md:w-8 md:h-8 border-2 border-slate-200 border-t-slate-500 rounded-full animate-spin"></div>
            <span className="text-[10px] md:text-xs text-slate-500 uppercase tracking-widest font-mono text-center">
              Renderizando<br className="md:hidden" /> {shape === 'cube' ? 'Cubo' : 'Esfera'}
            </span>
          </div>
        )}

        {isReady && (
          <Canvas
            // Camera initial position is handled by CameraController
            camera={{ near: 0.001, far: 1000 }} // Allow extreme close up without clipping
            dpr={[1, 2]} // Optimize for pixel ratio
            gl={{
              preserveDrawingBuffer: true,
              antialias: true, // Smoother points
              alpha: true
            }}
            className="cursor-move w-full h-full"
          >
            {/* Gradiente de profundidad (Niebla volumétrica exponencial calculada en base al volumen total) */}
            <fogExp2 attach="fog" color="#f4f6f8" density={0.08 / Math.max(1, Math.cbrt(maxComparisonDeaths) / 25)} />

            <ambientLight intensity={0.2} />
            <PointsCloud count={deaths} color={color} shape={shape} />
            <CameraController
              maxComparisonDeaths={maxComparisonDeaths}
              resetTrigger={resetTrigger}
              zoomLevel={zoomLevel}
            />
          </Canvas>
        )}
      </div>

      {/* Dynamic floor reflection/shadow */}
      <div
        className="rounded-[100%] bg-slate-900 opacity-20 blur-xl transition-all duration-1000 absolute bottom-6 z-0"
        style={{
          width: '60%',
          height: '20px',
          boxShadow: `0 0 40px 10px ${color}20`
        }}
      ></div>
    </div>
  );
};