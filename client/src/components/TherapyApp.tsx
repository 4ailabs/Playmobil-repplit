import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import Scene3D from "./Scene3D";
import DollLibrary from "./DollLibrary";
import ScenarioPanel from "./ScenarioPanel";
import InfoPanel from "./InfoPanel";
import { useTherapy } from "../lib/stores/useTherapy";

export default function TherapyApp() {
  const { selectedScenario } = useTherapy();

  return (
    <div className="w-full h-screen flex flex-col bg-gradient-to-br from-blue-50 to-slate-100">
      {/* Header */}
      <header className="bg-white/90 backdrop-blur-sm border-b border-blue-200 px-6 py-4 shadow-sm">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-slate-800">Terapia con Muñecos 3D</h1>
            <p className="text-sm text-slate-600 mt-1">{selectedScenario.name}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-slate-500">Sesión de terapia interactiva</p>
            <p className="text-xs text-slate-400">Arrastra los muñecos a la mesa circular</p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar - Doll Library */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-r border-blue-200 shadow-sm">
          <DollLibrary />
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
            <color attach="background" args={["#f1f5f9"]} />
            <Suspense fallback={null}>
              <Scene3D />
            </Suspense>
          </Canvas>
        </div>

        {/* Right Sidebar - Scenarios */}
        <div className="w-80 bg-white/80 backdrop-blur-sm border-l border-blue-200 shadow-sm">
          <ScenarioPanel />
        </div>
      </div>

      {/* Bottom Info Panel */}
      <InfoPanel />
    </div>
  );
}
