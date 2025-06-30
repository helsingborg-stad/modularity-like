<?php

namespace ModularityLikePosts\Api;

use ModularityLikePosts\Api\ParamsConfigInterface;
use ModularityLikePosts\Api\PostsTransformerInterface;
use ModularityLikePosts\Blade\Blade;
use ModularityLikePosts\Helper\GetOptionFields;

class HtmlTransformer implements PostsTransformerInterface {
    public function __construct(
        private Blade $bladeInstance, 
        private ParamsConfigInterface $paramsConfig,
        private GetOptionFields $getOptionFieldsHelper
    )
    {}

    /**
     * Transforms an array of posts into HTML based on the provided configuration.
     *
     * @param array $posts Array of posts to be transformed.
     * @return mixed Transformed HTML or the original array if HTML generation is not enabled.
     */
    public function transform(array $posts): mixed
    {
        if (!$this->paramsConfig->getHtml()) {
            return $posts;
        }

        $icon = $this->getOptionFieldsHelper->getIcon();
        $emblem = get_theme_mod('logotype_emblem') ?? null;
        $html = $this->bladeInstance->render(
            $this->paramsConfig->getAppearance(),
            ['posts' => $posts, 'icon' => $icon, 'emblem' => $emblem],
            true,
            [MODULARITYLIKEPOSTS_VIEW_PATH]
        );

        return $html;
    }
}