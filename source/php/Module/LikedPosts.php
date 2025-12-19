<?php

namespace ModularityLikePosts\Module;

use ModularityLikePosts\Module\SharedPosts;
use ModularityLikePosts\Helper\GetOptionFields;
use AcfService\AcfService;
use AcfService\Implementations\NativeAcfService;
use \WpService\Implementations\WpServiceWithTypecastedReturns;
use \WpService\Implementations\NativeWpService;

class LikedPosts extends \Modularity\Module
{
    public $slug = 'liked-posts';
    public $supports = array();
    private $template = 'liked-posts';
    private $getOptionFieldsHelper;
    private $acfService;
    private $wpService;

    public function init()
    {
        //Define module
        $this->nameSingular = __("Liked posts", 'modularity-like');
        $this->namePlural = __("Liked posts", 'modularity-like');
        $this->description = __("Shows the users liked posts", 'modularity-like');

        //Initialize services, helpers etc.
        $this->acfService            = new NativeAcfService();
        $this->wpService             = new WpServiceWithTypecastedReturns(new NativeWpService());
        $this->getOptionFieldsHelper = new GetOptionFields($this->acfService);

        $this->registerMeta();
    }

     /**
     * View data
     * @return array
     */
    public function data(): array
    {
        $fields = $this->getFields();
      
        $data['likeIcon']     = $this->getOptionFieldsHelper->getIcon();
        $data['noPostsFound'] = $this->getLabelNoPostsFound();
        $data['appearance']   = !empty($fields['liked_posts_appearance']) ? $fields['liked_posts_appearance'] : 'collection';
        $data['postTypes']    = json_encode($fields['liked_post_types_to_show']);
        $data['postColumns']  = apply_filters('Modularity/Display/replaceGrid', $fields['liked_posts_columns']);
        $data['shareButton']  = $fields['liked_posts_share_button'];
        $data['labels']       = $this->getLabels();
        $data['id']           = uniqid();

        return $data;
    }

    /**
     * Get the label for no posts found from ACF options.
     *
     * @return string The label for no posts found.
     */
    private function getLabelNoPostsFound(): string
    {
        return $this->acfService->getField(
            'like_no_posts_found_text',
            'option'
        ) ?: __('No liked posts were found', 'modularity-like');
    }

    /**
     * Get the labels used in the module.
     *
     * @return array An associative array of labels.
     */
    private function getLabels()
    {
        return [
            'shareButtonLabel' => __('Share favorites', 'modularity-like'),
            'shareSuccess'     => __('Link was copied successfully', 'modularity-like'),
            'shareError'       => __('Something went wrong, link: ', 'modularity-like'),
            'close'            => __('Close', 'modularity-like'),
            'shareLinkLabel'   => __('Share your link', 'modularity-like'),
            'shareLinkName'    => __('List name', 'modularity-like'), 
            'shareLinkExcerpt' => __('List excerpt', 'modularity-like'), 
        ];
    }

    /**
     * Get the template file for the module.
     *
     * @return string The template file name.
     */
    public function template(): string
    {
        return $this->template . ".blade.php";
    }

    /**
     * Register the user meta for liked posts.
     *
     * @return void
     */
    private function registerMeta(): void
    {
        register_meta('user', 'likedPosts', array(
            'type' => 'object',
            'single' => true,
            'show_in_rest' => array(
                'schema' => array(
                    'type' => 'object',
                    'additionalProperties' => array(
                        'type' => 'object',
                        'properties' => array(
                            'postId'   => array(
                                'type' => ['string', 'integer'],
                            ),
                            'blogId'   => array(
                                'type' => ['string', 'integer'],
                            ),
                            'postType' => array(
                                'type' => 'string',
                            ),
                            'likedAt'  => array(
                                'type'   => ['string', 'integer'],
                            ),
                            'website' => array(
                                'type' => 'string',
                            )
                        ),
                        'required'             => ['postId', 'blogId', 'postType', 'likedAt'],
                        'additionalProperties' => false,
                    ),
                ),
            ),
        ));
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
