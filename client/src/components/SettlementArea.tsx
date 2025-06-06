import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useGame } from "../lib/stores/useTherapy";
import { BUILDING_TYPES } from "../lib/types";

export default function SettlementArea() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { raycaster, mouse, camera, scene } = useThree();
  const { draggedBuilding, setDraggedBuilding, addBuilding, updateBuildingPosition, removeBuilding, isDragging, setIsDragging } = useGame();

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    // Check if we're dragging a building from the library
    if (draggedBuilding && !isDragging) {
      const intersect = event.intersections[0];
      if (intersect && intersect.object === meshRef.current) {
        const position = intersect.point;
        
        // Check if position is within settlement area (circular boundary)
        const distance = Math.sqrt(position.x ** 2 + position.z ** 2);
        if (distance <= 8) { // Settlement area radius
          const newBuilding = {
            ...draggedBuilding,
            id: `placed-${Date.now()}`,
            position: [position.x, 0.1, position.z] as [number, number, number]
          };
          
          addBuilding(newBuilding);
          setDraggedBuilding(null);
        }
      }
    }
  };

  const handlePointerMove = (event: any) => {
    if (isDragging && draggedBuilding) {
      const intersect = event.intersections[0];
      if (intersect && intersect.object === meshRef.current) {
        const position = intersect.point;
        
        // Check if position is within settlement area
        const distance = Math.sqrt(position.x ** 2 + position.z ** 2);
        if (distance <= 8) {
          updateBuildingPosition(draggedBuilding.id, [position.x, 0.1, position.z]);
        }
      }
    }
  };

  return (
    <group>
      {/* Settlement area - circular grass platform */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <cylinderGeometry args={[8, 8, 0.2, 32]} />
        <meshStandardMaterial
          color="#4a7c59"
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Settlement boundary markers */}
      <mesh position={[0, 0.11, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[7.8, 8.2, 32]} />
        <meshBasicMaterial color="#2d5016" transparent opacity={0.3} />
      </mesh>

      {/* Natural elements around settlement */}
      {/* Trees around the perimeter */}
      {Array.from({ length: 12 }, (_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const radius = 10 + Math.random() * 2;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <group key={i} position={[x, 0, z]}>
            {/* Tree trunk */}
            <mesh position={[0, 1, 0]} castShadow>
              <cylinderGeometry args={[0.2, 0.3, 2, 8]} />
              <meshStandardMaterial color="#654321" roughness={0.9} />
            </mesh>
            {/* Tree foliage */}
            <mesh position={[0, 2.5, 0]} castShadow>
              <sphereGeometry args={[1.5, 8, 6]} />
              <meshStandardMaterial color="#228B22" roughness={0.8} />
            </mesh>
          </group>
        );
      })}

      {/* Rocks scattered around */}
      {Array.from({ length: 8 }, (_, i) => {
        const angle = (i / 8) * Math.PI * 2 + Math.random();
        const radius = 12 + Math.random() * 3;
        const x = Math.cos(angle) * radius;
        const z = Math.sin(angle) * radius;
        
        return (
          <mesh 
            key={i} 
            position={[x, 0.2, z]} 
            rotation={[Math.random() * 0.3, Math.random() * Math.PI, Math.random() * 0.3]}
            castShadow
          >
            <boxGeometry args={[0.8 + Math.random() * 0.4, 0.4 + Math.random() * 0.3, 0.6 + Math.random() * 0.4]} />
            <meshStandardMaterial color="#696969" roughness={0.9} />
          </mesh>
        );
      })}
    </group>
  );
}