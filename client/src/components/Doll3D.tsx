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

  // Age-based scaling for different family member sizes
  const getAgeScale = () => {
    if (doll.dollType.id.includes('baby')) return 0.6; // Bebés más pequeños
    if (doll.dollType.id.includes('child') || doll.dollType.id.includes('teen')) return 0.8; // Niños y adolescentes medianos
    if (doll.dollType.category === 'father' || doll.dollType.category === 'mother') return 1.2; // Padres más grandes
    if (doll.dollType.category === 'grandfather' || doll.dollType.category === 'grandmother') return 1.0; // Abuelos tamaño normal
    return 1.0; // Tamaño por defecto
  };

  const ageScale = getAgeScale();
  const scale = hovered ? ageScale * 1.1 : ageScale;

  // Check if this is a geometric shape (abstract concept)
  const isGeometricShape = doll.dollType.category === 'other';

  if (isGeometricShape) {
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
        {/* Render different geometric shapes */}
        {doll.dollType.id === 'circle-concept' && (
          <mesh position={[0, 0.2, 0]} castShadow>
            <sphereGeometry args={[0.2, 16, 16]} />
            <meshLambertMaterial color={dollColor} />
          </mesh>
        )}
        
        {doll.dollType.id === 'triangle-concept' && (
          <mesh position={[0, 0.2, 0]} castShadow>
            <coneGeometry args={[0.2, 0.4, 3]} />
            <meshLambertMaterial color={dollColor} />
          </mesh>
        )}
        
        {doll.dollType.id === 'square-concept' && (
          <mesh position={[0, 0.2, 0]} castShadow>
            <boxGeometry args={[0.3, 0.3, 0.3]} />
            <meshLambertMaterial color={dollColor} />
          </mesh>
        )}
        
        {doll.dollType.id === 'diamond-concept' && (
          <mesh position={[0, 0.2, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <octahedronGeometry args={[0.2]} />
            <meshLambertMaterial color={dollColor} />
          </mesh>
        )}
        
        {doll.dollType.id === 'star-concept' && (
          <mesh position={[0, 0.2, 0]} castShadow>
            <dodecahedronGeometry args={[0.18]} />
            <meshLambertMaterial color={dollColor} />
          </mesh>
        )}

        {/* Selection indicator for geometric shapes */}
        {hovered && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.25, 0.3, 16]} />
            <meshBasicMaterial color="#FFD700" transparent opacity={0.6} />
          </mesh>
        )}
      </group>
    );
  }

  // Render human figure for children and adolescents
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
      {/* Body (cylinder) - different sizes for different ages */}
      <mesh position={[0, 0.2, 0]} castShadow>
        <cylinderGeometry args={[
          doll.dollType.id.includes('baby') ? 0.1 : 0.15, 
          doll.dollType.id.includes('baby') ? 0.12 : 0.2, 
          doll.dollType.id.includes('baby') ? 0.4 : 0.6, 
          8
        ]} />
        <meshLambertMaterial color={dollColor} />
      </mesh>

      {/* Head (sphere) - different sizes for different ages */}
      <mesh position={[0, doll.dollType.id.includes('baby') ? 0.5 : 0.65, 0]} castShadow>
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
