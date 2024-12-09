<?php

namespace ModularityLikePosts\Api;

use ModularityLikePosts\Api\ParamsConfigInterface;
use ModularityLikePosts\Api\PostsTransformerInterface;
use ModularityLikePosts\Blade\Blade;

class HtmlTransformer implements PostsTransformerInterface {
    public function __construct(private Blade $bladeInstance, private ParamsConfigInterface $paramsConfig)
    {}

    public function transform(array $posts): mixed
    {
        if (!$this->paramsConfig->getHtml()) {
            return $posts;
        }

        $icon = get_field('like_icon', 'option') ?? 'favorite';
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