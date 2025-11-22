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

// Geometrías compartidas - Estilo Playmobil: cabeza grande, cuerpo simple
const SIZE_MULTIPLIER = 1.5;

const sharedGeometries = {
  // Cuerpos estilo Playmobil: cilindros simples y rectos
  bodyAdult: new THREE.CylinderGeometry(0.16 * SIZE_MULTIPLIER, 0.16 * SIZE_MULTIPLIER, 0.5 * SIZE_MULTIPLIER, 12),
  bodyChild: new THREE.CylinderGeometry(0.12 * SIZE_MULTIPLIER, 0.12 * SIZE_MULTIPLIER, 0.4 * SIZE_MULTIPLIER, 12),
  bodyBaby: new THREE.CylinderGeometry(0.09 * SIZE_MULTIPLIER, 0.09 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 12),
  
  // Cabezas estilo Playmobil: grandes y redondas (característica distintiva)
  headAdult: new THREE.SphereGeometry(0.18 * SIZE_MULTIPLIER, 20, 20), // Cabeza grande característica
  headChild: new THREE.SphereGeometry(0.14 * SIZE_MULTIPLIER, 20, 20),
  headBaby: new THREE.SphereGeometry(0.11 * SIZE_MULTIPLIER, 20, 20),
  
  // Extremidades delgadas estilo Playmobil
  arm: new THREE.CylinderGeometry(0.035 * SIZE_MULTIPLIER, 0.035 * SIZE_MULTIPLIER, 0.3 * SIZE_MULTIPLIER, 8),
  leg: new THREE.CylinderGeometry(0.04 * SIZE_MULTIPLIER, 0.04 * SIZE_MULTIPLIER, 0.15 * SIZE_MULTIPLIER, 8), // Piernas más cortas estilo Playmobil
  
  // Detalles faciales Playmobil: ojos grandes y simples
  eye: new THREE.SphereGeometry(0.03 * SIZE_MULTIPLIER, 12, 12),
  pupil: new THREE.SphereGeometry(0.015 * SIZE_MULTIPLIER, 8, 8),
  
  // Formas geométricas (sin cambios)
  sphere: new THREE.SphereGeometry(0.25 * SIZE_MULTIPLIER, 20, 20),
  cone: new THREE.ConeGeometry(0.06 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 4),
  cylinder: new THREE.CylinderGeometry(0.025 * SIZE_MULTIPLIER, 0.025 * SIZE_MULTIPLIER, 0.18 * SIZE_MULTIPLIER, 8),
  ring: new THREE.RingGeometry(0.3 * SIZE_MULTIPLIER, 0.35 * SIZE_MULTIPLIER, 20),
  
  // Accesorios Playmobil: sombreros, cabello
  hat: new THREE.CylinderGeometry(0.2 * SIZE_MULTIPLIER, 0.2 * SIZE_MULTIPLIER, 0.08 * SIZE_MULTIPLIER, 12), // Sombrero simple
  hairLong: new THREE.SphereGeometry(0.19 * SIZE_MULTIPLIER, 16, 16), // Cabello largo
  hairShort: new THREE.BoxGeometry(0.22 * SIZE_MULTIPLIER, 0.1 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER), // Cabello corto
};

