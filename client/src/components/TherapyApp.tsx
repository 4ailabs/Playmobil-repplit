import { Canvas, useThree } from "@react-three/fiber";
import { Suspense, useRef, useCallback, useEffect, useState } from "react";
import Scene3D from "./Scene3D";
import DollLibrary from "./DollLibrary";
import DollEditor from "./DollEditor";
import LifePathsPanel from "./LifePathsPanel";
import InfoPanel from "./InfoPanel";
import InstructionsPanel from "./InstructionsPanel";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { logger } from "../lib/logger";
import { useKeyboardDelete } from "../hooks/useKeyboardDelete";
import { useUndoRedo } from "../hooks/useUndoRedo";
import { useIsMobile } from "../hooks/use-is-mobile";
import { MobileDrawer } from "./MobileDrawer";
import { Compass, HeartCrack, Scale, Sun, Maximize2, Minimize2, X, Menu, BookOpen } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import DollOHCardSelector from "./DollOHCardSelector";

// Internal component for Three.js renderer access
function CanvasExporter({ onExportReady }: { onExportReady: (exportFn: () => void) => void }) {
  const { gl, scene, camera, size } = useThree();

  const exportImage = useCallback(() => {
    try {
      requestAnimationFrame(() => {
        try {
          gl.render(scene, camera);
          const width = size.width;
          const height = size.height;

          if (width === 0 || height === 0) {
            logger.error('Canvas tiene dimensiones inválidas');
            alert('Error: El canvas no está listo.');
            return;
          }

          const canvas = gl.domElement;

          try {
            const dataUrl = canvas.toDataURL('image/png', 1.0);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '-');
            link.download = `dinamicas-sistemicas-${date}-${time}.png`;
            link.href = dataUrl;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => document.body.removeChild(link), 100);
            logger.info('Imagen exportada exitosamente');
            return;
          } catch {
            logger.debug('toDataURL falló, usando readPixels');
          }

          const webglContext = canvas.getContext('webgl') || canvas.getContext('webgl2') || canvas.getContext('experimental-webgl');
          if (!webglContext || !('readPixels' in webglContext) || typeof webglContext.readPixels !== 'function') {
            alert('Error: No se pudo acceder al contexto WebGL.');
            return;
          }

          const glContext = webglContext as WebGLRenderingContext | WebGL2RenderingContext;
          const pixels = new Uint8Array(width * height * 4);
          glContext.readPixels(0, 0, width, height, glContext.RGBA, glContext.UNSIGNED_BYTE, pixels);

          const tempCanvas = document.createElement('canvas');
          tempCanvas.width = width * 2;
          tempCanvas.height = height * 2;
          const ctx = tempCanvas.getContext('2d');
          if (!ctx) { alert('Error al crear contexto de imagen.'); return; }

          ctx.imageSmoothingEnabled = true;
          ctx.imageSmoothingQuality = 'high';
          const imageData = ctx.createImageData(width, height);

          for (let y = 0; y < height; y++) {
            const srcY = height - 1 - y;
            for (let x = 0; x < width; x++) {
              const srcIndex = (srcY * width + x) * 4;
              const dstIndex = (y * width + x) * 4;
              imageData.data[dstIndex] = pixels[srcIndex];
              imageData.data[dstIndex + 1] = pixels[srcIndex + 1];
              imageData.data[dstIndex + 2] = pixels[srcIndex + 2];
              imageData.data[dstIndex + 3] = pixels[srcIndex + 3];
            }
          }

          const originalCanvas = document.createElement('canvas');
          originalCanvas.width = width;
          originalCanvas.height = height;
          const originalCtx = originalCanvas.getContext('2d');
          if (!originalCtx) { alert('Error al procesar imagen.'); return; }

          originalCtx.putImageData(imageData, 0, 0);
          ctx.drawImage(originalCanvas, 0, 0, tempCanvas.width, tempCanvas.height);

          tempCanvas.toBlob((blob) => {
            if (!blob) { alert('Error al generar imagen.'); return; }
            const url = URL.createObjectURL(blob);
            const link = document.createElement('a');
            const date = new Date().toISOString().split('T')[0];
            const time = new Date().toLocaleTimeString('es-ES', { hour12: false }).replace(/:/g, '-');
            link.download = `dinamicas-sistemicas-${date}-${time}.png`;
            link.href = url;
            link.style.display = 'none';
            document.body.appendChild(link);
            link.click();
            setTimeout(() => { document.body.removeChild(link); URL.revokeObjectURL(url); }, 100);
          }, 'image/png', 1.0);

        } catch (error) {
          logger.errorWithContext('Error al exportar imagen', error);
          alert('Error al exportar la imagen.');
        }
      });
    } catch (error) {
      logger.errorWithContext('Error inesperado al exportar', error);
      alert('Error inesperado al exportar.');
    }
  }, [gl, scene, camera, size]);

  useEffect(() => { onExportReady(exportImage); }, [exportImage, onExportReady]);
  return null;
}

