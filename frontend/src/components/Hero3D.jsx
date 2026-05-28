import React, { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Points, PointMaterial } from '@react-three/drei';
import * as random from 'maath/random/dist/maath-random.esm';

// Blood cell particles
function BloodCells(props) {
  const ref = useRef();
  // Generate random positions within a sphere
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000 * 3), { radius: 10 }), []);

  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 10;
    ref.current.rotation.y -= delta / 15;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false} {...props}>
        <PointMaterial
          transparent
          color="#ff2a2a"
          size={0.05}
          sizeAttenuation={true}
          depthWrite={false}
          opacity={0.8}
        />
      </Points>
    </group>
  );
}

const Hero3D = () => {
  return (
    <div className="absolute inset-0 z-0 bg-darkBg pointer-events-none">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={0.5} />
        <directionalLight position={[10, 10, 5]} intensity={1} color="#ff2a2a" />
        <BloodCells />
      </Canvas>
    </div>
  );
};

export default Hero3D;
