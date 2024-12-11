<?php

namespace ModularityLikePosts;

use ModularityLikePosts\Helper\GetOptionFields;

class LikeIconCounter {
    private bool $hasLikeModule = false;
    private string $likeIcon = 'favorite';
    private array $likedPostsPageIds = [];

    /**
     * Constructor method.
     * 
     * Initializes the LikeIconCounter object and sets up the save_post action hook if the like_counter option is not empty.
     */
    public function __construct(private GetOptionFields $getOptionFieldsHelper) {
        $useMenuCounter = $this->getOptionFieldsHelper->getCounter();
        
        if (!empty($useMenuCounter)) {
            $this->likeIcon = $this->getOptionFieldsHelper->getIcon();
            $this->likedPostsPageIds = get_option('liked_posts_page_ids', []);

            add_action('save_post', array($this, 'checkForLikedModule'), 10, 2);
            add_filter('Municipio/Navigation/Item', array($this, 'addMenuItemIcon'), 10, 2);
        }
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

        if (isset($this->likedPostsPageIds[$pageId])) {
            $menuItem['icon'] = [
                'icon' => $this->likeIcon,
                'size' => 'md',
                'filled' => true,
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

    /**
     * Checks if the post has a liked posts module and updates the like counter page ID option.
     * 
     * @param int $postId The ID of the post being saved.
     * @param WP_Post $post The post object being saved.
     */
    public function checkForLikedModule($postId, $post) {
        $this->checkIfLikedPostsModuleExistsOnPage($postId);
        $this->checkifLikedPostsBlockExistsOnPage($post);
        $this->updateLikeCounterPageIdOption($postId);
    }

    private function checkifLikedPostsBlockExistsOnPage($post)
    {
        if (!empty($post->post_content) && !$this->hasLikeModule) {
            if (str_contains($post->post_content, 'wp:acf/liked-posts')) {
                $this->hasLikeModule = true;
            }
        }
    }

    /**
     * Checks if the Liked Posts module exists on the page for a given post ID.
     *
     * @param int $postId The ID of the post to check.
     * @return void
     */
    private function checkIfLikedPostsModuleExistsOnPage($postId)
    {
        $sidebarsArray = get_post_meta($postId, 'modularity-modules', false);

        $this->lookForLikedPostsModule($sidebarsArray);
    }

    /**
     * Recursively looks for a liked posts module in the given array.
     * 
     * @param array $array The array to search for the liked posts module.
     */
    private function lookForLikedPostsModule($array) {
        if (empty($array) || !is_array($array) || $this->hasLikeModule) {
            return;
        }

        if (isset($array['name']) && $array['name'] === 'mod-liked-posts') {
            $this->hasLikeModule = true;
            return;
        }
        foreach ($array as $value) {
            if (is_array($value)) {
                $this->lookForLikedPostsModule($value);
            }
        }
    }

    /**
     * Updates the like counter page ID option based on the presence of a liked posts module.
     * 
     * @param int $postId The ID of the post being saved.
     */
    private function updateLikeCounterPageIdOption($postId)
    {
        $likedPostsPageIds = $this->likedPostsPageIds;
        if ($this->hasLikeModule) {
            $likedPostsPageIds[$postId] = $postId;
        } else {
            unset($likedPostsPageIds[$postId]);
        }

        $this->likedPostsPageIds = $likedPostsPageIds;
        update_option('liked_posts_page_ids', $likedPostsPageIds);
    }
}
