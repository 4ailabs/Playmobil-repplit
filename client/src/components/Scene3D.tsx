import { OrbitControls, Environment } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect, useMemo } from "react";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import Table3D from "./Table3D";
import Doll3D from "./Doll3D";
import DollConnections from "./DollConnections";
import { useTherapy } from "../lib/stores/useTherapyStore";

export default function Scene3D() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { placedDolls } = useTherapy();

  // Set up initial camera position - Con más perspectiva dramática
  useEffect(() => {
    camera.position.set(10, 7, 10);
    camera.lookAt(0, 0.3, 0);
    // Ajustar el ángulo de la cámara para más perspectiva
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Set background color
  useEffect(() => {
    gl.setClearColor(new THREE.Color("#f1f5f9"));
  }, [gl]);

  return (
    <>
      {/* Lighting - Reduced intensity for white table */}
      <ambientLight intensity={0.6} />
      <directionalLight
        position={[10, 10, 5]}
        intensity={0.5}
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-10}
        shadow-camera-right={10}
        shadow-camera-top={10}
        shadow-camera-bottom={-10}
      />
      <pointLight position={[-10, 5, -5]} intensity={0.2} />

      {/* Environment */}
      <Environment preset="city" />

      {/* Camera Controls - Ajustados para perspectiva más dramática */}
      <OrbitControls
        ref={controlsRef}
        target={[0, 0.3, 0]}
        enablePan={true}
        enableZoom={true}
        enableRotate={true}
        minDistance={4}
        maxDistance={30}
        minPolarAngle={0.15}
        maxPolarAngle={Math.PI / 2.2}
        enableDamping={true}
        dampingFactor={0.05}
        zoomSpeed={1.2}
      />

      {/* Main Table with Four Life Paths indicators */}
      <Table3D />

      {/* Connections between dolls */}
      <DollConnections dolls={placedDolls} />

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
