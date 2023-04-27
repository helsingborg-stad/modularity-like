<?php

/**
 * Plugin Name:       Modularity Like Posts
 * Plugin URI:        https://github.com/helsingborg-stad/modularity-like
 * Description:       Lets users like and save posts.
 * Version:           1.1.0
 * Author:            Niclas Norin
 * Author URI:        https://github.com/NiclasNorin
 * License:           MIT
 * License URI:       https://opensource.org/licenses/MIT
 * Text Domain:       modularity-like
 * Domain Path:       /languages
 */

 // Protect agains direct file access
if (! defined('WPINC')) {
    die;
}

define('MODULARITYLIKEPOSTS_TEXT_DOMAIN', 'modularity-like'); // Should always be same as "Text Domain" in the plugin header

define('MODULARITYLIKEPOSTS_PATH', plugin_dir_path(__FILE__));
define('MODULARITYLIKEPOSTS_URL', plugins_url('', __FILE__));
define('MODULARITYLIKEPOSTS_TEMPLATE_PATH', MODULARITYLIKEPOSTS_PATH . 'templates/');
define('MODULARITYLIKEPOSTS_VIEW_PATH', MODULARITYLIKEPOSTS_PATH . 'views/');
define('MODULARITYLIKEPOSTS_MODULE_VIEW_PATH', MODULARITYLIKEPOSTS_PATH . 'source/php/Module/views');

require_once MODULARITYLIKEPOSTS_PATH . 'Public.php';

// Register the autoloader
require __DIR__ . '/vendor/autoload.php';

add_filter('/Modularity/externalViewPath', function ($arr) {
    $arr['mod-liked-posts'] = MODULARITYLIKEPOSTS_MODULE_VIEW_PATH;
    return $arr;
}, 10, 3);

// Acf auto import and export
add_action('acf/init', function () {
    if (function_exists('acf_add_options_page')) {
        acf_add_options_page([
            'page_title' => _x('Modularity Like', 'Admin page title', MODULARITYLIKEPOSTS_TEXT_DOMAIN),
            'menu_slug' => 'modularity_like',
        ]);
    }
    $acfExportManager = new \AcfExportManager\AcfExportManager();
    $acfExportManager->setTextdomain(MODULARITYLIKEPOSTS_TEXT_DOMAIN);
    $acfExportManager->setExportFolder(MODULARITYLIKEPOSTS_PATH . 'source/php/AcfFields/');
    $acfExportManager->autoExport(array(
        'liked-posts-settings' => 'group_63e9fb49ad0f4',
        'liked-posts-options' => 'group_63ecfd0993f44'
    ));
    $acfExportManager->import();

    load_plugin_textdomain(MODULARITYLIKEPOSTS_TEXT_DOMAIN, false, MODULARITYLIKEPOSTS_PATH . 'languages');
});


// Start application
new ModularityLikePosts\App();
