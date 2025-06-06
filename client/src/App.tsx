import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";
import GameApp from "./components/GameApp";

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-green-50 to-blue-100 overflow-hidden">
      <GameApp />
    </div>
  );
}

export default App;
