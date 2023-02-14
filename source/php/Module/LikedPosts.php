<?php

namespace ModularityLikePosts\Module;

class LikedPosts extends \Modularity\Module
{
    public $slug = 'liked-posts';
    public $supports = array();
    public $isBlockCompatible = false;

    public function init()
    {
        //Define module
        $this->nameSingular = __("Liked posts", 'like-posts');
        $this->namePlural = __("Liked posts", 'like-posts');
        $this->description = __("Shows the users liked posts", 'like-posts');
    }

     /**
     * View data
     * @return array
     */
    public function data(): array
    {
        $data = get_fields($this->ID);
        $data['test'] = $this->ID;

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