// Materiales compartidos - Colores sólidos estilo Playmobil
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

  // Escalas según edad - estilo Playmobil
  const ageScale = useMemo(() => {
    const baseMultiplier = 1.3;
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
  const isChild = useMemo(() => doll.dollType.id.includes('child') || doll.dollType.id.includes('teen'), [doll.dollType.id]);
  const isAdult = useMemo(() => 
    doll.dollType.category === 'father' || 
    doll.dollType.category === 'mother' || 
    doll.dollType.category === 'grandfather' || 
    doll.dollType.category === 'grandmother',
    [doll.dollType.category]
  );

  // Gaze direction - Independiente de la dirección de caminar
  // La mirada puede ser diferente de la dirección del cuerpo, pero limitada a un rango realista (±90 grados máximo)
  // Los humanos no pueden girar la cabeza 180 grados
  const gazeOffset = useMemo(() => {
    const followsBody = Math.random() > 0.5;
    if (followsBody) return 0; // A veces miran en la misma dirección que caminan
    // Limitar a ±90 grados máximo (rango realista de movimiento de cabeza humano)
    return (Math.random() - 0.5) * Math.PI / 2; // Entre -90 y +90 grados
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
          <mesh position={[-0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
          <mesh position={[0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.22 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
          <mesh position={[-0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.24 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
          <mesh position={[0.06 * SIZE_MULTIPLIER, 0.52 * SIZE_MULTIPLIER, 0.24 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
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
  const bodyHeight = isBaby ? 0.3 : isChild ? 0.4 : 0.5;
  const bodyTopY = bodyHeight * SIZE_MULTIPLIER; // Parte superior del cuerpo (centro del cilindro + mitad de altura)
  const headRadius = isBaby ? 0.11 * SIZE_MULTIPLIER : isChild ? 0.14 * SIZE_MULTIPLIER : 0.18 * SIZE_MULTIPLIER;
  const headY = bodyTopY + headRadius; // Cabeza conectada directamente al cuerpo (centro de la cabeza en la parte superior del cuerpo + radio)
  const headSize = isBaby ? sharedGeometries.headBaby : isChild ? sharedGeometries.headChild : sharedGeometries.headAdult;
  const bodyGeometry = isBaby ? sharedGeometries.bodyBaby : isChild ? sharedGeometries.bodyChild : sharedGeometries.bodyAdult;

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
      {/* Cuerpo estilo Playmobil: cilindro simple y recto - Rota con el cuerpo */}
      <mesh position={[0, bodyHeight * SIZE_MULTIPLIER / 2, 0]} castShadow>
        <primitive object={bodyGeometry.clone()} />
        <meshStandardMaterial
          color={dollColor}
          roughness={0.6} // Más brillante estilo juguete
          metalness={0.0}
          flatShading={false}
        />
      </mesh>

      {/* Cabeza estilo Playmobil: grande y redonda - Rota según la mirada (como humanos) */}
      {/* La cabeza rota independientemente del cuerpo para mirar en otra dirección */}
      <group position={[0, headY, 0]} rotation={[0, gazeOffset, 0]}>
        {/* Cabeza */}
        <mesh castShadow>
          <primitive object={headSize.clone()} />
          <meshStandardMaterial
            color={dollColor.clone().multiplyScalar(0.95)}
            roughness={0.5} // Más brillante
            metalness={0.0}
            flatShading={false}
          />
        </mesh>
        
        {/* Accesorios estilo Playmobil según género y edad - Rotan con la cabeza */}
        {!isBaby && (
          <>
            {isFemale ? (
              // Cabello largo para mujeres
              <mesh 
                position={[0, 0.15 * SIZE_MULTIPLIER, -0.02 * SIZE_MULTIPLIER]} 
                castShadow
              >
                <primitive object={sharedGeometries.hairLong.clone()} />
                <meshStandardMaterial
                  color={dollColor.clone().multiplyScalar(0.5)}
                  roughness={0.7}
                  metalness={0.0}
                />
              </mesh>
            ) : (
              // Cabello corto o sombrero para hombres adultos
              isAdult ? (
                <mesh 
                  position={[0, 0.1 * SIZE_MULTIPLIER, 0]} 
                  castShadow
                >
                  <primitive object={sharedGeometries.hat.clone()} />
                  <meshStandardMaterial
                    color={dollColor.clone().multiplyScalar(0.4)}
                    roughness={0.6}
                    metalness={0.0}
                  />
                </mesh>
              ) : (
                // Cabello corto para niños
                <mesh 
                  position={[0, 0.1 * SIZE_MULTIPLIER, 0]} 
                  castShadow
                >
                  <primitive object={sharedGeometries.hairShort.clone()} />
                  <meshStandardMaterial
                    color={dollColor.clone().multiplyScalar(0.5)}
                    roughness={0.7}
                    metalness={0.0}
                  />
                </mesh>
              )
            )}
          </>
        )}
        
        {/* Lazo para bebés femeninos */}
        {isFemale && isBaby && (
          <mesh 
            position={[0, 0.05 * SIZE_MULTIPLIER, 0.12 * SIZE_MULTIPLIER]} 
            rotation={[0, 0, 0]}
            castShadow
          >
            <torusGeometry args={[0.05 * SIZE_MULTIPLIER, 0.015 * SIZE_MULTIPLIER, 8, 16]} />
            <meshStandardMaterial
              color={dollColor.clone().multiplyScalar(1.3)}
              roughness={0.5}
              metalness={0.1}
            />
          </mesh>
        )}

        {/* Ojos estilo Playmobil: grandes y simples - Fijos en la cabeza (la cabeza ya rota según la mirada) */}
        <mesh position={[-0.07 * SIZE_MULTIPLIER, 0, 0.18 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
        <mesh position={[0.07 * SIZE_MULTIPLIER, 0, 0.18 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.eye} material={sharedMaterials.eyeWhite} />
        <mesh position={[-0.07 * SIZE_MULTIPLIER, 0, 0.21 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
        <mesh position={[0.07 * SIZE_MULTIPLIER, 0, 0.21 * SIZE_MULTIPLIER]} castShadow geometry={sharedGeometries.pupil} material={sharedMaterials.eyeBlack} />
      </group>

      {/* Brazos estilo Playmobil: delgados - Alineados con la dirección del cuerpo (coinciden con la flecha) */}
      {/* ESTRATEGIA CORRECTA: Los cilindros de brazos están verticales (eje Y) por defecto */}
      {/* Para que apunten hacia ADELANTE necesitan rotar 90° en X, luego ajustar Z para separarlos */}
      {/* Brazo izquierdo: rotar 90° en X para que apunte adelante, luego 20° en Z para separarlo del cuerpo */}
      <mesh 
        position={[-0.16 * SIZE_MULTIPLIER, bodyHeight * SIZE_MULTIPLIER * 0.65, 0.08 * SIZE_MULTIPLIER]} 
        rotation={[Math.PI / 2, 0, 0.35]} 
        castShadow 
        geometry={sharedGeometries.arm}
      >
        <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.0} />
      </mesh>
      {/* Brazo derecho: rotar 90° en X para que apunte adelante, luego -20° en Z para separarlo del cuerpo */}
      <mesh 
        position={[0.16 * SIZE_MULTIPLIER, bodyHeight * SIZE_MULTIPLIER * 0.65, 0.08 * SIZE_MULTIPLIER]} 
        rotation={[Math.PI / 2, 0, -0.35]} 
        castShadow 
        geometry={sharedGeometries.arm}
      >
        <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.0} />
      </mesh>

      {/* Piernas estilo Playmobil: delgadas, cortas y conectadas al cuerpo */}
      {/* Las piernas tienen longitud 0.15 * SIZE_MULTIPLIER = 0.225 */}
      {/* Su centro está en Y = -0.1125 (mitad de 0.225) para que:
           - Parte superior: Y = 0 (conectada al cuerpo)
           - Parte inferior: Y = -0.225 (ligeramente debajo de la mesa, estilo Playmobil) */}
      <mesh position={[-0.08 * SIZE_MULTIPLIER, -0.075 * SIZE_MULTIPLIER, 0]} castShadow geometry={sharedGeometries.leg}>
        <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.0} />
      </mesh>
      <mesh position={[0.08 * SIZE_MULTIPLIER, -0.075 * SIZE_MULTIPLIER, 0]} castShadow geometry={sharedGeometries.leg}>
        <meshStandardMaterial color={dollColor} roughness={0.6} metalness={0.0} />
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
    prevProps.isPlaced === nextProps.isPlaced
  );
});
