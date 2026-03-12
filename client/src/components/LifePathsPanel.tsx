import { LIFE_PATHS } from "../lib/types";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Badge } from "./ui/badge";
import { Compass, Sun, Scale, HeartCrack, Lightbulb } from "lucide-react";

export default function LifePathsPanel() {
  const { selectedLifePath, setSelectedLifePath } = useTherapy();

  const pathConfig: Record<string, {
    icon: JSX.Element;
    gradient: string;
    border: string;
    activeBorder: string;
    badgeBg: string;
  }> = {
    north: {
      icon: <Compass className="w-7 h-7 text-blue-600" />,
      gradient: 'from-blue-50/80 to-blue-100/40',
      border: 'border-blue-200/60',
      activeBorder: 'border-blue-400 ring-2 ring-blue-200',
      badgeBg: 'bg-blue-600',
    },
    south: {
      icon: <HeartCrack className="w-7 h-7 text-red-600" />,
      gradient: 'from-red-50/80 to-red-100/40',
      border: 'border-red-200/60',
      activeBorder: 'border-red-400 ring-2 ring-red-200',
      badgeBg: 'bg-red-600',
    },
    east: {
      icon: <Sun className="w-7 h-7 text-amber-500" />,
      gradient: 'from-amber-50/80 to-amber-100/40',
      border: 'border-amber-200/60',
      activeBorder: 'border-amber-400 ring-2 ring-amber-200',
      badgeBg: 'bg-amber-600',
    },
    west: {
      icon: <Scale className="w-7 h-7 text-emerald-600" />,
      gradient: 'from-emerald-50/80 to-emerald-100/40',
      border: 'border-emerald-200/60',
      activeBorder: 'border-emerald-400 ring-2 ring-emerald-200',
      badgeBg: 'bg-emerald-600',
    },
  };

  return (
    <div className="space-y-3">
      {LIFE_PATHS.map((path) => {
        const isSelected = selectedLifePath?.id === path.id;
        const config = pathConfig[path.id];

        return (
          <Card
            key={path.id}
            className={`
              cursor-pointer transition-all duration-300
              bg-gradient-to-br ${config.gradient}
              border ${isSelected ? config.activeBorder : config.border}
              ${isSelected ? 'shadow-md' : 'shadow-sm hover:shadow-md'}
              hover:scale-[1.005]
            `}
            onClick={() => setSelectedLifePath(path)}
          >
            <CardHeader className="pb-2">
              <CardTitle className="flex items-center justify-between">
                <div className="flex items-center gap-2.5">
                  {config.icon}
                  <span className="font-display text-lg font-semibold text-warm-800">
                    {path.name}
                  </span>
                </div>
                {isSelected && (
                  <Badge className={`text-[10px] px-1.5 py-0 ${config.badgeBg} text-white border-0`}>
                    Activo
                  </Badge>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="pt-0">
              <p className="text-xs text-warm-500 leading-relaxed mb-3">
                {path.description}
              </p>

              {isSelected && (
                <div className="space-y-3 animate-fade-in">
                  <div>
                    <p className="text-[11px] font-semibold text-warm-600 mb-1 uppercase tracking-wider">Características</p>
                    <ul className="text-xs text-warm-500 space-y-0.5">
                      {path.characteristics.slice(0, 3).map((char, i) => (
                        <li key={i} className="flex items-start gap-1.5">
                          <span className="text-warm-300 mt-0.5">—</span>
                          <span>{char}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <p className="text-[11px] font-semibold text-green-700 mb-1 uppercase tracking-wider">Beneficios</p>
                      <ul className="text-xs text-warm-500 space-y-0.5">
                        {path.benefits.slice(0, 2).map((b, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-green-400 mt-0.5">+</span>
                            <span>{b}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <p className="text-[11px] font-semibold text-red-600 mb-1 uppercase tracking-wider">Riesgos</p>
                      <ul className="text-xs text-warm-500 space-y-0.5">
                        {path.risks.slice(0, 2).map((r, i) => (
                          <li key={i} className="flex items-start gap-1.5">
                            <span className="text-red-400 mt-0.5">-</span>
                            <span>{r}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div>
                    <p className="text-[11px] font-semibold text-warm-600 mb-1 uppercase tracking-wider">Motivaciones</p>
                    <div className="flex flex-wrap gap-1">
                      {path.motivations.slice(0, 3).map((m, i) => (
                        <Badge key={i} variant="outline" className="text-[10px] border-warm-300 text-warm-600">
                          {m}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}

      {/* Methodology note */}
      <div className="mt-4 p-3 bg-warm-50/80 rounded-lg border border-warm-200/40">
        <p className="flex items-center gap-1.5 text-[11px] font-semibold text-warm-600 mb-1">
          <Lightbulb className="w-3.5 h-3.5 text-terracotta-400" />
          Metodología
        </p>
        <ol className="text-[11px] text-warm-500 space-y-0.5 list-decimal list-inside">
          <li>Selecciona el muñeco desde la biblioteca</li>
          <li>Observa la caída fenomenológica en el lienzo</li>
          <li>Lee la orientación y camino de vida</li>
          <li>Analiza patrones e interacciones</li>
          <li>Formula preguntas terapéuticas</li>
        </ol>
      </div>
    </div>
  );
}
