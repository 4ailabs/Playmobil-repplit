import { useMemo } from "react";
import { Line } from "@react-three/drei";
import * as THREE from "three";
import { PlacedDoll } from "../lib/types";
import { logger } from "../lib/logger";

interface DollConnectionsProps {
  dolls: PlacedDoll[];
}

export default function DollConnections({ dolls }: DollConnectionsProps) {
  const connections = useMemo(() => {
    const lines: Array<{
      start: [number, number, number];
      end: [number, number, number];
      color: string;
      type: string;
    }> = [];

    dolls.forEach((doll) => {
      if (!doll.relationships || doll.relationships.length === 0) return;

      doll.relationships.forEach((rel) => {
        const targetDoll = dolls.find((d) => d.id === rel.targetId);
        if (!targetDoll) return;

        // Calcular posición de inicio (arriba del muñeco)
        const startY = doll.position[1] + 0.8 * 1.5; // Altura aproximada del muñeco escalado
        const endY = targetDoll.position[1] + 0.8 * 1.5;

        const start: [number, number, number] = [doll.position[0], startY, doll.position[2]];
        const end: [number, number, number] = [targetDoll.position[0], endY, targetDoll.position[2]];

        // Colores según tipo de relación
        const colors = {
          family: "#3B82F6", // Azul - relación familiar
          strong: "#10B981", // Verde - conexión fuerte
          tension: "#F59E0B", // Ámbar - tensión
          conflict: "#EF4444", // Rojo - conflicto
          distant: "#9CA3AF", // Gris - distante
        };

        lines.push({
          start,
          end,
          color: colors[rel.type] || colors.family,
          type: rel.type,
        });
      });
    });

    return lines;
  }, [dolls]);

  if (connections.length === 0) return null;

  return (
    <>
      {connections.map((conn, index) => {
        // Línea sólida para relaciones fuertes/familiares
        // Línea punteada para tensión/distante
        const isDashed = conn.type === 'tension' || conn.type === 'distant';
        
        return (
          <group key={`connection-${index}`}>
            {/* Línea principal - usando Line de drei con props correctas */}
            <Line
              points={[conn.start, conn.end]}
              color={conn.color}
              lineWidth={isDashed ? 2 : 4}
              dashed={isDashed}
              dashScale={isDashed ? 0.5 : 1}
              dashSize={isDashed ? 0.2 : 0}
              gapSize={isDashed ? 0.1 : 0}
            />
            
            {/* Flecha en el medio para indicar dirección en conflictos */}
            {conn.type === 'conflict' && (
              <mesh 
                position={[
                  (conn.start[0] + conn.end[0]) / 2,
                  (conn.start[1] + conn.end[1]) / 2,
                  (conn.start[2] + conn.end[2]) / 2
                ]}
                rotation={[
                  Math.atan2(
                    conn.end[1] - conn.start[1],
                    Math.sqrt(
                      Math.pow(conn.end[0] - conn.start[0], 2) + 
                      Math.pow(conn.end[2] - conn.start[2], 2)
                    )
                  ),
                  0,
                  Math.atan2(conn.end[2] - conn.start[2], conn.end[0] - conn.start[0])
                ]}
              >
                <coneGeometry args={[0.08, 0.15, 6]} />
                <meshStandardMaterial 
                  color={conn.color}
                  emissive={conn.color}
                  emissiveIntensity={0.3}
                />
              </mesh>
            )}
          </group>
        );
      })}
    </>
  );
}

