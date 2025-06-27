<?php

namespace ModularityLikePosts\Api;

use Municipio\Api\RestApiEndpoint;
use WP_REST_Request;
use WP_REST_Response;
use ModularityLikePosts\Blade\Blade;
use ModularityLikePosts\Helper\GetOptionFields;

class LikePostsEndpoint extends RestApiEndpoint {
    private const NAMESPACE = 'like/v1';
    private const ROUTE     = '/ids=(?P<ids>[\d,-]+)';

    public function __construct(
        private Blade $bladeInstance,
        private GetOptionFields $getOptionFieldsHelper,
        private GetPosts $getPostsHelper
    ) {
    }

    public function handleRegisterRestRoute(): bool {
        return register_rest_route(self::NAMESPACE, self::ROUTE, array(
            'methods'             => 'GET',
            'callback'            => array($this, 'handleRequest'),
            'permission_callback' => '__return_true'
        ));
    }

    public function handleRequest(WP_REST_Request $request)
    {
        $paramsConfig = new ParamsConfig($request->get_params());

        if (empty($paramsConfig->getIds())) {
            return new WP_REST_Response(null, 400);
        }
        
        // $posts = $this->getPosts($paramsConfig->getIds());
        $posts = $this->getPostsHelper->getPosts($paramsConfig->getIds());
        $posts = (new HtmlTransformer($this->bladeInstance, $paramsConfig, $this->getOptionFieldsHelper))->transform($posts);

        return $posts;
    }

    private function getPosts(array $idStrings) {
        $query = new \WP_Query(array(
            'post__in' => $idStrings,
            // Only set available post types in options
            'post_type' => $this->getOptionFieldsHelper->getPostTypes(),
            'posts_per_page' => -1,
            'post_status' => ['publish'],
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
}