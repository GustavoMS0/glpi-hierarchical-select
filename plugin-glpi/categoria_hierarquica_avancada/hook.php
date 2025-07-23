<?php
/**
 * Hook principal do plugin Categoria Hierárquica Avançada
 */

/**
 * Instalação do plugin
 * 
 * @return boolean
 */
function plugin_categoria_hierarquica_avancada_install() {
    global $DB;
    
    // Criação da tabela de configurações
    $query = "CREATE TABLE IF NOT EXISTS `glpi_plugin_categoria_hierarquica_config` (
        `id` INT(11) NOT NULL AUTO_INCREMENT,
        `max_levels` INT(11) NOT NULL DEFAULT 4,
        `enabled_itemtypes` TEXT,
        `use_select2` TINYINT(1) NOT NULL DEFAULT 1,
        `show_empty_levels` TINYINT(1) NOT NULL DEFAULT 0,
        `date_creation` TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        `date_mod` TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        PRIMARY KEY (`id`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci";
    
    $DB->queryOrDie($query, $DB->error());
    
    // Verificar se já existe configuração
    $check_query = "SELECT COUNT(*) as count FROM `glpi_plugin_categoria_hierarquica_config`";
    $result = $DB->query($check_query);
    $row = $DB->fetchAssoc($result);
    
    if ($row['count'] == 0) {
        // Inserir configuração padrão apenas se não existe
        $config_query = "INSERT INTO `glpi_plugin_categoria_hierarquica_config` 
            (`max_levels`, `enabled_itemtypes`, `use_select2`, `show_empty_levels`) 
            VALUES (4, '" . json_encode(['Ticket', 'Problem', 'Change']) . "', 1, 0)";
        
        $DB->queryOrDie($config_query, $DB->error());
    }
    
    return true;
}

/**
 * Desinstalação do plugin
 * 
 * @return boolean
 */
function plugin_categoria_hierarquica_avancada_uninstall() {
    global $DB;
    
    // Remover tabela de configurações
    $query = "DROP TABLE IF EXISTS `glpi_plugin_categoria_hierarquica_config`";
    $DB->queryOrDie($query, $DB->error());
    
    return true;
}

/**
 * Classe principal de hooks
 */
class PluginCategoriaHierarquicaAvancadaHook {
    
    /**
     * Hook para formulários de itens
     * 
     * @param array $params
     */
    public static function itemForm($params) {
        $item = $params['item'];
        $options = $params['options'];
        
        // Verificar se é um tipo de item habilitado
        if (!self::isEnabledForItemType(get_class($item))) {
            return;
        }
        
        // Verificar se é o formulário de criação/edição
        if (isset($options['formfooter']) && $options['formfooter']) {
            self::addCategorySelector($item);
        }
    }
    
    /**
     * Adiciona o seletor hierárquico de categorias
     * 
     * @param CommonITILObject $item
     */
    private static function addCategorySelector($item) {
        $config = PluginCategoriaHierarquicaAvancadaConfig::getConfig();
        
        if (!$config) {
            return;
        }
        
        echo "<script type='text/javascript'>";
        echo "var categoria_hierarquica_config = " . json_encode($config) . ";";
        echo "</script>";
        
        // Adicionar HTML para o seletor hierárquico
        self::renderCategorySelector($item, $config);
    }
    
    /**
     * Renderiza o seletor hierárquico
     * 
     * @param CommonITILObject $item
     * @param array $config
     */
    private static function renderCategorySelector($item, $config) {
        echo "<div id='categoria-hierarquica-container' style='display: none;'>";
        echo "<div class='categoria-hierarquica-levels'>";
        
        for ($level = 1; $level <= $config['max_levels']; $level++) {
            echo "<div class='categoria-level' data-level='{$level}'>";
            echo "<label for='categoria_level_{$level}'>" . 
                 sprintf(__('Nível %d', 'categoria_hierarquica_avancada'), $level) . 
                 "</label>";
            echo "<select name='categoria_level_{$level}' id='categoria_level_{$level}' class='categoria-select'>";
            echo "<option value=''>-- " . __('Selecione', 'categoria_hierarquica_avancada') . " --</option>";
            echo "</select>";
            echo "</div>";
        }
        
        echo "</div>";
        echo "</div>";
    }
    
    /**
     * Verifica se o plugin está habilitado para o tipo de item
     * 
     * @param string $itemtype
     * @return boolean
     */
    private static function isEnabledForItemType($itemtype) {
        $config = PluginCategoriaHierarquicaAvancadaConfig::getConfig();
        
        if (!$config || !isset($config['enabled_itemtypes'])) {
            return false;
        }
        
        $enabled_types = json_decode($config['enabled_itemtypes'], true);
        return in_array($itemtype, $enabled_types);
    }
}