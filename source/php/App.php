<?php


namespace ModularityLikePosts;

/**
 * Class App
 * 
 * This class represents the main application for the Like Posts plugin.
 * It handles the initialization of various components, enqueuing of scripts and styles,
 * and registration of the module.
 */
class App
{
    private $setAcfFields;
    private $cacheBust;

    public function __construct()
    {
        new ComponentsJs();
        new MenuIconCounter();
        $this->setAcfFields = new \ModularityLikePosts\Helper\CheckboxPostTypes();

        add_action('wp_enqueue_scripts', array($this, 'enqueueFrontend'));
        add_filter('acf/load_field/name=liked_post_types_to_show', array($this, 'setModulePostTypes'));
        add_action('plugins_loaded', array($this, 'registerModule'));
        add_filter('Municipio/Helper/Post/CallToActionItems', array($this, 'postsIcon'), 10, 2);
        add_filter('Municipio/Admin/Acf/PrefillIconChoice', array($this, 'optionsAcfFieldIcons'));

        $this->cacheBust = new \ModularityLikePosts\Helper\CacheBust();
    }

    public function optionsAcfFieldIcons($fields) {
        // $fields[] = 'like_icon';

        return $fields;
    }

    public function setModulePostTypes($field)
    {
        $choices = get_field('select_post_type', 'option');
        $field['choices'] = array_combine($choices, $choices);
        foreach ($field['choices'] as $key => $value) {
            $field['choices'][$key] = ucfirst($value);
        }

        return $field;
    }

    public function postsIcon($callToActionArray, $post)
    {
        $postTypes = get_field('select_post_type', 'option') ?? [];
        if (!empty($post->post_type) && in_array($post->post_type, $postTypes)) {
            $callToActionArray['floating'] =  ['icon' => 'favorite', 'filled' => false, 'size' => 'md', 'attributeList' => ['data-like-icon' => '', 'data-post-id' => $post->ID, 'data-post-type' => $post->post_type], 'classList' => ['like-icon'], 'postTypes' => $postTypes];
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

        wp_localize_script('like-posts-js', 'likedPosts',  ['pageUrl' => get_home_url()]);

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
