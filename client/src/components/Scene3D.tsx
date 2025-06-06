import { OrbitControls, Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import Table3D from "./Table3D";
import Doll3D from "./Doll3D";
import { useTherapy } from "../lib/stores/useTherapy";

export default function Scene3D() {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const { placedDolls } = useTherapy();

  // Set up initial camera position
  useEffect(() => {
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.4} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 5, -5]} intensity={0.3} />

      {/* Environment */}
      <Environment preset="city" />

      {/* Camera Controls */}
      <OrbitControls
        ref={controlsRef}
        target={[0, 0, 0]}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={5}
        maxDistance={25}
        minPolarAngle={0.2}
        maxPolarAngle={Math.PI / 2}
        enableDamping={true}
        dampingFactor={0.05}
      />

      {/* Main Table */}
      <Table3D />

      {/* Placed Dolls */}
      {placedDolls.map((doll) => (
        <Doll3D
          key={doll.id}
          doll={doll}
          isPlaced={true}
        />
      ))}

      {/* Ground plane for shadows */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#f8fafc" transparent opacity={0.8} />
      </mesh>
    </>
  );
}
