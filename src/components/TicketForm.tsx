import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CategorySelector } from "./CategorySelector";
import { Separator } from "@/components/ui/separator";
import { CalendarDays, User, AlertCircle, Send } from "lucide-react";
import { toast } from "sonner";

interface TicketData {
  title: string;
  description: string;
  priority: string;
  type: string;
  requester: string;
}

export const TicketForm = () => {
  const [ticketData, setTicketData] = useState<TicketData>({
    title: "",
    description: "",
    priority: "medium",
    type: "incident",
    requester: "user@empresa.com",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success("Chamado criado com sucesso! ID: #TKT-2024-001234");
  };

  const priorityColors = {
    low: "bg-glpi-success",
    medium: "bg-glpi-warning",
    high: "bg-glpi-danger",
    urgent: "bg-red-600"
  };

  return (
    <div className="space-y-6">
      {/* Main Ticket Form */}
      <Card className="shadow-[var(--shadow-card)]">
        <CardHeader className="bg-gradient-to-r from-glpi-primary to-blue-600 text-white rounded-t-lg">
          <div className="flex items-center gap-3">
            <AlertCircle className="h-6 w-6" />
            <div>
              <CardTitle className="text-xl">Criar Novo Chamado</CardTitle>
              <CardDescription className="text-blue-100">
                GLPI Service Desk - Formulário Integrado
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Information */}
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="type" className="text-sm font-medium">
                  Tipo de Chamado
                </Label>
                <Select
                  value={ticketData.type}
                  onValueChange={(value) => setTicketData(prev => ({ ...prev, type: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="incident">Incidente</SelectItem>
                    <SelectItem value="request">Requisição</SelectItem>
                    <SelectItem value="change">Mudança</SelectItem>
                    <SelectItem value="problem">Problema</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="priority" className="text-sm font-medium">
                  Prioridade
                </Label>
                <Select
                  value={ticketData.priority}
                  onValueChange={(value) => setTicketData(prev => ({ ...prev, priority: value }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Baixa</SelectItem>
                    <SelectItem value="medium">Média</SelectItem>
                    <SelectItem value="high">Alta</SelectItem>
                    <SelectItem value="urgent">Urgente</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="title" className="text-sm font-medium">
                Título do Chamado
              </Label>
              <Input
                id="title"
                placeholder="Descreva brevemente o problema ou solicitação"
                value={ticketData.title}
                onChange={(e) => setTicketData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium">
                Descrição Detalhada
              </Label>
              <Textarea
                id="description"
                placeholder="Forneça uma descrição detalhada do problema, incluindo passos para reproduzir, mensagens de erro, etc."
                value={ticketData.description}
                onChange={(e) => setTicketData(prev => ({ ...prev, description: e.target.value }))}
                className="min-h-[120px] resize-none"
              />
            </div>

            {/* Status Display */}
            <div className="flex items-center gap-4 p-4 bg-muted/50 rounded-lg">
              <div className="flex items-center gap-2">
                <User className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Solicitante:</span>
                <Badge variant="outline">{ticketData.requester}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
                <span className="text-sm text-muted-foreground">Data:</span>
                <Badge variant="outline">{new Date().toLocaleDateString('pt-BR')}</Badge>
              </div>
              
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Prioridade:</span>
                <Badge className={`${priorityColors[ticketData.priority as keyof typeof priorityColors]} text-white`}>
                  {ticketData.priority === 'low' && 'Baixa'}
                  {ticketData.priority === 'medium' && 'Média'}
                  {ticketData.priority === 'high' && 'Alta'}
                  {ticketData.priority === 'urgent' && 'Urgente'}
                </Badge>
              </div>
            </div>

            <Separator />

            {/* Category Selection Section - Main Feature */}
            <div className="space-y-4">
              <div>
                <h3 className="text-lg font-semibold mb-2">Seleção de Categoria</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Utilize o seletor hierárquico abaixo para classificar seu chamado de forma precisa
                </p>
              </div>
              
              {/* Embedded Category Selector */}
              <div className="border-2 border-dashed border-glpi-primary/30 rounded-lg p-1">
                <CategorySelector />
              </div>
            </div>

            {/* Submit Actions */}
            <div className="flex gap-3 pt-6 border-t">
              <Button 
                type="submit"
                className="bg-glpi-primary hover:bg-glpi-primary/90 flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                Criar Chamado
              </Button>
              
              <Button 
                type="button"
                variant="outline"
                onClick={() => {
                  setTicketData({
                    title: "",
                    description: "",
                    priority: "medium",
                    type: "incident",
                    requester: "user@empresa.com",
                  });
                  toast.info("Formulário limpo");
                }}
              >
                Limpar Formulário
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Integration Note */}
      <Card className="border-glpi-primary/20 bg-gradient-to-r from-glpi-secondary/30 to-blue-50/30">
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-glpi-primary mt-0.5" />
            <div className="space-y-2">
              <h4 className="font-medium text-glpi-primary">Integração com GLPI</h4>
              <p className="text-sm text-muted-foreground">
                O plugin "Categoria Hierárquica Avançada" substitui o campo padrão de categoria do GLPI por esta interface hierárquica. 
                A categoria selecionada é automaticamente salva na tabela <code className="bg-muted px-1 rounded">glpi_itilcategories</code> 
                e vinculada ao chamado criado.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};