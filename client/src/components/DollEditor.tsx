import { useState } from "react";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import {
  Link2, Meh, Laugh, Frown, Angry, AlertTriangle,
  Users2, Heart, AlertCircle, Minus, Image as ImageIcon, X
} from "lucide-react";
import { RelationshipType } from "../lib/types";
import { IMAGE_CARD_URLS, WORD_CARD_DATA } from "../lib/ohCardsConstants";

export default function DollEditor() {
  const {
    placedDolls,
    selectedDollId,
    setSelectedDollId,
    updateDollLabel,
    updateDollNotes,
    updateDollEmotion,
    addDollRelationship,
    removeDollRelationship,
    updateDollOHCard,
    setDollNeedingOHCard,
  } = useTherapy();

  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState<RelationshipType>("family");
  const [ohCardPreviewOpen, setOhCardPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'image' | 'word' | 'both'>('both');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewWord, setPreviewWord] = useState<string | null>(null);

  const selectedDoll = placedDolls.find(d => d.id === selectedDollId);
  if (!selectedDoll) return null;

  const otherDolls = placedDolls.filter(d => d.id !== selectedDollId);

  const relColors: Record<string, string> = {
    family: "bg-blue-500/15 text-blue-300 border-blue-500/25",
    strong: "bg-green-500/15 text-green-300 border-green-500/25",
    tension: "bg-amber-500/15 text-amber-300 border-amber-500/25",
    conflict: "bg-red-500/15 text-red-300 border-red-500/25",
    distant: "bg-chrome-hover text-chrome-text-muted border-chrome-border",
  };

  return (
    <div className="h-full flex flex-col bg-transparent">
      {/* Header */}
      <div className="px-4 py-3 border-b chrome-divider flex items-center justify-between">
        <div className="flex items-center gap-2 min-w-0">
          <div
            className="w-3 h-3 rounded-full flex-shrink-0 shadow-sm ring-1 ring-white/10"
            style={{ backgroundColor: selectedDoll.dollType.color }}
          />
          <h2 className="font-display text-base font-semibold text-chrome-text truncate">
            {selectedDoll.label || selectedDoll.dollType.name}
          </h2>
        </div>
        <button
          onClick={() => setSelectedDollId(null)}
          className="p-1 rounded-md hover:bg-chrome-hover transition-colors text-chrome-text-muted hover:text-chrome-text flex-shrink-0"
          aria-label="Cerrar editor"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      </div>

      {/* Scrollable content */}
      <div className="flex-1 overflow-y-auto scrollbar-warm px-4 py-3 space-y-4">
        {/* Name */}
        <div>
          <label className="block text-[10px] font-medium text-chrome-text-muted mb-1 uppercase tracking-widest">
            Nombre
          </label>
          <input
            type="text"
            className="border border-chrome-border rounded-lg px-3 py-2 text-sm w-full bg-chrome-surface text-chrome-text placeholder:text-chrome-text-muted focus:outline-none focus:ring-2 focus:ring-chrome-accent/40 focus:border-chrome-accent/40 transition-all"
            value={selectedDoll.label || ""}
            onChange={e => updateDollLabel(selectedDoll.id, e.target.value)}
            placeholder="Ej: Papá, Mamá..."
          />
        </div>

        {/* Emotion */}
        <div>
          <label className="block text-[10px] font-medium text-chrome-text-muted mb-1 uppercase tracking-widest">
            Emoción
          </label>
          <Select
            value={selectedDoll.emotion || "neutral"}
            onValueChange={(value: 'neutral' | 'happy' | 'sad' | 'angry' | 'anxious') =>
              updateDollEmotion(selectedDoll.id, value)
            }
          >
            <SelectTrigger className="w-full h-9 text-sm bg-white/80 rounded-lg">
              <SelectValue>
                <span className="flex items-center gap-2">
                  {selectedDoll.emotion === 'happy' && <><Laugh className="w-4 h-4 text-green-600" /> Feliz</>}
                  {selectedDoll.emotion === 'sad' && <><Frown className="w-4 h-4 text-blue-500" /> Triste</>}
                  {selectedDoll.emotion === 'angry' && <><Angry className="w-4 h-4 text-red-500" /> Enojado</>}
                  {selectedDoll.emotion === 'anxious' && <><AlertTriangle className="w-4 h-4 text-amber-500" /> Ansioso</>}
                  {(!selectedDoll.emotion || selectedDoll.emotion === 'neutral') && <><Meh className="w-4 h-4 text-warm-400" /> Neutral</>}
                </span>
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="neutral"><span className="flex items-center gap-2"><Meh className="w-4 h-4" /> Neutral</span></SelectItem>
              <SelectItem value="happy"><span className="flex items-center gap-2"><Laugh className="w-4 h-4" /> Feliz</span></SelectItem>
              <SelectItem value="sad"><span className="flex items-center gap-2"><Frown className="w-4 h-4" /> Triste</span></SelectItem>
              <SelectItem value="angry"><span className="flex items-center gap-2"><Angry className="w-4 h-4" /> Enojado</span></SelectItem>
              <SelectItem value="anxious"><span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4" /> Ansioso</span></SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Notes */}
        <div>
          <label className="block text-[10px] font-medium text-chrome-text-muted mb-1 uppercase tracking-widest">
            Notas
          </label>
          <Textarea
            className="border border-chrome-border rounded-lg px-3 py-2 text-sm w-full bg-chrome-surface text-chrome-text placeholder:text-chrome-text-muted focus:outline-none focus:ring-2 focus:ring-chrome-accent/40 focus:border-chrome-accent/40 transition-all resize-none"
            rows={3}
            value={selectedDoll.notes || ""}
            onChange={e => updateDollNotes(selectedDoll.id, e.target.value)}
            placeholder="Notas sobre este muñeco..."
          />
        </div>

        {/* Divider */}
        <div className="border-t chrome-divider" />

        {/* OH Cards */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-medium text-chrome-text-muted uppercase tracking-widest flex items-center gap-1.5">
              <ImageIcon className="w-3 h-3" />
              OH Cards
            </label>
            {!selectedDoll.ohCardImage || !selectedDoll.ohCardWord ? (
              <button
                onClick={() => setDollNeedingOHCard(selectedDoll.id)}
                className="text-[10px] px-2 py-0.5 bg-chrome-accent/15 hover:bg-chrome-accent/25 text-chrome-accent rounded transition-colors font-medium"
              >
                Seleccionar
              </button>
            ) : (
              <span className="text-[10px] text-chrome-text-muted italic">Asignada</span>
            )}
          </div>

          {/* OH Card preview */}
          {(selectedDoll.ohCardImage || selectedDoll.ohCardWord) && (
            <div className="flex items-center gap-2 p-2 bg-chrome-surface rounded-lg border border-chrome-border">
              {selectedDoll.ohCardImage && (
                <button
                  onClick={() => {
                    setPreviewImageUrl(selectedDoll.ohCardImage!);
                    setPreviewWord(selectedDoll.ohCardWord || null);
                    setPreviewMode('image');
                    setOhCardPreviewOpen(true);
                  }}
                  className="group cursor-pointer hover:scale-105 transition-transform"
                >
                  <img
                    src={selectedDoll.ohCardImage}
                    alt="OH Card"
                    className="w-12 h-16 object-cover rounded border border-chrome-border group-hover:border-chrome-accent transition-colors"
                  />
                </button>
              )}
              <div className="flex-1 min-w-0">
                {selectedDoll.ohCardWord && (
                  <button
                    onClick={() => {
                      setPreviewImageUrl(selectedDoll.ohCardImage || null);
                      setPreviewWord(selectedDoll.ohCardWord || null);
                      setPreviewMode('word');
                      setOhCardPreviewOpen(true);
                    }}
                    className="w-full text-left group cursor-pointer hover:bg-chrome-hover rounded p-1.5 transition-colors"
                  >
                    <div className="text-[10px] text-chrome-text-muted">Palabra:</div>
                    <div className="text-sm font-semibold text-chrome-text truncate">{selectedDoll.ohCardWord}</div>
                  </button>
                )}
              </div>
              {(selectedDoll.ohCardImage && selectedDoll.ohCardWord) && (
                <button
                  onClick={() => {
                    setPreviewImageUrl(selectedDoll.ohCardImage!);
                    setPreviewWord(selectedDoll.ohCardWord!);
                    setPreviewMode('both');
                    setOhCardPreviewOpen(true);
                  }}
                  className="px-2 py-1 text-[10px] bg-chrome-accent/15 hover:bg-chrome-accent/25 text-chrome-accent rounded transition-colors font-medium flex-shrink-0"
                >
                  Ver
                </button>
              )}
            </div>
          )}

          {/* Inline selectors if not yet assigned */}
          {(!selectedDoll.ohCardImage || !selectedDoll.ohCardWord) && (
            <div className="space-y-2 mt-2">
              {!selectedDoll.ohCardImage && (
                <Select
                  value={selectedDoll.ohCardImage || "__none__"}
                  onValueChange={(value) =>
                    updateDollOHCard(selectedDoll.id, value === "__none__" ? undefined : value, selectedDoll.ohCardWord)
                  }
                >
                  <SelectTrigger className="w-full h-8 text-xs bg-white/80 rounded-lg">
                    <SelectValue placeholder="Imagen OH Card" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="__none__">Sin imagen</SelectItem>
                    {IMAGE_CARD_URLS.map((url, idx) => (
                      <SelectItem key={idx} value={url}>
                        <div className="flex items-center gap-2">
                          <img src={url} alt={`OH Card ${idx + 1}`} className="w-6 h-8 object-cover rounded" />
                          <span>Imagen {idx + 1}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              {!selectedDoll.ohCardWord && (
                <Select
                  value={selectedDoll.ohCardWord || "__none__"}
                  onValueChange={(value) =>
                    updateDollOHCard(selectedDoll.id, selectedDoll.ohCardImage, value === "__none__" ? undefined : value)
                  }
                >
                  <SelectTrigger className="w-full h-8 text-xs bg-white/80 rounded-lg">
                    <SelectValue placeholder="Palabra OH Card" />
                  </SelectTrigger>
                  <SelectContent className="max-h-[300px]">
                    <SelectItem value="__none__">Sin palabra</SelectItem>
                    {WORD_CARD_DATA.map((word, idx) => (
                      <SelectItem key={idx} value={word}>{word}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            </div>
          )}
        </div>

        {/* Divider */}
        <div className="border-t chrome-divider" />

        {/* Connections */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="text-[10px] font-medium text-chrome-text-muted uppercase tracking-widest flex items-center gap-1.5">
              <Link2 className="w-3 h-3" />
              Conexiones
            </label>
            <Dialog open={relationshipDialogOpen} onOpenChange={setRelationshipDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="ghost" className="h-6 text-[10px] px-2 text-chrome-accent hover:bg-chrome-hover">
                  + Agregar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle className="font-display text-lg">Agregar Conexión</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Conectar con:</label>
                    <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                      <SelectTrigger><SelectValue placeholder="Selecciona un muñeco" /></SelectTrigger>
                      <SelectContent>
                        {otherDolls.map(doll => (
                          <SelectItem key={doll.id} value={doll.id}>
                            {doll.label || doll.dollType.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Tipo de relación:</label>
                    <Select value={selectedRelationshipType} onValueChange={(value: RelationshipType) => setSelectedRelationshipType(value)}>
                      <SelectTrigger>
                        <SelectValue>
                          {selectedRelationshipType === 'family' && <span className="flex items-center gap-2"><Users2 className="w-4 h-4 text-blue-600" /> Familiar</span>}
                          {selectedRelationshipType === 'strong' && <span className="flex items-center gap-2"><Heart className="w-4 h-4 text-green-600" /> Fuerte</span>}
                          {selectedRelationshipType === 'tension' && <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Tensión</span>}
                          {selectedRelationshipType === 'conflict' && <span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600" /> Conflicto</span>}
                          {selectedRelationshipType === 'distant' && <span className="flex items-center gap-2"><Minus className="w-4 h-4 text-warm-500" /> Distante</span>}
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="family"><span className="flex items-center gap-2"><Users2 className="w-4 h-4 text-blue-600" /> Familiar</span></SelectItem>
                        <SelectItem value="strong"><span className="flex items-center gap-2"><Heart className="w-4 h-4 text-green-600" /> Fuerte</span></SelectItem>
                        <SelectItem value="tension"><span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 text-amber-600" /> Tensión</span></SelectItem>
                        <SelectItem value="conflict"><span className="flex items-center gap-2"><AlertCircle className="w-4 h-4 text-red-600" /> Conflicto</span></SelectItem>
                        <SelectItem value="distant"><span className="flex items-center gap-2"><Minus className="w-4 h-4 text-warm-500" /> Distante</span></SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={() => {
                      if (selectedTargetId) {
                        addDollRelationship(selectedDoll.id, {
                          targetId: selectedTargetId,
                          type: selectedRelationshipType,
                        });
                        setSelectedTargetId("");
                        setRelationshipDialogOpen(false);
                      }
                    }}
                    className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white"
                  >
                    Agregar Conexión
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {selectedDoll.relationships && selectedDoll.relationships.length > 0 ? (
              selectedDoll.relationships.map((rel) => {
                const targetDoll = placedDolls.find(d => d.id === rel.targetId);
                if (!targetDoll) return null;
                return (
                  <div key={rel.targetId} className={`flex items-center gap-1 px-2 py-0.5 rounded-md border text-[11px] ${relColors[rel.type]}`}>
                    <span>{targetDoll.label || targetDoll.dollType.name}</span>
                    <button
                      onClick={() => removeDollRelationship(selectedDoll.id, rel.targetId)}
                      className="hover:bg-black/10 rounded px-0.5"
                      aria-label="Eliminar conexión"
                    >
                      ×
                    </button>
                  </div>
                );
              })
            ) : (
              <p className="text-[10px] text-chrome-text-muted italic">Sin conexiones</p>
            )}
          </div>
        </div>

      </div>

      {/* OH Card Preview Modal */}
      <Dialog open={ohCardPreviewOpen} onOpenChange={setOhCardPreviewOpen}>
        <DialogContent className="max-w-md w-[92vw] max-h-[85vh] overflow-auto bg-chrome-bg border-chrome-border p-0">
          {/* Tab bar */}
          <div className="flex items-center gap-0 border-b chrome-divider px-1 pt-1">
            {previewImageUrl && (
              <button
                onClick={() => setPreviewMode('image')}
                className={`flex-1 py-2.5 text-[11px] font-medium tracking-wide transition-all border-b-2 ${
                  previewMode === 'image'
                    ? 'border-chrome-accent text-chrome-accent'
                    : 'border-transparent text-chrome-text-muted hover:text-chrome-text'
                }`}
              >
                Imagen
              </button>
            )}
            {previewWord && (
              <button
                onClick={() => setPreviewMode('word')}
                className={`flex-1 py-2.5 text-[11px] font-medium tracking-wide transition-all border-b-2 ${
                  previewMode === 'word'
                    ? 'border-chrome-accent text-chrome-accent'
                    : 'border-transparent text-chrome-text-muted hover:text-chrome-text'
                }`}
              >
                Palabra
              </button>
            )}
            {previewImageUrl && previewWord && (
              <button
                onClick={() => setPreviewMode('both')}
                className={`flex-1 py-2.5 text-[11px] font-medium tracking-wide transition-all border-b-2 ${
                  previewMode === 'both'
                    ? 'border-chrome-accent text-chrome-accent'
                    : 'border-transparent text-chrome-text-muted hover:text-chrome-text'
                }`}
              >
                Combinada
              </button>
            )}
          </div>
          <DialogHeader className="sr-only">
            <DialogTitle>OH Card</DialogTitle>
          </DialogHeader>

          {/* Content */}
          <div className="p-5">
            {previewMode === 'image' && previewImageUrl && (
              <div className="rounded-xl overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/5">
                <img src={previewImageUrl} alt="OH Card" className="w-full h-auto object-contain block" />
              </div>
            )}
            {previewMode === 'word' && previewWord && (
              <div className="flex items-center justify-center py-10">
                <div className="text-center">
                  <p className="text-[10px] text-chrome-text-muted uppercase tracking-[0.3em] mb-3">Palabra</p>
                  <p className="font-display text-3xl font-semibold text-chrome-text leading-tight">{previewWord}</p>
                  <div className="mt-4 w-12 h-px bg-chrome-accent/40 mx-auto" />
                </div>
              </div>
            )}
            {previewMode === 'both' && previewImageUrl && previewWord && (
              <div className="space-y-4">
                <div className="rounded-xl overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/5">
                  <img src={previewImageUrl} alt="OH Card" className="w-full h-auto object-contain block" />
                </div>
                <div className="text-center py-3">
                  <p className="text-[10px] text-chrome-text-muted uppercase tracking-[0.3em] mb-2">Palabra</p>
                  <p className="font-display text-2xl font-semibold text-chrome-text">{previewWord}</p>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
