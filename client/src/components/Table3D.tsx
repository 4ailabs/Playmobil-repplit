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
      
      // Check if position is within table bounds (rectangular)
      if (Math.abs(point.x) <= 4 && Math.abs(point.z) <= 3) {
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
      {/* Main rectangular table surface - matching your image */}
      <mesh
        ref={meshRef}
        position={[0, 0, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        onPointerDown={handlePointerDown}
        receiveShadow
        castShadow
      >
        <planeGeometry args={[8, 6]} />
        <meshStandardMaterial color="#87CEEB" />
      </mesh>
      
      {/* Table base/support */}
      <mesh position={[0, -0.1, 0]}>
        <boxGeometry args={[8.2, 0.2, 6.2]} />
        <meshStandardMaterial color="#5A5A5A" />
      </mesh>

      {/* Table legs */}
      {[
        [-3.5, -1, -2.5] as [number, number, number],
        [3.5, -1, -2.5] as [number, number, number], 
        [-3.5, -1, 2.5] as [number, number, number],
        [3.5, -1, 2.5] as [number, number, number]
      ].map((position, index) => (
        <mesh key={index} position={position} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 2]} />
          <meshStandardMaterial color="#404040" />
        </mesh>
      ))}

      {/* Cardinal direction labels - matching your image layout */}
      <Text
        position={[0, 0.02, -2.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Norte
      </Text>

      <Text
        position={[0, 0.02, 2.3]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Sur
      </Text>

      <Text
        position={[3.2, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Este
      </Text>

      <Text
        position={[-3.2, 0.02, 0]}
        rotation={[-Math.PI / 2, 0, 0]}
        fontSize={0.6}
        color="black"
        anchorX="center"
        anchorY="middle"
        fontWeight="bold"
      >
        Oeste
      </Text>

      {/* Center reference point */}
      <mesh position={[0, 0.01, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[0.3, 16]} />
        <meshBasicMaterial color="#FFFFFF" transparent opacity={0.3} />
      </mesh>

      {/* Subtle border lines to define cardinal areas */}
      <mesh position={[0, 0.005, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[0, 4, 4, 1, 0, Math.PI * 2]} />
        <meshBasicMaterial color="#000000" transparent opacity={0.1} />
      </mesh>
    </group>
  );
}
