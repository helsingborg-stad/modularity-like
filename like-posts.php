<?php

/**
 * Plugin Name:       Modularity Like Posts
 * Plugin URI:        https://github.com/NiclasNorin/modularity-json-render
 * Description:       Lets users like and save posts.
 * Version:           1.0.0
 * Author:            Niclas Norin
 * Author URI:        https://github.com/NiclasNorin
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       modularity-json-render
 * Domain Path:       /languages
 */

 // Protect agains direct file access
if (! defined('WPINC')) {
    die;
}

define('MODULARITYLIKEPOSTS_PATH', plugin_dir_path(__FILE__));
define('MODULARITYLIKEPOSTS_URL', plugins_url('', __FILE__));
define('MODULARITYLIKEPOSTS_TEMPLATE_PATH', MODULARITYLIKEPOSTS_PATH . 'templates/');
define('MODULARITYLIKEPOSTS_TEXT_DOMAIN', 'liked-posts');
define('MODULARITYLIKEPOSTS_VIEW_PATH', MODULARITYLIKEPOSTS_PATH . 'views/');
define('MODULARITYLIKEPOSTS_MODULE_VIEW_PATH', MODULARITYLIKEPOSTS_PATH . 'source/php/Module/views');

load_plugin_textdomain(MODULARITYLIKEPOSTS_TEXT_DOMAIN, false, MODULARITYLIKEPOSTS_PATH . '/languages');

require_once MODULARITYLIKEPOSTS_PATH . 'Public.php';

// Register the autoloader
require __DIR__ . '/vendor/autoload.php';

add_filter('/Modularity/externalViewPath', function ($arr) {
    $arr['mod-liked-posts'] = MODULARITYLIKEPOSTS_MODULE_VIEW_PATH;
    return $arr;
}, 10, 3);

// Acf auto import and export
add_action('acf/init', function () {
    $acfExportManager = new \AcfExportManager\AcfExportManager();
    $acfExportManager->setTextdomain('liked-posts');
    $acfExportManager->setExportFolder(MODULARITYLIKEPOSTS_PATH . 'source/php/AcfFields/');
    $acfExportManager->autoExport(array(
        'liked-posts-settings' => 'group_63e9fb49ad0f4' //Update with acf id here, settings view
    ));
    $acfExportManager->import();
});


// Start application
new ModularityLikePosts\App();
