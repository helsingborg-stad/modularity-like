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

    public function getPostTypes() 
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
}