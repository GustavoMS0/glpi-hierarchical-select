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
    $PLUGIN_HOOKS['item_form']['categoria_hierarquica_avancada'] = [
        'PluginCategoriaHierarquicaAvancadaHook',
        'itemForm'
    ];
    
    // Hook para adicionar JS/CSS
    $PLUGIN_HOOKS['add_javascript']['categoria_hierarquica_avancada'] = [
        'scripts/categoria_hierarquica.js'
    ];
    
    $PLUGIN_HOOKS['add_css']['categoria_hierarquica_avancada'] = [
        'css/categoria_hierarquica.css'
    ];
    
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