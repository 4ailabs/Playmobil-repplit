import { useState } from "react";
import { Shuffle, Trash2, Baby, Compass, Lightbulb, X, HelpCircle } from "lucide-react";

export default function InstructionsPanel() {
  const [isOpen, setIsOpen] = useState(false);

  if (!isOpen) {
    return (
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-14 right-4 z-30 bg-chrome-bg/90 hover:bg-chrome-surface text-chrome-text-muted hover:text-chrome-text flex items-center gap-1.5 shadow-lg border border-chrome-border backdrop-blur-sm rounded-lg h-7 px-2.5 text-[10px] font-medium tracking-wide transition-all hover:scale-105"
        title="Abrir guía de instrucciones"
      >
        <HelpCircle className="w-3 h-3" /> Guía
      </button>
    );
  }

  return (
    <div className="fixed bottom-14 right-4 z-40 w-72 chrome-panel rounded-xl shadow-2xl shadow-black/30 border border-chrome-border max-h-[calc(100vh-8rem)] overflow-y-auto scrollbar-warm animate-fade-in">
      <div className="p-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-display text-base font-semibold text-chrome-text flex items-center gap-2">
            <Lightbulb className="w-4 h-4 text-chrome-accent" />
            Guía Rápida
          </h3>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-chrome-hover transition-colors text-chrome-text-muted hover:text-chrome-text"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        <div className="space-y-3 text-xs text-chrome-text-muted">
          <div>
            <h4 className="font-semibold text-chrome-text mb-1 flex items-center gap-1.5">
              <Shuffle className="w-3.5 h-3.5 text-chrome-accent" />
              Colocación Aleatoria
            </h4>
            <p className="leading-relaxed pl-5">
              Selecciona un familiar de la biblioteca. El muñeco cae automáticamente al azar en la mesa.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-chrome-text mb-1 flex items-center gap-1.5">
              <Trash2 className="w-3.5 h-3.5 text-chrome-accent" />
              Eliminar
            </h4>
            <p className="leading-relaxed pl-5">
              Click en un muñeco, luego Delete o Backspace.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-chrome-text mb-1 flex items-center gap-1.5">
              <Baby className="w-3.5 h-3.5 text-chrome-accent" />
              Bebés Fallecidos
            </h4>
            <p className="leading-relaxed pl-5">
              Esferas etéreas con halo dorado. Honran pérdidas tempranas.
            </p>
          </div>

          <div>
            <h4 className="font-semibold text-chrome-text mb-1 flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-chrome-accent" />
              Caminos de Vida
            </h4>
            <p className="leading-relaxed pl-5">
              <strong className="text-blue-300">N:</strong> Migrante &middot; <strong className="text-red-300">S:</strong> Sufrimiento<br/>
              <strong className="text-emerald-300">E:</strong> Placer &middot; <strong className="text-amber-300">O:</strong> Deber
            </p>
          </div>

          <div className="bg-chrome-surface p-2.5 rounded-lg border border-chrome-border">
            <p className="text-[11px] text-chrome-text-muted leading-relaxed italic">
              Cada posición y dirección reveladas espontáneamente
              reflejan el inconsciente familiar sistémico.
            </p>
            <p className="text-[10px] text-chrome-accent/60 mt-1 font-medium">
              Dr. Miguel Ojeda Rios &middot; Playworld Pro
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
