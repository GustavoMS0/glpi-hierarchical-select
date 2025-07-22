<?php
/**
 * Ajax para buscar caminho completo da categoria
 */

include ('../../../inc/includes.php');

header('Content-Type: application/json');

// Verificar autenticação
if (!Session::getLoginUserID()) {
    http_response_code(401);
    echo json_encode(['error' => 'Não autenticado']);
    exit;
}

$category_id = isset($_GET['category_id']) ? (int) $_GET['category_id'] : 0;

if ($category_id <= 0) {
    http_response_code(400);
    echo json_encode(['error' => 'ID da categoria inválido']);
    exit;
}

try {
    $path = PluginCategoriaHierarquicaAvancadaCategory::getCategoryPath($category_id);
    
    echo json_encode([
        'success' => true,
        'path' => $path,
        'category_id' => $category_id
    ]);
    
} catch (Exception $e) {
    http_response_code(500);
    echo json_encode([
        'success' => false,
        'error' => 'Erro interno do servidor',
        'message' => $e->getMessage()
    ]);
}