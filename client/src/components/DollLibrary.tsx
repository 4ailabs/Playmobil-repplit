import { useState } from "react";
import { DOLL_TYPES } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Badge } from "./ui/badge";
import { UserRound, User, UserCog, Baby, Shapes, Lightbulb } from "lucide-react";
import { logger } from "../lib/logger";

export default function DollLibrary() {
  const { setDraggedDoll, draggedDoll, addDoll, dropDoll } = useTherapy();
  const [hoveredDoll, setHoveredDoll] = useState<string | null>(null);

  const generateRandomPosition = (): [number, number, number] => {
    const x = (Math.random() - 0.5) * 11;
    const z = (Math.random() - 0.5) * 13;
    const y = 0.16;
    return [x, y, z];
  };

  const generateRandomRotation = (): [number, number, number] => {
    const yRotation = Math.random() * Math.PI * 2;
    return [0, yRotation, 0];
  };

  const getLifePathForPosition = (position: [number, number, number]): 'north' | 'south' | 'east' | 'west' | null => {
    const [x, , z] = position;

    if (Math.abs(z) > Math.abs(x)) {
      return z < 0 ? 'north' : 'south';
    } else if (Math.abs(x) > 3) {
      return x > 0 ? 'east' : 'west';
    }

    return null;
  };

  const handleDollSelect = (dollType: typeof DOLL_TYPES[number]) => {
    const randomPosition = generateRandomPosition();
    const randomRotation = generateRandomRotation();

    const newDoll = {
      id: `placed-${Date.now()}`,
      dollType,
      position: randomPosition,
      rotation: randomRotation,
      lifePath: getLifePathForPosition(randomPosition),
      isDropped: true
    };

    logger.debug('Muñeco colocado al azar:', dollType.name, 'Posición:', randomPosition, 'Camino:', newDoll.lifePath);
    addDoll(newDoll);
    dropDoll(newDoll.id, randomPosition);
  };

  const selectableDolls = DOLL_TYPES;

  const categoryIcons: Record<string, JSX.Element> = {
    child: <UserRound className="w-3.5 h-3.5 text-blue-400" />,
    father: <User className="w-3.5 h-3.5 text-chrome-text-muted" />,
    mother: <User className="w-3.5 h-3.5 text-rose-400" />,
    grandfather: <UserCog className="w-3.5 h-3.5 text-chrome-text-muted" />,
    grandmother: <UserCog className="w-3.5 h-3.5 text-amber-400" />,
    deceased: <Baby className="w-3.5 h-3.5 text-chrome-text-muted" />,
    other: <Shapes className="w-3.5 h-3.5 text-violet-400" />
  };

  const categoryLabels: Record<string, string> = {
    child: 'Niños y Adolescentes',
    deceased: 'Bebés Fallecidos',
    father: 'Padres',
    mother: 'Madres',
    grandfather: 'Abuelos',
    grandmother: 'Abuelas',
    other: 'Formas Geométricas',
  };

  const categories = ['child', 'deceased', 'father', 'mother', 'grandfather', 'grandmother', 'other'] as const;

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="px-4 py-3 border-b chrome-divider">
        <h2 className="font-display text-base font-semibold text-chrome-text tracking-tight">
          Biblioteca
        </h2>
        <p className="text-[10px] text-chrome-text-muted mt-0.5 tracking-wide">
          Toca para colocar en la mesa
        </p>
      </div>

      {/* Doll categories */}
      <div className="flex-1 overflow-y-auto scrollbar-warm px-3 py-3 space-y-3">
        {categories.map((category) => {
          const categoryDolls = selectableDolls.filter(doll => doll.category === category);

          return (
            <div key={category}>
              {/* Category label */}
              <div className="flex items-center gap-1.5 mb-2 px-1">
                {categoryIcons[category]}
                <span className="text-[10px] font-semibold text-chrome-text-muted uppercase tracking-widest">
                  {categoryLabels[category]}
                </span>
              </div>
              {/* Doll grid */}
              <div className="grid grid-cols-2 gap-1.5">
                {categoryDolls.map((dollType) => {
                  const isActive = draggedDoll?.dollType.id === dollType.id;
                  const isHovered = hoveredDoll === dollType.id;

                  return (
                    <button
                      key={dollType.id}
                      type="button"
                      className={`
                        relative p-2 rounded-lg border cursor-pointer transition-all duration-200 touch-target touch-feedback
                        ${isActive
                          ? 'border-chrome-accent bg-chrome-accent/15 shadow-md shadow-chrome-accent/10 ring-1 ring-chrome-accent/40'
                          : 'border-chrome-border bg-chrome-surface hover:border-chrome-hover hover:bg-chrome-hover active:bg-chrome-border active:scale-[0.97]'
                        }
                        ${isHovered && !isActive ? 'shadow-sm shadow-black/20' : ''}
                        min-h-[60px]
                        focus:outline-none focus:ring-2 focus:ring-chrome-accent/40
                        group
                      `}
                      onClick={() => handleDollSelect(dollType)}
                      onMouseEnter={() => setHoveredDoll(dollType.id)}
                      onMouseLeave={() => setHoveredDoll(null)}
                      onTouchStart={() => setHoveredDoll(dollType.id)}
                      onTouchEnd={() => setHoveredDoll(null)}
                      aria-label={`Seleccionar ${dollType.name}`}
                      aria-pressed={isActive}
                    >
                      <div className="flex flex-col items-center gap-1.5">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-semibold shadow-sm shadow-black/30 group-hover:shadow-md group-hover:scale-110 transition-all duration-200 ring-1 ring-white/10"
                          style={{ backgroundColor: dollType.color }}
                        >
                          {dollType.name.charAt(0)}
                        </div>
                        <span className="text-[10px] font-medium text-chrome-text text-center leading-tight group-hover:text-chrome-accent transition-colors">
                          {dollType.name}
                        </span>
                      </div>

                      {isActive && (
                        <div className="absolute -top-1 -right-1">
                          <Badge className="text-[9px] px-1 py-0 bg-chrome-accent text-chrome-bg border-0 shadow-sm">
                            ✓
                          </Badge>
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>

      {/* Instructions footer */}
      <div className="px-4 py-2.5 border-t chrome-divider">
        <div className="text-[10px] text-chrome-text-muted space-y-0.5">
          <p className="font-medium text-chrome-text flex items-center gap-1.5 mb-1">
            <Lightbulb className="w-3 h-3 text-chrome-accent" />
            Controles
          </p>
          <div className="space-y-0 pl-4.5">
            <p>Click &rarr; colocar</p>
            <p>Doble click &rarr; rotar</p>
            <p>Delete &rarr; eliminar</p>
          </div>
        </div>
      </div>
    </div>
  );
}
