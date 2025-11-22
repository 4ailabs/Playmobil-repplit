import { useRef, useState, useEffect, memo, useMemo } from "react";
import { useFrame, ThreeEvent } from "@react-three/fiber";
import * as THREE from "three";
import { PlacedDoll } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Text } from "@react-three/drei";
import { logger } from "../lib/logger";

interface Doll3DProps {
  doll: PlacedDoll;
  isPlaced: boolean;
}

// Geometrías compartidas para mejor rendimiento - Tamaños aumentados para mejor visibilidad
const SIZE_MULTIPLIER = 1.5; // Multiplicador para hacer los muñecos más grandes

const sharedGeometries = {
  body: new THREE.CylinderGeometry(0.15 * SIZE_MULTIPLIER, 0.2 * SIZE_MULTIPLIER, 0.6 * SIZE_MULTIPLIER, 12),
  bodyBaby: new THREE.CylinderGeometry(0.1 * SIZE_MULTIPLIER, 0.12 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 12),
  // Cuerpo femenino: más ancho en la parte superior (caderas)
  bodyFemale: new THREE.CylinderGeometry(0.18 * SIZE_MULTIPLIER, 0.2 * SIZE_MULTIPLIER, 0.6 * SIZE_MULTIPLIER, 12),
  bodyBabyFemale: new THREE.CylinderGeometry(0.12 * SIZE_MULTIPLIER, 0.13 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 12),
  head: new THREE.SphereGeometry(0.12 * SIZE_MULTIPLIER, 20, 20),
  arm: new THREE.CylinderGeometry(0.05 * SIZE_MULTIPLIER, 0.05 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 8),
  eye: new THREE.SphereGeometry(0.025 * SIZE_MULTIPLIER, 12, 12),
  pupil: new THREE.SphereGeometry(0.012 * SIZE_MULTIPLIER, 8, 8),
  sphere: new THREE.SphereGeometry(0.25 * SIZE_MULTIPLIER, 20, 20),
  cone: new THREE.ConeGeometry(0.06 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 4),
  cylinder: new THREE.CylinderGeometry(0.025 * SIZE_MULTIPLIER, 0.025 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 8),
  ring: new THREE.RingGeometry(0.3 * SIZE_MULTIPLIER, 0.35 * SIZE_MULTIPLIER, 20),
  // Cabello para muñecos femeninos (esfera achatada)
  hair: new THREE.SphereGeometry(0.14 * SIZE_MULTIPLIER, 16, 16),
};

// Materiales compartidos - Mejorados para mejor apariencia visual
const sharedMaterials = {
  eyeWhite: new THREE.MeshStandardMaterial({ 
    color: "#FFFFFF",
    roughness: 0.1,
    metalness: 0.0,
    emissive: "#FFFFFF",
    emissiveIntensity: 0.1
  }),
  eyeBlack: new THREE.MeshStandardMaterial({ 
    color: "#000000",
    roughness: 0.3,
    metalness: 0.0
  }),
  directionArrow: new THREE.MeshStandardMaterial({ 
    color: "#FF6B6B",
    emissive: "#FF6B6B",
    emissiveIntensity: 0.3,
    roughness: 0.5
  }),
  directionLine: new THREE.MeshStandardMaterial({ 
    color: "#FF6B6B",
    emissive: "#FF6B6B",
    emissiveIntensity: 0.2,
    roughness: 0.5
  }),
};

