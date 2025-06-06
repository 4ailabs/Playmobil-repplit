import { HISTORICAL_ERAS } from "../lib/types";
import { useGame } from "../lib/stores/useTherapy";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function EraPanel() {
  const { selectedEra, setSelectedEra } = useGame();

  const eraIcons = {
    prehistoric: "🪨",
    ancient: "🏛️",
    medieval: "🏰",
    traditional: "🌿",
    modern: "🏡"
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-green-200">
        <h2 className="text-lg font-semibold text-slate-800">Historical Eras</h2>
        <p className="text-sm text-slate-600 mt-1">
          Choose your time period and sustainable practices
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {HISTORICAL_ERAS.map((era) => (
          <Card
            key={era.id}
            className={`
              cursor-pointer transition-all duration-200
              ${selectedEra.id === era.id
                ? 'bg-green-100 border-green-400 shadow-md'
                : 'bg-white/70 border-gray-200 hover:bg-green-50 hover:border-green-300'
              }
            `}
            onClick={() => setSelectedEra(era)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {eraIcons[era.category as keyof typeof eraIcons]}
                  </span>
                  <span>{era.name}</span>
                </div>
                {selectedEra.id === era.id && (
                  <Badge variant="default" className="text-xs">
                    Active
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {era.description}
              </p>
              
              <div className="space-y-2">
                <div>
                  <p className="text-xs font-medium text-slate-700 mb-1">Challenge:</p>
                  <p className="text-xs text-slate-600 leading-relaxed">
                    {era.challengeDescription}
                  </p>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-slate-700 mb-1">Sustainability Goals:</p>
                  <ul className="text-xs text-slate-600 space-y-0.5">
                    {era.sustainabilityGoals.map((goal, index) => (
                      <li key={index} className="flex items-start gap-1">
                        <span className="text-green-600 mt-0.5">•</span>
                        <span>{goal}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <p className="text-xs font-medium text-slate-700 mb-1">Available Buildings:</p>
                  <div className="flex flex-wrap gap-1">
                    {era.availableBuildings.slice(0, 4).map((buildingId) => (
                      <Badge key={buildingId} variant="outline" className="text-xs">
                        {buildingId.replace('-', ' ')}
                      </Badge>
                    ))}
                    {era.availableBuildings.length > 4 && (
                      <Badge variant="outline" className="text-xs">
                        +{era.availableBuildings.length - 4} more
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current era info */}
      <div className="p-4 border-t border-green-200 bg-green-50/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {eraIcons[selectedEra.category as keyof typeof eraIcons]}
            </span>
            <span className="text-sm font-medium text-slate-800">
              {selectedEra.name}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedEra.challengeDescription}
          </p>
          <div className="text-xs text-green-700">
            {selectedEra.availableBuildings.length} building types available
          </div>
        </div>
      </div>
    </div>
  );
}