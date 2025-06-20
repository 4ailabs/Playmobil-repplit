import { LIFE_PATHS } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Compass, Sword, Sun, Scale, Lightbulb } from "lucide-react";

export default function LifePathsPanel() {
  const { selectedLifePath, setSelectedLifePath } = useTherapy();

  const pathIcons = {
    north: <Compass className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-blue-700" />,
    south: <Sword className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-red-700" />,
    east: <Sun className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-yellow-500" />,
    west: <Scale className="w-7 h-7 md:w-8 md:h-8 lg:w-10 lg:h-10 text-amber-700" />,
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-blue-200">
        <h2 className="text-lg font-semibold text-slate-800">Los Cuatro Caminos de Vida</h2>
        <p className="text-sm text-slate-600 mt-1">
          Selecciona un camino para entender sus características
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {LIFE_PATHS.map((path) => (
          <Card
            key={path.id}
            className={`
              cursor-pointer transition-all duration-200
              ${selectedLifePath?.id === path.id
                ? 'bg-blue-100 border-blue-400 shadow-md'
                : 'bg-white/70 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }
            `}
            onClick={() => setSelectedLifePath(path)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {pathIcons[path.id]}
                  <span className="text-base md:text-lg lg:text-xl font-semibold text-slate-800">
                    {path.name}
                  </span>
                </div>
                {selectedLifePath?.id === path.id && (
                  <Badge variant={"default" as const} className="text-xs">
                    Seleccionado
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-slate-600 leading-relaxed mb-3">
                {path.description}
              </p>
              
              {selectedLifePath?.id === path.id && (
                <div className="space-y-3">
                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Características:</p>
                    <ul className="text-xs text-slate-600 space-y-0.5">
                      {path.characteristics.slice(0, 3).map((char, index) => (
                        <li key={index} className="flex items-start gap-1">
                          <span className="text-blue-600 mt-0.5">•</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <p className="text-xs font-medium text-green-700 mb-1">Beneficios:</p>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {path.benefits.slice(0, 2).map((benefit, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-green-600 mt-0.5">+</span>
                            <span>{benefit}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <p className="text-xs font-medium text-red-700 mb-1">Riesgos:</p>
                      <ul className="text-xs text-slate-600 space-y-0.5">
                        {path.risks.slice(0, 2).map((risk, index) => (
                          <li key={index} className="flex items-start gap-1">
                            <span className="text-red-600 mt-0.5">-</span>
                            <span>{risk}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-medium text-slate-700 mb-1">Motivaciones:</p>
                    <div className="flex flex-wrap gap-1">
                      {path.motivations.slice(0, 2).map((motivation, index) => (
                        <Badge key={index} variant={"outline" as const} className="text-xs">
                          {motivation}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current path info */}
      {selectedLifePath && (
        <div className="p-4 border-t border-blue-200 bg-blue-50/50">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              {pathIcons[selectedLifePath.id]}
              <span className="text-base md:text-lg lg:text-xl font-semibold text-slate-800">
                {selectedLifePath.name}
              </span>
            </div>
            <p className="text-xs text-slate-600 leading-relaxed">
              Cuando un muñeco apunte hacia esta dirección, estará siguiendo este camino de vida.
            </p>
          </div>
        </div>
      )}

      {/* Instructions */}
      <div className="p-2 border-t border-blue-200 bg-slate-50/50 mb-16 md:mb-24">
        <div className="text-sm md:text-base text-slate-700 space-y-1 flex flex-col">
          <span className="flex items-center gap-2 font-semibold text-blue-800 mb-1">
            <Lightbulb className="w-4 h-4 text-blue-500" /> Proceso de la Técnica:
          </span>
          <span>1. Selecciona muñecos familiares de la biblioteca</span>
          <span>2. Coloca el muñeco en el centro de la mesa</span>
          <span>3. Levanta y deja caer naturalmente</span>
          <span>4. Observa hacia qué dirección apuntan los pies</span>
          <span>5. Analiza los patrones familiares revelados</span>
        </div>
      </div>
    </div>
  );
}