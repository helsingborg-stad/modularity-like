<?php

namespace ModularityLikePosts\Module;

class LikedPosts extends \Modularity\Module
{
    public $slug = 'liked-posts';
    public $supports = array();

    public function init()
    {
        //Define module
        $this->nameSingular = __("Liked posts", 'modularity-like');
        $this->namePlural = __("Liked posts", 'modularity-like');
        $this->description = __("Shows the users liked posts", 'modularity-like');
    }

     /**
     * View data
     * @return array
     */
    public function data(): array
    {
        $fields = get_fields($this->ID);
        $data['likeIcon'] = get_field('like_icon', 'option') ?? 'favorite';

        /* Possibility to add more views */
        $data['displayAs'] = !empty($fields['liked_posts_display_as']) ? $fields['liked_posts_display_as'] : 'collection';

        $data['postTypes'] = json_encode($fields['liked_post_types_to_show']);
        $data['postColumns'] = apply_filters('Modularity/Display/replaceGrid', $fields['liked_posts_columns']);
        $data['shareButton'] = $fields['liked_posts_share_button'];
        $data['labels'] = [
            'shareButtonLabel' => __('Share favorites', 'modularity-like'),
            'shareSuccess' => __('Link was copied successfully', 'modularity-like'),
            'shareError' => __('Something went wrong, link: ', 'modularity-like'),
            'close' => __('Close', 'modularity-like'),
            'shareLinkLabel' => __('Share your link', 'modularity-like'),
            'shareLinkName' => __('List name', 'modularity-like'), 
            'shareLinkExcerpt' => __('List excerpt', 'modularity-like'), 
            'noPostsFound' => __('No liked posts were found', 'modularity-like')
        ];
        $data['id'] = uniqid();

        if (function_exists('get_theme_mod')) {
            $emblem = get_theme_mod('logotype_emblem');
        }

        $data['emblem'] = !empty($emblem) ? $emblem : '';

        return $data;
    }

    public function template(): string
    {
        return "liked-posts.blade.php";
    }

    /**
     * Available "magic" methods for modules:
     * init()            What to do on initialization
     * data()            Use to send data to view (return array)
     * style()           Enqueue style only when module is used on page
     * script            Enqueue script only when module is used on page
     * adminEnqueue()    Enqueue scripts for the module edit/add page in admin
     * template()        Return the view template (blade) the module should use when displayed
     */
}
