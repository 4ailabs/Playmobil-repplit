import { useRef, useState, memo, useMemo } from "react";
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

// Geometrías compartidas - Estilo Playmobil: cabeza grande, cuerpo simple
const SIZE_MULTIPLIER = 1.5;
const SKIN_COLOR = "#FDDCB1"; // Color piel clásico Playmobil

const sharedGeometries = {
  // Cuerpos estilo Playmobil: cilindros simples y rectos
  bodyAdult: new THREE.CylinderGeometry(0.16 * SIZE_MULTIPLIER, 0.16 * SIZE_MULTIPLIER, 0.5 * SIZE_MULTIPLIER, 12),
  bodyChild: new THREE.CylinderGeometry(0.12 * SIZE_MULTIPLIER, 0.12 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 12),
  bodyBaby: new THREE.CylinderGeometry(0.09 * SIZE_MULTIPLIER, 0.09 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 12),

  // Cabezas estilo Playmobil: grandes y redondas (característica distintiva)
  headAdult: new THREE.SphereGeometry(0.18 * SIZE_MULTIPLIER, 20, 20),
  headChild: new THREE.SphereGeometry(0.14 * SIZE_MULTIPLIER, 20, 20),
  headBaby: new THREE.SphereGeometry(0.11 * SIZE_MULTIPLIER, 20, 20),

  // Extremidades delgadas estilo Playmobil
  arm: new THREE.CylinderGeometry(0.035 * SIZE_MULTIPLIER, 0.035 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 8),
  leg: new THREE.CylinderGeometry(0.04 * SIZE_MULTIPLIER, 0.04 * SIZE_MULTIPLIER, 0.15 * SIZE_MULTIPLIER, 8),

  // Manos y zapatos
  hand: new THREE.SphereGeometry(0.045 * SIZE_MULTIPLIER, 10, 10),
  shoe: new THREE.CylinderGeometry(0.055 * SIZE_MULTIPLIER, 0.06 * SIZE_MULTIPLIER, 0.04 * SIZE_MULTIPLIER, 8),

  // Detalles faciales Playmobil: ojos grandes y simples
  eye: new THREE.SphereGeometry(0.03 * SIZE_MULTIPLIER, 12, 12),
  pupil: new THREE.SphereGeometry(0.015 * SIZE_MULTIPLIER, 8, 8),

  // Expresiones faciales
  mouthSmile: new THREE.TorusGeometry(0.055 * SIZE_MULTIPLIER, 0.008 * SIZE_MULTIPLIER, 6, 12, Math.PI),
  mouthFlat: new THREE.BoxGeometry(0.07 * SIZE_MULTIPLIER, 0.01 * SIZE_MULTIPLIER, 0.01 * SIZE_MULTIPLIER),
  mouthOpen: new THREE.RingGeometry(0, 0.025 * SIZE_MULTIPLIER, 12),
  eyebrow: new THREE.BoxGeometry(0.045 * SIZE_MULTIPLIER, 0.01 * SIZE_MULTIPLIER, 0.01 * SIZE_MULTIPLIER),

  // Formas geométricas
  sphere: new THREE.SphereGeometry(0.25 * SIZE_MULTIPLIER, 20, 20),
  cone: new THREE.ConeGeometry(0.06 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 4),
  cylinder: new THREE.CylinderGeometry(0.025 * SIZE_MULTIPLIER, 0.025 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 8),
  ring: new THREE.RingGeometry(0.3 * SIZE_MULTIPLIER, 0.35 * SIZE_MULTIPLIER, 20),

  // Accesorios Playmobil: sombreros, cabello (más ajustados a la cabeza)
  hat: new THREE.CylinderGeometry(0.17 * SIZE_MULTIPLIER, 0.17 * SIZE_MULTIPLIER, 0.06 * SIZE_MULTIPLIER, 12),
  hairLong: new THREE.SphereGeometry(0.16 * SIZE_MULTIPLIER, 16, 16),
  hairShort: new THREE.BoxGeometry(0.19 * SIZE_MULTIPLIER, 0.08 * SIZE_MULTIPLIER, 0.19 * SIZE_MULTIPLIER),
};

