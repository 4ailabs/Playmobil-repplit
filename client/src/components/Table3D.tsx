import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useThree, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { logger } from "../lib/logger";

export default function Table3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { raycaster, mouse, camera } = useThree();
  const { draggedDoll, setDraggedDoll, addDoll, dropDoll } = useTherapy();

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    event.stopPropagation();
    
    if (!draggedDoll) return;
    
    logger.debug('Mesa clickeada con muñeco:', draggedDoll.dollType.name);
    
    // Get the intersection point directly from the event
    const intersect = event.intersections?.[0];
    if (intersect) {
      const point = intersect.point;
      
      logger.debug('Posición de colocación:', point);
      
      // Check if position is within table bounds (rectangular: 14 wide x 18 deep N-S)
      if (Math.abs(point.x) <= 7 && Math.abs(point.z) <= 9) {
        const newDoll = {
          ...draggedDoll,
          id: `placed-${Date.now()}`,
          position: [point.x, point.y + 0.15, point.z] as [number, number, number],
          isDropped: true
        };
        
        logger.debug('Colocando muñeco:', newDoll);
        addDoll(newDoll);
        dropDoll(newDoll.id, newDoll.position);
        setDraggedDoll(null);
      } else {
        logger.debug('Posición fuera de los límites de la mesa');
      }
    }
  };

  return (
    <group>
      {/* Table surface - 14 wide (E-O) x 18 deep (N-S), darker for shadow contrast */}
      <mesh
        ref={meshRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        receiveShadow
      >
        <planeGeometry args={[14, 18]} />
        <meshPhysicalMaterial
          color="#D9D3CC"
          roughness={0.5}
          metalness={0.02}
          clearcoat={0.2}
          clearcoatRoughness={0.4}
        />
      </mesh>

      {/* Table border - thin raised edges */}
      {[
        { pos: [0, 0.02, -9] as [number, number, number], scale: [14.1, 0.04, 0.1] as [number, number, number] },
        { pos: [0, 0.02, 9] as [number, number, number], scale: [14.1, 0.04, 0.1] as [number, number, number] },
        { pos: [-7, 0.02, 0] as [number, number, number], scale: [0.1, 0.04, 18.1] as [number, number, number] },
        { pos: [7, 0.02, 0] as [number, number, number], scale: [0.1, 0.04, 18.1] as [number, number, number] },
      ].map((edge, i) => (
        <mesh key={`border-${i}`} position={edge.pos} scale={edge.scale}>
          <boxGeometry args={[1, 1, 1]} />
          <meshStandardMaterial color="#D5CCC2" roughness={0.5} metalness={0.02} />
        </mesh>
      ))}

      {/* Subtle concentric zone guides */}
      {[2.0, 4.0, 6.0].map((radius, i) => (
        <mesh key={`guide-${i}`} position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[radius - 0.02, radius, 48]} />
          <meshBasicMaterial color="#D5CCC2" transparent opacity={0.12} />
        </mesh>
      ))}

      {/* Cardinal direction labels */}
      <Text
        position={[0, 0.02, -8.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="#9B8E82"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        N
      </Text>

      <Text
        position={[0, 0.02, 8.7]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="#9B8E82"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        S
      </Text>

      <Text
        position={[6.7, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="#9B8E82"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        E
      </Text>

      <Text
        position={[-6.7, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="#9B8E82"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        O
      </Text>

      {/* Center reference point */}
      <mesh position={[0, 0.015, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.15, 16]} />
        <meshBasicMaterial color="#C4B9AD" transparent opacity={0.3} />
      </mesh>
    </group>
  );
}
