import { useState, useEffect } from "react";
import { IMAGE_CARD_URLS, WORD_CARD_DATA } from "../lib/ohCardsConstants";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { Image, FileText, Check, X } from "lucide-react";
import { logger } from "../lib/logger";

type SelectionPhase = 'images' | 'words' | 'complete';

export default function OHCardSelectionScreen({ onComplete }: { onComplete: () => void }) {
  const { setSelectedOHCardImages, setSelectedOHCardWords, selectedOHCardImages, selectedOHCardWords } = useTherapy();
  const [phase, setPhase] = useState<SelectionPhase>('images');
  const [selectedImages, setSelectedImages] = useState<string[]>([]);
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [numberOfPairs, setNumberOfPairs] = useState(5);

  // Inicializar con valores existentes si hay OH Cards seleccionadas
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
      if (isSelected) {
        return prev.filter(item => item !== url);
      }
      if (prev.length < numberOfPairs) {
        return [...prev, url];
      }
      return prev;
    });
  };

  const handleWordToggle = (word: string) => {
    setSelectedWords(prev => {
      const isSelected = prev.includes(word);
      if (isSelected) {
        return prev.filter(item => item !== word);
      }
      if (prev.length < numberOfPairs) {
        return [...prev, word];
      }
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

  const handleStart = () => {
    onComplete();
  };

  const handleSkip = () => {
    setSelectedOHCardImages([]);
    setSelectedOHCardWords([]);
    onComplete();
  };

  // Componente para el reverso de carta de imagen (verde)
  const ImageCardBack = () => (
    <div className="w-full h-full bg-gradient-to-br from-green-100 to-green-200 rounded-lg border-4 border-green-400 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-2 bg-green-300 rounded-full flex items-center justify-center">
          <Image className="w-8 h-8 text-green-700" />
        </div>
        <div className="text-2xl font-bold text-green-800">OH</div>
      </div>
    </div>
  );

  // Componente para el reverso de carta de palabra (marrón)
  const WordCardBack = () => (
    <div className="w-full h-full bg-gradient-to-br from-amber-100 to-amber-200 rounded-lg border-4 border-amber-400 flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 mx-auto mb-2 bg-amber-300 rounded-full flex items-center justify-center">
          <FileText className="w-8 h-8 text-amber-700" />
        </div>
        <div className="text-2xl font-bold text-amber-800">OH</div>
      </div>
    </div>
  );

  if (phase === 'complete') {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
        <Card className="max-w-2xl w-full">
          <CardHeader>
            <CardTitle className="text-2xl text-center">¡OH Cards Seleccionadas!</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="text-center space-y-2">
              <p className="text-lg">
                Has seleccionado <strong>{numberOfPairs}</strong> pares de OH Cards
              </p>
              <p className="text-sm text-gray-600">
                Cada muñeco que coloques recibirá automáticamente un par (imagen + palabra)
              </p>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-6">
              <div className="space-y-2">
                <h3 className="font-semibold text-green-700 flex items-center gap-2">
                  <Image className="w-4 h-4" />
                  Imágenes ({selectedImages.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedImages.map((url, idx) => (
                    <div key={idx} className="w-12 h-12 rounded border-2 border-green-400 overflow-hidden">
                      <img src={url} alt={`Imagen ${idx + 1}`} className="w-full h-full object-cover" />
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="space-y-2">
                <h3 className="font-semibold text-amber-700 flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Palabras ({selectedWords.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {selectedWords.map((word, idx) => (
                    <div key={idx} className="px-2 py-1 bg-amber-100 rounded border border-amber-400 text-xs font-medium text-amber-800">
                      {word}
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex gap-4 pt-4">
              <Button onClick={handleStart} className="flex-1" size="lg">
                Comenzar con OH Cards
              </Button>
              <Button onClick={handleSkip} variant="outline" className="flex-1" size="lg">
                Continuar sin OH Cards
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[100] flex items-center justify-center p-4 overflow-y-auto" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 }}>
      <Card className="max-w-6xl w-full max-h-[90vh] flex flex-col">
        <CardHeader className="flex-shrink-0">
          <div className="flex items-center justify-between">
            <CardTitle className="text-2xl">
              {phase === 'images' ? 'Selecciona Imágenes OH Cards' : 'Selecciona Palabras OH Cards'}
            </CardTitle>
            <Button onClick={handleSkip} variant="ghost" size="sm">
              <X className="w-4 h-4 mr-2" />
              Omitir
            </Button>
          </div>
          <p className="text-sm text-gray-600 mt-2">
            {phase === 'images' 
              ? `Selecciona ${numberOfPairs} imágenes. El orden importa: la primera imagen irá con la primera palabra.`
              : `Selecciona ${numberOfPairs} palabras. Deben coincidir con el número de imágenes seleccionadas.`
            }
          </p>
          
          <div className="mt-4 flex items-center gap-4">
            <div className="flex-1">
              <label className="text-sm font-medium text-gray-700 mb-2 block">
                Número de pares:
              </label>
              <input
                type="number"
                min="1"
                max="20"
                value={numberOfPairs}
                onChange={(e) => {
                  const num = parseInt(e.target.value) || 1;
                  setNumberOfPairs(Math.max(1, Math.min(20, num)));
                  if (phase === 'images') {
                    setSelectedImages(prev => prev.slice(0, num));
                  } else {
                    setSelectedWords(prev => prev.slice(0, num));
                  }
                }}
                className="w-24 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold text-blue-700">
                  {phase === 'images' ? selectedImages.length : selectedWords.length} / {numberOfPairs}
                </span>
                <span className="text-sm text-gray-600">seleccionadas</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div
                  className="bg-gradient-to-r from-blue-500 to-blue-600 h-2 rounded-full transition-all duration-300"
                  style={{ 
                    width: `${((phase === 'images' ? selectedImages.length : selectedWords.length) / numberOfPairs) * 100}%` 
                  }}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="flex-1 overflow-y-auto">
          <div className="grid grid-cols-[repeat(auto-fill,minmax(120px,1fr))] gap-4">
            {phase === 'images' ? (
              IMAGE_CARD_URLS.map((url, index) => {
                const selectionIndex = selectedImages.indexOf(url);
                const isSelected = selectionIndex !== -1;
                return (
                  <button
                    key={index}
                    onClick={() => handleImageToggle(url)}
                    className={`relative aspect-[2/3] rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
                      isSelected ? 'ring-4 ring-blue-500 ring-offset-2 scale-105' : ''
                    }`}
                  >
                    {isSelected ? (
                      <>
                        <img 
                          src={url} 
                          alt={`OH Card ${index + 1}`}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none';
                          }}
                        />
                        <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {selectionIndex + 1}
                        </div>
                      </>
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
                    className={`relative aspect-[2/3] rounded-lg shadow-md transition-all duration-200 hover:scale-105 ${
                      isSelected ? 'ring-4 ring-amber-500 ring-offset-2 scale-105' : ''
                    }`}
                  >
                    {isSelected ? (
                      <div className="w-full h-full bg-white rounded-lg border-4 border-amber-400 flex flex-col items-center justify-center p-2">
                        <div className="absolute top-2 right-2 bg-amber-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold">
                          {selectionIndex + 1}
                        </div>
                        <div className="text-center font-bold text-amber-800 text-sm">
                          {word}
                        </div>
                      </div>
                    ) : (
                      <WordCardBack />
                    )}
                  </button>
                );
              })
            )}
          </div>
        </CardContent>
        
        <div className="p-4 border-t flex-shrink-0">
          <div className="flex justify-end gap-4">
            {phase === 'images' && (
              <Button
                onClick={handleImagesConfirm}
                disabled={selectedImages.length !== numberOfPairs}
                size="lg"
                className="min-w-[150px]"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar Imágenes ({selectedImages.length}/{numberOfPairs})
              </Button>
            )}
            {phase === 'words' && (
              <Button
                onClick={handleWordsConfirm}
                disabled={selectedWords.length !== numberOfPairs}
                size="lg"
                className="min-w-[150px]"
              >
                <Check className="w-4 h-4 mr-2" />
                Confirmar Palabras ({selectedWords.length}/{numberOfPairs})
              </Button>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
}

