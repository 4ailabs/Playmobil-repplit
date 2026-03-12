import { useState } from "react";
import { LIFE_PATHS } from "../lib/types";
import { Compass, Sun, Scale, HeartCrack, ChevronDown } from "lucide-react";

export default function LifePathsPanel() {
  const [expandedPath, setExpandedPath] = useState<string | null>(null);

  const pathConfig: Record<string, {
    icon: JSX.Element;
    color: string;
    colorMuted: string;
    ringColor: string;
    bgActive: string;
    letter: string;
  }> = {
    north: {
      icon: <Compass className="w-5 h-5" />,
      color: 'text-blue-400',
      colorMuted: 'text-blue-400/70',
      ringColor: 'ring-blue-500/30',
      bgActive: 'bg-blue-500/10',
      letter: 'N',
    },
    south: {
      icon: <HeartCrack className="w-5 h-5" />,
      color: 'text-red-400',
      colorMuted: 'text-red-400/70',
      ringColor: 'ring-red-500/30',
      bgActive: 'bg-red-500/10',
      letter: 'S',
    },
    east: {
      icon: <Sun className="w-5 h-5" />,
      color: 'text-emerald-400',
      colorMuted: 'text-emerald-400/70',
      ringColor: 'ring-emerald-500/30',
      bgActive: 'bg-emerald-500/10',
      letter: 'E',
    },
    west: {
      icon: <Scale className="w-5 h-5" />,
      color: 'text-amber-400',
      colorMuted: 'text-amber-400/70',
      ringColor: 'ring-amber-500/30',
      bgActive: 'bg-amber-500/10',
      letter: 'O',
    },
  };

  return (
    <div className="space-y-2">
      {LIFE_PATHS.map((path) => {
        const isExpanded = expandedPath === path.id;
        const config = pathConfig[path.id];

        return (
          <div
            key={path.id}
            className={`rounded-xl border transition-all duration-200 ${
              isExpanded
                ? `${config.bgActive} border-chrome-border ${config.ringColor} ring-1`
                : 'border-chrome-border hover:border-chrome-hover bg-chrome-surface/50 hover:bg-chrome-surface'
            }`}
          >
            {/* Header — always visible */}
            <button
              onClick={() => setExpandedPath(isExpanded ? null : path.id)}
              className="w-full flex items-center gap-3 p-4 text-left"
            >
              <div className={`flex-shrink-0 w-9 h-9 rounded-lg flex items-center justify-center ${config.bgActive} ${config.color}`}>
                {config.icon}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className={`text-xs font-bold tracking-widest ${config.color}`}>{config.letter}</span>
                  <span className="font-display text-sm font-semibold text-chrome-text">{path.name}</span>
                </div>
                <p className="text-[11px] text-chrome-text-muted mt-0.5 leading-relaxed line-clamp-1">
                  {path.description}
                </p>
              </div>
              <ChevronDown className={`w-4 h-4 text-chrome-text-muted flex-shrink-0 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`} />
            </button>

            {/* Expanded content */}
            {isExpanded && (
              <div className="px-4 pb-4 pt-0 space-y-3 animate-fade-in">
                <div className="h-px bg-chrome-border" />

                <p className="text-xs text-chrome-text-muted leading-relaxed">
                  {path.description}
                </p>

                {/* Characteristics */}
                <div>
                  <p className="text-[10px] font-semibold text-chrome-text-muted uppercase tracking-widest mb-1.5">Características</p>
                  <ul className="space-y-1">
                    {path.characteristics.slice(0, 4).map((char, i) => (
                      <li key={i} className="flex items-start gap-2 text-xs text-chrome-text-muted">
                        <span className={`mt-1 w-1 h-1 rounded-full flex-shrink-0 ${config.color} bg-current`} />
                        <span>{char}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Benefits & Risks side by side */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-emerald-400/80 uppercase tracking-widest mb-1.5">Beneficios</p>
                    <ul className="space-y-1">
                      {path.benefits.slice(0, 3).map((b, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-chrome-text-muted">
                          <span className="text-emerald-500/70 mt-0.5 flex-shrink-0">+</span>
                          <span>{b}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="text-[10px] font-semibold text-red-400/80 uppercase tracking-widest mb-1.5">Riesgos</p>
                    <ul className="space-y-1">
                      {path.risks.slice(0, 3).map((r, i) => (
                        <li key={i} className="flex items-start gap-1.5 text-[11px] text-chrome-text-muted">
                          <span className="text-red-400/70 mt-0.5 flex-shrink-0">-</span>
                          <span>{r}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                {/* Motivations */}
                <div>
                  <p className="text-[10px] font-semibold text-chrome-text-muted uppercase tracking-widest mb-1.5">Motivaciones</p>
                  <div className="flex flex-wrap gap-1.5">
                    {path.motivations.slice(0, 4).map((m, i) => (
                      <span key={i} className="px-2 py-0.5 text-[10px] font-medium rounded bg-chrome-surface border border-chrome-border text-chrome-text-muted">
                        {m}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
      })}

      {/* Methodology note */}
      <div className="mt-3 p-3 bg-chrome-surface/60 rounded-xl border border-chrome-border">
        <p className="text-[11px] text-chrome-text-muted leading-relaxed italic">
          Cada posición y dirección reveladas espontáneamente reflejan el inconsciente familiar sistémico.
        </p>
        <p className="text-[10px] text-chrome-accent/50 mt-1.5 font-medium">
          Dr. Miguel Ojeda Rios · Playworld Pro
        </p>
      </div>
    </div>
  );
}
