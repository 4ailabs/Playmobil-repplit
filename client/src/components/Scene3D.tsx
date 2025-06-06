import { OrbitControls, Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import SettlementArea from "./SettlementArea";
import Building3D from "./Building3D";
import { useGame } from "../lib/stores/useTherapy";

export default function Scene3D() {
  const { camera } = useThree();
  const controlsRef = useRef<any>();
  const { placedBuildings } = useGame();

  // Set up initial camera position
  useEffect(() => {
    camera.position.set(10, 8, 10);
    camera.lookAt(0, 0, 0);
  }, [camera]);

  return (
    <>
      {/* Lighting */}
      <ambientLight intensity={0.5} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={1.2}
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
      <Environment preset="forest" />

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

      {/* Settlement Area */}
      <SettlementArea />

      {/* Placed Buildings */}
      {placedBuildings.map((building) => (
        <Building3D
          key={building.id}
          building={building}
          isPlaced={true}
        />
      ))}

      {/* Ground plane for natural terrain */}
      <mesh receiveShadow position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#7cb342" transparent opacity={0.9} />
      </mesh>
    </>
  );
}
