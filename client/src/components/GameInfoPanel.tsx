import { useState } from "react";
import { useGame } from "../lib/stores/useTherapy";
import { Card, CardContent } from "./ui/card";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "./ui/dialog";
import { Input } from "./ui/input";
import { Trash2, Save, FolderOpen, BarChart3, Users, Settings, Lightbulb } from "lucide-react";

export default function GameInfoPanel() {
  const {
    buildingCount,
    getAnalysis,
    getHint,
    clearSettlement,
    saveConfiguration,
    loadConfiguration,
    deleteConfiguration,
    savedConfigurations,
    isInfoPanelOpen,
    toggleInfoPanel,
    showHints,
    toggleHints,
    resources,
    population,
    sustainabilityScore
  } = useGame();

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
          className="bg-green-600 hover:bg-green-700 text-white shadow-lg"
        >
          <Settings className="w-4 h-4 mr-2" />
          Game Panel
        </Button>
      </div>
    );
  }

  return (
    <Card className="fixed bottom-4 left-4 right-4 bg-white/95 backdrop-blur-sm shadow-lg border border-green-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          {/* Analysis Section */}
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-slate-800">
                    Buildings:
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    {buildingCount()}
                  </Badge>
                  <span className="text-sm font-medium text-slate-800">
                    Pop:
                  </span>
                  <Badge variant="secondary" className="text-sm">
                    {population}
                  </Badge>
                </div>
                <p className="text-xs text-slate-600 mt-1">
                  {getAnalysis()}
                </p>
              </div>
            </div>

            <div className="h-8 w-px bg-slate-300" />

            {/* Resources */}
            <div className="flex items-center gap-2">
              <BarChart3 className="w-4 h-4 text-blue-600" />
              <div className="text-xs text-slate-600">
                <div className="flex gap-3">
                  {Object.entries(resources).slice(0, 3).map(([resource, amount]) => (
                    <span key={resource} className="capitalize">
                      {resource}: {amount}
                    </span>
                  ))}
                </div>
                <div className="flex items-center gap-2 mt-1">
                  <span>Sustainability:</span>
                  <Badge 
                    variant={sustainabilityScore > 70 ? "default" : sustainabilityScore > 40 ? "secondary" : "destructive"}
                    className="text-xs"
                  >
                    {sustainabilityScore}%
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          {/* Hints Section */}
          {showHints && (
            <>
              <div className="h-8 w-px bg-slate-300" />
              <div className="flex items-center gap-2 max-w-md">
                <Lightbulb className="w-4 h-4 text-yellow-600 flex-shrink-0" />
                <p className="text-xs text-slate-600 leading-relaxed">
                  {getHint()}
                </p>
              </div>
            </>
          )}

          {/* Action Buttons */}
          <div className="flex items-center gap-2">
            <Button
              onClick={toggleHints}
              size="sm"
              variant="outline"
              className={showHints ? "text-yellow-600 hover:bg-yellow-50" : "text-slate-600"}
            >
              <Lightbulb className="w-4 h-4 mr-1" />
              {showHints ? "Hide Hints" : "Show Hints"}
            </Button>

            <Button
              onClick={clearSettlement}
              size="sm"
              variant="outline"
              className="text-red-600 hover:bg-red-50 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Clear
            </Button>

            <Dialog open={saveDialogOpen} onOpenChange={setSaveDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-blue-600 hover:bg-blue-50">
                  <Save className="w-4 h-4 mr-1" />
                  Save
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Save Settlement Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-4">
                  <Input
                    placeholder="Settlement name..."
                    value={configName}
                    onChange={(e) => setConfigName(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleSave()}
                  />
                  <div className="flex gap-2">
                    <Button onClick={handleSave} disabled={!configName.trim()}>
                      Save Settlement
                    </Button>
                    <Button variant="outline" onClick={() => setSaveDialogOpen(false)}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </DialogContent>
            </Dialog>

            <Dialog open={loadDialogOpen} onOpenChange={setLoadDialogOpen}>
              <DialogTrigger asChild>
                <Button size="sm" variant="outline" className="text-green-600 hover:bg-green-50">
                  <FolderOpen className="w-4 h-4 mr-1" />
                  Load
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Load Settlement Configuration</DialogTitle>
                </DialogHeader>
                <div className="space-y-3">
                  {savedConfigurations.length === 0 ? (
                    <p className="text-sm text-slate-500 text-center py-4">
                      No saved settlements found
                    </p>
                  ) : (
                    savedConfigurations.map((config) => (
                      <div key={config.id} className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <p className="text-sm font-medium">{config.name}</p>
                          <p className="text-xs text-slate-500">
                            {config.buildings.length} buildings • {config.population} population • {new Date(config.timestamp).toLocaleString()}
                          </p>
                          <div className="flex gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              Sustainability: {config.sustainabilityScore}%
                            </Badge>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button
                            size="sm"
                            onClick={() => handleLoad(config.id)}
                          >
                            Load
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