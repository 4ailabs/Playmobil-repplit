import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlacedDoll } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";

interface Doll3DProps {
  doll: PlacedDoll;
  isPlaced: boolean;
}

export default function Doll3D({ doll, isPlaced }: Doll3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { removeDoll, setDraggedDoll, setIsDragging, isDragging } = useTherapy();

  // Subtle floating animation
  useFrame((state) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.position.y = doll.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const handlePointerDown = (event: any) => {
    if (isPlaced) {
      event.stopPropagation();
      setDraggedDoll(doll);
      setIsDragging(true);
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedDoll(null);
    }
  };

  const handleRightClick = (event: any) => {
    if (isPlaced) {
      event.stopPropagation();
      removeDoll(doll.id);
    }
  };

  const dollColor = hovered ? 
    new THREE.Color(doll.dollType.color).multiplyScalar(1.2) : 
    new THREE.Color(doll.dollType.color);

  const scale = hovered ? 1.1 : 1;

  return (
    <group
      ref={groupRef}
      position={doll.position}
      rotation={doll.rotation}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onContextMenu={handleRightClick}
    >
      {/* Body (cylinder) */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[0.15, 0.2, 0.6, 8]} />
        <meshStandardMaterial
          color={dollColor}
          roughness={0.7}
          metalness={0.1}
        />
      </mesh>

      {/* Head (sphere) */}
      <mesh position={[0, 0.65, 0]} castShadow>
        <sphereGeometry args={[0.12, 16, 16]} />
        <meshStandardMaterial
          color={dollColor.clone().multiplyScalar(0.9)}
          roughness={0.6}
          metalness={0.1}
        />
      </mesh>

      {/* Arms */}
      <mesh position={[-0.25, 0.35, 0]} rotation={[0, 0, 0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color={dollColor} roughness={0.7} />
      </mesh>
      <mesh position={[0.25, 0.35, 0]} rotation={[0, 0, -0.3]} castShadow>
        <cylinderGeometry args={[0.05, 0.05, 0.3, 6]} />
        <meshStandardMaterial color={dollColor} roughness={0.7} />
      </mesh>

      {/* Selection indicator */}
      {hovered && (
        <mesh position={[0, -0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.3, 0.35, 16]} />
          <meshBasicMaterial color="#3B82F6" transparent opacity={0.7} />
        </mesh>
      )}
    </group>
  );
}
