<?php
/**
 * Plugin Categoria Hierárquica Avançada para GLPI
 * 
 * Facilita a seleção de categorias em chamados GLPI exibindo os níveis 
 * hierárquicos em campos separados e dinâmicos.
 * 
 * @author  Seu Nome
 * @since   2024
 * @license GPL v2 or later
 */

define('PLUGIN_CATEGORIA_HIERARQUICA_VERSION', '1.0.0');
define('PLUGIN_CATEGORIA_HIERARQUICA_MIN_GLPI', '10.0.0');
define('PLUGIN_CATEGORIA_HIERARQUICA_MAX_GLPI', '11.0.0');

/**
 * Inicialização do plugin
 * 
 * @return boolean
 */
function plugin_init_categoria_hierarquica_avancada() {
    global $PLUGIN_HOOKS;
    
    $PLUGIN_HOOKS['csrf_compliant']['categoria_hierarquica_avancada'] = true;
    
    // Hook para formulários de chamados
    $PLUGIN_HOOKS['post_item_form']['categoria_hierarquica_avancada'] = 'plugin_categoria_hierarquica_post_item_form';
    
    // Hook para adicionar JS/CSS
    $PLUGIN_HOOKS['add_javascript']['categoria_hierarquica_avancada'] = 'categoria_hierarquica.js';
    
    $PLUGIN_HOOKS['add_css']['categoria_hierarquica_avancada'] = 'categoria_hierarquica.css';
    
    // Menu de configuração
    if (Session::haveRight('config', UPDATE)) {
        $PLUGIN_HOOKS['config_page']['categoria_hierarquica_avancada'] = 'front/config.php';
    }
    
    return true;
}

/**
 * Informações da versão do plugin
 * 
 * @return array
 */
function plugin_version_categoria_hierarquica_avancada() {
    return [
        'name'           => __('Categoria Hierárquica Avançada', 'categoria_hierarquica_avancada'),
        'version'        => PLUGIN_CATEGORIA_HIERARQUICA_VERSION,
        'author'         => 'Seu Nome',
        'license'        => 'GPLv2+',
        'homepage'       => '',
        'requirements'   => [
            'glpi' => [
                'min' => PLUGIN_CATEGORIA_HIERARQUICA_MIN_GLPI,
                'max' => PLUGIN_CATEGORIA_HIERARQUICA_MAX_GLPI
            ]
        ]
    ];
}

/**
 * Verifica pré-requisitos do plugin
 * 
 * @return boolean
 */
function plugin_categoria_hierarquica_avancada_check_prerequisites() {
    $version = rtrim(GLPI_VERSION, '-dev');
    
    if (version_compare($version, PLUGIN_CATEGORIA_HIERARQUICA_MIN_GLPI, 'lt') 
        || version_compare($version, PLUGIN_CATEGORIA_HIERARQUICA_MAX_GLPI, 'ge')) {
        echo sprintf(
            __('Plugin requer GLPI >= %s e < %s', 'categoria_hierarquica_avancada'),
            PLUGIN_CATEGORIA_HIERARQUICA_MIN_GLPI,
            PLUGIN_CATEGORIA_HIERARQUICA_MAX_GLPI
        );
        return false;
    }
    
    return true;
}

/**
 * Verifica configuração do plugin
 * 
 * @param boolean $verbose
 * @return boolean
 */
function plugin_categoria_hierarquica_avancada_check_config($verbose = false) {
    return true;
}

/**
 * Função do hook post_item_form
 */
function plugin_categoria_hierarquica_post_item_form($params) {
    $item = $params['item'];
    
    // Verificar se é um tipo de item válido
    if (!in_array(get_class($item), ['Ticket', 'Problem', 'Change'])) {
        return;
    }
    
    // Incluir as classes necessárias
    require_once(Plugin::getPhpDir('categoria_hierarquica_avancada') . '/inc/config.class.php');
    
    $config = PluginCategoriaHierarquicaAvancadaConfig::getConfig();
    
    if (!$config) {
        return;
    }
    
    $enabled_types = json_decode($config['enabled_itemtypes'], true);
    if (!in_array(get_class($item), $enabled_types)) {
        return;
    }
    
    // Adicionar HTML e JavaScript
    echo "<script type='text/javascript'>";
    echo "var categoria_hierarquica_config = " . json_encode($config) . ";";
    echo "</script>";
    
    // HTML do seletor hierárquico
    echo "<div id='categoria-hierarquica-container' style='display: none;'>";
    echo "<table class='tab_cadre_fixe'>";
    echo "<tr class='tab_bg_1'>";
    echo "<th colspan='2'>" . __('Seleção Hierárquica de Categoria', 'categoria_hierarquica_avancada') . "</th>";
    echo "</tr>";
    
    for ($level = 1; $level <= $config['max_levels']; $level++) {
        echo "<tr class='tab_bg_1 categoria-level' data-level='{$level}' style='display: none;'>";
        echo "<td>" . sprintf(__('Nível %d', 'categoria_hierarquica_avancada'), $level) . "</td>";
        echo "<td>";
        echo "<select name='categoria_level_{$level}' id='categoria_level_{$level}' class='categoria-select'>";
        echo "<option value=''>-- " . __('Selecione', 'categoria_hierarquica_avancada') . " --</option>";
        echo "</select>";
        echo "</td>";
        echo "</tr>";
    }
    
    echo "</table>";
    echo "</div>";
}