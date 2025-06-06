import { useRef, useState } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { PlacedBuilding } from "../lib/types";
import { useGame } from "../lib/stores/useTherapy";

interface Building3DProps {
  building: PlacedBuilding;
  isPlaced: boolean;
}

export default function Building3D({ building, isPlaced }: Building3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { removeBuilding, setDraggedBuilding, setIsDragging, isDragging } = useGame();

  // Subtle floating animation
  useFrame((state) => {
    if (groupRef.current && !isDragging) {
      groupRef.current.position.y = building.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.01;
    }
  });

  const handlePointerDown = (event: any) => {
    if (isPlaced) {
      event.stopPropagation();
      setDraggedBuilding(building);
      setIsDragging(true);
    }
  };

  const handlePointerUp = () => {
    if (isDragging) {
      setIsDragging(false);
      setDraggedBuilding(null);
    }
  };

  const handleRightClick = (event: any) => {
    if (isPlaced) {
      event.stopPropagation();
      removeBuilding(building.id);
    }
  };

  const buildingColor = hovered ? 
    new THREE.Color(building.buildingType.color).multiplyScalar(1.2) : 
    new THREE.Color(building.buildingType.color);

  const scale = hovered ? 1.1 : 1;

  // Different geometries based on building category
  const renderBuildingGeometry = () => {
    switch (building.buildingType.category) {
      case 'housing':
        return (
          <>
            {/* Main structure */}
            <mesh position={[0, 0.3, 0]} castShadow>
              <boxGeometry args={[0.8, 0.6, 0.8]} />
              <meshStandardMaterial
                color={buildingColor}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            {/* Roof */}
            <mesh position={[0, 0.75, 0]} castShadow>
              <coneGeometry args={[0.6, 0.3, 4]} />
              <meshStandardMaterial
                color={buildingColor.clone().multiplyScalar(0.7)}
                roughness={0.9}
              />
            </mesh>
          </>
        );
      
      case 'production':
        return (
          <>
            {/* Main building */}
            <mesh position={[0, 0.25, 0]} castShadow>
              <boxGeometry args={[1.0, 0.5, 0.6]} />
              <meshStandardMaterial
                color={buildingColor}
                roughness={0.7}
                metalness={0.2}
              />
            </mesh>
            {/* Equipment/machinery */}
            <mesh position={[0.4, 0.6, 0]} castShadow>
              <cylinderGeometry args={[0.15, 0.15, 0.7, 8]} />
              <meshStandardMaterial
                color={buildingColor.clone().multiplyScalar(0.8)}
                roughness={0.6}
              />
            </mesh>
          </>
        );
      
      case 'infrastructure':
        return (
          <>
            {/* Base structure */}
            <mesh position={[0, 0.2, 0]} castShadow>
              <cylinderGeometry args={[0.5, 0.6, 0.4, 8]} />
              <meshStandardMaterial
                color={buildingColor}
                roughness={0.8}
                metalness={0.1}
              />
            </mesh>
            {/* Feature (like well bucket or windmill blade) */}
            {building.buildingType.id === 'windmill' && (
              <group position={[0, 0.8, 0]} rotation={[0, 0, Math.PI / 4]}>
                {[0, 1, 2, 3].map((i) => (
                  <mesh
                    key={i}
                    position={[Math.cos(i * Math.PI / 2) * 0.4, Math.sin(i * Math.PI / 2) * 0.4, 0]}
                    rotation={[0, 0, i * Math.PI / 2]}
                    castShadow
                  >
                    <boxGeometry args={[0.05, 0.3, 0.02]} />
                    <meshStandardMaterial color="#f5deb3" roughness={0.8} />
                  </mesh>
                ))}
              </group>
            )}
            {building.buildingType.id === 'well' && (
              <mesh position={[0, 0.5, 0]} castShadow>
                <cylinderGeometry args={[0.15, 0.15, 0.3, 8]} />
                <meshStandardMaterial color="#654321" roughness={0.9} />
              </mesh>
            )}
          </>
        );
      
      case 'culture':
        return (
          <>
            {/* Main structure */}
            <mesh position={[0, 0.4, 0]} castShadow>
              <boxGeometry args={[1.2, 0.8, 0.8]} />
              <meshStandardMaterial
                color={buildingColor}
                roughness={0.7}
                metalness={0.1}
              />
            </mesh>
            {/* Decorative columns */}
            {[-0.4, 0.4].map((x, i) => (
              <mesh key={i} position={[x, 0.4, 0.5]} castShadow>
                <cylinderGeometry args={[0.08, 0.08, 0.8, 8]} />
                <meshStandardMaterial
                  color={buildingColor.clone().multiplyScalar(1.1)}
                  roughness={0.6}
                />
              </mesh>
            ))}
            {/* Roof detail */}
            <mesh position={[0, 0.9, 0]} castShadow>
              <boxGeometry args={[1.4, 0.1, 1.0]} />
              <meshStandardMaterial
                color={buildingColor.clone().multiplyScalar(0.8)}
                roughness={0.8}
              />
            </mesh>
          </>
        );
      
      default:
        return (
          <mesh position={[0, 0.3, 0]} castShadow>
            <boxGeometry args={[0.8, 0.6, 0.8]} />
            <meshStandardMaterial
              color={buildingColor}
              roughness={0.8}
              metalness={0.1}
            />
          </mesh>
        );
    }
  };

  return (
    <group
      ref={groupRef}
      position={building.position}
      rotation={building.rotation}
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
      onContextMenu={handleRightClick}
    >
      {renderBuildingGeometry()}

      {/* Selection indicator */}
      {hovered && (
        <mesh position={[0, -0.02, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.6, 0.7, 16]} />
          <meshBasicMaterial color="#22c55e" transparent opacity={0.7} />
        </mesh>
      )}

      {/* Efficiency indicator */}
      {building.efficiency < 1.0 && (
        <mesh position={[0, 1.2, 0]}>
          <sphereGeometry args={[0.1, 8, 8]} />
          <meshBasicMaterial color="#f59e0b" />
        </mesh>
      )}
    </group>
  );
}