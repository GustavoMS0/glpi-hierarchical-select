# Plugin Categoria Hierárquica Avançada para GLPI

## Descrição

Plugin para GLPI 10.0+ que facilita a seleção de categorias em chamados exibindo os níveis hierárquicos em campos separados e dinâmicos, inspirado no comportamento do plugin SplitCat.

## Funcionalidades

- ✅ Seleção hierárquica de categorias com campos separados
- ✅ Atualização dinâmica via AJAX
- ✅ Suporte a múltiplos níveis (configurável de 2 a 8 níveis)
- ✅ Integração completa com tipos de chamados do GLPI
- ✅ Painel de configuração administrativo
- ✅ Interface moderna e responsiva
- ✅ Suporte ao Select2 para melhor UX
- ✅ Multilíngue (PT-BR e EN-US)

## Requisitos

- GLPI 10.0.0 ou superior
- PHP 7.4 ou superior
- JavaScript habilitado no navegador

## Instalação

1. Faça o download ou clone este repositório
2. Copie a pasta `categoria_hierarquica_avancada` para o diretório `plugins/` da sua instalação GLPI
3. Acesse GLPI como administrador
4. Vá em **Configurar > Plugins**
5. Localize "Categoria Hierárquica Avançada" e clique em **Instalar**
6. Após a instalação, clique em **Ativar**

## Configuração

1. Acesse **Configurar > Plugins > Categoria Hierárquica Avançada**
2. Configure as seguintes opções:
   - **Máximo de níveis hierárquicos**: Define quantos níveis serão exibidos (2-8)
   - **Tipos de chamados habilitados**: Selecione onde o plugin deve atuar (Ticket, Problem, Change)
   - **Usar Select2**: Habilita interface avançada com busca
   - **Mostrar níveis vazios**: Exibe todos os níveis mesmo quando vazios

## Como Usar

1. Ao criar ou editar um chamado, problema ou mudança, o plugin substituirá o seletor padrão de categorias
2. Selecione a categoria nivel por nível, começando pelo primeiro
3. Cada seleção carregará automaticamente as subcategorias do próximo nível
4. A categoria final selecionada será salva no campo original do GLPI

## Estrutura do Plugin

```
categoria_hierarquica_avancada/
├── setup.php                  # Configuração principal do plugin
├── hook.php                   # Hooks de instalação/desinstalação
├── inc/
│   ├── config.class.php       # Classe de configuração
│   └── category.class.php     # Classe para manipulação de categorias
├── front/
│   └── config.php             # Interface de configuração
├── ajax/
│   ├── get_categories.php     # Busca categorias por nível
│   └── get_category_path.php  # Busca caminho da categoria
├── scripts/
│   └── categoria_hierarquica.js # JavaScript principal
├── css/
│   └── categoria_hierarquica.css # Estilos do plugin
├── locales/
│   ├── pt_BR.po               # Tradução português brasileiro
│   ├── pt_BR.mo
│   └── en_US.po               # Tradução inglês americano
└── README.md
```

## Desenvolvimento

### Principais Classes

- `PluginCategoriaHierarquicaAvancadaHook`: Manipula hooks do GLPI
- `PluginCategoriaHierarquicaAvancadaConfig`: Gerencia configurações
- `PluginCategoriaHierarquicaAvancadaCategory`: Manipula categorias hierárquicas

### API AJAX

- `ajax/get_categories.php`: Retorna categorias de um nível específico
- `ajax/get_category_path.php`: Retorna caminho completo de uma categoria

### JavaScript

O arquivo `scripts/categoria_hierarquica.js` contém toda a lógica frontend:
- Inicialização do plugin
- Carregamento dinâmico de categorias
- Integração com Select2
- Sincronização com campo original do GLPI

## Compatibilidade

- GLPI 10.0.0 - 10.9.x ✅
- PHP 7.4+ ✅
- Navegadores modernos ✅

## Licença

GPL v2 ou posterior

## Suporte

Para relatar bugs ou solicitar funcionalidades, abra uma issue no repositório do projeto.

## Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça fork do projeto
2. Crie uma branch para sua feature (`git checkout -b feature/nova-funcionalidade`)
3. Commit suas mudanças (`git commit -am 'Adiciona nova funcionalidade'`)
4. Push para a branch (`git push origin feature/nova-funcionalidade`)
5. Abra um Pull Request

## Changelog

### v1.0.0
- Versão inicial
- Seleção hierárquica de categorias
- Painel de configuração
- Suporte multilíngue
- Integração com Select2