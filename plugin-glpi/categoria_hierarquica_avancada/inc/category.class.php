<?php
/**
 * Classe para manipulação de categorias hierárquicas
 */

class PluginCategoriaHierarquicaAvancadaCategory {
    
    /**
     * Obter categorias raiz (nível 1)
     * 
     * @return array
     */
    public static function getRootCategories() {
        global $DB;
        
        $query = "SELECT id, name 
                  FROM glpi_itilcategories 
                  WHERE itilcategories_id = 0 
                  AND is_deleted = 0 
                  ORDER BY name ASC";
        
        $result = $DB->query($query);
        $categories = [];
        
        while ($row = $DB->fetchAssoc($result)) {
            $categories[] = [
                'id' => $row['id'],
                'name' => $row['name']
            ];
        }
        
        return $categories;
    }
    
    /**
     * Obter subcategorias de uma categoria pai
     * 
     * @param int $parent_id
     * @return array
     */
    public static function getSubCategories($parent_id) {
        global $DB;
        
        $query = "SELECT id, name 
                  FROM glpi_itilcategories 
                  WHERE itilcategories_id = " . (int) $parent_id . " 
                  AND is_deleted = 0 
                  ORDER BY name ASC";
        
        $result = $DB->query($query);
        $categories = [];
        
        while ($row = $DB->fetchAssoc($result)) {
            $categories[] = [
                'id' => $row['id'],
                'name' => $row['name']
            ];
        }
        
        return $categories;
    }
    
    /**
     * Obter caminho completo da categoria
     * 
     * @param int $category_id
     * @return array
     */
    public static function getCategoryPath($category_id) {
        global $DB;
        
        $path = [];
        $current_id = $category_id;
        
        while ($current_id > 0) {
            $query = "SELECT id, name, itilcategories_id 
                      FROM glpi_itilcategories 
                      WHERE id = " . (int) $current_id . " 
                      AND is_deleted = 0";
            
            $result = $DB->query($query);
            
            if ($result && $DB->numrows($result) > 0) {
                $row = $DB->fetchAssoc($result);
                array_unshift($path, [
                    'id' => $row['id'],
                    'name' => $row['name']
                ]);
                $current_id = $row['itilcategories_id'];
            } else {
                break;
            }
        }
        
        return $path;
    }
    
    /**
     * Verificar se uma categoria tem subcategorias
     * 
     * @param int $category_id
     * @return boolean
     */
    public static function hasSubCategories($category_id) {
        global $DB;
        
        $query = "SELECT COUNT(*) as count 
                  FROM glpi_itilcategories 
                  WHERE itilcategories_id = " . (int) $category_id . " 
                  AND is_deleted = 0";
        
        $result = $DB->query($query);
        
        if ($result) {
            $row = $DB->fetchAssoc($result);
            return $row['count'] > 0;
        }
        
        return false;
    }
    
    /**
     * Construir árvore hierárquica completa
     * 
     * @param int $parent_id
     * @param int $max_depth
     * @param int $current_depth
     * @return array
     */
    public static function buildCategoryTree($parent_id = 0, $max_depth = 4, $current_depth = 0) {
        if ($current_depth >= $max_depth) {
            return [];
        }
        
        $categories = self::getSubCategories($parent_id);
        $tree = [];
        
        foreach ($categories as $category) {
            $tree[] = [
                'id' => $category['id'],
                'name' => $category['name'],
                'level' => $current_depth + 1,
                'has_children' => self::hasSubCategories($category['id']),
                'children' => self::buildCategoryTree($category['id'], $max_depth, $current_depth + 1)
            ];
        }
        
        return $tree;
    }
}