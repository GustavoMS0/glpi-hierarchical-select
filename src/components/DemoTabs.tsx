import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategorySelector } from "./CategorySelector";
import { PluginConfig } from "./PluginConfig";
import { TicketForm } from "./TicketForm";
import { Layers, Settings, Ticket } from "lucide-react";

export const DemoTabs = () => {
  return (
    <div className="w-full max-w-6xl mx-auto p-6">
      <Tabs defaultValue="selector" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-8">
          <TabsTrigger value="selector" className="flex items-center gap-2">
            <Layers className="h-4 w-4" />
            Seletor de Categorias
          </TabsTrigger>
          <TabsTrigger value="ticket" className="flex items-center gap-2">
            <Ticket className="h-4 w-4" />
            Formulário de Chamado
          </TabsTrigger>
          <TabsTrigger value="config" className="flex items-center gap-2">
            <Settings className="h-4 w-4" />
            Configuração do Plugin
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="selector" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Demonstração do Seletor</h2>
            <p className="text-muted-foreground">
              Interface principal do plugin para seleção hierárquica de categorias
            </p>
          </div>
          <CategorySelector />
        </TabsContent>
        
        <TabsContent value="ticket" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Integração com Chamados</h2>
            <p className="text-muted-foreground">
              Como o plugin se integra ao formulário de criação de chamados do GLPI
            </p>
          </div>
          <TicketForm />
        </TabsContent>
        
        <TabsContent value="config" className="space-y-6">
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-2xl font-bold text-foreground">Painel Administrativo</h2>
            <p className="text-muted-foreground">
              Configurações e personalização do comportamento do plugin
            </p>
          </div>
          <PluginConfig />
        </TabsContent>
      </Tabs>
    </div>
  );
};