/**
 * JavaScript para o plugin Categoria Hierárquica Avançada
 */

var CategoriaHierarquica = {
    config: {},
    
    /**
     * Inicializar o plugin
     */
    init: function() {
        if (typeof categoria_hierarquica_config !== 'undefined') {
            this.config = categoria_hierarquica_config;
        }
        
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
        
        // Ocultar seletor original
        originalSelect.closest('tr').hide();
        
        // Mostrar container hierárquico
        $('#categoria-hierarquica-container').show();
        
        // Carregar categorias do primeiro nível
        this.loadCategories(1, 0);
        
        // Configurar Select2 se habilitado
        if (this.config.use_select2) {
            this.initializeSelect2();
        }
    },
    
    /**
     * Vincular eventos
     */
    bindEvents: function() {
        var self = this;
        
        // Evento de mudança nos seletores
        $(document).on('change', '.categoria-select', function() {
            var level = parseInt($(this).closest('.categoria-level').data('level'));
            var selectedValue = $(this).val();
            
            // Limpar níveis seguintes
            self.clearNextLevels(level);
            
            // Carregar próximo nível se há seleção
            if (selectedValue) {
                self.loadCategories(level + 1, selectedValue);
                
                // Atualizar campo original
                self.updateOriginalField();
            }
        });
    },
    
    /**
     * Carregar categorias para um nível específico
     */
    loadCategories: function(level, parentId) {
        if (level > this.config.max_levels) {
            return;
        }
        
        var self = this;
        var selector = $('#categoria_level_' + level);
        
        // Mostrar loading
        selector.html('<option value="">Carregando...</option>');
        
        $.ajax({
            url: CFG_GLPI.root_doc + '/plugins/categoria_hierarquica_avancada/ajax/get_categories.php',
            type: 'GET',
            data: {
                level: level,
                parent_id: parentId
            },
            dataType: 'json',
            success: function(response) {
                if (response.success) {
                    self.populateSelector(selector, response.categories, level);
                } else {
                    console.error('Erro ao carregar categorias:', response.error);
                    selector.html('<option value="">Erro ao carregar</option>');
                }
            },
            error: function(xhr, status, error) {
                console.error('Erro AJAX:', error);
                selector.html('<option value="">Erro ao carregar</option>');
            }
        });
    },
    
    /**
     * Popular um seletor com categorias
     */
    populateSelector: function(selector, categories, level) {
        var html = '<option value="">-- Selecione --</option>';
        
        $.each(categories, function(index, category) {
            html += '<option value="' + category.id + '">' + 
                   category.name + '</option>';
        });
        
        selector.html(html);
        
        // Mostrar o seletor
        selector.closest('.categoria-level').show();
        
        // Reinicializar Select2 se necessário
        if (this.config.use_select2) {
            this.reinitializeSelect2(selector);
        }
    },
    
    /**
     * Limpar níveis seguintes
     */
    clearNextLevels: function(fromLevel) {
        for (var i = fromLevel + 1; i <= this.config.max_levels; i++) {
            var selector = $('#categoria_level_' + i);
            selector.html('<option value="">-- Selecione --</option>');
            
            if (!this.config.show_empty_levels) {
                selector.closest('.categoria-level').hide();
            }
        }
    },
    
    /**
     * Atualizar campo original do GLPI
     */
    updateOriginalField: function() {
        var finalCategory = null;
        
        // Encontrar a última categoria selecionada
        for (var i = this.config.max_levels; i >= 1; i--) {
            var value = $('#categoria_level_' + i).val();
            if (value) {
                finalCategory = value;
                break;
            }
        }
        
        // Atualizar campo original
        if (finalCategory) {
            $('select[name="itilcategories_id"]').val(finalCategory);
        }
    },
    
    /**
     * Inicializar Select2
     */
    initializeSelect2: function() {
        if (typeof $.fn.select2 !== 'undefined') {
            $('.categoria-select').select2({
                theme: 'bootstrap',
                width: '100%',
                placeholder: '-- Selecione --',
                allowClear: true
            });
        }
    },
    
    /**
     * Reinicializar Select2 em um elemento específico
     */
    reinitializeSelect2: function(element) {
        if (typeof $.fn.select2 !== 'undefined') {
            element.select2('destroy').select2({
                theme: 'bootstrap',
                width: '100%',
                placeholder: '-- Selecione --',
                allowClear: true
            });
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