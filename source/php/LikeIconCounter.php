<?php

namespace ModularityLikePosts;

use ModularityLikePosts\Helper\GetOptionFields;
use WpService\WpService;

class LikeIconCounter implements \Municipio\HooksRegistrar\Hookable {
    /**
     * Constructor method.
     * 
     * Initializes the LikeIconCounter object and sets up the save_post action hook if the like_counter option is not empty.
     */
    public function __construct(
        private GetOptionFields $getOptionFieldsHelper,
        private WpService $wpService
    ) {}

    /**
     * Adds hooks for the LikeIconCounter functionality.
     * 
     * This method registers the init action hook to initialize the like icon counter functionality.
     */
    public function addHooks(): void {
        $this->wpService->addAction('init', [$this, 'init']);
    }

    /**
     * Initializes the like icon counter functionality.
     * 
     * This method checks if the like counter option is enabled and, if so, registers the save_post action hook
     * and the Municipio/Navigation/Item filter hook to handle updating the like counter and adding menu item icons.
     */
    public function init() {
        if (!empty($this->getOptionFieldsHelper->getCounter())) {
            $this->wpService->addAction('save_post', [$this, 'checkForLikedModule'], 10, 2);
            $this->wpService->addFilter('Municipio/Navigation/Item', [$this, 'addMenuItemIcon'], 10, 2);
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
        static $likedPostsPageIds = null;

        if (empty($menuItem['id'])) {
            return $menuItem;
        }

        if ($likedPostsPageIds === null) {
            $likedPostsPageIds = $this->getOptionFieldsHelper->getLikedPostsPageIds();
        }

        if (isset($likedPostsPageIds[$menuItem['id'] ?? 0])) {
            $menuItem['icon'] = [
                'icon' => $this->getOptionFieldsHelper->getIcon(),
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

    /**
     * Checks if the liked posts block exists in the content of the given post.
     *
     * @param WP_Post $post The post object to check.
     * @return void
     */
    private function checkifLikedPostsBlockExistsOnPage(null|object $post)
    {
        if(empty($post) || !property_exists($post, 'ID')) {
            return false;
        }

        static $hasLikeModule = [];
        if (!empty($post->post_content) && empty($hasLikeModule[$post->ID])) {
            if (str_contains($post->post_content, 'wp:acf/liked-posts')) {
                $hasLikeModule[$post->ID] = true;
            }
        }
    }

    /**
     * Recursively looks for a liked posts module in the given array.
     * 
     * @param array $array The array to search for the liked posts module.
     * @return bool True if the liked posts module is found, false otherwise.
     */
    private function lookForLikedPostsModule($array): bool {
        if (empty($array) || !is_array($array)) {
            return false;
        }

        if (isset($array['name']) && $array['name'] === 'mod-liked-posts') {
            return true;
        }

        foreach ($array as $value) {
            if (is_array($value) && $this->lookForLikedPostsModule($value)) {
                return true;
            }
        }
        return false;
    }

    /**
     * Checks if the Liked Posts module exists on the page for a given post ID.
     *
     * @param int $postId The ID of the post to check.
     * @return bool True if the liked posts module exists, false otherwise.
     */
    private function checkIfLikedPostsModuleExistsOnPage($postId): bool {
        $sidebarsArray = $this->wpService->getPostMeta(
            $postId,
            'modularity-modules',
            false
        );

        return $this->lookForLikedPostsModule(
            is_array($sidebarsArray) && !empty($sidebarsArray) ? $sidebarsArray : []
        );
    }

    /**
     * Updates the like counter page ID option based on the presence of a liked posts module.
     * 
     * @param int $postId The ID of the post being saved.
     */
    private function updateLikeCounterPageIdOption($postId)
    {
        $likedPostsPageIds = $this->getOptionFieldsHelper->getLikedPostsPageIds();
        $hasLikeModule     = $this->checkIfLikedPostsModuleExistsOnPage($postId);

        if ($hasLikeModule) {
            $likedPostsPageIds[$postId] = $postId;
        } else {
            unset($likedPostsPageIds[$postId]);
        }

        $this->wpService->updateOption(
            'liked_posts_page_ids', 
            $likedPostsPageIds
        );
    }
}
