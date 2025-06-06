import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Button } from "./ui/button";
import { useState } from "react";

export default function InstructionsPanel() {
  const [isOpen, setIsOpen] = useState(true);

  if (!isOpen) {
    return (
      <Button
        onClick={() => setIsOpen(true)}
        className="fixed top-4 right-4 z-50 bg-blue-600 hover:bg-blue-700 text-white"
        size="sm"
      >
        📋 Instrucciones
      </Button>
    );
  }

  return (
    <Card className="fixed top-4 right-4 z-50 w-80 bg-white/95 backdrop-blur-sm border-blue-200 shadow-lg">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg text-blue-900">
            🎭 Constelaciones Familiares
          </CardTitle>
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="sm"
            className="h-6 w-6 p-0"
          >
            ✕
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div>
          <h4 className="font-semibold text-blue-800 mb-2">🎲 Colocación Aleatoria:</h4>
          <p className="text-gray-700">
            • Selecciona un familiar de la biblioteca<br/>
            • ¡El muñeco cae automáticamente al azar en la mesa!<br/>
            • Posición y dirección espontáneas revelan dinámicas inconscientes<br/>
            • Metodología auténtica de constelaciones familiares
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2">🔄 Rotar Dirección:</h4>
          <p className="text-gray-700">
            • Doble clic en un muñeco colocado para rotarlo<br/>
            • La flecha roja muestra hacia dónde mira<br/>
            • Importante para analizar dinámicas relacionales
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2">🗑️ Eliminar (Compatible Mac):</h4>
          <p className="text-gray-700">
            • Haz clic en un muñeco para seleccionarlo (aro rojo)<br/>
            • Presiona Delete o Backspace para eliminarlo<br/>
            • Funciona en Mac, PC y todos los sistemas
          </p>
        </div>

        <div>
          <h4 className="font-semibold text-blue-800 mb-2">🧭 Caminos de Vida:</h4>
          <p className="text-gray-700">
            • <strong>N:</strong> Migrante - Búsqueda y exploración<br/>
            • <strong>S:</strong> Sufrimiento - Dolor y sanación<br/>
            • <strong>E:</strong> Placer - Disfrute y satisfacción<br/>
            • <strong>O:</strong> Deber - Responsabilidad y servicio
          </p>
        </div>

        <div className="bg-blue-50 p-3 rounded-lg">
          <h4 className="font-semibold text-blue-800 mb-1">💡 Metodología Auténtica:</h4>
          <p className="text-xs text-blue-700">
            La colocación aleatoria automática simula el proceso intuitivo 
            de las constelaciones familiares. Cada posición, dirección y 
            camino de vida revelados espontáneamente reflejan el inconsciente 
            familiar sistémico. Analiza las distancias, orientaciones y 
            agrupaciones para comprender las dinámicas relacionales.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}