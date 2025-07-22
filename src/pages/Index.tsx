import { DemoTabs } from "@/components/DemoTabs";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-gradient-to-r from-glpi-primary to-blue-600 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">
            Plugin GLPI - Categoria Hierárquica Avançada
          </h1>
          <p className="text-xl text-blue-100 max-w-3xl mx-auto">
            Demonstração de interface para seleção hierárquica de categorias em chamados, 
            inspirado no comportamento do plugin SplitCat, com interface moderna e responsiva.
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="py-8">
        <DemoTabs />
      </div>

      {/* Footer */}
      <footer className="bg-muted/30 border-t py-8 mt-12">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          <p>
            Protótipo de interface para plugin GLPI 10.0+ • 
            Compatível com PHP 7.4+ • 
            Estrutura modular e extensível
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
