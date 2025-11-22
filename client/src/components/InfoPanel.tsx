import { useState } from "react";
import { useTherapy } from "../lib/stores/useTherapyStore";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { 
  Trash2, Save, FolderOpen, BarChart3, Users, Settings, Download, Link2, FileText, Smile,
  Meh, Laugh, Frown, Angry, AlertTriangle, Users2, Heart, AlertCircle, Minus,
  Circle, CheckCircle2, Image as ImageIcon, Type, Undo2, Redo2
} from "lucide-react";
import { DollRelationship, RelationshipType } from "../lib/types";
import { IMAGE_CARD_URLS, WORD_CARD_DATA } from "../lib/ohCardsConstants";
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
    isInfoPanelOpen,
    toggleInfoPanel,
    placedDolls,
    selectedDollId,
    setSelectedDollId,
    updateDollLabel,
    updateDollNotes,
    updateDollEmotion,
    addDollRelationship,
    removeDollRelationship,
    updateDollOHCard,
    setDollNeedingOHCard,
    undo,
    redo,
    canUndo,
    canRedo,
  } = useTherapy();

  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [loadDialogOpen, setLoadDialogOpen] = useState(false);
  const [ohCardPreviewOpen, setOhCardPreviewOpen] = useState(false);
  const [previewMode, setPreviewMode] = useState<'image' | 'word' | 'both'>('both');
  const [previewImageUrl, setPreviewImageUrl] = useState<string | null>(null);
  const [previewWord, setPreviewWord] = useState<string | null>(null);
  const [configName, setConfigName] = useState("");
  const [relationshipDialogOpen, setRelationshipDialogOpen] = useState(false);
  const [selectedTargetId, setSelectedTargetId] = useState<string>("");
  const [selectedRelationshipType, setSelectedRelationshipType] = useState<RelationshipType>("family");

  const handleSave = () => {
    if (configName.trim()) {
      saveConfiguration(configName.trim());
      toast.success('Configuración guardada exitosamente', {
        description: `"${configName.trim()}" se ha guardado correctamente`,
        icon: '💾'
      });
      setConfigName("");
      setSaveDialogOpen(false);
    }
  };

  const handleLoad = (configId: string) => {
    loadConfiguration(configId);
    const config = savedConfigurations.find(c => c.id === configId);
    toast.success('Configuración cargada', {
      description: `"${config?.name}" se ha cargado correctamente`,
      icon: '📂'
    });
    setLoadDialogOpen(false);
  };
  
  const handleClearTable = () => {
    if (dollCount() === 0) {
      toast.info('La mesa ya está vacía', {
        duration: 2000
      });
      return;
    }
    clearTable();
    toast.success('Mesa limpiada', {
      description: 'Todos los muñecos han sido eliminados',
      icon: '🗑️'
    });
  };
  
  const handleDelete = (configId: string) => {
    const config = savedConfigurations.find(c => c.id === configId);
    deleteConfiguration(configId);
    toast.success('Configuración eliminada', {
      description: `"${config?.name}" ha sido eliminada`,
      icon: '🗑️'
    });
  };
  
  const handleUndo = () => {
    if (canUndo()) {
      undo();
      toast.success('Acción deshecha', {
        duration: 2000,
        icon: '↶'
      });
    }
  };
  
  const handleRedo = () => {
    if (canRedo()) {
      redo();
      toast.success('Acción rehecha', {
        duration: 2000,
        icon: '↷'
      });
    }
  };
  
  const handleExport = () => {
    if (onExportImage) {
      onExportImage();
      toast.success('Exportando imagen...', {
        description: 'La descarga comenzará en un momento',
        icon: '📸'
      });
    }
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
    <Card className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-md shadow-xl border border-blue-200/50 animate-in slide-in-from-bottom-4 duration-300 max-w-7xl mx-auto">
      <CardContent className="p-4">
        <div className="flex flex-col gap-4">
          {/* Primera fila: Estadísticas y acciones principales */}
          <div className="flex flex-wrap items-center justify-between gap-3">
            {/* Estadísticas */}
            <div className="flex items-center gap-3 bg-gradient-to-br from-blue-50 to-blue-100/50 px-4 py-2 rounded-lg border border-blue-200/50">
              <div className="p-2 bg-blue-500 rounded-lg flex-shrink-0">
                <Users className="w-4 h-4 text-white" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-semibold text-slate-800">
                    Muñecos:
                  </span>
                  <Badge variant="secondary" className="text-sm font-bold bg-blue-500 text-white">
                    {dollCount()}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-0.5 line-clamp-1">
                  {getAnalysis()}
                </p>
              </div>
            </div>

            {/* Estado y acciones */}
            <div className="flex items-center gap-3">
              {/* Estado */}
              <div className="hidden md:flex items-center gap-2 bg-gradient-to-br from-green-50 to-green-100/50 px-3 py-2 rounded-lg border border-green-200/50">
                <div className="p-1.5 bg-green-500 rounded">
                  <BarChart3 className="w-3 h-3 text-white" />
                </div>
                <div className="text-xs">
                  <div className="font-semibold text-slate-700">Configs: {savedConfigurations.length}</div>
                  <div className="text-slate-600 flex items-center gap-1">
                    {dollCount() > 0 ? (
                      <>
                        <CheckCircle2 className="w-2.5 h-2.5 text-green-600" />
                        <span>Activa</span>
                      </>
                    ) : (
                      <>
                        <Circle className="w-2.5 h-2.5 text-gray-400" />
                        <span>Preparando</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex items-center gap-2">
                {/* Botones Undo/Redo */}
                <div className="flex items-center gap-1 border-r border-slate-200 pr-2">
                  <Button
                    onClick={handleUndo}
                    disabled={!canUndo()}
                    size="sm"
                    variant="outline"
                    className="h-9 px-2 disabled:opacity-50"
                    title="Deshacer (Ctrl+Z)"
                  >
                    <Undo2 className="w-4 h-4" />
                  </Button>
                  <Button
                    onClick={handleRedo}
                    disabled={!canRedo()}
                    size="sm"
                    variant="outline"
                    className="h-9 px-2 disabled:opacity-50"
                    title="Rehacer (Ctrl+Y)"
                  >
                    <Redo2 className="w-4 h-4" />
                  </Button>
                </div>
                
                {onExportImage && (
                  <Button
                    onClick={handleExport}
                    size="sm"
                    className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white shadow-md hover:shadow-lg transition-all"
                    title="Exportar imagen de la dinámica sistémica"
                  >
                    <Download className="w-4 h-4 mr-1.5" />
                    <span className="hidden sm:inline">Exportar</span>
                  </Button>
                )}
                <Button
                  onClick={handleClearTable}
                  size="sm"
                  variant="outline"
                  className="text-red-600 border-red-300 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  <span className="hidden sm:inline">Limpiar</span>
                </Button>
                <Button
                  onClick={toggleInfoPanel}
                  className="h-9 w-9 p-0 bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700"
                  aria-label="Ocultar panel"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" /></svg>
                </Button>
              </div>
            </div>
          </div>

          {/* Segunda fila: Panel del muñeco seleccionado */}
          {selectedDollId && (() => {
            const selectedDoll = placedDolls.find(d => d.id === selectedDollId);
            if (!selectedDoll) return null;
            const otherDolls = placedDolls.filter(d => d.id !== selectedDollId);
            
            return (
              <div className="border-t border-purple-200 pt-4">
                <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 px-4 py-3 rounded-lg border border-purple-200/50">
                  <h3 className="text-sm font-bold text-purple-900 mb-3 flex items-center gap-2">
                    <Users className="w-4 h-4" />
                    Muñeco Seleccionado: {selectedDoll.label || selectedDoll.dollType.name}
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
                    {/* Nombre */}
                    <div>
                      <label className="block text-xs font-semibold text-purple-900 mb-1.5 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        Nombre
                      </label>
                      <input
                        type="text"
                        className="border border-purple-200 rounded-md px-3 py-1.5 text-sm w-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
                        value={selectedDoll.label || ""}
                        onChange={e => updateDollLabel(selectedDoll.id, e.target.value)}
                        placeholder="Ej: Papá, Mamá..."
                      />
                    </div>
                    
                    {/* Emoción/Estado */}
                    <div>
                      <label className="block text-xs font-semibold text-purple-900 mb-1.5 flex items-center gap-1.5">
                        <Smile className="w-3 h-3" />
                        Emoción
                      </label>
                      <Select
                        value={selectedDoll.emotion || "neutral"}
                        onValueChange={(value: 'neutral' | 'happy' | 'sad' | 'angry' | 'anxious') => 
                          updateDollEmotion(selectedDoll.id, value)
                        }
                      >
                        <SelectTrigger className="w-full h-9 text-sm">
                          <SelectValue>
                            {selectedDoll.emotion === 'happy' && <Laugh className="w-4 h-4" />}
                            {selectedDoll.emotion === 'sad' && <Frown className="w-4 h-4" />}
                            {selectedDoll.emotion === 'angry' && <Angry className="w-4 h-4" />}
                            {selectedDoll.emotion === 'anxious' && <AlertTriangle className="w-4 h-4" />}
                            {(!selectedDoll.emotion || selectedDoll.emotion === 'neutral') && <Meh className="w-4 h-4" />}
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="neutral" className="flex items-center gap-2">
                            <Meh className="w-4 h-4" />
                            <span>Neutral</span>
                          </SelectItem>
                          <SelectItem value="happy" className="flex items-center gap-2">
                            <Laugh className="w-4 h-4" />
                            <span>Feliz</span>
                          </SelectItem>
                          <SelectItem value="sad" className="flex items-center gap-2">
                            <Frown className="w-4 h-4" />
                            <span>Triste</span>
                          </SelectItem>
                          <SelectItem value="angry" className="flex items-center gap-2">
                            <Angry className="w-4 h-4" />
                            <span>Enojado</span>
                          </SelectItem>
                          <SelectItem value="anxious" className="flex items-center gap-2">
                            <AlertTriangle className="w-4 h-4" />
                            <span>Ansioso</span>
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    
                    {/* Notas */}
                    <div className="md:col-span-2">
                      <label className="block text-xs font-semibold text-purple-900 mb-1.5 flex items-center gap-1.5">
                        <FileText className="w-3 h-3" />
                        Notas
                      </label>
                      <Textarea
                        className="border border-purple-200 rounded-md px-3 py-2 text-xs w-full bg-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
                        rows={2}
                        value={selectedDoll.notes || ""}
                        onChange={e => updateDollNotes(selectedDoll.id, e.target.value)}
                        placeholder="Notas sobre este muñeco..."
                      />
                    </div>
                    
                    {/* OH Cards */}
                    <div className="md:col-span-2 lg:col-span-4 border-t border-purple-200 pt-3 mt-3">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                          <ImageIcon className="w-3 h-3" />
                          OH Cards Asignadas
                        </label>
                        {!selectedDoll.ohCardImage || !selectedDoll.ohCardWord ? (
                          <button
                            onClick={() => setDollNeedingOHCard(selectedDoll.id)}
                            className="text-xs px-2 py-1 bg-purple-100 hover:bg-purple-200 text-purple-700 rounded-md transition-colors"
                          >
                            Seleccionar OH Card
                          </button>
                        ) : (
                          <span className="text-xs text-gray-500 italic">Asignada (no modificable)</span>
                        )}
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                        {/* Imagen OH Card - Solo lectura si ya está asignada */}
                        <div>
                          <label className="block text-xs text-purple-700 mb-1.5">Imagen OH Card</label>
                          {selectedDoll.ohCardImage && selectedDoll.ohCardWord ? (
                            <div className="w-full h-9 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 flex items-center gap-2">
                              <img 
                                src={selectedDoll.ohCardImage} 
                                alt="OH Card" 
                                className="w-6 h-8 object-cover rounded"
                              />
                              <span>Asignada (no modificable)</span>
                            </div>
                          ) : (
                            <Select
                              value={selectedDoll.ohCardImage || "__none__"}
                              onValueChange={(value) => 
                                updateDollOHCard(selectedDoll.id, value === "__none__" ? undefined : value, selectedDoll.ohCardWord)
                              }
                            >
                            <SelectTrigger className="w-full h-9 text-sm">
                              <SelectValue placeholder="Sin imagen asignada">
                                {selectedDoll.ohCardImage ? (
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={selectedDoll.ohCardImage} 
                                      alt="OH Card" 
                                      className="w-6 h-8 object-cover rounded"
                                    />
                                    <span>Imagen asignada</span>
                                  </div>
                                ) : (
                                  "Sin imagen asignada"
                                )}
                              </SelectValue>
                            </SelectTrigger>
                            <SelectContent className="max-h-[300px]">
                              <SelectItem value="__none__">Sin imagen</SelectItem>
                              {IMAGE_CARD_URLS.map((url, idx) => (
                                <SelectItem key={idx} value={url}>
                                  <div className="flex items-center gap-2">
                                    <img 
                                      src={url} 
                                      alt={`OH Card ${idx + 1}`} 
                                      className="w-8 h-12 object-cover rounded"
                                    />
                                    <span>Imagen {idx + 1}</span>
                                  </div>
                                </SelectItem>
                              ))}
                            </SelectContent>
                            </Select>
                          )}
                        </div>
                        
                        {/* Palabra OH Card - Solo lectura si ya está asignada */}
                        <div>
                          <label className="block text-xs text-purple-700 mb-1.5">Palabra OH Card</label>
                          {selectedDoll.ohCardImage && selectedDoll.ohCardWord ? (
                            <div className="w-full h-9 px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-xs text-gray-600 flex items-center">
                              {selectedDoll.ohCardWord} (no modificable)
                            </div>
                          ) : (
                            <Select
                              value={selectedDoll.ohCardWord || "__none__"}
                              onValueChange={(value) => 
                                updateDollOHCard(selectedDoll.id, selectedDoll.ohCardImage, value === "__none__" ? undefined : value)
                              }
                            >
                              <SelectTrigger className="w-full h-9 text-sm">
                                <SelectValue placeholder="Sin palabra asignada">
                                  {selectedDoll.ohCardWord || "Sin palabra asignada"}
                                </SelectValue>
                              </SelectTrigger>
                              <SelectContent className="max-h-[300px]">
                                <SelectItem value="__none__">Sin palabra</SelectItem>
                                {WORD_CARD_DATA.map((word, idx) => (
                                  <SelectItem key={idx} value={word}>
                                    {word}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          )}
                        </div>
                        
                        {/* Vista previa del par asignado */}
                        {(selectedDoll.ohCardImage || selectedDoll.ohCardWord) && (
                          <div className="md:col-span-2 flex items-center gap-3 p-2 bg-purple-50 rounded-md border border-purple-200">
                            {selectedDoll.ohCardImage && (
                              <button
                                onClick={() => {
                                  setPreviewImageUrl(selectedDoll.ohCardImage!);
                                  setPreviewWord(selectedDoll.ohCardWord || null);
                                  setPreviewMode('image');
                                  setOhCardPreviewOpen(true);
                                }}
                                className="relative group cursor-pointer hover:scale-105 transition-transform"
                                title="Haz clic para ver imagen en grande"
                              >
                                <img 
                                  src={selectedDoll.ohCardImage} 
                                  alt="OH Card" 
                                  className="w-12 h-16 object-cover rounded border-2 border-purple-300 group-hover:border-purple-500 transition-colors"
                                />
                                <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 rounded transition-colors flex items-center justify-center">
                                  <ImageIcon className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity" />
                                </div>
                              </button>
                            )}
                            {selectedDoll.ohCardWord && (
                              <button
                                onClick={() => {
                                  setPreviewImageUrl(selectedDoll.ohCardImage || null);
                                  setPreviewWord(selectedDoll.ohCardWord || null);
                                  setPreviewMode('word');
                                  setOhCardPreviewOpen(true);
                                }}
                                className="flex-1 group cursor-pointer hover:bg-purple-100 rounded p-2 transition-colors"
                                title="Haz clic para ver palabra en grande"
                              >
                                <div className="text-xs text-purple-600 font-medium">Palabra:</div>
                                <div className="text-sm font-bold text-purple-900 group-hover:text-purple-700">{selectedDoll.ohCardWord}</div>
                              </button>
                            )}
                            {(selectedDoll.ohCardImage && selectedDoll.ohCardWord) && (
                              <button
                                onClick={() => {
                                  setPreviewImageUrl(selectedDoll.ohCardImage!);
                                  setPreviewWord(selectedDoll.ohCardWord!);
                                  setPreviewMode('both');
                                  setOhCardPreviewOpen(true);
                                }}
                                className="px-3 py-1.5 text-xs bg-purple-200 hover:bg-purple-300 text-purple-800 rounded-md transition-colors font-medium"
                                title="Ver imagen y palabra juntas"
                              >
                                Ver juntas
                              </button>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    
                    {/* Conexiones */}
                    <div className="md:col-span-2 lg:col-span-4">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs font-semibold text-purple-900 flex items-center gap-1.5">
                          <Link2 className="w-3 h-3" />
                          Conexiones
                        </label>
                        <Dialog open={relationshipDialogOpen} onOpenChange={setRelationshipDialogOpen}>
                          <DialogTrigger asChild>
                            <Button size="sm" variant="outline" className="h-7 text-xs px-2">
                              + Agregar
                            </Button>
                          </DialogTrigger>
                          <DialogContent>
                            <DialogHeader>
                              <DialogTitle>Agregar Conexión</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4">
                              <div>
                                <label className="text-sm font-medium mb-2 block">Conectar con:</label>
                                <Select value={selectedTargetId} onValueChange={setSelectedTargetId}>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Selecciona un muñeco" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    {otherDolls.map(doll => (
                                      <SelectItem key={doll.id} value={doll.id}>
                                        {doll.label || doll.dollType.name}
                                      </SelectItem>
                                    ))}
                                  </SelectContent>
                                </Select>
                              </div>
                              <div>
                                <label className="text-sm font-medium mb-2 block">Tipo de relación:</label>
                                <Select value={selectedRelationshipType} onValueChange={(value: RelationshipType) => setSelectedRelationshipType(value)}>
                                  <SelectTrigger>
                                    <SelectValue>
                                      {selectedRelationshipType === 'family' && (
                                        <div className="flex items-center gap-2">
                                          <Users2 className="w-4 h-4 text-blue-600" />
                                          <span>Familiar</span>
                                        </div>
                                      )}
                                      {selectedRelationshipType === 'strong' && (
                                        <div className="flex items-center gap-2">
                                          <Heart className="w-4 h-4 text-green-600" />
                                          <span>Conexión Fuerte</span>
                                        </div>
                                      )}
                                      {selectedRelationshipType === 'tension' && (
                                        <div className="flex items-center gap-2">
                                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                                          <span>Tensión</span>
                                        </div>
                                      )}
                                      {selectedRelationshipType === 'conflict' && (
                                        <div className="flex items-center gap-2">
                                          <AlertCircle className="w-4 h-4 text-red-600" />
                                          <span>Conflicto</span>
                                        </div>
                                      )}
                                      {selectedRelationshipType === 'distant' && (
                                        <div className="flex items-center gap-2">
                                          <Minus className="w-4 h-4 text-gray-600" />
                                          <span>Distante</span>
                                        </div>
                                      )}
                                    </SelectValue>
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="family" className="flex items-center gap-2">
                                      <Users2 className="w-4 h-4 text-blue-600" />
                                      <span>Familiar</span>
                                    </SelectItem>
                                    <SelectItem value="strong" className="flex items-center gap-2">
                                      <Heart className="w-4 h-4 text-green-600" />
                                      <span>Conexión Fuerte</span>
                                    </SelectItem>
                                    <SelectItem value="tension" className="flex items-center gap-2">
                                      <AlertTriangle className="w-4 h-4 text-amber-600" />
                                      <span>Tensión</span>
                                    </SelectItem>
                                    <SelectItem value="conflict" className="flex items-center gap-2">
                                      <AlertCircle className="w-4 h-4 text-red-600" />
                                      <span>Conflicto</span>
                                    </SelectItem>
                                    <SelectItem value="distant" className="flex items-center gap-2">
                                      <Minus className="w-4 h-4 text-gray-600" />
                                      <span>Distante</span>
                                    </SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                              <Button
                                onClick={() => {
                                  if (selectedTargetId) {
                                    addDollRelationship(selectedDoll.id, {
                                      targetId: selectedTargetId,
                                      type: selectedRelationshipType,
                                    });
                                    setSelectedTargetId("");
                                    setRelationshipDialogOpen(false);
                                  }
                                }}
                                className="w-full"
                              >
                                Agregar Conexión
                              </Button>
                            </div>
                          </DialogContent>
                        </Dialog>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {selectedDoll.relationships && selectedDoll.relationships.length > 0 ? (
                          selectedDoll.relationships.map((rel) => {
                            const targetDoll = placedDolls.find(d => d.id === rel.targetId);
                            if (!targetDoll) return null;
                            const relColors = {
                              family: "bg-blue-100 text-blue-700 border-blue-300",
                              strong: "bg-green-100 text-green-700 border-green-300",
                              tension: "bg-amber-100 text-amber-700 border-amber-300",
                              conflict: "bg-red-100 text-red-700 border-red-300",
                              distant: "bg-gray-100 text-gray-700 border-gray-300",
                            };
                            return (
                              <div key={rel.targetId} className={`flex items-center gap-1.5 px-2 py-1 rounded border text-xs ${relColors[rel.type]}`}>
                                <span>{targetDoll.label || targetDoll.dollType.name}</span>
                                <button
                                  onClick={() => removeDollRelationship(selectedDoll.id, rel.targetId)}
                                  className="hover:bg-black/10 rounded px-1"
                                  aria-label="Eliminar conexión"
                                >
                                  ×
                                </button>
                              </div>
                            );
                          })
                        ) : (
                          <p className="text-xs text-slate-500 italic">Sin conexiones</p>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })()}
        </div>
      </CardContent>

      {/* Modal para ver OH Card en grande */}
      <Dialog open={ohCardPreviewOpen} onOpenChange={setOhCardPreviewOpen}>
        <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden flex flex-col p-0">
          <DialogHeader className="px-6 pt-6 pb-4 flex-shrink-0 border-b">
            <div className="flex items-center justify-between">
              <DialogTitle className="text-xl">Vista ampliada de OH Card</DialogTitle>
              <div className="flex gap-2">
                {previewImageUrl && (
                  <Button
                    variant={previewMode === 'image' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('image')}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    Imagen
                  </Button>
                )}
                {previewWord && (
                  <Button
                    variant={previewMode === 'word' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('word')}
                  >
                    <Type className="w-4 h-4 mr-1" />
                    Palabra
                  </Button>
                )}
                {previewImageUrl && previewWord && (
                  <Button
                    variant={previewMode === 'both' ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPreviewMode('both')}
                  >
                    <ImageIcon className="w-4 h-4 mr-1" />
                    <Type className="w-4 h-4 mr-1" />
                    Juntas
                  </Button>
                )}
              </div>
            </div>
          </DialogHeader>
          <div className="flex-1 overflow-auto px-6 pb-6 flex items-center justify-center bg-gradient-to-br from-gray-50 to-purple-50">
            {previewMode === 'image' && previewImageUrl && (
              <div className="w-full flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] bg-white rounded-2xl shadow-2xl overflow-hidden">
                  <img 
                    src={previewImageUrl} 
                    alt="OH Card ampliada" 
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
            )}
            {previewMode === 'word' && previewWord && (
              <div className="w-full flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center bg-white rounded-2xl shadow-2xl">
                  {/* Palabra en los cuatro lados */}
                  <span className="absolute top-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                    {previewWord}
                  </span>
                  <span className="absolute bottom-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                    {previewWord}
                  </span>
                  <span className="absolute left-[3.5%] top-1/2 -translate-y-1/2 -rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                    {previewWord}
                  </span>
                  <span className="absolute right-[3.5%] top-1/2 -translate-y-1/2 rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                    {previewWord}
                  </span>
                  {/* Marco rojo delgado - siempre presente cuando hay palabra */}
                  <div 
                    className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-lg bg-white"
                    style={{ border: '2.5px solid #D32F2F' }}
                  ></div>
                </div>
              </div>
            )}
            {previewMode === 'both' && previewImageUrl && previewWord && (
              <div className="w-full flex items-center justify-center">
                <div className="relative w-full max-w-md aspect-[3/4] flex items-center justify-center bg-white rounded-2xl shadow-2xl">
                  {/* Palabra en los cuatro lados */}
                  <span className="absolute top-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                    {previewWord}
                  </span>
                  <span className="absolute bottom-[3.5%] left-1/2 -translate-x-1/2 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider">
                    {previewWord}
                  </span>
                  <span className="absolute left-[3.5%] top-1/2 -translate-y-1/2 -rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                    {previewWord}
                  </span>
                  <span className="absolute right-[3.5%] top-1/2 -translate-y-1/2 rotate-90 text-[#402E32] font-bold text-base md:text-lg lg:text-xl tracking-wider whitespace-nowrap">
                    {previewWord}
                  </span>
                  {/* Marco rojo delgado con la imagen */}
                  <div 
                    className="absolute top-[10%] left-[10%] w-[80%] h-[80%] rounded-lg bg-white flex items-center justify-center overflow-hidden"
                    style={{ border: '2.5px solid #D32F2F' }}
                  >
                    <img 
                      src={previewImageUrl} 
                      alt="OH Card" 
                      className="w-[98%] h-[98%] object-contain rounded-md"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
}
