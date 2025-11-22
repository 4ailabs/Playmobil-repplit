import { useState } from "react";
import { DOLL_TYPES } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { UserRound, User, UserCog, Baby, Shapes, Lightbulb } from "lucide-react";
import { logger } from "../lib/logger";

export default function DollLibrary() {
  const { setDraggedDoll, draggedDoll, addDoll, dropDoll } = useTherapy();
  const [hoveredDoll, setHoveredDoll] = useState<string | null>(null);

  const generateRandomPosition = (): [number, number, number] => {
    // Random position within table bounds (12 wide x 14 deep - Aumentado)
    const x = (Math.random() - 0.5) * 11; // -5.5 to 5.5
    const z = (Math.random() - 0.5) * 13; // -6.5 to 6.5
    const y = 0.16; // Fixed height above table
    return [x, y, z];
  };

  const generateRandomRotation = (): [number, number, number] => {
    // Random Y rotation to show different directions
    const yRotation = Math.random() * Math.PI * 2; // 0 to 2π
    return [0, yRotation, 0];
  };

  const getLifePathForPosition = (position: [number, number, number]): 'north' | 'south' | 'east' | 'west' | null => {
    const [x, , z] = position;
    
    // Check if position is in any cardinal direction zone (ajustado para mesa 12x14)
    if (Math.abs(z) > Math.abs(x)) {
      // North/South zones (top/bottom of table)
      return z < 0 ? 'north' : 'south';
    } else if (Math.abs(x) > 3) {
      // East/West zones (left/right of table) - Ajustado para mesa más grande
      return x > 0 ? 'east' : 'west';
    }
    
    return null; // Center area
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

  // All doll types are now selectable for complete family constellations
  const selectableDolls = DOLL_TYPES;

  const categoryIcons = {
    child: <UserRound className="w-5 h-5 text-blue-500" />,
    father: <User className="w-5 h-5 text-blue-800" />,
    mother: <User className="w-5 h-5 text-pink-600" />,
    grandfather: <UserCog className="w-5 h-5 text-gray-700" />,
    grandmother: <UserCog className="w-5 h-5 text-pink-400" />,
    deceased: <Baby className="w-5 h-5 text-yellow-500" />,
    other: <Shapes className="w-5 h-5 text-indigo-400" />
  };

  const categories = ['child', 'deceased', 'father', 'mother', 'grandfather', 'grandmother', 'other'] as const;

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-blue-200">
        <h2 className="text-lg font-semibold text-slate-800">Biblioteca de Muñecos</h2>
        <p className="text-sm text-slate-600 mt-1">
          Arrastra los muñecos a la mesa para crear tu escena
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const categoryDolls = selectableDolls.filter(doll => doll.category === category);
          
          return (
            <Card key={category} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  {category === 'child' && 'Niños y Adolescentes'}
                  {category === 'deceased' && 'Bebés Fallecidos'}
                  {category === 'father' && 'Padres'}
                  {category === 'mother' && 'Madres'}
                  {category === 'grandfather' && 'Abuelos'}
                  {category === 'grandmother' && 'Abuelas'}
                  {category === 'other' && 'Formas Geométricas'}
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="grid grid-cols-2 gap-2">
                  {categoryDolls.map((dollType) => (
                    <button
                      key={dollType.id}
                      type="button"
                      className={`
                        relative p-3 rounded-xl border-2 cursor-pointer transition-all duration-300 touch-target touch-feedback
                        bg-gradient-to-br from-white to-slate-50
                        ${draggedDoll?.dollType.id === dollType.id 
                          ? 'border-blue-400 bg-gradient-to-br from-blue-50 to-blue-100 shadow-lg scale-105 ring-2 ring-blue-300 ring-offset-1' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-gradient-to-br hover:from-blue-50 hover:to-blue-100/50 active:bg-blue-100 active:border-blue-400 active:scale-95'
                        }
                        ${hoveredDoll === dollType.id ? 'shadow-lg transform scale-105' : 'shadow-sm hover:shadow-md'}
                        min-h-[70px] min-w-[70px]
                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2
                        group
                      `}
                      onClick={() => handleDollSelect(dollType)}
                      onMouseEnter={() => setHoveredDoll(dollType.id)}
                      onMouseLeave={() => setHoveredDoll(null)}
                      onTouchStart={() => setHoveredDoll(dollType.id)}
                      onTouchEnd={() => setHoveredDoll(null)}
                      aria-label={`Seleccionar ${dollType.name}`}
                      aria-pressed={draggedDoll?.dollType.id === dollType.id}
                    >
                      {/* Visual representation */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-10 h-10 rounded-full flex items-center justify-center text-white text-sm font-bold shadow-md group-hover:shadow-lg transition-shadow duration-300 group-hover:scale-110 transform"
                          style={{ backgroundColor: dollType.color }}
                        >
                          {dollType.name.charAt(0)}
                        </div>
                        <span className="text-xs font-semibold text-slate-700 text-center leading-tight group-hover:text-blue-700 transition-colors">
                          {dollType.name}
                        </span>
                      </div>

                      {/* Selection indicator */}
                      {draggedDoll?.dollType.id === dollType.id && (
                        <div className="absolute -top-1 -right-1 animate-in zoom-in-50 duration-200">
                          <Badge variant="default" className="text-xs px-1.5 py-0.5 bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-md">
                            ✓
                          </Badge>
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-blue-200 bg-gradient-to-br from-blue-50/80 to-indigo-50/50">
        <div className="text-xs text-slate-700 space-y-1.5">
          <p className="font-semibold text-blue-800 flex items-center gap-1.5">
            <Lightbulb className="w-4 h-4 text-blue-600" />
            Instrucciones:
          </p>
          <div className="space-y-1 pl-5">
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Click en un muñeco para seleccionar</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Se coloca automáticamente en la mesa</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Doble click para rotar dirección</span>
            </p>
            <p className="flex items-start gap-2">
              <span className="text-blue-500 mt-0.5">•</span>
              <span>Delete/Backspace para eliminar</span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
