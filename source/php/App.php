<?php

namespace ModularityLikePosts;

class App
{
    public function __construct()
    {
        new ComponentsJs();
        add_action('admin_enqueue_scripts', array($this, 'enqueueStyles'));
        add_action('wp_enqueue_scripts', array($this, 'enqueueScripts'));

        //Init module
        add_action('plugins_loaded', array($this, 'registerModule'));
        add_filter('accessibility_items', array($this, 'addLikeIcon'));

        $this->cacheBust = new \ModularityLikePosts\Helper\CacheBust();
    }

    public function addLikeIcon() {
        return [['icon' => 'favorite', 'icon__filled' => false, 'icon__size' => 'lg', 'icon__attributeList' => ['data-post-id' => get_the_ID(), 'data-like-icon' => '', 'style' => 'color: #cc5249; right: .5rem; top: .5rem; cursor: pointer;']]];
    }

    

    /**
     * Enqueue required style
     * @return void
     */
    public function enqueueStyles()
    {
        wp_register_style(
            'like-posts-css',
            MODULARITYLIKEPOSTS_URL . '/dist/' .
            $this->cacheBust->name('css/like-posts.css')
        );

        wp_enqueue_style('like-posts-css');
    }

    /**
     * Enqueue required scripts
     * @return void
     */
    public function enqueueScripts()
    {
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
