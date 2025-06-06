import { useTexture } from "@react-three/drei";
import { useRef } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { DOLL_TYPES } from "../lib/types";

export default function Table3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { raycaster, mouse, camera, scene } = useThree();
  const { draggedDoll, setDraggedDoll, addDoll, updateDollPosition, removeDoll, isDragging, setIsDragging } = useTherapy();
  
  // Load wood texture
  const woodTexture = useTexture("/textures/wood.jpg");
  woodTexture.wrapS = woodTexture.wrapT = THREE.RepeatWrapping;
  woodTexture.repeat.set(4, 4);

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    // Check if we're dragging a doll from the library
    if (draggedDoll && !isDragging) {
      const intersect = event.intersections[0];
      if (intersect && intersect.object === meshRef.current) {
        const position = intersect.point;
        
        // Check if position is within table radius
        const distance = Math.sqrt(position.x ** 2 + position.z ** 2);
        if (distance <= 3.8) { // Slightly smaller than table radius for visual margin
          const newDoll = {
            ...draggedDoll,
            id: `placed-${Date.now()}`,
            position: [position.x, 0.4, position.z] as [number, number, number]
          };
          
          addDoll(newDoll);
          setDraggedDoll(null);
        }
      }
    }
  };

  const handlePointerMove = (event: any) => {
    if (isDragging && draggedDoll) {
      const intersect = event.intersections[0];
      if (intersect && intersect.object === meshRef.current) {
        const position = intersect.point;
        
        // Check if position is within table radius
        const distance = Math.sqrt(position.x ** 2 + position.z ** 2);
        if (distance <= 3.8) {
          updateDollPosition(draggedDoll.id, [position.x, 0.4, position.z]);
        }
      }
    }
  };

  return (
    <group>
      {/* Table surface */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        castShadow
        receiveShadow
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
      >
        <cylinderGeometry args={[4, 4, 0.1, 32]} />
        <meshStandardMaterial
          map={woodTexture}
          roughness={0.8}
          metalness={0.1}
        />
      </mesh>
      
      {/* Table edge/rim */}
      <mesh position={[0, -0.05, 0]} castShadow>
        <cylinderGeometry args={[4.05, 4.05, 0.02, 32]} />
        <meshStandardMaterial color="#8B4513" roughness={0.9} />
      </mesh>

      {/* Table legs */}
      {[0, Math.PI / 2, Math.PI, (3 * Math.PI) / 2].map((angle, index) => (
        <mesh
          key={index}
          position={[Math.cos(angle) * 3, -0.4, Math.sin(angle) * 3]}
          castShadow
        >
          <cylinderGeometry args={[0.1, 0.12, 0.8, 8]} />
          <meshStandardMaterial color="#654321" roughness={0.9} />
        </mesh>
      ))}
    </group>
  );
}
