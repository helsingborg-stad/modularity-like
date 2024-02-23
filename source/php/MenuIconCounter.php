<?php

namespace ModularityLikePosts;

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
        
        $this->pagesWithLikePostsModule = \Modularity\Helper\ModuleUsageByName::getModuleUsageByName('mod-liked-posts');
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
        if (!empty($menuItem['page_id']) && in_array($menuItem['page_id'], $this->pagesWithLikePostsModule)) {
            $menuItem['icon'] = [
                'icon' => 'favorite',
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