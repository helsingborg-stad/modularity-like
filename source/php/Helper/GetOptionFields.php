<?php

namespace ModularityLikePosts\Helper;

class GetOptionFields
{
    public function getIconColor()
    {
        static $color = null;

        if (!is_null($color)) {
            return $color;
        }

        $color = get_field('like_icon_color', 'option') ?? '#e84666';

        return $color;
    }

    public function getIcon() 
    {
        static $icon = null;

        if (!is_null($icon)) {
            return $icon;
        }

        $icon = get_field('like_icon', 'option') ?? 'favorite';

        return $icon;
    }

    public function getPostTypes(): array
    {
        static $postTypes = null;

        if (!is_null($postTypes)) {
            return $postTypes;
        }

        $postTypes = get_field('select_post_type', 'option') ?? [];

        return $postTypes;
    }

    public function getCounter()
    {
        static $counter = null;

        if (!is_null($counter)) {
            return $counter;
        }

        $counter = get_field('like_counter', 'option') ?? false;

        return $counter;
    }

    public function getTooltipLike()
    {
        static $tooltipLike = null;

        if (!is_null($tooltipLike)) {
            return $tooltipLike;
        }

        $tooltipLike = get_field('like_tooltip_like_text', 'option') ?? false;

        return $tooltipLike;
    }

    public function getTooltipUnlike()
    {
        static $tooltipUnlike = null;

        if (!is_null($tooltipUnlike)) {
            return $tooltipUnlike;
        }

        $tooltipUnlike = get_field('like_tooltip_unlike_text', 'option') ?? false;

        return $tooltipUnlike;
    }
}