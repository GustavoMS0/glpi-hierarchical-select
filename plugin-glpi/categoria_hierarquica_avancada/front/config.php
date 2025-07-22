<?php
/**
 * Página de configuração do plugin
 */

include ('../../../inc/includes.php');

Session::checkRight('config', UPDATE);

Html::header(__('Categoria Hierárquica Avançada', 'categoria_hierarquica_avancada'), $_SERVER['PHP_SELF'], 'config', 'plugins');

// Processar atualização da configuração
if (isset($_POST['update_config'])) {
    $config_data = [
        'max_levels' => $_POST['max_levels'],
        'enabled_itemtypes' => $_POST['enabled_itemtypes'] ?? [],
        'use_select2' => $_POST['use_select2'],
        'show_empty_levels' => $_POST['show_empty_levels']
    ];
    
    if (PluginCategoriaHierarquicaAvancadaConfig::updateConfig($config_data)) {
        Session::addMessageAfterRedirect(__('Configuração atualizada com sucesso', 'categoria_hierarquica_avancada'), true);
    } else {
        Session::addMessageAfterRedirect(__('Erro ao atualizar configuração', 'categoria_hierarquica_avancada'), false, ERROR);
    }
    
    Html::redirect($_SERVER['PHP_SELF']);
}

echo "<div class='center'>";
echo "<h2>" . __('Configuração - Categoria Hierárquica Avançada', 'categoria_hierarquica_avancada') . "</h2>";

// Mostrar formulário de configuração
PluginCategoriaHierarquicaAvancadaConfig::showConfigForm();

echo "</div>";

Html::footer();