function Doll3DComponent({ doll, isPlaced }: Doll3DProps) {
  const groupRef = useRef<THREE.Group>(null);
  const [hovered, setHovered] = useState(false);
  const { setDraggedDoll, setIsDragging, isDragging, updateDollRotation, selectedDollId, setSelectedDollId } = useTherapy();

  // Memoizar cálculos costosos - Escalas aumentadas para mejor visibilidad
  const ageScale = useMemo(() => {
    const baseMultiplier = 1.3; // Multiplicador base para hacer todos más grandes
    if (doll.dollType.id.includes('baby')) return 0.7 * baseMultiplier;
    if (doll.dollType.id.includes('child') || doll.dollType.id.includes('teen')) return 0.9 * baseMultiplier;
    if (doll.dollType.category === 'father' || doll.dollType.category === 'mother') return 1.3 * baseMultiplier;
    if (doll.dollType.category === 'grandfather' || doll.dollType.category === 'grandmother') return 1.1 * baseMultiplier;
    return 1.0 * baseMultiplier;
  }, [doll.dollType.id, doll.dollType.category]);

  const scale = hovered ? ageScale * 1.15 : ageScale;
  const dollColor = useMemo(() => {
    const baseColor = new THREE.Color(doll.dollType.color);
    return hovered ? baseColor.multiplyScalar(1.2) : baseColor;
  }, [doll.dollType.color, hovered]);

  const isGeometricShape = doll.dollType.category === 'other';
  const isDeceasedBaby = doll.dollType.category === 'deceased';
  
  // Detectar género para diferenciación visual
  const isFemale = useMemo(() => {
    const id = doll.dollType.id.toLowerCase();
    return id.includes('girl') || 
           id.includes('mother') || 
           id.includes('grandmother') || 
           id.includes('daughter') || 
           id.includes('sister') ||
           id.includes('wife') ||
           id.includes('partner-female');
  }, [doll.dollType.id]);

  // Store gaze direction for this doll instance (memoizado)
  const gazeOffset = useMemo(() => {
    const followsBody = Math.random() > 0.5;
    if (followsBody) return 0;
    return (Math.random() - 0.5) * Math.PI / 2;
  }, []); // Solo calcular una vez por muñeco

  // Optimizar animación: solo actualizar si no está siendo arrastrado
  useFrame((state) => {
    if (groupRef.current && !isDragging && isPlaced) {
      groupRef.current.position.y = doll.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (isPlaced) {
      event.stopPropagation();
      // Select the doll instead of dragging when placed
      setSelectedDollId(doll.id);
      logger.debug('Muñeco seleccionado:', doll.dollType.name, 'Presiona Delete/Backspace para eliminar');
    } else {
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

  const handleDoubleClick = (event: ThreeEvent<MouseEvent>) => {
    if (isPlaced) {
      event.stopPropagation();
      // Rotate 45 degrees on Y axis to change direction
      const newRotation: [number, number, number] = [
        doll.rotation[0],
        doll.rotation[1] + Math.PI / 4,
        doll.rotation[2]
      ];
      updateDollRotation(doll.id, newRotation);
      logger.debug('Rotando muñeco:', doll.dollType.name, 'Nueva dirección');
    }
  };

  // El manejo de teclado se hace globalmente en TherapyApp para evitar memory leaks


  if (isGeometricShape) {
    return (
      <group
        ref={groupRef}
        position={doll.position}
        rotation={doll.rotation}
        scale={[scale, scale, scale]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Render different geometric shapes - usando geometrías compartidas - Tamaños aumentados */}
        {doll.dollType.id === 'circle-concept' && (
          <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0]} castShadow geometry={sharedGeometries.sphere}>
            <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.1} />
          </mesh>
        )}
        
        {doll.dollType.id === 'triangle-concept' && (
          <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0]} castShadow>
            <coneGeometry args={[0.25 * SIZE_MULTIPLIER, 0.5 * SIZE_MULTIPLIER, 4]} />
            <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.1} />
          </mesh>
        )}
        
        {doll.dollType.id === 'square-concept' && (
          <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0]} castShadow>
            <boxGeometry args={[0.4 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER]} />
            <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.1} />
          </mesh>
        )}
        
        {doll.dollType.id === 'diamond-concept' && (
          <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0]} rotation={[0, 0, Math.PI / 4]} castShadow>
            <octahedronGeometry args={[0.25 * SIZE_MULTIPLIER, 0]} />
            <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.1} />
          </mesh>
        )}
        
        {doll.dollType.id === 'star-concept' && (
          <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0]} castShadow>
            <dodecahedronGeometry args={[0.22 * SIZE_MULTIPLIER, 0]} />
            <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.1} />
          </mesh>
        )}

        {/* Eyes for geometric shapes - positioned on the front with independent gaze */}
        <group rotation={[0, gazeOffset, 0]}>
          {/* Left eye (white) - usando geometría compartida */}
          <mesh position={[-0.08, 0.25, 0.15]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
          
          {/* Right eye (white) */}
          <mesh position={[0.08, 0.25, 0.15]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />

          {/* Left pupil (black) */}
          <mesh position={[-0.08, 0.25, 0.18]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
          
          {/* Right pupil (black) */}
          <mesh position={[0.08, 0.25, 0.18]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
        </group>

        {/* Direction indicator for geometric shapes */}
        {isPlaced && (
          <>
            {/* Direction arrow - usando geometría compartida */}
            <mesh position={[0, 0.4, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow geometry={sharedGeometries.cone} material={sharedMaterials.directionArrow} />
            
            {/* Direction line */}
            <mesh position={[0, 0.4, 0.08]} rotation={[Math.PI / 2, 0, 0]} geometry={sharedGeometries.cylinder} material={sharedMaterials.directionLine} />
          </>
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

  // Special representation for deceased babies
  if (isDeceasedBaby) {
    return (
      <group
        ref={groupRef}
        position={doll.position}
        rotation={doll.rotation}
        scale={[scale * 0.8, scale * 0.8, scale * 0.8]} // Slightly smaller but visible
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
        {/* Ethereal sphere representing the spirit - Más grande */}
        <mesh position={[0, 0.5 * SIZE_MULTIPLIER, 0]} castShadow>
          <primitive object={sharedGeometries.sphere.clone()} />
          <meshStandardMaterial 
            color={dollColor} 
            transparent 
            opacity={0.85}
            emissive={dollColor.clone().multiplyScalar(0.4)}
            roughness={0.3}
          />
        </mesh>

        {/* Larger halo above - Más grande */}
        <mesh position={[0, 0.85 * SIZE_MULTIPLIER, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.15 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER, 20]} />
          <meshStandardMaterial 
            color="#FFD700" 
            transparent 
            opacity={0.9}
            emissive="#FFD700"
            emissiveIntensity={0.5}
          />
        </mesh>

        {/* Eyes - larger and more visible - Usando geometrías compartidas */}
        <group rotation={[0, gazeOffset, 0]}>
          {/* Left eye */}
          <mesh position={[-0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
          
          {/* Right eye */}
          <mesh position={[0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />

          {/* Left pupil */}
          <mesh position={[-0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.24 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
          
          {/* Right pupil */}
          <mesh position={[0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.24 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
        </group>

        {/* Direction indicator for deceased babies */}
        {isPlaced && (
          <>
            {/* Direction arrow - softer color */}
            <mesh position={[0, 0.9, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <coneGeometry args={[0.04, 0.12, 3]} />
              <meshBasicMaterial color="#FFB6C1" transparent opacity={0.9} />
            </mesh>
            
            {/* Direction line */}
            <mesh position={[0, 0.9, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
              <meshBasicMaterial color="#FFB6C1" transparent opacity={0.9} />
            </mesh>
          </>
        )}

        {/* Selection indicator */}
        {(hovered || selectedDollId === doll.id) && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.2, 0.25, 16]} />
            <meshBasicMaterial 
              color={selectedDollId === doll.id ? "#FF4444" : "#3B82F6"} 
              transparent 
              opacity={selectedDollId === doll.id ? 0.9 : 0.7} 
            />
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
      onDoubleClick={handleDoubleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Body (cylinder) - different sizes for different ages and genders - Usando geometrías compartidas escaladas */}
      <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0]} castShadow>
        {doll.dollType.id.includes('baby') ? (
          <primitive object={isFemale ? sharedGeometries.bodyBabyFemale.clone() : sharedGeometries.bodyBaby.clone()} />
        ) : (
          <primitive object={isFemale ? sharedGeometries.bodyFemale.clone() : sharedGeometries.body.clone()} />
        )}
        <meshStandardMaterial
          color={dollColor}
          roughness={0.7}
          metalness={0.0}
          flatShading={false}
        />
      </mesh>

      {/* Head (sphere) - different sizes for different ages - Usando geometría compartida */}
      <mesh position={[0, doll.dollType.id.includes('baby') ? 0.55 * SIZE_MULTIPLIER : 0.7 * SIZE_MULTIPLIER, 0]} castShadow>
        <primitive object={sharedGeometries.head.clone()} />
        <meshStandardMaterial
          color={dollColor.clone().multiplyScalar(0.95)}
          roughness={0.6}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>
      
      {/* Cabello para muñecos femeninos - Posicionado sobre la cabeza */}
      {isFemale && !doll.dollType.id.includes('baby') && (
        <mesh 
          position={[0, (doll.dollType.id.includes('baby') ? 0.55 : 0.7) * SIZE_MULTIPLIER + 0.13 * SIZE_MULTIPLIER, -0.02 * SIZE_MULTIPLIER]} 
          castShadow
        >
          <primitive object={sharedGeometries.hair.clone()} />
          <meshStandardMaterial
            color={dollColor.clone().multiplyScalar(0.7)}
            roughness={0.8}
            metalness={0.0}
            flatShading={false}
          />
        </mesh>
      )}
      
      {/* Lazo o accesorio para bebés femeninos */}
      {isFemale && doll.dollType.id.includes('baby') && (
        <mesh 
          position={[0, 0.6 * SIZE_MULTIPLIER, 0.1 * SIZE_MULTIPLIER]} 
          rotation={[0, 0, 0]}
          castShadow
        >
          <torusGeometry args={[0.05 * SIZE_MULTIPLIER, 0.015 * SIZE_MULTIPLIER, 8, 16]} />
          <meshStandardMaterial
            color={dollColor.clone().multiplyScalar(1.3)}
            roughness={0.6}
            metalness={0.1}
          />
        </mesh>
      )}

      {/* Eyes - positioned on the front of the head with independent gaze - usando geometrías compartidas */}
      {/* Posiciones calculadas en relación a la cabeza escalada */}
      <group rotation={[0, gazeOffset, 0]}>
        {/* Left eye (white) - Posición relativa a la cabeza */}
        <mesh position={[-0.06 * SIZE_MULTIPLIER, doll.dollType.id.includes('baby') ? 0.6 * SIZE_MULTIPLIER : 0.78 * SIZE_MULTIPLIER, 0.13 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
        
        {/* Right eye (white) */}
        <mesh position={[0.06 * SIZE_MULTIPLIER, doll.dollType.id.includes('baby') ? 0.6 * SIZE_MULTIPLIER : 0.78 * SIZE_MULTIPLIER, 0.13 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />

        {/* Left pupil (black) */}
        <mesh position={[-0.06 * SIZE_MULTIPLIER, doll.dollType.id.includes('baby') ? 0.6 * SIZE_MULTIPLIER : 0.78 * SIZE_MULTIPLIER, 0.16 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
        
        {/* Right pupil (black) */}
        <mesh position={[0.06 * SIZE_MULTIPLIER, doll.dollType.id.includes('baby') ? 0.6 * SIZE_MULTIPLIER : 0.78 * SIZE_MULTIPLIER, 0.16 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
      </group>

      {/* Arms - usando geometría compartida - Posiciones ajustadas en relación al cuerpo */}
      {/* Altura del brazo = altura del cuerpo (0.25) + mitad del brazo (0.15) */}
      <mesh position={[-0.28 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 0]} rotation={[0, 0, 0.3]} castShadow geometry={sharedGeometries.arm}>
        <meshStandardMaterial color={dollColor} roughness={0.7} metalness={0.0} />
      </mesh>
      <mesh position={[0.28 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 0]} rotation={[0, 0, -0.3]} castShadow geometry={sharedGeometries.arm}>
        <meshStandardMaterial color={dollColor} roughness={0.7} metalness={0.0} />
      </mesh>

      {/* Direction indicator - shows where the doll is facing - MEJORADO con cono visual prominente */}
      {isPlaced && (
        <>
          {/* Cono de visión mejorado - más visible y prominente, rotado según dirección del muñeco */}
          <group rotation={[0, doll.rotation[1], 0]}>
            {/* Cono de visión semitransparente - más grande */}
            <mesh 
              position={[0, 0.95 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER]} 
              rotation={[Math.PI / 2, 0, 0]} 
            >
              <coneGeometry args={[0.12 * SIZE_MULTIPLIER, 0.35 * SIZE_MULTIPLIER, 12]} />
              <meshStandardMaterial 
                color="#FF6B6B" 
                transparent 
                opacity={0.4}
                emissive="#FF6B6B"
                emissiveIntensity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Línea de dirección más prominente y gruesa */}
            <mesh position={[0, 0.95 * SIZE_MULTIPLIER, 0.15 * SIZE_MULTIPLIER]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.04 * SIZE_MULTIPLIER, 0.04 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 8]} />
              <meshStandardMaterial 
                color="#FF6B6B"
                emissive="#FF6B6B"
                emissiveIntensity={0.6}
              />
            </mesh>
            
            {/* Flecha de dirección más grande */}
            <mesh position={[0, 0.95 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <coneGeometry args={[0.08 * SIZE_MULTIPLIER, 0.2 * SIZE_MULTIPLIER, 6]} />
              <meshStandardMaterial 
                color="#FF6B6B"
                emissive="#FF6B6B"
                emissiveIntensity={0.7}
              />
            </mesh>
          </group>
          
          {/* Etiqueta de nombre - Tamaño reducido para mejor legibilidad */}
          {doll.label && (
            <Text
              position={[0.55 * SIZE_MULTIPLIER, 1.15 * SIZE_MULTIPLIER, 0]}
              fontSize={0.2 * SIZE_MULTIPLIER}
              color="#1F2937"
              anchorX="left"
              anchorY="middle"
              outlineColor="#FFFFFF"
              outlineWidth={0.015 * SIZE_MULTIPLIER}
              maxWidth={3.5 * SIZE_MULTIPLIER}
              textAlign="left"
              fontWeight="bold"
            >
              {doll.label}
            </Text>
          )}
        </>
      )}

      {/* Selection indicator - Tamaño aumentado */}
      {(hovered || selectedDollId === doll.id) && (
        <mesh position={[0, -0.05 * SIZE_MULTIPLIER, 0]} rotation={[-Math.PI / 2, 0, 0]}>
          <ringGeometry args={[0.35 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 20]} />
          <meshStandardMaterial 
            color={selectedDollId === doll.id ? "#FF4444" : "#3B82F6"} 
            transparent 
            opacity={selectedDollId === doll.id ? 0.9 : 0.7}
            emissive={selectedDollId === doll.id ? "#FF4444" : "#3B82F6"}
            emissiveIntensity={0.2}
          />
        </mesh>
      )}
    </group>
  );
}

// Memoizar el componente para evitar re-renders innecesarios
export default memo(Doll3DComponent, (prevProps, nextProps) => {
  // Solo re-renderizar si cambian propiedades importantes
  return (
    prevProps.doll.id === nextProps.doll.id &&
    prevProps.doll.position[0] === nextProps.doll.position[0] &&
    prevProps.doll.position[1] === nextProps.doll.position[1] &&
    prevProps.doll.position[2] === nextProps.doll.position[2] &&
    prevProps.doll.rotation[1] === nextProps.doll.rotation[1] &&
    prevProps.doll.label === nextProps.doll.label &&
    prevProps.isPlaced === nextProps.isPlaced
  );
});
