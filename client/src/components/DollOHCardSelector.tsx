import { useState, useEffect } from "react";
import { IMAGE_CARD_URLS, WORD_CARD_DATA } from "../lib/ohCardsConstants";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Image, FileText, X, Check, RotateCcw } from "lucide-react";
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

  // Si ya hay OH Card asignada, mostrar directamente en modo confirmado
  useEffect(() => {
    if (currentImage && currentWord) {
      setIsConfirmed(true);
      setPhase('reveal');
      // Encontrar los índices de las cartas asignadas
      const imgIndex = IMAGE_CARD_URLS.indexOf(currentImage);
      const wordIndex = WORD_CARD_DATA.indexOf(currentWord);
      if (imgIndex !== -1) setRevealedImageIndex(imgIndex);
      if (wordIndex !== -1) setRevealedWordIndex(wordIndex);
    }
  }, [currentImage, currentWord]);

  const handleImageSelect = (index: number) => {
    if (isConfirmed) return; // No permitir cambios si ya está confirmado
    // Solo marcar como seleccionada, NO revelar todavía
    setSelectedImage(IMAGE_CARD_URLS[index]);
    setRevealedImageIndex(null); // Asegurar que no se revele automáticamente
  };

  const handleWordSelect = (index: number) => {
    if (isConfirmed) return; // No permitir cambios si ya está confirmado
    // Solo marcar como seleccionada, NO revelar todavía
    setSelectedWord(WORD_CARD_DATA[index]);
    setRevealedWordIndex(null); // Asegurar que no se revele automáticamente
  };

  const handleRevealImage = () => {
    if (selectedImage) {
      const index = IMAGE_CARD_URLS.indexOf(selectedImage);
      if (index !== -1) {
        setRevealedImageIndex(index);
      }
    }
  };

  const handleRevealWord = () => {
    if (selectedWord) {
      const index = WORD_CARD_DATA.indexOf(selectedWord);
      if (index !== -1) {
        setRevealedWordIndex(index);
      }
    }
  };

  const handleConfirm = () => {
    if (selectedImage && selectedWord) {
      // Revelar ambas cartas al confirmar
      const imgIndex = IMAGE_CARD_URLS.indexOf(selectedImage);
      const wordIndex = WORD_CARD_DATA.indexOf(selectedWord);
      if (imgIndex !== -1) setRevealedImageIndex(imgIndex);
      if (wordIndex !== -1) setRevealedWordIndex(wordIndex);
      
      updateDollOHCard(dollId, selectedImage, selectedWord);
      setIsConfirmed(true);
      setPhase('reveal');
      logger.debug(`OH Card confirmado para ${dollName}: imagen y palabra "${selectedWord}"`);
      // Cerrar después de un breve delay para que el usuario vea la confirmación
      setTimeout(() => {
        onComplete();
      }, 1500);
    }
  };

  const handleSkip = () => {
    if (isConfirmed) return; // No permitir cambios si ya está confirmado
    updateDollOHCard(dollId, undefined, undefined);
    logger.debug(`OH Card omitido para ${dollName}`);
    onComplete();
  };

  // Componente para el reverso de carta de imagen (verde) - usando SVG como en el original
  const ImageCardBack = ({ index }: { index: number }) => {
    const isRevealed = revealedImageIndex === index;
    const isSelected = selectedImage === IMAGE_CARD_URLS[index];
    
    return (
      <div className="relative w-full h-full">
        {isRevealed ? (
          <img 
            src={IMAGE_CARD_URLS[index]} 
            alt={`OH Card ${index + 1}`}
            className="w-full h-full object-cover rounded-lg"
          />
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', borderRadius: '1rem', border: isSelected ? '4px solid #10B981' : '4px solid #A5C96A', background: '#fff' }}>
            <defs>
              <pattern id={`scribbleGreen-${index}`} patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M5 20 Q15 5 35 20 Q25 35 5 20 Z" stroke="#A5C96A" strokeWidth="2" fill="none"/>
                <path d="M20 5 Q35 15 20 35 Q5 25 20 5 Z" stroke="#A5C96A" strokeWidth="1.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="300" height="420" rx="24" fill={`url(#scribbleGreen-${index})`} />
            <ellipse cx="150" cy="210" rx="44" ry="22" fill="#A5C96A" fillOpacity="0.18"/>
            <text x="150" y="218" textAnchor="middle" fontSize="40" fontWeight="bold" fontFamily="Arial" fill="#7A9D3A">OH</text>
          </svg>
        )}
        {isSelected && !isRevealed && (
          <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-2 ring-white">
            <Check className="w-4 h-4" />
          </div>
        )}
        {isRevealed && (
          <div className="absolute top-2 right-2 bg-green-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  };

  // Componente para el reverso de carta de palabra (marrón) - usando SVG como en el original
  const WordCardBack = ({ index }: { index: number }) => {
    const isRevealed = revealedWordIndex === index;
    const isSelected = selectedWord === WORD_CARD_DATA[index];
    const word = WORD_CARD_DATA[index];
    
    return (
      <div className="relative w-full h-full">
        {isRevealed ? (
          <div className="w-full h-full bg-white rounded-lg border-4 border-amber-400 flex flex-col items-center justify-center p-2">
            <div className="absolute top-2 right-2 bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
              <Check className="w-4 h-4" />
            </div>
            <div className="text-center font-bold text-amber-800 text-sm">
              {word}
            </div>
          </div>
        ) : (
          <svg width="100%" height="100%" viewBox="0 0 300 420" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ display: 'block', borderRadius: '1rem', border: isSelected ? '4px solid #F59E0B' : '4px solid #C2A24A', background: '#fff' }}>
            <defs>
              <pattern id={`scribbleBrown-${index}`} patternUnits="userSpaceOnUse" width="40" height="40">
                <path d="M5 20 Q15 5 35 20 Q25 35 5 20 Z" stroke="#C2A24A" strokeWidth="2" fill="none"/>
                <path d="M20 5 Q35 15 20 35 Q5 25 20 5 Z" stroke="#C2A24A" strokeWidth="1.5" fill="none"/>
              </pattern>
            </defs>
            <rect width="300" height="420" rx="24" fill={`url(#scribbleBrown-${index})`} />
            <ellipse cx="150" cy="210" rx="44" ry="22" fill="#C2A24A" fillOpacity="0.18"/>
            <text x="150" y="218" textAnchor="middle" fontSize="40" fontWeight="bold" fontFamily="Arial" fill="#A67C2E">OH</text>
          </svg>
        )}
        {isSelected && !isRevealed && (
          <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold ring-2 ring-white">
            <Check className="w-4 h-4" />
          </div>
        )}
        {isRevealed && (
          <div className="absolute top-2 right-2 bg-amber-600 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
            <Check className="w-4 h-4" />
          </div>
        )}
      </div>
    );
  };

  // Si ya está confirmado, mostrar vista de solo lectura
  if (isConfirmed && selectedImage && selectedWord) {
    return (
      <Dialog open={true} onOpenChange={() => {}}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl">
                OH Card asignada a: <span className="text-blue-600">{dollName}</span>
              </DialogTitle>
              <Button onClick={onComplete} variant="ghost" size="sm">
                <X className="w-4 h-4 mr-2" />
                Cerrar
              </Button>
            </div>
            <p className="text-sm text-gray-600 mt-2">
              Esta OH Card ya está asignada y no puede modificarse
            </p>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6 pb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
            <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center bg-white rounded-2xl shadow-2xl">
              {/* Palabra en los cuatro lados */}
              <span className="absolute top-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                {selectedWord}
              </span>
              <span className="absolute bottom-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                {selectedWord}
              </span>
              <span className="absolute left-[3.5%] top-1/2 -translate-y-1/2 -rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                {selectedWord}
              </span>
              <span className="absolute right-[3.5%] top-1/2 -translate-y-1/2 rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                {selectedWord}
              </span>
              {/* Marco rojo delgado con la imagen */}
              <div 
                className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-lg bg-white flex items-center justify-center overflow-hidden"
                style={{ border: '2.5px solid #D32F2F' }}
              >
                <img 
                  src={selectedImage} 
                  alt="OH Card" 
                  className="w-[98%] h-[98%] object-contain rounded-md"
                />
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={true} onOpenChange={() => {}}>
      <DialogContent className="max-w-6xl max-h-[90vh] overflow-hidden flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl">
              Seleccionar OH Card para: <span className="text-blue-600">{dollName}</span>
            </DialogTitle>
            <Button onClick={handleSkip} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" />
              Omitir
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {phase === 'image' 
              ? 'Paso 1: Selecciona una carta de imagen (boca abajo para movimiento inconsciente)'
              : phase === 'word'
                ? 'Paso 2: Selecciona una carta de palabra (boca abajo para movimiento inconsciente)'
                : 'Revelando tu selección...'
            }
          </p>
        </DialogHeader>

        <div className="flex-1 overflow-y-auto px-6 pb-6">
          {phase === 'image' ? (
            <div className="space-y-4">
              {selectedImage && (
                <div className="bg-green-50 border-2 border-green-400 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-green-500 flex items-center justify-center bg-white">
                      {revealedImageIndex !== null && revealedImageIndex === IMAGE_CARD_URLS.indexOf(selectedImage) ? (
                        <img src={selectedImage} alt="Imagen seleccionada" className="w-full h-full object-cover" />
                      ) : (
                        <div className="text-center">
                          <Image className="w-8 h-8 text-green-600 mx-auto mb-1" />
                          <p className="text-xs text-green-700 font-medium">Carta seleccionada</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-green-800">Imagen seleccionada</p>
                      {revealedImageIndex !== null && revealedImageIndex === IMAGE_CARD_URLS.indexOf(selectedImage) ? (
                        <p className="text-sm text-gray-600">Haz clic en "Continuar" para seleccionar la palabra</p>
                      ) : (
                        <p className="text-sm text-gray-600">Haz clic en "Ver imagen" para revelarla, o continúa sin verla</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {revealedImageIndex === null || revealedImageIndex !== IMAGE_CARD_URLS.indexOf(selectedImage) ? (
                        <Button onClick={handleRevealImage} variant="default" size="sm">
                          <Image className="w-4 h-4 mr-2" />
                          Ver imagen
                        </Button>
                      ) : null}
                      <Button onClick={() => {
                        setSelectedImage(undefined);
                        setRevealedImageIndex(null);
                      }} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                {IMAGE_CARD_URLS.map((url, index) => {
                  const isSelected = selectedImage === url;
                  return (
                    <button
                      key={index}
                      onClick={() => handleImageSelect(index)}
                      disabled={isConfirmed}
                      className={`relative aspect-[2/3] rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
                        isSelected ? 'ring-4 ring-green-500 ring-offset-2 scale-105' : ''
                      } ${isConfirmed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <ImageCardBack index={index} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : phase === 'word' ? (
            <div className="space-y-4">
              {selectedWord && (
                <div className="bg-amber-50 border-2 border-amber-400 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-24 h-32 rounded-lg overflow-hidden border-2 border-amber-500 flex items-center justify-center bg-white">
                      {revealedWordIndex !== null && revealedWordIndex === WORD_CARD_DATA.indexOf(selectedWord) ? (
                        <p className="text-lg font-bold text-amber-800 text-center px-2">{selectedWord}</p>
                      ) : (
                        <div className="text-center">
                          <FileText className="w-8 h-8 text-amber-600 mx-auto mb-1" />
                          <p className="text-xs text-amber-700 font-medium">Carta seleccionada</p>
                        </div>
                      )}
                    </div>
                    <div className="flex-1">
                      <p className="font-semibold text-amber-800">
                        Palabra seleccionada{revealedWordIndex !== null && revealedWordIndex === WORD_CARD_DATA.indexOf(selectedWord) ? `: "${selectedWord}"` : ''}
                      </p>
                      {revealedWordIndex !== null && revealedWordIndex === WORD_CARD_DATA.indexOf(selectedWord) ? (
                        <p className="text-sm text-gray-600">Haz clic en "Confirmar" para asignar la OH Card</p>
                      ) : (
                        <p className="text-sm text-gray-600">Haz clic en "Ver palabra" para revelarla, o confirma sin verla</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      {revealedWordIndex === null || revealedWordIndex !== WORD_CARD_DATA.indexOf(selectedWord) ? (
                        <Button onClick={handleRevealWord} variant="default" size="sm">
                          <FileText className="w-4 h-4 mr-2" />
                          Ver palabra
                        </Button>
                      ) : null}
                      <Button onClick={() => {
                        setSelectedWord(undefined);
                        setRevealedWordIndex(null);
                      }} variant="outline" size="sm">
                        <RotateCcw className="w-4 h-4 mr-2" />
                        Cambiar
                      </Button>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="grid grid-cols-[repeat(auto-fill,minmax(100px,1fr))] gap-3">
                {WORD_CARD_DATA.map((word, index) => {
                  const isSelected = selectedWord === word;
                  return (
                    <button
                      key={index}
                      onClick={() => handleWordSelect(index)}
                      disabled={isConfirmed}
                      className={`relative aspect-[2/3] rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
                        isSelected ? 'ring-4 ring-amber-500 ring-offset-2 scale-105' : ''
                      } ${isConfirmed ? 'cursor-not-allowed opacity-50' : 'cursor-pointer'}`}
                    >
                      <WordCardBack index={index} />
                    </button>
                  );
                })}
              </div>
            </div>
          ) : (
            // Vista de revelación final
            <div className="flex items-center justify-center py-8">
              <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center bg-white rounded-2xl shadow-2xl">
                {/* Palabra en los cuatro lados */}
                <span className="absolute top-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                  {selectedWord}
                </span>
                <span className="absolute bottom-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                  {selectedWord}
                </span>
                <span className="absolute left-[3.5%] top-1/2 -translate-y-1/2 -rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                  {selectedWord}
                </span>
                <span className="absolute right-[3.5%] top-1/2 -translate-y-1/2 rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                  {selectedWord}
                </span>
                {/* Marco rojo delgado con la imagen */}
                <div 
                  className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-lg bg-white flex items-center justify-center overflow-hidden"
                  style={{ border: '2.5px solid #D32F2F' }}
                >
                  <img 
                    src={selectedImage} 
                    alt="OH Card" 
                    className="w-[98%] h-[98%] object-contain rounded-md"
                  />
                </div>
              </div>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t flex-shrink-0 flex items-center justify-between">
          <Button 
            onClick={() => {
              setPhase('image');
              setSelectedWord(undefined);
              setRevealedWordIndex(null);
            }} 
            variant="outline" 
            disabled={phase === 'image' || isConfirmed}
          >
            ← Volver a Imágenes
          </Button>
          
          <div className="flex gap-2">
            {phase === 'image' && selectedImage && (
              <Button onClick={() => setPhase('word')} size="lg" disabled={isConfirmed}>
                Continuar a Palabras →
              </Button>
            )}
            {phase === 'word' && selectedImage && selectedWord && (
              <Button onClick={handleConfirm} size="lg" className="min-w-[150px]" disabled={isConfirmed}>
                <Check className="w-4 h-4 mr-2" />
                Confirmar OH Card
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
