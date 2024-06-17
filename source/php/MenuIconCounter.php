<?php

namespace ModularityLikePosts;

use ModularityLikePosts\Helper\FunctionCache; 
/**
 * Class MenuIconCounter
 * 
 * This class is responsible for adding a menu item icon to pages that have the 'mod-liked-posts' module enabled.
 */
class MenuIconCounter {
    private $pagesWithLikePostsModule;

    /**
     * Constructor method.
     * 
     * Initializes the MenuIconCounter object and sets the pages with the 'mod-liked-posts' module.
     */
    public function __construct() {
        $useMenuCounter = get_field('like_counter', 'option');
        if (!$useMenuCounter) {
            return;
        }
        
        $this->pagesWithLikePostsModule = FunctionCache::call(function() {
            return \Modularity\Helper\ModuleUsageByName::getModuleUsageByName('mod-liked-posts');
        }, 3600);

        add_filter('Municipio/Navigation/Item', array($this, 'addMenuItemIcon'), 10, 2);
    }

    /**
     * Adds a menu item icon to the given menu item if it corresponds to a page with the 'mod-liked-posts' module.
     * 
     * @param array $menuItem The menu item to modify.
     * @param string $menuId The ID of the menu.
     * @return array The modified menu item.
     */
    public function addMenuItemIcon($menuItem, $menuId) {
        if (empty($menuItem['id'])) {
            return $menuItem;
        }

        $pageId = !empty($menuItem['page_id']) ? $menuItem['page_id'] : $menuItem['id'];

        if (in_array($pageId, $this->pagesWithLikePostsModule)) {
            $menuItem['icon'] = [
                'icon' => get_field('like_icon', 'option') ?? 'favorite',
                'size' => 'md',
                'attributeList' => [
                    'data-js-like-icon-counter' => '',
                ],
                'classList' => [
                    'u-position--relative'
                ]
            ];
        }

        return $menuItem;
    }
}