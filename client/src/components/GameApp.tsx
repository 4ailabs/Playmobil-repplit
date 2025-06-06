import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene3D from "./Scene3D";
import BuildingLibrary from "./BuildingLibrary";
import EraPanel from "./EraPanel";
import GameInfoPanel from "./GameInfoPanel";
import { useGame } from "../lib/stores/useTherapy";

export default function GameApp() {
  const { selectedEra } = useGame();

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-green-50 to-blue-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-green-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Historical Community Builder</h1>
            <p className="text-sm text-slate-600 mt-1">{selectedEra.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Sustainable Resource Management Game</p>
            <p className="text-xs text-slate-400">Build eco-friendly communities through history</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Building Library */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-green-200 shadow-sm">
          <BuildingLibrary />
        </div>

        {/* Center - 3D Scene */}
        <div className="flex-1 relative">
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
            <color attach="background" args={["#e8f5e8"]} />
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Sidebar - Eras */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-green-200 shadow-sm">
          <EraPanel />
        </div>
      </div>

      {/* Bottom Info Panel */}
      <GameInfoPanel />
    </div>
  );
}