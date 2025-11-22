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
      
      // Check if position is within table bounds (rectangular: 12 wide x 14 deep - Aumentado)
      if (Math.abs(point.x) <= 6 && Math.abs(point.z) <= 7) {
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
      {/* Rectangular area on the floor - Aumentado de 8x10 a 12x14 */}
      <mesh
        ref={meshRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        receiveShadow
      >
        <planeGeometry args={[12, 14]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Cardinal direction labels - single letters - Ajustadas para mesa más grande */}
      <Text
        position={[0, 0.02, -6.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        N
      </Text>

      <Text
        position={[0, 0.02, 6.8]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        S
      </Text>

      <Text
        position={[5.8, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        E
      </Text>

      <Text
        position={[-5.8, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.8}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        O
      </Text>

      {/* Center reference point */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.2, 16]} />
        <meshBasicMaterial color="#DDDDDD" transparent opacity={0.4} />
      </mesh>
    </group>
  );
}
