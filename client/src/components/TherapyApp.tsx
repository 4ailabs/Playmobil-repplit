import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useCallback, useEffect, useState } from "react";
import Scene3D from "./Scene3D";
import DollLibrary from "./DollLibrary";
import LifePathsPanel from "./LifePathsPanel";
import InfoPanel from "./InfoPanel";
import InstructionsPanel from "./InstructionsPanel";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { logger } from "../lib/logger";
import { useKeyboardDelete } from "../hooks/useKeyboardDelete";
import { useIsMobile } from "../hooks/use-is-mobile";
import { MobileDrawer } from "./MobileDrawer";
import { Compass, HeartCrack, Scale, Sun, Maximize2, Minimize2, X, Menu, BookOpen, Sparkles } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import DollOHCardSelector from "./DollOHCardSelector";

// Componente interno para acceder al renderer de Three.js
function CanvasExporter({ onExportReady }: { onExportReady: (exportFn: () => void) => void }) {
  const { gl, scene, camera, size } = useThree();
  
  const exportImage = useCallback(() => {
    try {
      // Esperar un frame para asegurar que todo esté renderizado
      requestAnimationFrame(() => {
        try {
          // Forzar un render final antes de capturar
          gl.render(scene, camera);
          
          // Obtener las dimensiones del viewport
          const width = size.width;
          const height = size.height;
          
          if (width === 0 || height === 0) {
            logger.error('Canvas tiene dimensiones inválidas');
            alert('Error: El canvas no está listo. Por favor, espera un momento e intenta de nuevo.');
            return;
          }

          // Obtener el canvas y su contexto WebGL
          const canvas = gl.domElement;
          
          // Intentar usar el método más directo: toDataURL del canvas
          // Si el canvas no está "tainted" (contaminado por CORS), esto funcionará
          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            
            // Crear el enlace de descarga directamente desde el data URL
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '-');
            link.download = `dinamicas-sistemicas-${date}-${time}.png`;
            link.href = dataUrl;
            link.style.display = 'none';
            
            document.body.appendChild(link);
            link.click();
            
            setTimeout(() => {
              document.body.removeChild(link);
            }, 100);
            
            logger.info('Imagen exportada exitosamente usando toDataURL');
            return;
          } catch (toDataUrlError) {
            // Si toDataURL falla (canvas tainted), usar readPixels
            logger.debug('toDataURL falló, usando readPixels como fallback');
          }

          // Método alternativo: leer píxeles del framebuffer WebGL
          // Intentar obtener el contexto WebGL directamente del canvas
          const webglContext = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
          
          if (!webglContext || typeof webglContext.readPixels !== 'function') {
            alert('Error: No se pudo acceder al contexto WebGL. Por favor, intenta recargar la página.');
            logger.error('No se pudo obtener el contexto WebGL para readPixels');
            return;
          }

          // Leer los píxeles directamente del framebuffer de WebGL
          const pixels = new Uint8Array(width * height * 4);
          webglContext.readPixels(0, 0, width, height, webglContext.RGBA, webglContext.UNSIGNED_BYTE, pixels);
          
          // Crear un canvas temporal con mejor resolución (2x)
          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width * 2;
          tempCanvas.height = height * 2;
          const ctx = tempCanvas.getContext('2d');
          
          if (!ctx) {
            logger.error('No se pudo obtener contexto 2D para exportar');
            alert('Error: No se pudo crear el contexto de imagen.');
            return;
          }

          // Configurar calidad de renderizado
          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';

          // Crear ImageData a tamaño original primero
          const imageData = ctx.createImageData(width, height);
          
          // Voltear verticalmente porque WebGL tiene el origen en la esquina inferior izquierda
          // y copiar los píxeles al ImageData
          for (let y = 0; y < height; y++) {
            const srcY = height - 1 - y; // Voltear verticalmente
            for (let x = 0; x < width; x++) {
              const srcIndex = (srcY * width + x) * 4;
              const dstIndex = (y * width + x) * 4;
              
              // Copiar píxeles (RGBA)
              imageData.data[dstIndex] = pixels[srcIndex];         // R
              imageData.data[dstIndex + 1] = pixels[srcIndex + 1]; // G
              imageData.data[dstIndex + 2] = pixels[srcIndex + 2]; // B
              imageData.data[dstIndex + 3] = pixels[srcIndex + 3]; // A
            }
          }
          
          // Crear un canvas intermedio con la imagen volteada correctamente
          const originalCanvas = document.createElement('canvas');
          originalCanvas.width = width;
          originalCanvas.height = height;
          const originalCtx = originalCanvas.getContext('2d');
          
          if (!originalCtx) {
            logger.error('No se pudo crear canvas intermedio');
            alert('Error: No se pudo procesar la imagen.');
            return;
          }
          
          // Poner la imagen volteada en el canvas intermedio
          originalCtx.putImageData(imageData, 0, 0);
          
          // Escalar usando drawImage para mejor calidad de interpolación
          ctx.drawImage(originalCanvas, 0, 0, tempCanvas.width, tempCanvas.height);

          // Convertir a blob para mejor compatibilidad
          tempCanvas.toBlob((blob) => {
            if (!blob) {
              logger.error('No se pudo crear el blob de la imagen');
              alert('Error: No se pudo generar la imagen. Por favor, intenta de nuevo.');
              return;
            }

            // Crear URL del blob
            const url = URL.createObjectURL(blob);
            
            // Crear el enlace de descarga
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '-');
            link.download = `dinamicas-sistemicas-${date}-${time}.png`;
            link.href = url;
            link.style.display = 'none';
            
            // Trigger download
            document.body.appendChild(link);
            link.click();
            
            // Limpiar después de un breve delay
            setTimeout(() => {
              document.body.removeChild(link);
              URL.revokeObjectURL(url);
            }, 100);
            
            logger.info('Imagen exportada exitosamente usando readPixels');
          }, 'image/png', 1.0);
          
        } catch (error) {
          logger.errorWithContext('Error al exportar imagen del canvas', error);
          alert('Error al exportar la imagen. Por favor, intenta de nuevo.');
          console.error('Error de exportación:', error);
        }
      });
    } catch (error) {
      logger.errorWithContext('Error al exportar imagen del canvas', error);
      alert('Error inesperado al exportar. Por favor, recarga la página e intenta de nuevo.');
      console.error('Error inesperado:', error);
    }
  }, [gl, scene, camera, size]);

  // Exponer la función de exportación al componente padre
  useEffect(() => {
    onExportReady(exportImage);
  }, [exportImage, onExportReady]);

  return null;
}

