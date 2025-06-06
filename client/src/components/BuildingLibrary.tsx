import { useState } from "react";
import { BUILDING_TYPES } from "../lib/types";
import { useGame } from "../lib/stores/useTherapy";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";

export default function BuildingLibrary() {
  const { setDraggedBuilding, draggedBuilding, selectedEra, resources, canAffordBuilding } = useGame();
  const [hoveredBuilding, setHoveredBuilding] = useState<string | null>(null);

  const handleBuildingSelect = (buildingType: any) => {
    const newBuilding = {
      id: `temp-${Date.now()}`,
      buildingType,
      position: [0, 0.1, 0] as [number, number, number],
      rotation: [0, 0, 0] as [number, number, number],
      level: 1,
      efficiency: 1.0
    };
    setDraggedBuilding(newBuilding);
  };

  const categoryIcons = {
    housing: "🏠",
    production: "🏭",
    infrastructure: "🚰",
    culture: "🏛️"
  };

  const categories = ['housing', 'production', 'infrastructure', 'culture'] as const;

  // Filter buildings available in current era
  const availableBuildings = BUILDING_TYPES.filter(building => 
    selectedEra.availableBuildings.includes(building.id)
  );

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-green-200">
        <h2 className="text-lg font-semibold text-slate-800">Building Library</h2>
        <p className="text-sm text-slate-600 mt-1">
          Drag buildings to create your sustainable community
        </p>
      </div>

      {/* Resources Display */}
      <div className="p-4 border-b border-green-200 bg-green-50/50">
        <h3 className="text-sm font-medium text-slate-700 mb-2">Available Resources</h3>
        <div className="grid grid-cols-3 gap-2 text-xs">
          {Object.entries(resources).map(([resource, amount]) => (
            <div key={resource} className="flex items-center gap-1">
              <span className="capitalize text-slate-600">{resource}:</span>
              <span className="font-medium text-slate-800">{amount}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {categories.map((category) => {
          const categoryBuildings = availableBuildings.filter(building => building.category === category);
          
          if (categoryBuildings.length === 0) return null;
          
          return (
            <Card key={category} className="bg-white/70 backdrop-blur-sm">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center gap-2">
                  <span className="text-lg">{categoryIcons[category]}</span>
                  <span className="capitalize">{category}</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="space-y-2">
                  {categoryBuildings.map((buildingType) => {
                    const affordable = canAffordBuilding(buildingType);
                    
                    return (
                      <div
                        key={buildingType.id}
                        className={`
                          relative p-3 rounded-lg border-2 cursor-pointer transition-all duration-200
                          ${draggedBuilding?.buildingType.id === buildingType.id 
                            ? 'border-green-400 bg-green-50' 
                            : affordable
                              ? 'border-gray-200 hover:border-green-300 hover:bg-green-50/50'
                              : 'border-red-200 bg-red-50/30 cursor-not-allowed opacity-60'
                          }
                          ${hoveredBuilding === buildingType.id ? 'shadow-md' : 'shadow-sm'}
                        `}
                        onClick={() => affordable && handleBuildingSelect(buildingType)}
                        onMouseEnter={() => setHoveredBuilding(buildingType.id)}
                        onMouseLeave={() => setHoveredBuilding(null)}
                      >
                        {/* Visual representation */}
                        <div className="flex items-start gap-3">
                          <div
                            className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-xs font-bold flex-shrink-0"
                            style={{ backgroundColor: buildingType.color }}
                          >
                            {buildingType.name.charAt(0)}
                          </div>
                          
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-sm font-medium text-slate-700 truncate">
                                {buildingType.name}
                              </span>
                              <Badge variant="outline" className="text-xs px-1">
                                +{buildingType.sustainabilityBonus}🌱
                              </Badge>
                            </div>
                            
                            <p className="text-xs text-slate-600 leading-tight mb-2">
                              {buildingType.description}
                            </p>
                            
                            {/* Resource costs */}
                            <div className="flex flex-wrap gap-1 text-xs">
                              {Object.entries(buildingType.resourceCost).map(([resource, cost]) => (
                                <span 
                                  key={resource}
                                  className={`px-1 py-0.5 rounded text-xs ${
                                    (resources[resource] || 0) >= cost 
                                      ? 'bg-green-100 text-green-700' 
                                      : 'bg-red-100 text-red-700'
                                  }`}
                                >
                                  {resource}: {cost}
                                </span>
                              ))}
                            </div>
                            
                            {/* Production display */}
                            {Object.keys(buildingType.resourceProduction).length > 0 && (
                              <div className="flex flex-wrap gap-1 text-xs mt-1">
                                <span className="text-blue-600 font-medium">Produces:</span>
                                {Object.entries(buildingType.resourceProduction).map(([resource, amount]) => (
                                  <span key={resource} className="bg-blue-100 text-blue-700 px-1 py-0.5 rounded">
                                    {resource}: +{amount}
                                  </span>
                                ))}
                              </div>
                            )}
                            
                            {/* Population capacity */}
                            {buildingType.populationCapacity > 0 && (
                              <div className="text-xs text-purple-600 mt-1">
                                Population: +{buildingType.populationCapacity}
                              </div>
                            )}
                          </div>
                        </div>

                        {/* Selection indicator */}
                        {draggedBuilding?.buildingType.id === buildingType.id && (
                          <div className="absolute -top-1 -right-1">
                            <Badge variant="default" className="text-xs px-1">
                              ✓
                            </Badge>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Instructions */}
      <div className="p-4 border-t border-green-200 bg-green-50/50">
        <div className="text-xs text-slate-600 space-y-1">
          <p>💡 <strong>Instructions:</strong></p>
          <p>• Click a building to select it</p>
          <p>• Click on the settlement area to place</p>
          <p>• Drag placed buildings to move them</p>
          <p>• Right-click to remove buildings</p>
          <p>• Monitor your resources and sustainability!</p>
        </div>
      </div>
    </div>
  );
}