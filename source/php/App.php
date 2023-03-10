<?php

namespace ModularityLikePosts;

class App
{
    public function __construct()
    {
        new ComponentsJs();
        $this->setAcfFields = new \ModularityLikePosts\Helper\CheckboxPostTypes();

        add_action('wp_enqueue_scripts', array($this, 'enqueueFrontend'));

        //Init module
        add_filter('acf/load_field/name=select_post_type', array($this, 'setOptionsPostTypes'));
        add_filter('acf/load_field/name=liked_post_types_to_show', array($this, 'setModulePostTypes'));

        add_action('plugins_loaded', array($this, 'registerModule'));
        add_filter('accessibility_items', array($this, 'pageIcons'));
        add_filter('post_icons', array($this, 'postsIcon'));


        $this->cacheBust = new \ModularityLikePosts\Helper\CacheBust();
    }

    public function setOptionsPostTypes($field) {
        
        $args = array(
            'public' => true,
            '_builtin' => false
        );

        $postTypes = get_post_types($args, 'names');

        $newChoices = [];
        if (!empty($postTypes)) {
            foreach ($postTypes as $postType) {
                $newChoices[$postType] = ucfirst($postType);
            }
        }

        $field['choices'] = array_merge($field['choices'], $newChoices);

        return $field;
    }

    public function setModulePostTypes ($field) {
        $choices = get_field('select_post_type', 'option');
        $field['choices'] = array_combine($choices, $choices);
        foreach ($field['choices'] as $key => $value) {
            $field['choices'][$key] = ucfirst($value);
        }

        return $field;
    }

    /**
     * If the post type is in the array of post types, then add the icons.
     * 
     * @return The return value is the result of the addLikeIcons() method.
     */
    public function pageIcons() {
        global $post;
        $postTypes = get_field('select_post_type', 'option') ?? [];
        
        if (!empty($postTypes)) {
            foreach ($postTypes as $postType) {
                if ($post->post_type == $postType) {
                    return [['icon' => 'favorite_outline', 'size' => 'lg', 'classes' => ['like-icon'], 'attributes' => ['data-post-id' => !empty(get_the_ID()) ? get_the_ID() : "", 'data-like-icon' => '', 'data-post-type' => $postType ?? '']]];
                }
            }
        }
    }

    public function postsIcon($postType = false) {
        return ['icon' => 'favorite_outline', 'size' => 'md', 'attributes' => ['data-like-icon' => ''], 'classes' => ['like-icon']];
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

        wp_enqueue_script('like-posts-js');
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
