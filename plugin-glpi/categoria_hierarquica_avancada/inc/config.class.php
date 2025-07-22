<?php
/**
 * Classe de configuração do plugin
 */

class PluginCategoriaHierarquicaAvancadaConfig extends CommonDBTM {
    
    static $rightname = 'config';
    
    /**
     * Obter configuração atual
     * 
     * @return array|false
     */
    public static function getConfig() {
        global $DB;
        
        $query = "SELECT * FROM `glpi_plugin_categoria_hierarquica_config` LIMIT 1";
        $result = $DB->query($query);
        
        if ($result && $DB->numrows($result) > 0) {
            return $DB->fetchAssoc($result);
        }
        
        return false;
    }
    
    /**
     * Atualizar configuração
     * 
     * @param array $data
     * @return boolean
     */
    public static function updateConfig($data) {
        global $DB;
        
        $config = self::getConfig();
        
        if ($config) {
            $update_data = [];
            
            if (isset($data['max_levels'])) {
                $update_data['max_levels'] = (int) $data['max_levels'];
            }
            
            if (isset($data['enabled_itemtypes'])) {
                $update_data['enabled_itemtypes'] = json_encode($data['enabled_itemtypes']);
            }
            
            if (isset($data['use_select2'])) {
                $update_data['use_select2'] = (int) $data['use_select2'];
            }
            
            if (isset($data['show_empty_levels'])) {
                $update_data['show_empty_levels'] = (int) $data['show_empty_levels'];
            }
            
            if (!empty($update_data)) {
                $update_data['date_mod'] = $_SESSION['glpi_currenttime'];
                
                return $DB->update(
                    'glpi_plugin_categoria_hierarquica_config',
                    $update_data,
                    ['id' => $config['id']]
                );
            }
        }
        
        return false;
    }
    
    /**
     * Mostrar formulário de configuração
     * 
     * @return void
     */
    public static function showConfigForm() {
        global $CFG_GLPI;
        
        $config = self::getConfig();
        
        if (!$config) {
            echo "<div class='alert alert-warning'>";
            echo __('Configuração não encontrada', 'categoria_hierarquica_avancada');
            echo "</div>";
            return;
        }
        
        echo "<form name='config_form' method='post' action='" . 
             Plugin::getWebDir('categoria_hierarquica_avancada') . "/front/config.php'>";
        
        echo "<div class='spaced' id='tabsbody'>";
        echo "<table class='tab_cadre_fixe'>";
        
        echo "<tr class='tab_bg_1'>";
        echo "<th colspan='2'>" . __('Configuração do Plugin', 'categoria_hierarquica_avancada') . "</th>";
        echo "</tr>";
        
        // Máximo de níveis
        echo "<tr class='tab_bg_1'>";
        echo "<td>" . __('Máximo de níveis hierárquicos', 'categoria_hierarquica_avancada') . "</td>";
        echo "<td>";
        Dropdown::showNumber('max_levels', [
            'value' => $config['max_levels'],
            'min' => 2,
            'max' => 8
        ]);
        echo "</td>";
        echo "</tr>";
        
        // Tipos de itens habilitados
        echo "<tr class='tab_bg_1'>";
        echo "<td>" . __('Tipos de chamados habilitados', 'categoria_hierarquica_avancada') . "</td>";
        echo "<td>";
        
        $enabled_types = json_decode($config['enabled_itemtypes'], true);
        $available_types = ['Ticket' => __('Ticket'), 'Problem' => __('Problem'), 'Change' => __('Change')];
        
        foreach ($available_types as $type => $label) {
            $checked = in_array($type, $enabled_types) ? 'checked' : '';
            echo "<input type='checkbox' name='enabled_itemtypes[]' value='{$type}' {$checked}> {$label}<br>";
        }
        
        echo "</td>";
        echo "</tr>";
        
        // Usar Select2
        echo "<tr class='tab_bg_1'>";
        echo "<td>" . __('Usar Select2 para seletores', 'categoria_hierarquica_avancada') . "</td>";
        echo "<td>";
        Dropdown::showYesNo('use_select2', $config['use_select2']);
        echo "</td>";
        echo "</tr>";
        
        // Mostrar níveis vazios
        echo "<tr class='tab_bg_1'>";
        echo "<td>" . __('Mostrar níveis vazios', 'categoria_hierarquica_avancada') . "</td>";
        echo "<td>";
        Dropdown::showYesNo('show_empty_levels', $config['show_empty_levels']);
        echo "</td>";
        echo "</tr>";
        
        echo "<tr class='tab_bg_1'>";
        echo "<td class='center' colspan='2'>";
        echo "<input type='submit' name='update_config' value='" . 
             __('Atualizar', 'categoria_hierarquica_avancada') . "' class='submit'>";
        echo "</td>";
        echo "</tr>";
        
        echo "</table>";
        echo "</div>";
        
        Html::closeForm();
    }
}