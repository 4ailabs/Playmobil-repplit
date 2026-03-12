import { useState } from "react";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Button } from "./ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import {
  Trash2, Save, FolderOpen, Users, Download, Undo2, Redo2
} from "lucide-react";
import { toast } from "sonner";

interface InfoPanelProps {
  onExportImage?: () => void;
}

export default function InfoPanel({ onExportImage }: InfoPanelProps) {
  const {
    dollCount,
    getAnalysis,
    clearTable,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    savedConfigurations,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTherapy();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [configName, setConfigName] = useState("");

  const handleSave = () => {
    if (configName.trim()) {
      saveConfiguration(configName.trim());
      toast.success('Configuración guardada', {
        description: `"${configName.trim()}"`,
      });
      setConfigName("");
      setSaveDialogOpen(false);
    }
  };

  const handleLoad = (configId: string) => {
    loadConfiguration(configId);
    const config = savedConfigurations.find(c => c.id === configId);
    toast.success('Configuración cargada', {
      description: `"${config?.name}"`,
    });
    setLoadDialogOpen(false);
  };

  const handleDelete = (configId: string) => {
    const config = savedConfigurations.find(c => c.id === configId);
    deleteConfiguration(configId);
    toast.success('Eliminada', {
      description: `"${config?.name}"`,
    });
  };

  const handleClearTable = () => {
    if (dollCount() === 0) {
      toast.info('La mesa ya está vacía', { duration: 2000 });
      return;
    }
    clearTable();
    toast.success('Mesa limpiada');
  };

  const handleUndo = () => {
    if (canUndo()) { undo(); }
  };

  const handleRedo = () => {
    if (canRedo()) { redo(); }
  };

  const handleExport = () => {
    if (onExportImage) {
      onExportImage();
      toast.success('Exportando imagen...');
    }
  };

  return (
    <div className="chrome-panel border-t border-chrome-border px-4 py-2 flex-shrink-0 z-30">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto">
        {/* Left: Stats */}
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="flex items-center gap-1.5">
            <Users className="w-3.5 h-3.5 text-chrome-accent" />
            <span className="text-sm font-semibold text-chrome-text tabular-nums">
              {dollCount()}
            </span>
          </div>
          <p className="hidden md:block text-[11px] text-chrome-text-muted truncate max-w-[200px]">
            {getAnalysis()}
          </p>
        </div>

        {/* Center: Primary actions */}
        <div className="flex items-center gap-0.5">
          {/* Undo/Redo */}
          <Button
            onClick={handleUndo}
            disabled={!canUndo()}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover disabled:opacity-20"
            title="Deshacer (Ctrl+Z)"
          >
            <Undo2 className="w-3.5 h-3.5" />
          </Button>
          <Button
            onClick={handleRedo}
            disabled={!canRedo()}
            size="sm"
            variant="ghost"
            className="h-8 w-8 p-0 text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover disabled:opacity-20"
            title="Rehacer (Ctrl+Y)"
          >
            <Redo2 className="w-3.5 h-3.5" />
          </Button>

          <div className="w-px h-4 bg-chrome-border mx-1.5" />

          {/* Save */}
          <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover text-xs gap-1"
              >
                <Save className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Guardar</span>
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle className="font-display text-lg">Guardar Configuración</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <Input
                  value={configName}
                  onChange={(e) => setConfigName(e.target.value)}
                  placeholder="Nombre de la sesión..."
                  onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                />
                <Button onClick={handleSave} className="w-full bg-terracotta-600 hover:bg-terracotta-700 text-white">
                  Guardar
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Load */}
          <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                variant="ghost"
                className="h-8 text-chrome-text-muted hover:text-chrome-text hover:bg-chrome-hover text-xs gap-1"
              >
                <FolderOpen className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Cargar</span>
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="font-display text-lg">Cargar Configuración</DialogTitle>
              </DialogHeader>
              <div className="space-y-2 max-h-[60vh] overflow-y-auto">
                {savedConfigurations.length === 0 ? (
                  <p className="text-sm text-warm-400 text-center py-8 italic">
                    No hay configuraciones guardadas
                  </p>
                ) : (
                  savedConfigurations.map((config) => (
                    <div
                      key={config.id}
                      className="flex items-center justify-between p-3 rounded-lg border border-warm-200/60 hover:bg-warm-50 transition-colors group"
                    >
                      <button
                        onClick={() => handleLoad(config.id)}
                        className="flex-1 text-left min-w-0"
                      >
                        <p className="text-sm font-medium text-warm-700 truncate">{config.name}</p>
                        <p className="text-[11px] text-warm-400">
                          {new Date(config.timestamp).toLocaleDateString('es-ES', { day: 'numeric', month: 'short', year: 'numeric' })}
                        </p>
                      </button>
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(config.id); }}
                        className="p-1.5 rounded-md text-warm-300 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
                        aria-label="Eliminar"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ))
                )}
              </div>
            </DialogContent>
          </Dialog>

          <div className="w-px h-4 bg-chrome-border mx-1.5" />

          {/* Export */}
          {onExportImage && (
            <Button
              onClick={handleExport}
              size="sm"
              className="h-7 bg-chrome-accent hover:bg-chrome-accent-hover text-chrome-bg text-xs rounded gap-1 shadow-sm font-semibold"
            >
              <Download className="w-3 h-3" />
              <span className="hidden sm:inline">Exportar</span>
            </Button>
          )}
        </div>

        {/* Right: Clear */}
        <Button
          onClick={handleClearTable}
          size="sm"
          variant="ghost"
          className="h-8 text-red-400/70 hover:text-red-400 hover:bg-red-500/10 text-xs gap-1"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Limpiar</span>
        </Button>
      </div>
    </div>
  );
}
