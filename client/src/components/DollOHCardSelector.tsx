import { useState, useEffect } from "react";
import { IMAGE_CARD_URLS, WORD_CARD_DATA } from "../lib/ohCardsConstants";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Button } from "./ui/button";
import { Image, FileText, X, Check, RotateCcw, Eye, ArrowRight, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { logger } from "../lib/logger";

interface DollOHCardSelectorProps {
  dollId: string;
  dollName: string;
  currentImage?: string;
  currentWord?: string;
  onComplete: () => void;
}

export default function DollOHCardSelector({
  dollId,
  dollName,
  currentImage,
  currentWord,
  onComplete
}: DollOHCardSelectorProps) {
  const { updateDollOHCard } = useTherapy();
  const [selectedImage, setSelectedImage] = useState<string | undefined>(currentImage);
  const [selectedWord, setSelectedWord] = useState<string | undefined>(currentWord);
  const [phase, setPhase] = useState<'image' | 'word' | 'reveal'>('image');
  const [revealedImageIndex, setRevealedImageIndex] = useState<number | null>(null);
  const [revealedWordIndex, setRevealedWordIndex] = useState<number | null>(null);
  const [isConfirmed, setIsConfirmed] = useState(false);

  useEffect(() => {
    if (currentImage && currentWord) {
      setIsConfirmed(true);
      setPhase('reveal');
      const imgIndex = IMAGE_CARD_URLS.indexOf(currentImage);
      const wordIndex = WORD_CARD_DATA.indexOf(currentWord);
      if (imgIndex !== -1) setRevealedImageIndex(imgIndex);
      if (wordIndex !== -1) setRevealedWordIndex(wordIndex);
    }
  }, [currentImage, currentWord]);

  const handleImageSelect = (index: number) => {
    if (isConfirmed) return;
    setSelectedImage(IMAGE_CARD_URLS[index]);
    setRevealedImageIndex(null);
  };

  const handleWordSelect = (index: number) => {
    if (isConfirmed) return;
    setSelectedWord(WORD_CARD_DATA[index]);
    setRevealedWordIndex(null);
  };

  const handleRevealImage = () => {
    if (selectedImage) {
      const index = IMAGE_CARD_URLS.indexOf(selectedImage);
      if (index !== -1) setRevealedImageIndex(index);
    }
  };

  const handleRevealWord = () => {
    if (selectedWord) {
      const index = WORD_CARD_DATA.indexOf(selectedWord);
      if (index !== -1) setRevealedWordIndex(index);
    }
  };

  const handleConfirm = () => {
    if (selectedImage && selectedWord) {
      const imgIndex = IMAGE_CARD_URLS.indexOf(selectedImage);
      const wordIndex = WORD_CARD_DATA.indexOf(selectedWord);
      if (imgIndex !== -1) setRevealedImageIndex(imgIndex);
      if (wordIndex !== -1) setRevealedWordIndex(wordIndex);

      updateDollOHCard(dollId, selectedImage, selectedWord);
      setIsConfirmed(true);
      setPhase('reveal');
      logger.debug(`OH Card confirmado para ${dollName}: imagen y palabra "${selectedWord}"`);
      setTimeout(() => onComplete(), 1500);
    }
  };

  const handleSkip = () => {
    if (isConfirmed) return;
    updateDollOHCard(dollId, undefined, undefined);
    logger.debug(`OH Card omitido para ${dollName}`);
    onComplete();
  };

  // --- Card back components ---
  const ImageCardBack = ({ index }: { index: number }) => {
    const isRevealed = revealedImageIndex === index;
    const isSelected = selectedImage === IMAGE_CARD_URLS[index];

    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {isRevealed ? (
          <img
            src={IMAGE_CARD_URLS[index]}
            alt={`OH Card ${index + 1}`}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-950 flex items-center justify-center relative">
            {/* Subtle pattern */}
            <div className="absolute inset-0 opacity-[0.08]" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="text-center relative z-10">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-emerald-800/60 flex items-center justify-center ring-1 ring-emerald-600/30">
                <Image className="w-5 h-5 text-emerald-300/80" />
              </div>
              <span className="text-emerald-400/70 text-[10px] font-medium tracking-widest uppercase">OH</span>
            </div>
          </div>
        )}
        {isSelected && !isRevealed && (
          <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-emerald-900">
            <Check className="w-3 h-3" />
          </div>
        )}
        {isRevealed && (
          <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
    );
  };

  const WordCardBack = ({ index }: { index: number }) => {
    const isRevealed = revealedWordIndex === index;
    const isSelected = selectedWord === WORD_CARD_DATA[index];
    const word = WORD_CARD_DATA[index];

    return (
      <div className="relative w-full h-full rounded-lg overflow-hidden">
        {isRevealed ? (
          <div className="w-full h-full bg-chrome-surface flex items-center justify-center p-3 border border-chrome-border">
            <span className="text-chrome-text font-display text-sm font-semibold text-center leading-tight">{word}</span>
          </div>
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 flex items-center justify-center relative">
            <div className="absolute inset-0 opacity-[0.06]" style={{
              backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
              backgroundSize: '16px 16px'
            }} />
            <div className="text-center relative z-10">
              <div className="w-10 h-10 mx-auto mb-1.5 rounded-full bg-stone-700/50 flex items-center justify-center ring-1 ring-stone-500/20">
                <FileText className="w-5 h-5 text-stone-400/70" />
              </div>
              <span className="text-stone-400/50 text-[10px] font-medium tracking-widest uppercase">OH</span>
            </div>
          </div>
        )}
        {isSelected && !isRevealed && (
          <div className="absolute top-1.5 right-1.5 bg-stone-500 text-white rounded-full w-5 h-5 flex items-center justify-center ring-2 ring-stone-800">
            <Check className="w-3 h-3" />
          </div>
        )}
        {isRevealed && !isSelected && (
          <div className="absolute top-1.5 right-1.5 bg-stone-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-lg">
            <Check className="w-3 h-3" />
          </div>
        )}
      </div>
    );
  };

  // --- Confirmed read-only view ---
  if (isConfirmed && selectedImage && selectedWord) {
    return (
      <Dialog open={true} onOpenChange={() => onComplete()}>
        <DialogContent className="max-w-md w-[92vw] max-h-[85vh] overflow-auto bg-chrome-bg border-chrome-border p-0">
          <DialogHeader className="px-5 pt-5 pb-3 flex-shrink-0 border-b chrome-divider">
            <DialogTitle className="font-display text-lg text-chrome-text">
              OH Card — <span className="text-chrome-accent">{dollName}</span>
            </DialogTitle>
            <p className="text-[10px] text-chrome-text-muted tracking-widest uppercase mt-1">
              Asignada
            </p>
          </DialogHeader>
          <div className="p-5 space-y-4">
            <div className="rounded-xl overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/5">
              <img src={selectedImage} alt="OH Card" className="w-full h-auto object-contain block" />
            </div>
            <div className="text-center py-2">
              <p className="text-[10px] text-chrome-text-muted uppercase tracking-[0.3em] mb-2">Palabra</p>
              <p className="font-display text-2xl font-semibold text-chrome-text">{selectedWord}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  // --- Selection flow ---
  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0 bg-chrome-bg border-chrome-border">
        {/* Header */}
        <DialogHeader className="px-6 pt-5 pb-4 flex-shrink-0 border-b chrome-divider">
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="font-display text-xl text-chrome-text">
                OH Card — <span className="text-chrome-accent">{dollName}</span>
              </DialogTitle>
              <p className="text-xs text-chrome-text-muted mt-1.5">
                {phase === 'image'
                  ? 'Paso 1 — Elige una carta de imagen (boca abajo, movimiento inconsciente)'
                  : phase === 'word'
                    ? 'Paso 2 — Elige una carta de palabra'
                    : 'Revelando tu selección...'
                }
              </p>
            </div>
            <Button onClick={handleSkip} variant="ghost" size="sm" className="text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover">
              <X className="w-4 h-4 mr-1.5" />
              Omitir
            </Button>
          </div>

          {/* Phase indicator */}
          <div className="flex items-center gap-2 mt-4">
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all ${
              phase === 'image'
                ? 'bg-emerald-500/15 text-emerald-300 ring-1 ring-emerald-500/25'
                : 'bg-chrome-surface text-chrome-text-muted'
            }`}>
              <Image className="w-3 h-3" />
              Imagen
              {selectedImage && <Check className="w-3 h-3" />}
            </div>
            <ArrowRight className="w-3 h-3 text-chrome-text-muted" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all ${
              phase === 'word'
                ? 'bg-stone-500/15 text-stone-300 ring-1 ring-stone-500/25'
                : 'bg-chrome-surface text-chrome-text-muted'
            }`}>
              <FileText className="w-3 h-3" />
              Palabra
              {selectedWord && <Check className="w-3 h-3" />}
            </div>
            <ArrowRight className="w-3 h-3 text-chrome-text-muted" />
            <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[11px] font-medium tracking-wide transition-all ${
              phase === 'reveal'
                ? 'bg-chrome-accent/15 text-chrome-accent ring-1 ring-chrome-accent/25'
                : 'bg-chrome-surface text-chrome-text-muted'
            }`}>
              <Sparkles className="w-3 h-3" />
              Revelar
            </div>
          </div>
        </DialogHeader>

        {/* Content */}
        <div className="flex-1 overflow-y-auto px-6 pb-6 pt-4">
          {phase === 'image' ? (
            <div className="space-y-4">
              {/* Selected preview bar */}
              {selectedImage && (
                <div className="bg-emerald-500/8 border border-emerald-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-28 rounded-lg overflow-hidden ring-1 ring-emerald-500/30 flex-shrink-0 bg-chrome-surface">
                      {revealedImageIndex !== null && revealedImageIndex === IMAGE_CARD_URLS.indexOf(selectedImage) ? (
                        <img src={selectedImage} alt="Imagen seleccionada" className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex flex-col items-center justify-center">
                          <Image className="w-6 h-6 text-emerald-400/60" />
                          <p className="text-[9px] text-emerald-400/60 mt-1 tracking-wide">Oculta</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-emerald-300 text-sm">Imagen seleccionada</p>
                      <p className="text-[11px] text-chrome-text-muted mt-0.5">
                        {revealedImageIndex !== null ? 'Revelada. Continúa a palabras.' : 'Puedes revelarla o continuar sin verla.'}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {(revealedImageIndex === null || revealedImageIndex !== IMAGE_CARD_URLS.indexOf(selectedImage)) && (
                        <Button onClick={handleRevealImage} size="sm" className="bg-emerald-600 hover:bg-emerald-500 text-white text-xs h-8">
                          <Eye className="w-3 h-3 mr-1.5" />
                          Revelar
                        </Button>
                      )}
                      <Button onClick={() => { setSelectedImage(undefined); setRevealedImageIndex(null); }} variant="ghost" size="sm" className="text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover text-xs h-8">
                        <RotateCcw className="w-3 h-3 mr-1.5" />
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card grid */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2.5">
                {IMAGE_CARD_URLS.map((url, index) => {
                  const isSelected = selectedImage === url;
                  return (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      disabled={isConfirmed}
                      className={`relative aspect-[2/3] rounded-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-lg hover:shadow-emerald-900/20 ${
                        isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-chrome-bg scale-[1.04]' : 'ring-1 ring-chrome-border hover:ring-emerald-600/40'
                      } ${isConfirmed ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    >
                      <ImageCardBack index={index} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : phase === 'word' ? (
            <div className="space-y-4">
              {/* Selected preview bar */}
              {selectedWord && (
                <div className="bg-stone-500/8 border border-stone-500/20 rounded-xl p-4">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-28 rounded-lg overflow-hidden ring-1 ring-stone-500/25 flex-shrink-0 bg-chrome-surface flex items-center justify-center">
                      {revealedWordIndex !== null && revealedWordIndex === WORD_CARD_DATA.indexOf(selectedWord) ? (
                        <span className="text-chrome-text font-display text-sm font-semibold text-center px-2">{selectedWord}</span>
                      ) : (
                        <div className="flex flex-col items-center justify-center">
                          <FileText className="w-6 h-6 text-stone-400/50" />
                          <p className="text-[9px] text-stone-400/50 mt-1 tracking-wide">Oculta</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-stone-300 text-sm">
                        Palabra seleccionada{revealedWordIndex !== null ? `: "${selectedWord}"` : ''}
                      </p>
                      <p className="text-[11px] text-chrome-text-muted mt-0.5">
                        {revealedWordIndex !== null ? 'Revelada. Confirma tu OH Card.' : 'Puedes revelarla o confirmar sin verla.'}
                      </p>
                    </div>
                    <div className="flex gap-2 flex-shrink-0">
                      {(revealedWordIndex === null || revealedWordIndex !== WORD_CARD_DATA.indexOf(selectedWord)) && (
                        <Button onClick={handleRevealWord} size="sm" className="bg-stone-600 hover:bg-stone-500 text-white text-xs h-8">
                          <Eye className="w-3 h-3 mr-1.5" />
                          Revelar
                        </Button>
                      )}
                      <Button onClick={() => { setSelectedWord(undefined); setRevealedWordIndex(null); }} variant="ghost" size="sm" className="text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover text-xs h-8">
                        <RotateCcw className="w-3 h-3 mr-1.5" />
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {/* Card grid */}
              <div className="grid grid-cols-[repeat(auto-fill,minmax(90px,1fr))] gap-2.5">
                {WORD_CARD_DATA.map((word, index) => {
                  const isSelected = selectedWord === word;
                  return (
                    <button
                      key={index}
                      onClick={() => handleWordSelect(index)}
                      disabled={isConfirmed}
                      className={`relative aspect-[2/3] rounded-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-lg hover:shadow-black/20 ${
                        isSelected ? 'ring-2 ring-stone-400 ring-offset-2 ring-offset-chrome-bg scale-[1.04]' : 'ring-1 ring-chrome-border hover:ring-stone-500/40'
                      } ${isConfirmed ? 'cursor-not-allowed opacity-40' : 'cursor-pointer'}`}
                    >
                      <WordCardBack index={index} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Reveal view — clean gallery style
            <div className="flex flex-col items-center py-6 space-y-5">
              <div className="w-full max-w-xs rounded-xl overflow-hidden shadow-xl shadow-black/20 ring-1 ring-white/5">
                <img src={selectedImage} alt="OH Card" className="w-full h-auto object-contain block" />
              </div>
              <div className="text-center">
                <p className="text-[10px] text-chrome-text-muted uppercase tracking-[0.3em] mb-2">Palabra</p>
                <p className="font-display text-2xl font-semibold text-chrome-text">{selectedWord}</p>
                <div className="mt-3 w-12 h-px bg-chrome-accent/30 mx-auto" />
              </div>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 py-4 border-t chrome-divider flex-shrink-0 flex items-center justify-between">
          <Button
            onClick={() => {
              setPhase('image');
              setSelectedWord(undefined);
              setRevealedWordIndex(null);
            }}
            variant="ghost"
            disabled={phase === 'image' || isConfirmed}
            className="text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover disabled:opacity-20"
          >
            ← Volver a Imágenes
          </Button>

          <div className="flex gap-2">
            {phase === 'image' && selectedImage && (
              <Button onClick={() => setPhase('word')} disabled={isConfirmed} className="bg-chrome-accent hover:bg-chrome-accent-hover text-chrome-bg font-semibold">
                Continuar a Palabras
                <ArrowRight className="w-3.5 h-3.5 ml-1.5" />
              </Button>
            )}
            {phase === 'word' && selectedImage && selectedWord && (
              <Button onClick={handleConfirm} disabled={isConfirmed} className="bg-chrome-accent hover:bg-chrome-accent-hover text-chrome-bg font-semibold min-w-[150px]">
                <Check className="w-3.5 h-3.5 mr-1.5" />
                Confirmar OH Card
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
