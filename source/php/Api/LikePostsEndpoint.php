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

    /**
     * Register the REST route for the LikePosts endpoint.
     *
     * @return bool True if the route was registered successfully, false otherwise.
     */
    public function handleRegisterRestRoute(): bool {
        return register_rest_route(self::NAMESPACE, self::ROUTE, array(
            'methods'             => 'GET',
            'callback'            => array($this, 'handleRequest'),
            'permission_callback' => '__return_true'
        ));
    }

    /**
     * Handle the REST request for the LikePosts endpoint.
     *
     * @param WP_REST_Request $request The REST request object.
     * @return WP_REST_Response The response containing the posts or an error.
     */
    public function handleRequest(WP_REST_Request $request)
    {
        $paramsConfig = new ParamsConfig($request->get_params());

        if (empty($paramsConfig->getIds())) {
            return new WP_REST_Response(null, 400);
        }

        $posts = $this->getPostsHelper->getPosts($paramsConfig->getIds());
        $posts = (new HtmlTransformer($this->bladeInstance, $paramsConfig, $this->getOptionFieldsHelper))->transform($posts);

        return $posts;
    }
}