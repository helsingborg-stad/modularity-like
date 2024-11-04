<?php


namespace ModularityLikePosts;

use Municipio\Api\RestApiEndpointsRegistry;

/**
 * Class App
 * 
 * This class represents the main application for the Like Posts plugin.
 * It handles the initialization of various components, enqueuing of scripts and styles,
 * and registration of the module.
 */
class App
{
    private $cacheBust;

    public function __construct()
    {
        new LikeIconCounter();
        
        add_action('wp_enqueue_scripts', array($this, 'enqueueFrontend'));
        add_filter('acf/load_field/name=liked_post_types_to_show', array($this, 'setModulePostTypes'));
        add_action('plugins_loaded', array($this, 'registerModule'));
        add_filter('Municipio/Helper/Post/CallToActionItems', array($this, 'postsIcon'), 10, 2);
        add_filter('Municipio/Admin/Acf/PrefillIconChoice', array($this, 'addIconsToSelect'));
        add_filter('kirki_inline_styles', array($this, 'addIconColor'), 10, 1);

        RestApiEndpointsRegistry::add(new \ModularityLikePosts\Api\LikePostsEndpoint());
        
        $this->cacheBust = new \ModularityLikePosts\Helper\CacheBust();
    }

    public function addIconColor($inlineStyles) 
    {
        $color = get_field('like_icon_color', 'option') ?? '#e84666';
        $inlineStyles .= ':root { --like-icon-color: ' . $color . '; }';

        return $inlineStyles;
    }

    public function addIconsToSelect($fields) 
    {
        $fields[] = 'like_icon';

        return $fields;
    }

    public function setModulePostTypes($field)
    {
        $choices = get_field('select_post_type', 'option');

        if(is_array($choices) && !empty($choices)) {
            $field['choices'] = array_combine($choices, $choices);
            foreach ($field['choices'] as $key => $value) {
                $field['choices'][$key] = ucfirst($value);
            }
        } else {
            $field['choices'] = [];
        }
        
        return $field;
    }

    public function postsIcon($callToActionArray, $post)
    {
        $icon = get_field('like_icon', 'option') ?? 'favorite';
        $postTypes = get_field('select_post_type', 'option') ?? [];
        if (!empty($post->post_type) && in_array($post->post_type, $postTypes)) {
            $callToActionArray['floating'] =  ['icon' => $icon, 'filled' => false, 'size' => 'md', 'attributeList' => ['data-like-icon' => '', 'data-post-id' => $post->ID, 'data-post-type' => $post->post_type], 'classList' => ['like-icon']];
        };

        return $callToActionArray;
    }

    /**
     * Enqueue required scripts
     * @return void
     */
    public function enqueueFrontend()
    {
        wp_register_style(
            'like-posts-css',
            MODULARITYLIKEPOSTS_URL . '/dist/' .
            $this->cacheBust->name('css/like-posts.css')
        );

        wp_enqueue_style('like-posts-css');

        wp_register_script(
            'like-posts-js',
            MODULARITYLIKEPOSTS_URL . '/dist/' .
            $this->cacheBust->name('js/like-posts.js')
        );

        $user = wp_get_current_user();

        if (!empty($user->ID)) {
            $userLikedPosts = get_user_meta($user->ID, 'likedPosts', true);

            wp_localize_script('like-posts-js', 'likedPosts',  ['currentUser' => $user->ID, 'likedPostsMeta' => (object) $userLikedPosts]);

            wp_enqueue_script('like-posts-js');
        }
    }

    /**
     * Register the module
     * @return void
     */
    public function registerModule()
    {
        if (function_exists('modularity_register_module')) {
            modularity_register_module(
                MODULARITYLIKEPOSTS_PATH . 'source/php/Module/',
                'LikedPosts'
            );
        }
    }
}
