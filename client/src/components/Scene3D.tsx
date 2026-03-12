import { OrbitControls, Environment, ContactShadows } from "@react-three/drei";
import { useThree } from "@react-three/fiber";
import { useRef, useEffect } from "react";
import * as THREE from "three";
import { OrbitControls as OrbitControlsImpl } from "three-stdlib";
import { EffectComposer, N8AO, Vignette } from "@react-three/postprocessing";
import Table3D from "./Table3D";
import Doll3D from "./Doll3D";
import DollConnections from "./DollConnections";
import { useTherapy } from "../lib/stores/useTherapyStore";

export default function Scene3D() {
  const { camera, gl } = useThree();
  const controlsRef = useRef<OrbitControlsImpl>(null);
  const { placedDolls } = useTherapy();

  // Set up initial camera position
  useEffect(() => {
    camera.position.set(10, 7, 10);
    camera.lookAt(0, 0.3, 0);
    if (camera instanceof THREE.PerspectiveCamera) {
      camera.updateProjectionMatrix();
    }
  }, [camera]);

  // Set warm background color
  useEffect(() => {
    gl.setClearColor(new THREE.Color("#FDF6EE"));
  }, [gl]);

  return (
    <>
      {/* Three-point lighting for depth and warmth */}
      <ambientLight intensity={0.35} color="#FFF5EB" />
      {/* Key light - warm directional */}
      <directionalLight
        position={[8, 12, 6]}
        intensity={0.8}
        color="#FFF8F0"
        castShadow
        shadow-mapSize-width={2048}
        shadow-mapSize-height={2048}
        shadow-camera-far={50}
        shadow-camera-left={-12}
        shadow-camera-right={12}
        shadow-camera-top={12}
        shadow-camera-bottom={-12}
      />
      {/* Fill light - cool blue for depth contrast */}
      <directionalLight position={[-6, 4, -4]} intensity={0.25} color="#E8F0FF" />
      {/* Rim/back light - warm glow on edges */}
      <directionalLight position={[0, 6, -10]} intensity={0.35} color="#FFF0E0" />

      {/* Environment for PBR reflections on plastic dolls */}
      <Environment preset="city" />

      {/* Camera Controls */}
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

      {/* Main Table */}
      <Table3D />

      {/* Soft contact shadows on the table surface - key forces remount when dolls change */}
      <ContactShadows
        key={placedDolls.length}
        position={[0, 0.02, 0]}
        opacity={0.5}
        scale={22}
        blur={2.5}
        far={4}
        resolution={512}
        color="#3D2B1F"
        frames={Infinity}
      />

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

      {/* Ground plane - warm subtle */}
      <mesh receiveShadow position={[0, -0.1, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <planeGeometry args={[50, 50]} />
        <meshLambertMaterial color="#E8E0D6" transparent opacity={0.85} />
      </mesh>

      {/* Post-processing for cinematic quality */}
      <EffectComposer>
        {/* Ambient Occlusion - depth at object-surface junctions */}
        <N8AO
          aoRadius={0.5}
          intensity={1.5}
          distanceFalloff={1}
        />
        {/* Vignette - frames the scene */}
        <Vignette
          offset={0.3}
          darkness={0.35}
          eskil={false}
        />
      </EffectComposer>
    </>
  );
}