export default function TherapyApp() {
  const { isFullscreen, toggleFullscreen, dollNeedingOHCard, placedDolls, setDollNeedingOHCard } = useTherapy();
  const exportFnRef = useRef<(() => void) | null>(null);
  const isMobile = useIsMobile();
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [lifePathsModalOpen, setLifePathsModalOpen] = useState(false);

  // Hook global para manejar eliminación con teclado (evita memory leaks)
  useKeyboardDelete();

  const handleExportReady = useCallback((exportFn: () => void) => {
    exportFnRef.current = exportFn;
  }, []);

  const exportCanvasAsImage = useCallback(() => {
    if (exportFnRef.current) {
      exportFnRef.current();
    } else {
      logger.warn('Función de exportación no está lista aún');
    }
  }, []);

  // Cerrar drawers cuando se activa pantalla completa
  useEffect(() => {
    if (isFullscreen) {
      setLeftDrawerOpen(false);
      setRightDrawerOpen(false);
    }
  }, [isFullscreen]);


  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header - ocultar en pantalla completa - Más compacto */}
      {!isFullscreen && (
        <header className="bg-gradient-to-r from-blue-50 via-white to-blue-50 backdrop-blur-md border-b border-blue-200/50 px-4 py-2 shadow-sm sticky top-0 z-40 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <img 
                  src="https://images.squarespace-cdn.com/content/v1/63937c55c3c2e84a13a3ede9/a279434a-f77d-4cf0-93f5-8528eb0aa100/CAAE2365-50D2-40DD-8CBC-104F7E0B2EE0.png?format=2500w" 
                  alt="Playworld Pro Logo" 
                  className="h-10 w-auto object-contain transition-transform hover:scale-105"
                />
              </div>
              <div>
                <h1 className="text-lg font-bold bg-gradient-to-r from-blue-700 to-blue-500 bg-clip-text text-transparent">
                  Los Cuatro Caminos de Vida
                </h1>
                <p className="text-xs text-slate-600">Terapia con Muñecos 3D • Dinámicas Sistémicas</p>
                <p className="text-xs text-blue-600 font-medium">Dr. Miguel Ojeda Rios • Playworld Pro</p>
              </div>
            </div>
            <div className="hidden lg:block text-right">
              <div className="flex items-center gap-2 text-xs">
                <span className="px-2 py-1 rounded-full bg-blue-100 text-blue-700 font-medium flex items-center gap-1">
                  <Compass className="w-3 h-3" />
                  Norte
                </span>
                <span className="px-2 py-1 rounded-full bg-red-100 text-red-700 font-medium flex items-center gap-1">
                  <HeartCrack className="w-3 h-3" />
                  Sur
                </span>
                <span className="px-2 py-1 rounded-full bg-amber-100 text-amber-700 font-medium flex items-center gap-1">
                  <Scale className="w-3 h-3" />
                  Oeste
                </span>
                <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 font-medium flex items-center gap-1">
                  <Sun className="w-3 h-3" />
                  Este
                </span>
              </div>
              <p className="text-xs text-slate-500 mt-1">Selecciona muñecos y descubre su camino</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden min-h-0">
        {/* Left Sidebar - Doll Library - ocultar en pantalla completa */}
        {!isFullscreen && (
          <>
            {/* Desktop: Sidebar colapsable */}
            {leftSidebarOpen && (
              <div className="hidden lg:block w-72 bg-white/80 backdrop-blur-sm border-r border-blue-200 shadow-sm flex-shrink-0 relative">
                <button
                  onClick={() => setLeftSidebarOpen(false)}
                  className="absolute top-2 right-2 z-10 bg-white/90 hover:bg-white rounded-full p-1.5 shadow-md transition-all hover:scale-110"
                  aria-label="Ocultar biblioteca de muñecos"
                >
                  <X className="w-4 h-4 text-slate-600" />
                </button>
                <DollLibrary />
              </div>
            )}
            {/* Botón para mostrar sidebar cuando está oculto */}
            {!leftSidebarOpen && (
              <button
                onClick={() => setLeftSidebarOpen(true)}
                className="hidden lg:flex fixed left-4 top-1/2 -translate-y-1/2 z-20 bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110"
                aria-label="Mostrar biblioteca de muñecos"
              >
                <Menu className="w-5 h-5" />
              </button>
            )}
            {/* Mobile: Drawer */}
            {isMobile && (
              <MobileDrawer
                title="Biblioteca de Muñecos"
                triggerLabel="Muñecos"
                side="left"
                isOpen={leftDrawerOpen}
                onOpenChange={setLeftDrawerOpen}
              >
                <DollLibrary />
              </MobileDrawer>
            )}
          </>
        )}

        {/* Center - 3D Scene - Ocupa todo el espacio disponible */}
        <div className="flex-1 relative min-w-0 min-h-0">
          {/* Botones flotantes - Ajustados para no traslapar con header */}
          <div className="absolute top-24 right-4 z-10 flex flex-col gap-3">
            {/* Botón de pantalla completa */}
            <button
              onClick={toggleFullscreen}
              className="bg-gradient-to-br from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 active:from-blue-700 active:to-blue-800 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 touch-feedback min-h-12 min-w-12 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 backdrop-blur-sm flex items-center justify-center"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Activar pantalla completa"}
              aria-pressed={isFullscreen}
            >
              {isFullscreen ? (
                <Minimize2 className="w-5 h-5" strokeWidth={2.5} />
              ) : (
                <Maximize2 className="w-5 h-5" strokeWidth={2.5} />
              )}
            </button>
            
            {/* Botón para abrir información de caminos de vida */}
            {!isFullscreen && (
              <button
                onClick={() => setLifePathsModalOpen(true)}
                className="bg-gradient-to-br from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 active:from-purple-700 active:to-purple-800 text-white p-3 rounded-full shadow-xl hover:shadow-2xl transition-all duration-300 hover:scale-110 active:scale-95 touch-feedback min-h-12 min-w-12 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 backdrop-blur-sm flex items-center justify-center"
                title="Ver información de los Caminos de Vida"
                aria-label="Abrir información de los Caminos de Vida"
              >
                <BookOpen className="w-5 h-5" strokeWidth={2.5} />
              </button>
            )}
          </div>
          
          <Canvas
            shadows
            camera={{
              position: [10, 7, 10],
              fov: 30,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <Scene3D />
              <CanvasExporter onExportReady={handleExportReady} />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Sidebar - Life Paths - REMOVIDO para dar más espacio al canvas */}
        {/* La información ahora se accede mediante el botón flotante y modal */}
      </div>

      {/* Bottom Info Panel - ocultar en pantalla completa */}
      {!isFullscreen && <InfoPanel onExportImage={exportCanvasAsImage} />}
      
      {/* Instructions Panel - ocultar en pantalla completa */}
      {!isFullscreen && <InstructionsPanel />}
      
      {/* Modal de Caminos de Vida */}
      <Dialog open={lifePathsModalOpen} onOpenChange={setLifePathsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold">Los Cuatro Caminos de Vida</DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <LifePathsPanel />
          </div>
        </DialogContent>
      </Dialog>

      {/* Doll OH Card Selector - Modal para seleccionar OH Card individual */}
      {dollNeedingOHCard && (() => {
        const doll = placedDolls.find(d => d.id === dollNeedingOHCard);
        if (!doll) return null;
        return (
          <DollOHCardSelector
            dollId={doll.id}
            dollName={doll.label || doll.dollType.name}
            currentImage={doll.ohCardImage}
            currentWord={doll.ohCardWord}
            onComplete={() => setDollNeedingOHCard(null)}
          />
        );
      })()}
    </div>
  );
}

