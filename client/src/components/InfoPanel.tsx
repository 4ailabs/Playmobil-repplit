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
    toggleInfoPanel
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

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                  <Save className="w-4 h-4 mr-1" />
                  Guardar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Guardar Configuración</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Nombre de la configuración..."
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={!configName.trim()}>
                      Guardar
                    </Button>
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancelar
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                  <FolderOpen className="w-4 h-4 mr-1" />
                  Cargar
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cargar Configuración</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {savedConfigurations.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No hay configuraciones guardadas
                    </p>
                  ) : (
                    savedConfigurations.map((config) => (
                      <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{config.name}</p>
                          <p className="text-xs text-slate-500">
                            {config.dolls.length} muñecos • {new Date(config.timestamp).toLocaleString()}
                          </p>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleLoad(config.id)}
                          >
                            Cargar
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => deleteConfiguration(config.id)}
                            className="text-red-600 hover:bg-red-50"
                          >
                            <Trash2 className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </DialogContent>
            </Dialog>

            <Button
              onClick={toggleInfoPanel}
              size="sm"
              variant="ghost"
              className="text-slate-500 hover:text-slate-700"
            >
              ✕
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
