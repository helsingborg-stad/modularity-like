<?php


namespace ModularityLikePosts;

use ModularityLikePosts\Api\GetPosts;
use Municipio\Api\RestApiEndpointsRegistry;
use ModularityLikePosts\Blade\Blade;
use ModularityLikePosts\Helper\GetOptionFields;
use WpService\Implementations\NativeWpService;
use WpService\Implementations\WpServiceWithTypecastedReturns;
use WpService\WpService;
use AcfService\AcfService;
use Municipio\Helper\SiteSwitcher\SiteSwitcher;
use Municipio\HooksRegistrar\HooksRegistrar;
use ModularityLikePosts\Helper\CacheBust;

/**
 * Class App
 * 
 * This class represents the main application for the Like Posts plugin.
 * It handles the initialization of various components, enqueuing of scripts and styles,
 * and registration of the module.
 */
class App implements \Municipio\HooksRegistrar\Hookable
{
    public function __construct(
        private Blade $bladeInstance, 
        private SiteSwitcher $siteSwitcher, 
        private WpService $wpService,
        private GetPosts $getPostsHelper,
        private GetOptionFields $getOptionFieldsHelper,
        private CacheBust $cacheBust
    )
    {
        $this->setUpRestEndpoints();
        $this->setUpLikeIconCounter();
    }

    /**
     * Set up REST API endpoints for the application.
     *
     * @return void
     */
    private function setUpRestEndpoints(): void
    {
        RestApiEndpointsRegistry::add(new \ModularityLikePosts\Api\LikePostsEndpoint(
            $this->bladeInstance,
            $this->getOptionFieldsHelper,
            $this->getPostsHelper
        ));
    }

    /**
     * Set up the like icon counter functionality.
     *
     * @return void
     */
    private function setUpLikeIconCounter(): void
    {
        new LikeIconCounter($this->getOptionFieldsHelper);
    }

    /**
     * Add hooks to WordPress actions and filters.
     *
     * @return void
     */
    public function addHooks(): void
     {
        $this->wpService->addAction('wp_enqueue_scripts', array($this, 'enqueueFrontend'));
        $this->wpService->addFilter('acf/load_field/name=liked_post_types_to_show', array($this, 'setModulePostTypes'));
        $this->wpService->addAction('init', array($this, 'registerModule'));
        $this->wpService->addFilter('Municipio/Helper/Post/CallToActionItems', array($this, 'postsIcon'), 10, 2);
        $this->wpService->addFilter('Municipio/Admin/Acf/PrefillIconChoice', array($this, 'addIconsToSelect'));
        $this->wpService->addFilter('kirki_inline_styles', array($this, 'addIconColor'), 10, 1);
    }

    /**
     * Add icon color CSS variable to inline styles.
     *
     * @param string $inlineStyles The existing inline styles.
     * @return string The modified inline styles with the icon color variable.
     */
    public function addIconColor($inlineStyles) 
    {
        $color = $this->getOptionFieldsHelper->getIconColor();
        $inlineStyles .= ':root { --like-icon-color: ' . $color . '; }';

        return $inlineStyles;
    }

    /**
     * Add like icon field to ACF icon select fields.
     *
     * @param array $fields The existing ACF fields.
     * @return array The modified ACF fields with the like icon field added.
     */
    public function addIconsToSelect($fields) 
    {
        $fields[] = 'like_icon';

        return $fields;
    }

    /**
     * Set the post types available for the module.
     *
     * @param array $field The ACF field configuration.
     * @return array The modified ACF field configuration with post types.
     */
    public function setModulePostTypes($field)
    {
        $choices = $this->getOptionFieldsHelper->getPostTypes();

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

    /**
     * Add like icon to post call to action items.
     *
     * @param array $callToActionArray The existing call to action items.
     * @param object $post The post object.
     * @return array The modified call to action items with the like icon added.
     */
    public function postsIcon($callToActionArray, $post)
    {
        $frontPageId = (int) $this->wpService->getOption('page_on_front', 0);

        if (
            $frontPageId !== $post->ID &&
            !empty($post->post_type) && 
            in_array($post->post_type, $this->getOptionFieldsHelper->getPostTypes())
        ) {
            $callToActionArray['floating'] = [
                'wrapper' => [
                    'attributeList' => [
                        'data-js-like-icon-wrapper' => ''
                    ],
                ],
                'icon' => [
                    'icon' => $this->getOptionFieldsHelper->getIcon(), 
                    'filled' => false, 
                    'size' => 'md', 
                    'attributeList' => [
                        'data-like-icon' => '', 
                        'data-post-id' => $post->ID, 
                        'data-post-type' => $post->post_type,
                        'data-blog-id' => get_current_blog_id()
                    ], 
                ]
            ];
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

        $userLikedPosts = get_user_meta($user->ID, 'likedPosts', true);

        $tooltipUnlike = $this->getOptionFieldsHelper->getTooltipUnlike();
        $tooltipLike = $this->getOptionFieldsHelper->getTooltipLike();

        $data = [
            'currentUser'     => $user->ID,
            'currentBlogId'   => get_current_blog_id(),
            'likedPostsMeta'  => (object) $userLikedPosts,
            'tooltipUnlike'   => $tooltipUnlike,
            'tooltipLike'     => $tooltipLike,
        ];

        $inlineJs = 'window.likedPosts = ' . wp_json_encode($data) . ';';
        wp_add_inline_script('like-posts-js', $inlineJs, 'before');

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
