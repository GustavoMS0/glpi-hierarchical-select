/**
 * JavaScript para o plugin Categoria Hierárquica Avançada
 */

var CategoriaHierarquica = {
    currentLevel: 0,
    
    /**
     * Inicializar o plugin
     */
    init: function() {
        this.setupCategorySelector();
        this.bindEvents();
    },
    
    /**
     * Configurar o seletor de categorias
     */
    setupCategorySelector: function() {
        var originalSelect = $('select[name="itilcategories_id"]');
        
        if (originalSelect.length === 0) {
            return;
        }
        
        // Não ocultar o seletor original, apenas modificar seu comportamento
        console.log('Plugin Categoria Hierárquica Avançada carregado');
    },
    
    /**
     * Vincular eventos
     */
    bindEvents: function() {
        var self = this;
        
        // Evento de mudança no seletor original
        $(document).on('change', 'select[name="itilcategories_id"]', function() {
            var selectedValue = $(this).val();
            
            // Limpar selects filhos
            self.clearChildSelects();
            
            // Carregar próximo nível se há seleção
            if (selectedValue) {
                self.checkAndLoadChildren(selectedValue, 1, $(this));
            }
        });
        
        // Evento de mudança nos seletores filhos
        $(document).on('change', '.categoria-child-select', function() {
            var selectedValue = $(this).val();
            var level = parseInt($(this).data('level'));
            
            // Limpar níveis seguintes
            self.clearChildSelects(level);
            
            // Carregar próximo nível se há seleção
            if (selectedValue) {
                self.checkAndLoadChildren(selectedValue, level + 1, $(this));
            }
            
            // Atualizar campo original com a última categoria selecionada
            self.updateOriginalField();
        });
    },
    
    /**
     * Verificar se tem filhos e carregar se necessário
     */
    checkAndLoadChildren: function(parentId, level, parentElement) {
        var self = this;
        
        $.ajax({
            url: CFG_GLPI.root_doc + '/plugins/categoria_hierarquica_avancada/ajax/get_categories.php',
            type: 'GET',
            data: {
                level: level,
                parent_id: parentId
            },
            dataType: 'json',
            success: function(response) {
                if (response.success && response.categories && response.categories.length > 0) {
                    self.createChildSelector(response.categories, level, parentElement);
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro AJAX ao carregar categorias:', error);
            }
        });
    },
    
    /**
     * Criar um seletor filho
     */
    createChildSelector: function(categories, level, parentElement) {
        // Criar HTML do select
        var selectHtml = '<select class="form-control categoria-child-select" data-level="' + level + '" style="margin-left: 10px; display: inline-block; width: auto; min-width: 200px;">';
        selectHtml += '<option value="">-- Selecione uma subcategoria --</option>';
        
        $.each(categories, function(index, category) {
            selectHtml += '<option value="' + category.id + '">' + category.name + '</option>';
        });
        
        selectHtml += '</select>';
        
        // Inserir o select após o elemento pai
        $(selectHtml).insertAfter(parentElement);
        
        // Atualizar nível atual
        this.currentLevel = level;
    },
    
    /**
     * Limpar selects filhos a partir de um nível
     */
    clearChildSelects: function(fromLevel) {
        if (typeof fromLevel === 'undefined') {
            // Limpar todos os selects filhos
            $('.categoria-child-select').remove();
            this.currentLevel = 0;
        } else {
            // Limpar selects a partir do nível especificado
            $('.categoria-child-select').each(function() {
                var selectLevel = parseInt($(this).data('level'));
                if (selectLevel > fromLevel) {
                    $(this).remove();
                }
            });
            this.currentLevel = fromLevel;
        }
    },
    
    /**
     * Atualizar campo original do GLPI com a última categoria selecionada
     */
    updateOriginalField: function() {
        var finalCategory = null;
        var maxLevel = 0;
        
        // Encontrar a categoria selecionada do nível mais alto
        $('.categoria-child-select').each(function() {
            var value = $(this).val();
            var level = parseInt($(this).data('level'));
            
            if (value && level > maxLevel) {
                finalCategory = value;
                maxLevel = level;
            }
        });
        
        // Atualizar campo original com a última categoria selecionada na hierarquia
        if (finalCategory) {
            $('select[name="itilcategories_id"]').val(finalCategory);
        }
    }
};

// Inicializar quando o documento estiver pronto
$(document).ready(function() {
    // Aguardar um pouco para garantir que o GLPI carregou
    setTimeout(function() {
        CategoriaHierarquica.init();
    }, 500);
});