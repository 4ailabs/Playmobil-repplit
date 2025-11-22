import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";
import { Shuffle, Eye, Trash2, Baby, Camera, Monitor, Compass, Lightbulb, X, BookOpen } from "lucide-react";

export default function InstructionsPanel() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-24 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-2 shadow-lg"
        size="sm"
      >
        <BookOpen className="w-4 h-4" /> Instrucciones
      </Button>
    );
  }

  return (
    <Card className="fixed top-24 right-4 z-50 w-80 bg-white/95 backdrop-blur-sm border-blue-200 shadow-lg max-h-[calc(100vh-7rem)] overflow-y-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900 flex items-center gap-2">
            <Lightbulb className="w-6 h-6 text-blue-700" />
            Dinámicas Sistémicas - Playworld Pro
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            className="h-8 w-auto px-3 py-1 bg-red-100 border border-red-300 text-red-700 font-semibold rounded hover:bg-red-200 transition-all text-xs"
          >
            <X className="inline w-4 h-4 mr-1 align-middle" /> Ocultar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Shuffle className="w-4 h-4 text-blue-500" /> Colocación Aleatoria:</h4>
          <p className="text-gray-700">
            • Selecciona un familiar de la biblioteca<br/>
            • ¡El muñeco cae automáticamente al azar en la mesa!<br/>
            • Posición y dirección espontáneas revelan dinámicas inconscientes<br/>
            • Incluye bebés fallecidos para honrar miembros perdidos<br/>
            • Metodología auténtica de dinámicas sistémicas
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Trash2 className="w-4 h-4 text-blue-500" /> Eliminar (Compatible Mac):</h4>
          <p className="text-gray-700">
            • Haz clic en un muñeco para seleccionarlo<br/>
            • Presiona Delete o Backspace para eliminarlo<br/>
            • Funciona en Mac, PC y todos los sistemas
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Baby className="w-4 h-4 text-blue-500" /> Bebés Fallecidos:</h4>
          <p className="text-gray-700">
            • Representados con esferas etéreas y halo dorado<br/>
            • Honran abortos, óbitos y pérdidas tempranas<br/>
            • Esenciales para completar el sistema familiar<br/>
            • Ayudan a sanar dinámicas interrumpidas
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2"><Compass className="w-4 h-4 text-blue-500" /> Caminos de Vida:</h4>
          <p className="text-gray-700">
            • <strong>N:</strong> Migrante - Búsqueda y exploración<br/>
            • <strong>S:</strong> Sufrimiento - Dolor y sanación<br/>
            • <strong>E:</strong> Placer - Disfrute y satisfacción<br/>
            • <strong>O:</strong> Deber - Responsabilidad y servicio
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-blue-500" /> Metodología Auténtica:</h4>
          <p className="text-xs text-blue-700">
            La colocación aleatoria automática simula el proceso intuitivo 
            de las dinámicas sistémicas. Cada posición, dirección y 
            camino de vida revelados espontáneamente reflejan el inconsciente 
            familiar sistémico. Analiza las distancias, orientaciones y 
            agrupaciones para comprender las dinámicas relacionales.
          </p>
          <div className="mt-2 pt-2 border-t border-blue-200">
            <p className="text-xs text-blue-600 font-medium">
              Creado por Dr. Miguel Ojeda Rios
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}