<?php

namespace ModularityLikePosts\Api;

use ModularityLikePosts\Api\ParamsConfigInterface;
use ModularityLikePosts\Api\PostsTransformerInterface;

class HtmlTransformer implements PostsTransformerInterface {
    public function __construct(private ParamsConfigInterface $paramsConfig)
    {}

    public function transform(array $posts): mixed
    {
        if (!$this->paramsConfig->getHtml()) {
            return $posts;
        }

        $icon = get_field('like_icon', 'option') ?? 'favorite';
        $emblem = get_theme_mod('logotype_emblem') ?? null;

        $html = liked_posts_render_blade_view('html', ['posts' => $posts, 'icon' => $icon, 'emblem' => $emblem]);

        return $html;
    }
}