// Materiales compartidos - Estilo plástico brillante Playmobil
const sharedMaterials = {
  skin: new THREE.MeshStandardMaterial({
    color: SKIN_COLOR,
    roughness: 0.35,
    metalness: 0.02,
  }),
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
  faceDark: new THREE.MeshStandardMaterial({
    color: "#2D1B0E",
    roughness: 0.4,
    metalness: 0.0,
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

  // Escalas según edad - proporciones más contenidas
  const ageScale = useMemo(() => {
    if (doll.dollType.id.includes('baby')) return 0.75;
    if (doll.dollType.id.includes('child') || doll.dollType.id.includes('teen')) return 0.9;
    if (doll.dollType.category === 'father' || doll.dollType.category === 'mother') return 1.15;
    if (doll.dollType.category === 'grandfather' || doll.dollType.category === 'grandmother') return 1.05;
    return 1.0;
  }, [doll.dollType.id, doll.dollType.category]);

  const scale = hovered ? ageScale * 1.15 : ageScale;
  const dollColor = useMemo(() => {
    const baseColor = new THREE.Color(doll.dollType.color);
    return hovered ? baseColor.multiplyScalar(1.2) : baseColor;
  }, [doll.dollType.color, hovered]);

  const isGeometricShape = doll.dollType.category === 'other';
  const isDeceasedBaby = doll.dollType.category === 'deceased';
  
  // Detectar género y edad
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

  const isBaby = useMemo(() => doll.dollType.id.includes('baby'), [doll.dollType.id]);
  const isTeen = useMemo(() => doll.dollType.id.includes('teen'), [doll.dollType.id]);
  const isChild = useMemo(() => doll.dollType.id.includes('child') || doll.dollType.id.includes('teen'), [doll.dollType.id]);
  const isAdult = useMemo(() => 
    doll.dollType.category === 'father' || 
    doll.dollType.category === 'mother' || 
    doll.dollType.category === 'grandfather' || 
    doll.dollType.category === 'grandmother',
    [doll.dollType.category]
  );

  // Expresión facial basada en emoción
  const faceExpression = useMemo(() => {
    const emotion = doll.emotion || 'neutral';
    switch (emotion) {
      case 'happy':
        return { mouthType: 'smile' as const, eyebrowAngle: 0, showEyebrows: false };
      case 'sad':
        return { mouthType: 'frown' as const, eyebrowAngle: 0.25, showEyebrows: true };
      case 'angry':
        return { mouthType: 'flat' as const, eyebrowAngle: -0.3, showEyebrows: true };
      case 'anxious':
        return { mouthType: 'open' as const, eyebrowAngle: 0.2, showEyebrows: true };
      default:
        return { mouthType: 'flat' as const, eyebrowAngle: 0, showEyebrows: false };
    }
  }, [doll.emotion]);

  // Gaze direction - Independiente de la dirección de caminar
  const gazeOffset = useMemo(() => {
    const followsBody = Math.random() > 0.5;
    if (followsBody) return 0;
    return (Math.random() - 0.5) * Math.PI / 2;
  }, []);

  // Animación suave
  useFrame((state) => {
    if (groupRef.current && !isDragging && isPlaced) {
      groupRef.current.position.y = doll.position[1] + Math.sin(state.clock.elapsedTime * 2) * 0.02;
    }
  });

  const handlePointerDown = (event: ThreeEvent<PointerEvent>) => {
    if (isPlaced) {
      event.stopPropagation();
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
      const newRotation: [number, number, number] = [
        doll.rotation[0],
        doll.rotation[1] + Math.PI / 4,
        doll.rotation[2]
      ];
      updateDollRotation(doll.id, newRotation);
      logger.debug('Rotando muñeco:', doll.dollType.name, 'Nueva dirección');
    }
  };

  // Formas geométricas (sin cambios)
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

        {/* Flecha direccional para formas geométricas - igual que los muñecos humanos */}
        {isPlaced && (
          <>
            {/* Cono de visión semitransparente */}
            <mesh 
              position={[0, 0.25 * SIZE_MULTIPLIER, 0.25 * SIZE_MULTIPLIER]} 
              rotation={[Math.PI / 2, 0, 0]} 
            >
              <coneGeometry args={[0.1 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 12]} />
              <meshStandardMaterial 
                color="#FF6B6B" 
                transparent 
                opacity={0.4}
                emissive="#FF6B6B"
                emissiveIntensity={0.3}
                side={THREE.DoubleSide}
              />
            </mesh>
            
            {/* Línea de dirección */}
            <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0.12 * SIZE_MULTIPLIER]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <cylinderGeometry args={[0.035 * SIZE_MULTIPLIER, 0.035 * SIZE_MULTIPLIER, 0.25 * SIZE_MULTIPLIER, 8]} />
              <meshStandardMaterial 
                color="#FF6B6B"
                emissive="#FF6B6B"
                emissiveIntensity={0.6}
              />
            </mesh>
            
            {/* Flecha de dirección */}
            <mesh position={[0, 0.25 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <coneGeometry args={[0.07 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 6]} />
              <meshStandardMaterial 
                color="#FF6B6B"
                emissive="#FF6B6B"
                emissiveIntensity={0.7}
              />
            </mesh>
          </>
        )}

        {/* Indicador de selección */}
        {(hovered || selectedDollId === doll.id) && (
          <mesh position={[0, 0.05, 0]} rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.25, 0.3, 16]} />
            <meshBasicMaterial 
              color={selectedDollId === doll.id ? "#FF4444" : "#FFD700"} 
              transparent 
              opacity={selectedDollId === doll.id ? 0.9 : 0.6} 
            />
          </mesh>
        )}
      </group>
    );
  }

  // Bebés fallecidos (sin cambios)
  if (isDeceasedBaby) {
    return (
      <group
        ref={groupRef}
        position={doll.position}
        rotation={doll.rotation}
        scale={[scale * 0.8, scale * 0.8, scale * 0.8]}
        onPointerDown={handlePointerDown}
        onPointerUp={handlePointerUp}
        onDoubleClick={handleDoubleClick}
        onPointerEnter={() => setHovered(true)}
        onPointerLeave={() => setHovered(false)}
      >
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

        <group rotation={[0, gazeOffset, 0]}>
          <mesh position={[-0.045 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
          <mesh position={[0.045 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
          <mesh position={[-0.045 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.24 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
          <mesh position={[0.045 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.24 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
        </group>

        {isPlaced && (
          <>
            <mesh position={[0, 0.9, 0.15]} rotation={[Math.PI / 2, 0, 0]} castShadow>
              <coneGeometry args={[0.04, 0.12, 3]} />
              <meshBasicMaterial color="#FFB6C1" transparent opacity={0.9} />
            </mesh>
            <mesh position={[0, 0.9, 0.08]} rotation={[Math.PI / 2, 0, 0]}>
              <cylinderGeometry args={[0.02, 0.02, 0.12, 6]} />
              <meshBasicMaterial color="#FFB6C1" transparent opacity={0.9} />
            </mesh>
          </>
        )}

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

  // Muñeco estilo Playmobil: cabeza grande, cuerpo simple, extremidades delgadas
  // Teens: cuerpo de adulto pero cabeza de child para evitar cabezones
  const bodyHeight = isBaby ? 0.3 : (isChild && !isTeen) ? 0.4 : 0.5;
  const bodyTopY = bodyHeight * SIZE_MULTIPLIER;
  const headRadius = isBaby ? 0.11 * SIZE_MULTIPLIER : isChild ? 0.14 * SIZE_MULTIPLIER : 0.18 * SIZE_MULTIPLIER;
  const headY = bodyTopY + headRadius;
  const headSize = isBaby ? sharedGeometries.headBaby : isChild ? sharedGeometries.headChild : sharedGeometries.headAdult;
  const bodyGeometry = isBaby ? sharedGeometries.bodyBaby : (isChild && !isTeen) ? sharedGeometries.bodyChild : sharedGeometries.bodyAdult;

  return (
    <group
      ref={groupRef}
      position={doll.position}
      rotation={doll.rotation} // Rotación del cuerpo (dirección de caminar)
      scale={[scale, scale, scale]}
      onPointerDown={handlePointerDown}
      onPointerUp={handlePointerUp}
      onDoubleClick={handleDoubleClick}
      onPointerEnter={() => setHovered(true)}
      onPointerLeave={() => setHovered(false)}
    >
      {/* Cuerpo - plástico brillante estilo Playmobil */}
      <mesh position={[0, bodyHeight * SIZE_MULTIPLIER / 2, 0]} castShadow>
        <primitive object={bodyGeometry.clone()} />
        <meshStandardMaterial
          color={dollColor}
          roughness={0.25}
          metalness={0.05}
          flatShading={false}
        />
      </mesh>

      {/* Cabeza - color piel, rota según mirada */}
      <group position={[0, headY, 0]} rotation={[0, gazeOffset, 0]}>
        <mesh castShadow>
          <primitive object={headSize.clone()} />
          <meshStandardMaterial
            color={SKIN_COLOR}
            roughness={0.35}
            metalness={0.02}
            flatShading={false}
          />
        </mesh>

        {/* Cabello / accesorios */}
        {!isBaby && (
          <>
            {isFemale ? (
              <mesh position={[0, 0.1 * SIZE_MULTIPLIER, -0.02 * SIZE_MULTIPLIER]} castShadow>
                <primitive object={sharedGeometries.hairLong.clone()} />
                <meshStandardMaterial color={dollColor.clone().multiplyScalar(0.5)} roughness={0.4} metalness={0.0} />
              </mesh>
            ) : isAdult ? (
              <mesh position={[0, 0.08 * SIZE_MULTIPLIER, 0]} castShadow>
                <primitive object={sharedGeometries.hat.clone()} />
                <meshStandardMaterial color={dollColor.clone().multiplyScalar(0.4)} roughness={0.35} metalness={0.0} />
              </mesh>
            ) : (
              <mesh position={[0, 0.08 * SIZE_MULTIPLIER, 0]} castShadow>
                <primitive object={sharedGeometries.hairShort.clone()} />
                <meshStandardMaterial color={dollColor.clone().multiplyScalar(0.5)} roughness={0.4} metalness={0.0} />
              </mesh>
            )}
          </>
        )}

        {/* Lazo para bebés femeninos */}
        {isFemale && isBaby && (
          <mesh position={[0, 0.05 * SIZE_MULTIPLIER, 0.12 * SIZE_MULTIPLIER]} castShadow>
            <torusGeometry args={[0.05 * SIZE_MULTIPLIER, 0.015 * SIZE_MULTIPLIER, 8, 16]} />
            <meshStandardMaterial color={dollColor.clone().multiplyScalar(1.3)} roughness={0.3} metalness={0.1} />
          </mesh>
        )}

        {/* Ojos — más juntos para look Playmobil */}
        <mesh position={[-0.05 * SIZE_MULTIPLIER, 0, 0.18 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
        <mesh position={[0.05 * SIZE_MULTIPLIER, 0, 0.18 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
        <mesh position={[-0.05 * SIZE_MULTIPLIER, 0, 0.21 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
        <mesh position={[0.05 * SIZE_MULTIPLIER, 0, 0.21 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />

        {/* Boca - expresión según emoción */}
        {faceExpression.mouthType === 'smile' && (
          <mesh position={[0, -0.06 * SIZE_MULTIPLIER, 0.17 * SIZE_MULTIPLIER]} rotation={[0, 0, Math.PI]} geometry={sharedGeometries.mouthSmile} material={sharedMaterials.faceDark} />
        )}
        {faceExpression.mouthType === 'frown' && (
          <mesh position={[0, -0.06 * SIZE_MULTIPLIER, 0.17 * SIZE_MULTIPLIER]} rotation={[0, 0, 0]} geometry={sharedGeometries.mouthSmile} material={sharedMaterials.faceDark} />
        )}
        {faceExpression.mouthType === 'flat' && (
          <mesh position={[0, -0.06 * SIZE_MULTIPLIER, 0.17 * SIZE_MULTIPLIER]} geometry={sharedGeometries.mouthFlat} material={sharedMaterials.faceDark} />
        )}
        {faceExpression.mouthType === 'open' && (
          <mesh position={[0, -0.06 * SIZE_MULTIPLIER, 0.175 * SIZE_MULTIPLIER]} rotation={[0, 0, 0]} geometry={sharedGeometries.mouthOpen} material={sharedMaterials.faceDark} />
        )}

        {/* Cejas - solo para emociones fuertes */}
        {faceExpression.showEyebrows && (
          <>
            <mesh
              position={[-0.05 * SIZE_MULTIPLIER, 0.04 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER]}
              rotation={[0, 0, faceExpression.eyebrowAngle]}
              geometry={sharedGeometries.eyebrow}
              material={sharedMaterials.faceDark}
            />
            <mesh
              position={[0.05 * SIZE_MULTIPLIER, 0.04 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER]}
              rotation={[0, 0, -faceExpression.eyebrowAngle]}
              geometry={sharedGeometries.eyebrow}
              material={sharedMaterials.faceDark}
            />
          </>
        )}
      </group>

      {/* Brazos (ropa) + manos (piel) */}
      <mesh
        position={[-0.16 * SIZE_MULTIPLIER, bodyHeight * SIZE_MULTIPLIER * 0.65, 0.08 * SIZE_MULTIPLIER]}
        rotation={[Math.PI / 2, 0, 0.35]}
        castShadow
        geometry={sharedGeometries.arm}
      >
        <meshStandardMaterial color={dollColor} roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh
        position={[-0.19 * SIZE_MULTIPLIER, bodyHeight * SIZE_MULTIPLIER * 0.52, 0.2 * SIZE_MULTIPLIER]}
        castShadow
        geometry={sharedGeometries.hand}
        material={sharedMaterials.skin}
      />
      <mesh
        position={[0.16 * SIZE_MULTIPLIER, bodyHeight * SIZE_MULTIPLIER * 0.65, 0.08 * SIZE_MULTIPLIER]}
        rotation={[Math.PI / 2, 0, -0.35]}
        castShadow
        geometry={sharedGeometries.arm}
      >
        <meshStandardMaterial color={dollColor} roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh
        position={[0.19 * SIZE_MULTIPLIER, bodyHeight * SIZE_MULTIPLIER * 0.52, 0.2 * SIZE_MULTIPLIER]}
        castShadow
        geometry={sharedGeometries.hand}
        material={sharedMaterials.skin}
      />

      {/* Piernas + zapatos */}
      <mesh position={[-0.08 * SIZE_MULTIPLIER, -0.075 * SIZE_MULTIPLIER, 0]} castShadow geometry={sharedGeometries.leg}>
        <meshStandardMaterial color={dollColor} roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[-0.08 * SIZE_MULTIPLIER, -0.19 * SIZE_MULTIPLIER, 0.01 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.shoe}>
        <meshStandardMaterial color={dollColor.clone().multiplyScalar(0.6)} roughness={0.3} metalness={0.05} />
      </mesh>
      <mesh position={[0.08 * SIZE_MULTIPLIER, -0.075 * SIZE_MULTIPLIER, 0]} castShadow geometry={sharedGeometries.leg}>
        <meshStandardMaterial color={dollColor} roughness={0.25} metalness={0.05} />
      </mesh>
      <mesh position={[0.08 * SIZE_MULTIPLIER, -0.19 * SIZE_MULTIPLIER, 0.01 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.shoe}>
        <meshStandardMaterial color={dollColor.clone().multiplyScalar(0.6)} roughness={0.3} metalness={0.05} />
      </mesh>

      {/* Direction indicator - Flecha en el cuerpo que indica la dirección de caminar (coincide con rotación del cuerpo) */}
      {isPlaced && (
        <>
          {/* CORRECCIÓN: NO usar grupo con rotación extra porque el grupo principal ya rota todo según doll.rotation */}
          {/* La flecha está en el mismo espacio local que los brazos, apuntando hacia adelante (Z positivo) */}
          {/* Cono de visión semitransparente - en el cuerpo */}
          <mesh 
            position={[0, bodyHeight * SIZE_MULTIPLIER * 0.5, 0.25 * SIZE_MULTIPLIER]} 
            rotation={[Math.PI / 2, 0, 0]} 
          >
            <coneGeometry args={[0.1 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 12]} />
            <meshStandardMaterial 
              color="#FF6B6B" 
              transparent 
              opacity={0.4}
              emissive="#FF6B6B"
              emissiveIntensity={0.3}
              side={THREE.DoubleSide}
            />
          </mesh>
          
          {/* Línea de dirección - en el cuerpo */}
          <mesh position={[0, bodyHeight * SIZE_MULTIPLIER * 0.5, 0.12 * SIZE_MULTIPLIER]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <cylinderGeometry args={[0.035 * SIZE_MULTIPLIER, 0.035 * SIZE_MULTIPLIER, 0.25 * SIZE_MULTIPLIER, 8]} />
            <meshStandardMaterial 
              color="#FF6B6B"
              emissive="#FF6B6B"
              emissiveIntensity={0.6}
            />
          </mesh>
          
          {/* Flecha de dirección (apunta hacia donde camina - coincide con rotación del cuerpo) - en el cuerpo */}
          <mesh position={[0, bodyHeight * SIZE_MULTIPLIER * 0.5, 0.18 * SIZE_MULTIPLIER]} rotation={[Math.PI / 2, 0, 0]} castShadow>
            <coneGeometry args={[0.07 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 6]} />
            <meshStandardMaterial 
              color="#FF6B6B"
              emissive="#FF6B6B"
              emissiveIntensity={0.7}
            />
          </mesh>
          
          {doll.label && (
            <Text
              position={[0.3 * SIZE_MULTIPLIER, headY + 0.2 * SIZE_MULTIPLIER, 0]}
              fontSize={0.12 * SIZE_MULTIPLIER}
              color="#1F2937"
              anchorX="left"
              anchorY="middle"
              outlineColor="#FFFFFF"
              outlineWidth={0.01 * SIZE_MULTIPLIER}
              maxWidth={2 * SIZE_MULTIPLIER}
              textAlign="left"
              fontWeight="bold"
            >
              {doll.label}
            </Text>
          )}
        </>
      )}

      {/* Selection indicator */}
      {(hovered || selectedDollId === doll.id) && (
        <mesh position={[0, -0.25 * SIZE_MULTIPLIER, 0]} rotation={[-Math.PI / 2, 0, 0]}>
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

// Memoizar el componente
export default memo(Doll3DComponent, (prevProps, nextProps) => {
  return (
    prevProps.doll.id === nextProps.doll.id &&
    prevProps.doll.position[0] === nextProps.doll.position[0] &&
    prevProps.doll.position[1] === nextProps.doll.position[1] &&
    prevProps.doll.position[2] === nextProps.doll.position[2] &&
    prevProps.doll.rotation[0] === nextProps.doll.rotation[0] &&
    prevProps.doll.rotation[1] === nextProps.doll.rotation[1] &&
    prevProps.doll.rotation[2] === nextProps.doll.rotation[2] &&
    prevProps.doll.label === nextProps.doll.label &&
    prevProps.doll.emotion === nextProps.doll.emotion &&
    prevProps.isPlaced === nextProps.isPlaced
  );
});
