import { useState, useEffect } from "react";
import { IMAGE_CARD_URLS, WORD_CARD_DATA } from "../lib/ohCardsConstants";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Button } from "./ui/button";
import { Image, FileText, Check, X, Sparkles } from "lucide-react";
import { logger } from "../lib/logger";

type SelectionPhase = 'images' | 'words' | 'complete';

export default function OHCardSelectionScreen({ onComplete }: { onComplete: () => void }) {
  const { setSelectedOHCardImages, setSelectedOHCardWords, selectedOHCardImages, selectedOHCardWords } = useTherapy();
  const [phase, setPhase] = useState<SelectionPhase>('images');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [numberOfPairs, setNumberOfPairs] = useState(5);

  useEffect(() => {
    logger.debug('OHCardSelectionScreen montado, selectedOHCardImages:', selectedOHCardImages.length, 'selectedOHCardWords:', selectedOHCardWords.length);
    if (selectedOHCardImages.length > 0 && selectedOHCardWords.length > 0) {
      setSelectedImages(selectedOHCardImages);
      setSelectedWords(selectedOHCardWords);
      setNumberOfPairs(Math.max(selectedOHCardImages.length, selectedOHCardWords.length, 5));
      setPhase('complete');
    }
  }, [selectedOHCardImages, selectedOHCardWords]);

  const handleImageToggle = (url: string) => {
    setSelectedImages(prev => {
      const isSelected = prev.includes(url);
      if (isSelected) return prev.filter(item => item !== url);
      if (prev.length < numberOfPairs) return [...prev, url];
      return prev;
    });
  };

  const handleWordToggle = (word: string) => {
    setSelectedWords(prev => {
      const isSelected = prev.includes(word);
      if (isSelected) return prev.filter(item => item !== word);
      if (prev.length < numberOfPairs) return [...prev, word];
      return prev;
    });
  };

  const handleImagesConfirm = () => {
    if (selectedImages.length === numberOfPairs) {
      setSelectedOHCardImages(selectedImages);
      setPhase('words');
      logger.debug(`Imágenes OH Cards seleccionadas: ${selectedImages.length}`);
    }
  };

  const handleWordsConfirm = () => {
    if (selectedWords.length === numberOfPairs) {
      setSelectedOHCardWords(selectedWords);
      setPhase('complete');
      logger.debug(`Palabras OH Cards seleccionadas: ${selectedWords.length}`);
    }
  };

  const handleStart = () => onComplete();
  const handleSkip = () => {
    setSelectedOHCardImages([]);
    setSelectedOHCardWords([]);
    onComplete();
  };

  // Card back: image (dark emerald)
  const ImageCardBack = () => (
    <div className="w-full h-full bg-gradient-to-br from-emerald-900 to-emerald-950 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '14px 14px'
      }} />
      <div className="text-center relative z-10">
        <div className="w-12 h-12 mx-auto mb-1.5 rounded-full bg-emerald-800/50 flex items-center justify-center ring-1 ring-emerald-600/25">
          <Image className="w-6 h-6 text-emerald-400/70" />
        </div>
        <span className="text-emerald-500/60 text-[10px] font-medium tracking-widest uppercase">OH</span>
      </div>
    </div>
  );

  // Card back: word (dark stone)
  const WordCardBack = () => (
    <div className="w-full h-full bg-gradient-to-br from-stone-800 to-stone-900 rounded-lg flex items-center justify-center relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.06]" style={{
        backgroundImage: `radial-gradient(circle at 50% 50%, rgba(255,255,255,0.3) 1px, transparent 1px)`,
        backgroundSize: '14px 14px'
      }} />
      <div className="text-center relative z-10">
        <div className="w-12 h-12 mx-auto mb-1.5 rounded-full bg-stone-700/50 flex items-center justify-center ring-1 ring-stone-500/20">
          <FileText className="w-6 h-6 text-stone-400/70" />
        </div>
        <span className="text-stone-400/50 text-[10px] font-medium tracking-widest uppercase">OH</span>
      </div>
    </div>
  );

  // --- Complete screen ---
  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4">
        <div className="max-w-2xl w-full bg-chrome-bg border border-chrome-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
          <div className="px-6 pt-6 pb-4 border-b chrome-divider">
            <div className="flex items-center gap-2 mb-1">
              <Sparkles className="w-5 h-5 text-chrome-accent" />
              <h2 className="font-display text-xl font-semibold text-chrome-text">OH Cards Seleccionadas</h2>
            </div>
            <p className="text-xs text-chrome-text-muted">
              {numberOfPairs} pares listos. Cada muñeco recibirá un par automáticamente.
            </p>
          </div>

          <div className="p-6 space-y-5">
            <div className="grid grid-cols-2 gap-5">
              {/* Images summary */}
              <div>
                <h3 className="text-[11px] font-semibold text-emerald-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <Image className="w-3 h-3" />
                  Imágenes ({selectedImages.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedImages.map((url, idx) => (
                    <div key={idx} className="w-10 h-14 rounded overflow-hidden ring-1 ring-emerald-500/30 shadow-sm">
                      <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              {/* Words summary */}
              <div>
                <h3 className="text-[11px] font-semibold text-stone-400 uppercase tracking-widest mb-2.5 flex items-center gap-1.5">
                  <FileText className="w-3 h-3" />
                  Palabras ({selectedWords.length})
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {selectedWords.map((word, idx) => (
                    <span key={idx} className="px-2 py-0.5 bg-stone-500/10 text-stone-300 rounded text-[11px] font-medium border border-stone-500/20">
                      {word}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex gap-3 pt-2">
              <Button onClick={handleStart} className="flex-1 bg-chrome-accent hover:bg-chrome-accent-hover text-chrome-bg font-semibold" size="lg">
                Comenzar con OH Cards
              </Button>
              <Button onClick={handleSkip} variant="ghost" className="flex-1 text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover" size="lg">
                Continuar sin OH Cards
              </Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // --- Selection flow ---
  const currentCount = phase === 'images' ? selectedImages.length : selectedWords.length;
  const progress = (currentCount / numberOfPairs) * 100;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto">
      <div className="max-w-5xl w-full max-h-[90vh] flex flex-col bg-chrome-bg border border-chrome-border rounded-2xl shadow-2xl shadow-black/40 overflow-hidden">
        {/* Header */}
        <div className="px-6 pt-5 pb-4 flex-shrink-0 border-b chrome-divider">
          <div className="flex items-center justify-between">
            <h2 className="font-display text-xl text-chrome-text">
              {phase === 'images' ? 'Selecciona Imágenes' : 'Selecciona Palabras'}
            </h2>
            <Button onClick={handleSkip} variant="ghost" size="sm" className="text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover">
              <X className="w-4 h-4 mr-1.5" />
              Omitir
            </Button>
          </div>
          <p className="text-xs text-chrome-text-muted mt-1">
            {phase === 'images'
              ? `Selecciona ${numberOfPairs} imágenes. El orden importa.`
              : `Selecciona ${numberOfPairs} palabras para emparejar con las imágenes.`
            }
          </p>

          {/* Controls row */}
          <div className="mt-4 flex items-center gap-5">
            <div>
              <label className="text-[10px] font-medium text-chrome-text-muted uppercase tracking-widest mb-1.5 block">
                Pares
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numberOfPairs}
                onChange={(e) => {
                  const num = parseInt(e.target.value) || 1;
                  setNumberOfPairs(Math.max(1, Math.min(20, num)));
                  if (phase === 'images') setSelectedImages(prev => prev.slice(0, num));
                  else setSelectedWords(prev => prev.slice(0, num));
                }}
                className="w-16 px-2.5 py-1.5 bg-chrome-surface border border-chrome-border rounded-lg text-sm text-chrome-text focus:outline-none focus:ring-2 focus:ring-chrome-accent/40 text-center"
              />
            </div>
            <div className="flex-1">
              <div className="flex items-baseline gap-1.5 mb-1.5">
                <span className="text-lg font-semibold text-chrome-text tabular-nums">{currentCount}</span>
                <span className="text-chrome-text-muted text-xs">/ {numberOfPairs}</span>
              </div>
              <div className="w-full bg-chrome-surface rounded-full h-1.5 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-300 ${phase === 'images' ? 'bg-emerald-500' : 'bg-stone-400'}`}
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Card grid */}
        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(110px,1fr))] gap-3">
            {phase === 'images' ? (
              IMAGE_CARD_URLS.map((url, index) => {
                const selectionIndex = selectedImages.indexOf(url);
                const isSelected = selectionIndex !== -1;
                return (
                  <button
                    key={index}
                    onClick={() => handleImageToggle(url)}
                    className={`relative aspect-[2/3] rounded-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-lg hover:shadow-emerald-900/20 ${
                      isSelected ? 'ring-2 ring-emerald-400 ring-offset-2 ring-offset-chrome-bg scale-[1.04]' : 'ring-1 ring-chrome-border hover:ring-emerald-600/40'
                    } cursor-pointer`}
                  >
                    {isSelected ? (
                      <div className="w-full h-full rounded-lg overflow-hidden relative">
                        <img src={url} alt={`OH Card ${index + 1}`} className="w-full h-full object-cover"
                          onError={(e) => { e.currentTarget.style.display = 'none'; }}
                        />
                        <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg">
                          {selectionIndex + 1}
                        </div>
                      </div>
                    ) : (
                      <ImageCardBack />
                    )}
                  </button>
                );
              })
            ) : (
              WORD_CARD_DATA.map((word, index) => {
                const selectionIndex = selectedWords.indexOf(word);
                const isSelected = selectionIndex !== -1;
                return (
                  <button
                    key={index}
                    onClick={() => handleWordToggle(word)}
                    className={`relative aspect-[2/3] rounded-lg transition-all duration-200 hover:scale-[1.04] hover:shadow-lg hover:shadow-black/20 ${
                      isSelected ? 'ring-2 ring-stone-400 ring-offset-2 ring-offset-chrome-bg scale-[1.04]' : 'ring-1 ring-chrome-border hover:ring-stone-500/40'
                    } cursor-pointer`}
                  >
                    {isSelected ? (
                      <div className="w-full h-full bg-chrome-surface rounded-lg flex items-center justify-center p-3 relative border border-chrome-border">
                        <div className="absolute top-1.5 right-1.5 bg-stone-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-bold shadow-lg">
                          {selectionIndex + 1}
                        </div>
                        <span className="text-chrome-text font-display text-sm font-semibold text-center leading-tight">{word}</span>
                      </div>
                    ) : (
                      <WordCardBack />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t chrome-divider flex-shrink-0 flex justify-end">
          {phase === 'images' && (
            <Button
              onClick={handleImagesConfirm}
              disabled={selectedImages.length !== numberOfPairs}
              className="bg-chrome-accent hover:bg-chrome-accent-hover text-chrome-bg font-semibold min-w-[180px] disabled:opacity-30"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Confirmar Imágenes ({selectedImages.length}/{numberOfPairs})
            </Button>
          )}
          {phase === 'words' && (
            <Button
              onClick={handleWordsConfirm}
              disabled={selectedWords.length !== numberOfPairs}
              className="bg-chrome-accent hover:bg-chrome-accent-hover text-chrome-bg font-semibold min-w-[180px] disabled:opacity-30"
            >
              <Check className="w-3.5 h-3.5 mr-1.5" />
              Confirmar Palabras ({selectedWords.length}/{numberOfPairs})
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
