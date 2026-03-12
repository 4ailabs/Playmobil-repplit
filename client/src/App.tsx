import { Toaster } from "sonner";
import TherapyApp from "./components/TherapyApp";

function App() {
  return (
    <div className="w-full h-screen bg-warm-paper overflow-hidden relative grain">
      <TherapyApp />
      <Toaster
        position="top-right"
        richColors
        closeButton
        expand={false}
        duration={3000}
        toastOptions={{
          className: "font-body",
        }}
      />
    </div>
  );
}

export default App;
