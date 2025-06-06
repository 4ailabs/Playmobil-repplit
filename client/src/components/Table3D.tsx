import { Text } from "@react-three/drei";
import { useRef } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useTherapy } from "../lib/stores/useTherapyStore";

export default function Table3D() {
  const meshRef = useRef<THREE.Mesh>(null);
  const { raycaster, mouse, camera } = useThree();
  const { draggedDoll, setDraggedDoll, addDoll, dropDoll } = useTherapy();

  const handlePointerDown = (event: any) => {
    event.stopPropagation();
    
    if (!draggedDoll) return;
    
    console.log('Mesa clickeada con muñeco:', draggedDoll.dollType.name);
    
    // Get the intersection point directly from the event
    const intersect = event.intersections?.[0];
    if (intersect) {
      const point = intersect.point;
      
      console.log('Posición de colocación:', point);
      
      // Check if position is within table bounds (rectangular: 8 wide x 10 deep)
      if (Math.abs(point.x) <= 4 && Math.abs(point.z) <= 5) {
        const newDoll = {
          ...draggedDoll,
          id: `placed-${Date.now()}`,
          position: [point.x, point.y + 0.15, point.z] as [number, number, number],
          isDropped: true
        };
        
        console.log('Colocando muñeco:', newDoll);
        addDoll(newDoll);
        dropDoll(newDoll.id, newDoll.position);
        setDraggedDoll(null);
      } else {
        console.log('Posición fuera de los límites de la mesa');
      }
    }
  };

  return (
    <group>
      {/* Rectangular area on the floor */}
      <mesh
        ref={meshRef}
        position={[0, 0.01, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        receiveShadow
      >
        <planeGeometry args={[8, 10]} />
        <meshLambertMaterial color="#FFFFFF" />
      </mesh>

      {/* Cardinal direction labels - single letters */}
      <Text
        position={[0, 0.02, -4.8]}
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
        position={[0, 0.02, 4.8]}
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
        position={[3.8, 0.02, 0]}
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
        position={[-3.8, 0.02, 0]}
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
