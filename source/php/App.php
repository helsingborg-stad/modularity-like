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
        $frontPageId     = (int) $this->wpService->getOption('page_on_front', 0);
        $isFrontPage     = $frontPageId === $post->ID;
        $hasPostType     = !empty($post->post_type);
        $enabledPostType = in_array($post->post_type, $this->getOptionFieldsHelper->getPostTypes());

        if (!$isFrontPage && $hasPostType && $enabledPostType) {

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
                        'data-blog-id' => $this->wpService->getCurrentBlogId()
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

        //TODO: Implement wputilservice
        $this->wpService->wpEnqueueStyle(
            'like-posts-css',
            MODULARITYLIKEPOSTS_URL . '/dist/' .
            $this->cacheBust->name('css/like-posts.css')
        );

        $this->wpService->wpRegisterScript(
            'like-posts-js',
            MODULARITYLIKEPOSTS_URL . '/dist/' .
            $this->cacheBust->name('js/like-posts.js')
        );

        $userId = $this->wpService->wpGetCurrentUser()->ID ?? 0;

        $data = [
            'currentUser'     => $userId,
            'currentBlogId'   => $this->wpService->getCurrentBlogId(),
            'likedPostsMeta'  => (object) $this->wpService->getUserMeta(
                $userId, 
                'likedPosts', 
                true
            ) ?? [],
            'tooltipUnlike'   => $this->getOptionFieldsHelper->getTooltipUnlike(),
            'tooltipLike'     => $this->getOptionFieldsHelper->getTooltipLike()
        ];

        $inlineJs = 'window.likedPosts = ' . wp_json_encode($data) . ';';
        $this->wpService->wpAddInlineScript('like-posts-js', $inlineJs, 'before');

        $this->wpService->wpEnqueueScript('like-posts-js');
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
