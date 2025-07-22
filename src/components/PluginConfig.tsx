import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Settings, Save, Download, Upload, Ticket } from "lucide-react";
import { toast } from "sonner";

interface PluginSettings {
  maxLevels: number;
  enabledTicketTypes: string[];
  useSelect2: boolean;
  enableSearch: boolean;
  enableMultilingual: boolean;
}

const ticketTypes = [
  { id: "incident", name: "Incidente", description: "Problemas técnicos e falhas" },
  { id: "request", name: "Requisição", description: "Solicitações de serviços" },
  { id: "change", name: "Mudança", description: "Alterações no ambiente" },
  { id: "problem", name: "Problema", description: "Causa raiz de incidentes" },
];

export const PluginConfig = () => {
  const [settings, setSettings] = useState<PluginSettings>({
    maxLevels: 4,
    enabledTicketTypes: ["incident", "request"],
    useSelect2: true,
    enableSearch: true,
    enableMultilingual: true,
  });

  const handleTicketTypeToggle = (typeId: string) => {
    setSettings(prev => ({
      ...prev,
      enabledTicketTypes: prev.enabledTicketTypes.includes(typeId)
        ? prev.enabledTicketTypes.filter(id => id !== typeId)
        : [...prev.enabledTicketTypes, typeId]
    }));
  };

  const handleSaveSettings = () => {
    toast.success("Configurações salvas com sucesso!");
  };

  const handleExportConfig = () => {
    const config = JSON.stringify(settings, null, 2);
    const blob = new Blob([config], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'glpi-hierarchical-categories-config.json';
    a.click();
    toast.success("Configuração exportada!");
  };

  const handleImportConfig = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const config = JSON.parse(e.target?.result as string);
            setSettings(config);
            toast.success("Configuração importada!");
          } catch {
            toast.error("Erro ao importar configuração!");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow-card)]">
      <CardHeader className="bg-gradient-to-r from-glpi-primary to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Settings className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Configuração do Plugin</CardTitle>
            <CardDescription className="text-blue-100">
              Categoria Hierárquica Avançada - Painel Administrativo
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-8">
        {/* General Settings */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Settings className="h-5 w-5 text-glpi-primary" />
            Configurações Gerais
          </h3>
          
          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-3">
              <Label htmlFor="maxLevels" className="text-sm font-medium">
                Máximo de Níveis Hierárquicos
              </Label>
              <select
                id="maxLevels"
                value={settings.maxLevels}
                onChange={(e) => setSettings(prev => ({ ...prev, maxLevels: parseInt(e.target.value) }))}
                className="w-full p-2 border border-input rounded-md bg-background"
              >
                <option value="3">3 Níveis</option>
                <option value="4">4 Níveis</option>
                <option value="5">5 Níveis</option>
                <option value="6">6 Níveis</option>
              </select>
            </div>

            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <Label htmlFor="useSelect2" className="text-sm font-medium">
                  Usar Select2 (Busca Avançada)
                </Label>
                <Switch
                  id="useSelect2"
                  checked={settings.useSelect2}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, useSelect2: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enableSearch" className="text-sm font-medium">
                  Habilitar Busca em Tempo Real
                </Label>
                <Switch
                  id="enableSearch"
                  checked={settings.enableSearch}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableSearch: checked }))}
                />
              </div>
              
              <div className="flex items-center justify-between">
                <Label htmlFor="enableMultilingual" className="text-sm font-medium">
                  Suporte Multilíngue
                </Label>
                <Switch
                  id="enableMultilingual"
                  checked={settings.enableMultilingual}
                  onCheckedChange={(checked) => setSettings(prev => ({ ...prev, enableMultilingual: checked }))}
                />
              </div>
            </div>
          </div>
        </div>

        <Separator />

        {/* Ticket Types Configuration */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Ticket className="h-5 w-5 text-glpi-primary" />
            Tipos de Chamados Habilitados
          </h3>
          
          <div className="grid gap-4 md:grid-cols-2">
            {ticketTypes.map((type) => (
              <div
                key={type.id}
                className="flex items-center justify-between p-4 border rounded-lg bg-card hover:bg-accent/50 transition-colors"
              >
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <Label htmlFor={type.id} className="font-medium cursor-pointer">
                      {type.name}
                    </Label>
                    {settings.enabledTicketTypes.includes(type.id) && (
                      <Badge variant="default" className="bg-glpi-success text-white text-xs">
                        Ativo
                      </Badge>
                    )}
                  </div>
                  <p className="text-xs text-muted-foreground">{type.description}</p>
                </div>
                <Switch
                  id={type.id}
                  checked={settings.enabledTicketTypes.includes(type.id)}
                  onCheckedChange={() => handleTicketTypeToggle(type.id)}
                />
              </div>
            ))}
          </div>
        </div>

        <Separator />

        {/* Status Summary */}
        <div className="bg-gradient-to-r from-glpi-secondary to-blue-50 p-4 rounded-lg border border-glpi-primary/20">
          <h4 className="font-medium text-glpi-primary mb-3">Status da Configuração</h4>
          <div className="grid gap-2 text-sm">
            <div className="flex justify-between">
              <span>Níveis configurados:</span>
              <Badge variant="outline">{settings.maxLevels}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Tipos de chamado ativos:</span>
              <Badge variant="outline">{settings.enabledTicketTypes.length}</Badge>
            </div>
            <div className="flex justify-between">
              <span>Funcionalidades ativas:</span>
              <div className="flex gap-1">
                {settings.useSelect2 && <Badge className="bg-glpi-success text-white text-xs">Select2</Badge>}
                {settings.enableSearch && <Badge className="bg-glpi-success text-white text-xs">Busca</Badge>}
                {settings.enableMultilingual && <Badge className="bg-glpi-success text-white text-xs">Multilíngue</Badge>}
              </div>
            </div>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap gap-3 pt-4 border-t">
          <Button onClick={handleSaveSettings} className="bg-glpi-success hover:bg-glpi-success/90">
            <Save className="h-4 w-4 mr-2" />
            Salvar Configurações
          </Button>
          
          <Button onClick={handleExportConfig} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Exportar Config
          </Button>
          
          <Button onClick={handleImportConfig} variant="outline">
            <Upload className="h-4 w-4 mr-2" />
            Importar Config
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};