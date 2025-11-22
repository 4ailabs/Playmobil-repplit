import { Canvas } from "@react-three/fiber";
import { Suspense } from "react";
import "@fontsource/inter";
import { Toaster } from "sonner";
import TherapyApp from "./components/TherapyApp";

function App() {
  return (
    <div className="w-full h-screen bg-gradient-to-br from-blue-50 to-slate-100 overflow-hidden">
      <TherapyApp />
      <Toaster 
        position="top-right" 
        richColors 
        closeButton 
        expand={false}
        duration={3000}
      />
    </div>
  );
}

export default App;
