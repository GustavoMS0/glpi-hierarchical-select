import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ChevronRight, RotateCcw, Layers } from "lucide-react";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  parentId?: string;
}

const mockCategories: Category[] = [
  // Level 1 - Main Categories
  { id: "1", name: "Hardware" },
  { id: "2", name: "Software" },
  { id: "3", name: "Rede" },
  { id: "4", name: "Segurança" },
  
  // Level 2 - Subcategories
  { id: "11", name: "Computadores", parentId: "1" },
  { id: "12", name: "Periféricos", parentId: "1" },
  { id: "13", name: "Servidores", parentId: "1" },
  
  { id: "21", name: "Sistema Operacional", parentId: "2" },
  { id: "22", name: "Aplicativos", parentId: "2" },
  { id: "23", name: "Licenças", parentId: "2" },
  
  { id: "31", name: "Conectividade", parentId: "3" },
  { id: "32", name: "Wi-Fi", parentId: "3" },
  { id: "33", name: "Infraestrutura", parentId: "3" },
  
  // Level 3 - Items
  { id: "111", name: "Desktop", parentId: "11" },
  { id: "112", name: "Notebook", parentId: "11" },
  { id: "113", name: "Workstation", parentId: "11" },
  
  { id: "121", name: "Impressoras", parentId: "12" },
  { id: "122", name: "Monitores", parentId: "12" },
  { id: "123", name: "Teclado/Mouse", parentId: "12" },
  
  { id: "211", name: "Windows", parentId: "21" },
  { id: "212", name: "Linux", parentId: "21" },
  { id: "213", name: "macOS", parentId: "21" },
  
  { id: "221", name: "Office", parentId: "22" },
  { id: "222", name: "Adobe", parentId: "22" },
  { id: "223", name: "Desenvolvimento", parentId: "22" },
  
  // Level 4 - Subitems
  { id: "1111", name: "Problemas de Hardware", parentId: "111" },
  { id: "1112", name: "Instalação", parentId: "111" },
  { id: "1113", name: "Configuração", parentId: "111" },
  
  { id: "1211", name: "Impressão", parentId: "121" },
  { id: "1212", name: "Conectividade", parentId: "121" },
  { id: "1213", name: "Configuração", parentId: "121" },
  
  { id: "2111", name: "Instalação", parentId: "211" },
  { id: "2112", name: "Atualização", parentId: "211" },
  { id: "2113", name: "Problemas", parentId: "211" },
];

export const CategorySelector = () => {
  const [selectedLevels, setSelectedLevels] = useState<string[]>([]);
  const [availableOptions, setAvailableOptions] = useState<Category[][]>([]);
  const [finalSelection, setFinalSelection] = useState<string>("");

  useEffect(() => {
    // Initialize with level 1 categories
    const level1Categories = mockCategories.filter(cat => !cat.parentId);
    setAvailableOptions([level1Categories]);
  }, []);

  const handleLevelSelection = (levelIndex: number, categoryId: string) => {
    const newSelectedLevels = [...selectedLevels];
    newSelectedLevels[levelIndex] = categoryId;
    
    // Remove selections after this level
    newSelectedLevels.splice(levelIndex + 1);
    setSelectedLevels(newSelectedLevels);

    // Update available options for next levels
    const newAvailableOptions = [...availableOptions];
    newAvailableOptions.splice(levelIndex + 1);

    // Find children of selected category
    const children = mockCategories.filter(cat => cat.parentId === categoryId);
    if (children.length > 0) {
      newAvailableOptions.push(children);
    }

    setAvailableOptions(newAvailableOptions);
    
    // Set final selection to the deepest selected category
    setFinalSelection(categoryId);
    
    // Show toast with selected path
    const selectedPath = getSelectedPath(newSelectedLevels);
    toast.success(`Categoria selecionada: ${selectedPath}`);
  };

  const getSelectedPath = (levels: string[]) => {
    return levels.map(levelId => {
      const category = mockCategories.find(cat => cat.id === levelId);
      return category?.name;
    }).join(" > ");
  };

  const resetSelection = () => {
    setSelectedLevels([]);
    setFinalSelection("");
    const level1Categories = mockCategories.filter(cat => !cat.parentId);
    setAvailableOptions([level1Categories]);
    toast.info("Seleção resetada");
  };

  const levelLabels = ["Categoria Principal", "Subcategoria", "Item", "Subitem"];

  return (
    <Card className="w-full max-w-4xl mx-auto shadow-[var(--shadow-card)] hover:shadow-[var(--shadow-hover)] transition-[var(--transition-smooth)]">
      <CardHeader className="bg-gradient-to-r from-glpi-primary to-blue-600 text-white rounded-t-lg">
        <div className="flex items-center gap-3">
          <Layers className="h-6 w-6" />
          <div>
            <CardTitle className="text-xl">Seleção Hierárquica de Categorias</CardTitle>
            <CardDescription className="text-blue-100">
              Plugin GLPI - Categoria Hierárquica Avançada
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Category Level Selectors */}
        <div className="grid gap-4">
          {availableOptions.map((options, levelIndex) => (
            <div key={levelIndex} className="space-y-2">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-xs">
                  Nível {levelIndex + 1}
                </Badge>
                <span className="text-sm font-medium text-muted-foreground">
                  {levelLabels[levelIndex] || `Nível ${levelIndex + 1}`}
                </span>
              </div>
              
              <Select
                value={selectedLevels[levelIndex] || ""}
                onValueChange={(value) => handleLevelSelection(levelIndex, value)}
              >
                <SelectTrigger className="w-full transition-[var(--transition-smooth)] hover:border-glpi-primary focus:border-glpi-primary">
                  <SelectValue placeholder={`Selecione ${levelLabels[levelIndex]?.toLowerCase() || 'uma opção'}`} />
                </SelectTrigger>
                <SelectContent>
                  {options.map((option) => (
                    <SelectItem key={option.id} value={option.id}>
                      {option.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ))}
        </div>

        {/* Selected Path Display */}
        {selectedLevels.length > 0 && (
          <div className="bg-gradient-to-r from-glpi-secondary to-blue-50 p-4 rounded-lg border border-glpi-primary/20">
            <div className="flex items-center gap-2 mb-2">
              <span className="text-sm font-medium text-glpi-primary">Caminho Selecionado:</span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {selectedLevels.map((levelId, index) => {
                const category = mockCategories.find(cat => cat.id === levelId);
                return (
                  <div key={index} className="flex items-center gap-2">
                    <Badge className="bg-glpi-primary text-white">
                      {category?.name}
                    </Badge>
                    {index < selectedLevels.length - 1 && (
                      <ChevronRight className="h-4 w-4 text-muted-foreground" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex gap-3 pt-4 border-t">
          <Button 
            onClick={resetSelection}
            variant="outline"
            className="flex items-center gap-2"
          >
            <RotateCcw className="h-4 w-4" />
            Resetar Seleção
          </Button>
          
          {finalSelection && (
            <Button 
              className="bg-glpi-success text-white hover:bg-glpi-success/90"
              onClick={() => toast.success("Categoria salva no chamado!")}
            >
              Confirmar Categoria
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};