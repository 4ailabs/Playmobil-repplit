import { THERAPY_SCENARIOS } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapy";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";

export default function ScenarioPanel() {
  const { selectedScenario, setSelectedScenario } = useTherapy();

  const scenarioIcons = {
    family: "👨‍👩‍👧‍👦",
    couple: "💑",
    individual: "🧠",
    systemic: "🌳",
    work: "🏢"
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-blue-200">
        <h2 className="text-lg font-semibold text-slate-800">Escenarios Terapéuticos</h2>
        <p className="text-sm text-slate-600 mt-1">
          Selecciona el contexto de tu sesión
        </p>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3">
        {THERAPY_SCENARIOS.map((scenario) => (
          <Card
            key={scenario.id}
            className={`
              cursor-pointer transition-all duration-200
              ${selectedScenario.id === scenario.id
                ? 'bg-blue-100 border-blue-400 shadow-md'
                : 'bg-white/70 border-gray-200 hover:bg-blue-50 hover:border-blue-300'
              }
            `}
            onClick={() => setSelectedScenario(scenario)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="text-sm flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-lg">
                    {scenarioIcons[scenario.category as keyof typeof scenarioIcons]}
                  </span>
                  <span>{scenario.name}</span>
                </div>
                {selectedScenario.id === scenario.id && (
                  <Badge variant="default" className="text-xs">
                    Activo
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-slate-600 leading-relaxed">
                {scenario.description}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Current scenario info */}
      <div className="p-4 border-t border-blue-200 bg-blue-50/50">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <span className="text-lg">
              {scenarioIcons[selectedScenario.category as keyof typeof scenarioIcons]}
            </span>
            <span className="text-sm font-medium text-slate-800">
              {selectedScenario.name}
            </span>
          </div>
          <p className="text-xs text-slate-600 leading-relaxed">
            {selectedScenario.description}
          </p>
        </div>
      </div>
    </div>
  );
}