export default function TherapyApp() {
  const { isFullscreen, toggleFullscreen, dollNeedingOHCard, placedDolls, selectedDollId, setDollNeedingOHCard } = useTherapy();
  const exportFnRef = useRef<(() => void) | null>(null);
  const isMobile = useIsMobile();
  const [leftDrawerOpen, setLeftDrawerOpen] = useState(false);
  const [rightDrawerOpen, setRightDrawerOpen] = useState(false);
  const [leftSidebarOpen, setLeftSidebarOpen] = useState(true);
  const [lifePathsModalOpen, setLifePathsModalOpen] = useState(false);

  useKeyboardDelete();
  useUndoRedo();

  const handleExportReady = useCallback((exportFn: () => void) => {
    exportFnRef.current = exportFn;
  }, []);

  const exportCanvasAsImage = useCallback(() => {
    if (exportFnRef.current) exportFnRef.current();
    else logger.warn('Función de exportación no está lista aún');
  }, []);

  useEffect(() => {
    if (isFullscreen) {
      setLeftDrawerOpen(false);
      setRightDrawerOpen(false);
    }
  }, [isFullscreen]);

  const hasSelectedDoll = !!selectedDollId;

  return (
    <div className="w-full h-screen flex flex-col">
      {/* ═══════════════ HEADER ═══════════════ */}
      {!isFullscreen && (
        <header className="chrome-panel px-5 py-2.5 sticky top-0 z-40 flex-shrink-0 border-b border-chrome-border">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <img
                src="https://images.squarespace-cdn.com/content/v1/63937c55c3c2e84a13a3ede9/a279434a-f77d-4cf0-93f5-8528eb0aa100/CAAE2365-50D2-40DD-8CBC-104F7E0B2EE0.png?format=2500w"
                alt="Playworld Pro Logo"
                className="h-8 w-auto object-contain brightness-110"
              />
              <div>
                <h1 className="font-display text-lg font-semibold tracking-tight text-chrome-text leading-tight">
                  Los Cuatro Caminos de Vida
                </h1>
                <p className="text-[11px] text-chrome-text-muted tracking-widest uppercase font-light">
                  Dinámicas Sistémicas &middot; Dr. Miguel Ojeda Rios
                </p>
              </div>
            </div>
            {/* Cardinal badges — dark theme */}
            <div className="hidden lg:flex items-center gap-1">
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium tracking-wider uppercase bg-blue-500/15 text-blue-300 border border-blue-500/20">
                <Compass className="w-3 h-3" /> Norte
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium tracking-wider uppercase bg-red-500/15 text-red-300 border border-red-500/20">
                <HeartCrack className="w-3 h-3" /> Sur
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium tracking-wider uppercase bg-amber-500/15 text-amber-300 border border-amber-500/20">
                <Scale className="w-3 h-3" /> Oeste
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded text-[10px] font-medium tracking-wider uppercase bg-emerald-500/15 text-emerald-300 border border-emerald-500/20">
                <Sun className="w-3 h-3" /> Este
              </span>
            </div>
          </div>
        </header>
      )}

      {/* ═══════════════ 3-ZONE LAYOUT ═══════════════ */}
      <div className="flex-1 flex overflow-hidden min-h-0">

        {/* ──── LEFT: Doll Library ──── */}
        {!isFullscreen && (
          <>
            {/* Desktop sidebar */}
            {leftSidebarOpen && (
              <div className="hidden lg:block w-64 chrome-panel border-r border-chrome-border flex-shrink-0 relative">
                <button
                  onClick={() => setLeftSidebarOpen(false)}
                  className="absolute top-2.5 right-2.5 z-10 bg-chrome-hover hover:bg-chrome-border rounded-full p-1 transition-all hover:scale-110"
                  aria-label="Ocultar biblioteca"
                >
                  <X className="w-3 h-3 text-chrome-text-muted" />
                </button>
                <DollLibrary />
              </div>
            )}
            {!leftSidebarOpen && (
              <button
                onClick={() => setLeftSidebarOpen(true)}
                className="hidden lg:flex fixed left-3 top-1/2 -translate-y-1/2 z-20 bg-chrome-bg hover:bg-chrome-surface text-chrome-accent p-2.5 rounded-lg border border-chrome-border shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105"
                aria-label="Mostrar biblioteca"
              >
                <Menu className="w-4 h-4" />
              </button>
            )}
            {/* Mobile drawer */}
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

        {/* ──── CENTER: 3D Canvas ──── */}
        <div className="flex-1 relative min-w-0 min-h-0">
          {/* Floating buttons */}
          <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
            <button
              onClick={toggleFullscreen}
              className="bg-chrome-bg/90 hover:bg-chrome-surface text-chrome-text p-2 rounded-lg border border-chrome-border shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 min-h-9 min-w-9 focus:outline-none focus:ring-2 focus:ring-chrome-accent/40 backdrop-blur-sm flex items-center justify-center"
              title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
              aria-label={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
            >
              {isFullscreen ? <Minimize2 className="w-3.5 h-3.5" strokeWidth={2} /> : <Maximize2 className="w-3.5 h-3.5" strokeWidth={2} />}
            </button>
            {!isFullscreen && (
              <button
                onClick={() => setLifePathsModalOpen(true)}
                className="bg-chrome-bg/90 hover:bg-chrome-surface text-chrome-accent p-2 rounded-lg border border-chrome-border shadow-lg transition-all duration-200 hover:scale-105 active:scale-95 min-h-9 min-w-9 focus:outline-none focus:ring-2 focus:ring-chrome-accent/40 backdrop-blur-sm flex items-center justify-center"
                title="Caminos de Vida"
                aria-label="Abrir Caminos de Vida"
              >
                <BookOpen className="w-3.5 h-3.5" strokeWidth={2} />
              </button>
            )}
          </div>

          <Canvas
            shadows
            dpr={[1, 2]}
            camera={{ position: [10, 7, 10], fov: 30, near: 0.1, far: 1000 }}
            gl={{ antialias: true, powerPreference: "high-performance", preserveDrawingBuffer: true, toneMapping: 0 }}
            className="w-full h-full"
            style={{ width: '100%', height: '100%' }}
          >
            <Suspense fallback={null}>
              <Scene3D />
              <CanvasExporter onExportReady={handleExportReady} />
            </Suspense>
          </Canvas>
        </div>

        {/* ──── RIGHT: Doll Editor (contextual) ──── */}
        {!isFullscreen && hasSelectedDoll && (
          <div className="hidden lg:block w-72 chrome-panel border-l border-chrome-border flex-shrink-0 animate-fade-in">
            <DollEditor />
          </div>
        )}
        {/* Mobile: right drawer for doll editor */}
        {!isFullscreen && isMobile && hasSelectedDoll && (
          <MobileDrawer
            title="Editor de Muñeco"
            triggerLabel="Editar"
            side="right"
            isOpen={rightDrawerOpen}
            onOpenChange={setRightDrawerOpen}
          >
            <DollEditor />
          </MobileDrawer>
        )}
      </div>

      {/* ═══════════════ ACTION BAR (bottom) ═══════════════ */}
      {!isFullscreen && <InfoPanel onExportImage={exportCanvasAsImage} />}

      {/* ═══════════════ INSTRUCTIONS (floating) ═══════════════ */}
      {!isFullscreen && <InstructionsPanel />}

      {/* ═══════════════ MODALS ═══════════════ */}
      <Dialog open={lifePathsModalOpen} onOpenChange={setLifePathsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="font-display text-2xl font-semibold text-warm-800">
              Los Cuatro Caminos de Vida
            </DialogTitle>
          </DialogHeader>
          <div className="mt-4">
            <LifePathsPanel />
          </div>
        </DialogContent>
      </Dialog>

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
