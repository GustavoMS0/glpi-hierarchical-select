<?php
/**
 * Ajax para buscar categorias por nível
 */

include ('../../../inc/includes.php');

header('Content-Type: application/json');

// Verificar autenticação
if (!Session::getLoginUserID()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autenticado']);
    exit;
}

$parent_id = isset($_GET['parent_id']) ? (int) $_GET['parent_id'] : 0;
$level = isset($_GET['level']) ? (int) $_GET['level'] : 1;

try {
    if ($level === 1 || $parent_id === 0) {
        // Buscar categorias raiz
        $categories = PluginCategoriaHierarquicaAvancadaCategory::getRootCategories();
    } else {
        // Buscar subcategorias
        $categories = PluginCategoriaHierarquicaAvancadaCategory::getSubCategories($parent_id);
    }
    
    // Adicionar informação se tem filhos
    foreach ($categories as &$category) {
        $category['has_children'] = PluginCategoriaHierarquicaAvancadaCategory::hasSubCategories($category['id']);
    }
    
    echo json_encode([
        'success' => true,
        'categories' => $categories,
        'level' => $level,
        'parent_id' => $parent_id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno do servidor',
        'message' => $e->getMessage()
    ]);
}