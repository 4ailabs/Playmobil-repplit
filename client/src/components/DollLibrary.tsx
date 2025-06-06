import { useState } from "react";
import { DOLL_TYPES } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function DollLibrary() {
  const { setDraggedDoll, draggedDoll, addDoll, dropDoll } = useTherapy();
  const [hoveredDoll, setHoveredDoll] = useState<string | null>(null);

  const generateRandomPosition = (): [number, number, number] => {
    // Random position within table bounds (8 wide x 10 deep)
    const x = (Math.random() - 0.5) * 7; // -3.5 to 3.5
    const z = (Math.random() - 0.5) * 9; // -4.5 to 4.5
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
    
    // Check if position is in any cardinal direction zone
    if (Math.abs(z) > Math.abs(x)) {
      // North/South zones (top/bottom of table)
      return z < 0 ? 'north' : 'south';
    } else if (Math.abs(x) > 2) {
      // East/West zones (left/right of table)  
      return x > 0 ? 'east' : 'west';
    }
    
    return null; // Center area
  };

  const handleDollSelect = (dollType: any) => {
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
    
    console.log('Muñeco colocado al azar:', dollType.name, 'Posición:', randomPosition, 'Camino:', newDoll.lifePath);
    addDoll(newDoll);
    dropDoll(newDoll.id, randomPosition);
  };

  // All doll types are now selectable for complete family constellations
  const selectableDolls = DOLL_TYPES;

  const categoryIcons = {
    child: "🧒",
    father: "👨",
    mother: "👩", 
    grandfather: "👴",
    grandmother: "👵",
    other: "🔷"
  };

  const categories = ['child', 'father', 'mother', 'grandfather', 'grandmother', 'other'] as const;

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
                    <div
                      key={dollType.id}
                      className={`
                        relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                        ${draggedDoll?.dollType.id === dollType.id 
                          ? 'border-blue-400 bg-blue-50' 
                          : 'border-gray-200 hover:border-blue-300 hover:bg-blue-50/50'
                        }
                        ${hoveredDoll === dollType.id ? 'shadow-md' : 'shadow-sm'}
                      `}
                      onClick={() => handleDollSelect(dollType)}
                      onMouseEnter={() => setHoveredDoll(dollType.id)}
                      onMouseLeave={() => setHoveredDoll(null)}
                    >
                      {/* Visual representation */}
                      <div className="flex flex-col items-center gap-2">
                        <div
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold"
                          style={{ backgroundColor: dollType.color }}
                        >
                          {dollType.name.charAt(0)}
                        </div>
                        <span className="text-xs font-medium text-slate-700 text-center leading-tight">
                          {dollType.name}
                        </span>
                      </div>

                      {/* Selection indicator */}
                      {draggedDoll?.dollType.id === dollType.id && (
                        <div className="absolute -top-1 -right-1">
                          <Badge variant="default" className="text-xs px-1">
                            ✓
                          </Badge>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-blue-200 bg-blue-50/50">
        <div className="text-xs text-slate-600 space-y-1">
          <p>💡 <strong>Instrucciones:</strong></p>
          <p>• Click en un muñeco para seleccionar</p>
          <p>• Click en la mesa para colocar</p>
          <p>• Arrastra muñecos ya colocados</p>
          <p>• Click derecho para eliminar</p>
        </div>
      </div>
    </div>
  );
}
