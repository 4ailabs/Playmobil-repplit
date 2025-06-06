import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";
import TherapyApp from "./components/TherapyApp";

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
      <TherapyApp />
    </div>
  );
}

export default App;
