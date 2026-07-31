import { Canvas } from "@react-three/fiber";
import { Float, Stars } from "@react-three/drei";

function FloatingSphere() {
  return (
    <Float
      speed={2}
      rotationIntensity={2}
      floatIntensity={3}
    >
      <mesh>
        <icosahedronGeometry args={[1.4, 2]} />
        <meshStandardMaterial
          color="#10b981"
          emissive="#10b981"
          emissiveIntensity={1}
          wireframe
        />
      </mesh>
    </Float>
  );
}

export default function HeroCanvas() {
  return (
    <div className="absolute inset-0 -z-10">
      <Canvas camera={{ position: [0, 0, 5] }}>
        <ambientLight intensity={1} />

        <pointLight
          position={[5, 5, 5]}
          intensity={30}
          color="#10b981"
        />

        <Stars
          radius={100}
          depth={50}
          count={5000}
          factor={4}
          fade
        />

        <FloatingSphere />
      </Canvas>
    </div>
  );
}