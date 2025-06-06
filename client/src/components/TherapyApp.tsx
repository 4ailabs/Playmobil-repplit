import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene3D from "./Scene3D";
import DollLibrary from "./DollLibrary";
import LifePathsPanel from "./LifePathsPanel";
import InfoPanel from "./InfoPanel";
import InstructionsPanel from "./InstructionsPanel";
import { useTherapy } from "../lib/stores/useTherapyStore";

export default function TherapyApp() {
  const { isFullscreen, toggleFullscreen } = useTherapy();

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header - ocultar en pantalla completa */}
      {!isFullscreen && (
        <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-6 py-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-slate-800">Los Cuatro Caminos de Vida</h1>
              <p className="text-sm text-slate-600 mt-1">Terapia con Muñecos 3D - Técnica de Constelaciones Familiares</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-500">Norte: Migrante • Sur: Sufrimiento • Oeste: Deber • Este: Placer</p>
              <p className="text-xs text-slate-400">Selecciona muñecos familiares y déjalos caer para descubrir su camino</p>
            </div>
          </div>
        </header>
      )}

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Doll Library - ocultar en pantalla completa */}
        {!isFullscreen && (
          <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-blue-200 shadow-sm">
            <DollLibrary />
          </div>
        )}

        {/* Center - 3D Scene */}
        <div className="flex-1 relative">
          {/* Botón de pantalla completa flotante */}
          <button
            onClick={toggleFullscreen}
            className="absolute top-4 right-4 z-10 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-full shadow-lg transition-all duration-200 hover:scale-105"
            title={isFullscreen ? "Salir de pantalla completa" : "Pantalla completa"}
          >
            {isFullscreen ? (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 9V4.5M9 9H4.5M9 9L3.5 3.5M15 9h4.5M15 9V4.5M15 9l5.5-5.5M9 15v4.5M9 15H4.5M9 15l-5.5 5.5M15 15h4.5M15 15v4.5m0 0l5.5 5.5" />
              </svg>
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
              </svg>
            )}
          </button>
          
          <Canvas
            shadows
            camera={{
              position: [10, 8, 10],
              fov: 45,
              near: 0.1,
              far: 1000
            }}
            gl={{
              antialias: true,
              powerPreference: "high-performance"
            }}
          >
            <color attach="background" args={["#f1f5f9"]} />
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Sidebar - Life Paths - ocultar en pantalla completa */}
        {!isFullscreen && (
          <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-blue-200 shadow-sm">
            <LifePathsPanel />
          </div>
        )}
      </div>

      {/* Bottom Info Panel - ocultar en pantalla completa */}
      {!isFullscreen && <InfoPanel />}
      
      {/* Instructions Panel - ocultar en pantalla completa */}
      {!isFullscreen && <InstructionsPanel />}
    </div>
  );
}
