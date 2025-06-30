<?php

namespace ModularityLikePosts\Api;

use ModularityLikePosts\Helper\GetOptionFields;

class GetPosts {
    private int $blogId;
    private bool $currentUser;
    private int $currentBlogIdContext;
    public function __construct(
        private GetOptionFields $getOptionFieldsHelper
    ) {
        $this->blogId               = get_current_blog_id();
        $this->currentUser          = get_current_user_id();
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
        $structuredIds = $this->structurePostIds($unstructuredIds);
        $posts = [];
        foreach ($structuredIds as $blogId => $postIds) {
            $success = $this->maybeSwitchBlog($blogId);
            if (!$success) {
                continue;
            }

            $canReadPrivatePosts = user_can($this->currentUser, 'read_private_posts');

            $posts[$blogId] = $this->getPostsQuery($postIds, $canReadPrivatePosts);
        }

        restore_current_blog();

        return $posts;
    }

    /**
     * Get posts based on the provided post IDs and user permissions.
     *
     * @param array $postIds Array of post IDs to retrieve.
     * @param bool $canReadPrivatePosts Whether the current user can read private posts.
     * @return array Array of prepared post objects.
     */
    private function getPostsQuery(array $postIds, bool $canReadPrivatePosts): array
    {
        $query = new \WP_Query(array(
            'post__in' => $postIds,
            'post_type' => $this->getOptionFieldsHelper->getPostTypes(),
            'posts_per_page' => -1,
            'post_status' => $canReadPrivatePosts ? ['publish'] : ['publish', 'private'],
            'ignore_sticky_posts' => true
        ));

        if (empty($query->posts)) {
            return [];
        }

        $posts = [];

        foreach ($query->posts as $post) {
            $posts[] = \Municipio\Helper\Post::preparePostObject($post);
        }

        return $posts;
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