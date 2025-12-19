<?php

namespace ModularityLikePosts\Api;

use ModularityLikePosts\Helper\GetOptionFields;
use WpService\WpService;
use \Municipio\Helper\SiteSwitcher\SiteSwitcher;

class GetPosts {
    private int $blogId;
    private int $currentUser;
    private int $currentBlogIdContext;
    private array $orderedPosts = [];
    private array $postTypes;

    public function __construct(
        private WpService $wpService,
        private GetOptionFields $getOptionFieldsHelper,
        private SiteSwitcher $siteSwitcher
    ) {

        $this->blogId               = $this->wpService->getCurrentBlogId();
        $this->postTypes            = $this->getOptionFieldsHelper->getPostTypes();
        $this->currentBlogIdContext = $this->blogId;
    }

    /**
     * Get posts based on an array of unstructured post IDs.
     *
     * @param array $unstructuredIds Array of post IDs in the format 'blogId-postId'.
     * @return array Array of posts structured by blog ID.
     */
    public function getPosts(array $unstructuredIds): array
    {

        $this->currentUser = $this->getCurrentUser();
        $this->setUpWantedOrder($unstructuredIds);
        $structuredIds = $this->structurePostIds($unstructuredIds);

        foreach ($structuredIds as $blogId => $postIds) {
            $this->siteSwitcher->runInSite(
                $blogId,
                function () use ($blogId, $postIds) {
                    
                    $userCanReadPrivatePostsOnCurrentBlog = $this->wpService->userCan(
                        $this->currentUser,
                        'read_private_posts'
                    );

                    $this->populatePosts(
                        $blogId, 
                        $postIds, 
                        $userCanReadPrivatePostsOnCurrentBlog
                    );
                }
            );
        }

        // Filter out empty items from orderedPosts
        $filteredPosts = array_filter($this->orderedPosts, function ($item) {
            return !empty($item);
        });

        return $filteredPosts;
    }

    /**
     * Set up the order of posts based on the provided unstructured IDs.
     *
     * @param array $unstructuredIds Array of post IDs in the format 'blogId-postId'.
     */
    private function setUpWantedOrder(array $unstructuredIds): void
    {
        $this->orderedPosts = [];
        foreach ($unstructuredIds as $id) {
            if (!is_string($id)) {
                continue;
            }

            $this->orderedPosts[$id] = null;
        }
    }

    /**
     * Get posts based on the provided post IDs and user permissions.
     *
     * @param array $postIds Array of post IDs to retrieve.
     * @param bool $canReadPrivatePosts Whether the current user can read private posts.
     * @return array Array of prepared post objects.
     */
    private function populatePosts(int $blogId, array $postIds, bool $canReadPrivatePosts): void
    {
        $query = new \WP_Query(array(
            'post__in'            => $postIds,
            'post_type'           => $this->postTypes,
            'posts_per_page'      => 500,
            'post_status'         => $canReadPrivatePosts ? ['publish', 'private'] : ['publish'],
            'ignore_sticky_posts' => false
        ));

        foreach ($query->posts as $post) {
            $key = $blogId . '-' . $post->ID;

            if (!array_key_exists($key, $this->orderedPosts)) {
                continue;
            }

            $preparedPost = \Municipio\Helper\Post::preparePostObject($post);
            $preparedPost->blogId = $this->currentBlogIdContext;

            $this->orderedPosts[$key] = $preparedPost;
        }
    }

    /**
     * Switch to the specified blog if not already switched.
     *
     * @param int $blogId The ID of the blog to switch to.
     * @return bool True if the switch was successful, false otherwise.
     */
    private function maybeSwitchBlog(int $blogId): bool 
    {
        if ($this->currentBlogIdContext === $blogId) {
            return true;
        }

        if (!get_blog_details($blogId)) {
            return false;
        }

        switch_to_blog($blogId);

        $this->currentBlogIdContext = $blogId;

        return true;
    }

    /**
     * Get the current user ID, caching it for performance.
     *
     * @return int The ID of the current user.
     */
    private function getCurrentUser(): int
    {
        static $currentUser = null;

        if ($currentUser === null) {
            $currentUser = get_current_user_id();
        }

        return $currentUser;
    }

    /**
     * Structure post IDs from an unstructured array.
     *
     * @param array $unstructuredIds An array of post IDs in the format 'blogId-postId'.
     * @return array Structured array with blog IDs as keys and arrays of post IDs as values.
     */
    private function structurePostIds(array $unstructuredIds): array
    {
        $structuredIds = [];
        foreach ($unstructuredIds as $id) {
            if (!is_string($id)) {
                continue;
            }

            $parts = explode('-', $id);

            if (count($parts) !== 2) {
                continue;
            }

            $blogId = (int) $parts[0];
            $postId = (int) $parts[1];

            if (!isset($structuredIds[$blogId])) {
                $structuredIds[$blogId] = [];
            }

            $structuredIds[$blogId][] = $postId;
        }

        return $structuredIds;
    }
}