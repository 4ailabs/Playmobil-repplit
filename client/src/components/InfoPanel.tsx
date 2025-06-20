import { useState } from "react";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Trash2, Save, FolderOpen, BarChart3, Users, Settings } from "lucide-react";

export default function InfoPanel() {
  const {
    dollCount,
    getAnalysis,
    clearTable,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    savedConfigurations,
    isInfoPanelOpen,
    toggleInfoPanel,
    placedDolls,
    selectedDollId,
    setSelectedDollId,
    updateDollLabel,
  } = useTherapy();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [configName, setConfigName] = useState("");

  const handleSave = () => {
    if (configName.trim()) {
      saveConfiguration(configName.trim());
      setConfigName("");
      setSaveDialogOpen(false);
    }
  };

  const handleLoad = (configId: string) => {
    loadConfiguration(configId);
    setLoadDialogOpen(false);
  };

  if (!isInfoPanelOpen) {
    return (
      <div className="fixed bottom-4 right-4">
        <Button
          onClick={toggleInfoPanel}
          size="sm"
          className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Panel de Control
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg border border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Analysis Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-blue-600" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    Muñecos en mesa:
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    {dollCount()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {getAnalysis()}
                </p>
                {selectedDollId && (() => {
                  const selectedDoll = placedDolls.find(d => d.id === selectedDollId);
                  if (!selectedDoll) return null;
                  return (
                    <div className="mt-3">
                      <label className="block text-xs font-medium text-slate-700 mb-1">Nombre del muñeco seleccionado:</label>
                      <input
                        type="text"
                        className="border rounded px-2 py-1 text-sm w-full"
                        value={selectedDoll.label || ""}
                        onChange={e => updateDollLabel(selectedDoll.id, e.target.value)}
                        placeholder="(Opcional) Escribe un nombre o etiqueta"
                      />
                    </div>
                  );
                })()}
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300" />

            {/* Quick Stats */}
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-green-600" />
              <div className="text-xs text-slate-600">
                <div>Configuraciones: {savedConfigurations.length}</div>
                <div>Estado: {dollCount() > 0 ? 'Activa' : 'Preparando'}</div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={clearTable}
              size="sm"
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Limpiar Mesa
            </Button>
            <Button
              onClick={toggleInfoPanel}
              className="h-8 w-auto px-3 py-1 bg-red-100 border border-red-300 text-red-700 font-semibold rounded hover:bg-red-200 transition-all text-xs"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="inline w-4 h-4 mr-1 align-middle" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg> Ocultar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
