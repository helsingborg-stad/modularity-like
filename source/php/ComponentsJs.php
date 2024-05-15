<?php

namespace ModularityLikePosts;

class ComponentsJs
{
    private const VIEW_PATH = MODULARITYLIKEPOSTS_VIEW_PATH . 'js/object/';

    public function __construct()
    {
        add_action('wp_enqueue_scripts', array($this, 'renderComponents'), 50);
    }

    /**
     * Send data to frontend application
     *
     * @return void
     */
    public function renderComponents(): void
    {
        if (!$this->shouldRenderComponents()) {
            return;
        }

        $components = $this->createComponents();

        $l10n = [
            'shareYourFavourites' => __('Share your favorites with this link', 'modularity-like'),
        ];
        wp_localize_script(
            'like-posts-js',
            'likedPostsLang',
            $l10n
        );
        wp_localize_script(
            'like-posts-js',
            'likedPostsComponents',
            $components
        );
    }

    private function shouldRenderComponents(): bool
    {
        return !is_admin();
    }

    /**
     * Fetch components from js view path
     *
     * @return void
     */
    public function createComponents(): array
    {
        $components = [];
        $viewFiles = glob(self::VIEW_PATH . '*.blade.php');
        if (is_array($viewFiles) && !empty($viewFiles)) {
            foreach ($viewFiles as $view) {
                $components[$this->getKey($view)] = (object) [
                    'key' => $this->getKey($view),
                    'html' => $this->renderView(
                        $view,
                        $this->getComponentViewData($this->getKey($view))
                    )
                ];
            }
        }
        return $components;
    }

    /**
     * Create a js-object friendly name of the view
     *
     * @param string $view
     * @return string
     */
    private function getKey(string $view): string
    {
        return str_replace(
            ".blade.php",
            "",
            basename($view)
        );
    }

    private function getComponentViewData(string $viewName): array 
    {
        if (method_exists($this, $viewName . 'ViewData')) {
            return $this->{$viewName . 'ViewData'}();
        }
        return [];
    }

    /**
     * Get data for the collection view. Utilized by @getComponentViewData
     */
    private function collectionViewData(): array 
    {
        return  [
            'lang' => (object) $this->lang,
            'icon' => get_field('like_icon', 'option') ?? 'favorite'
        ];
    }

    /**
     * Render blade view
     *
     * @param string  $view       The view path
     * @param array   $data       Data required to render view (default: [])
     * @param boolean $compress   If true, compress the output (default: true)
     * @return string
     */
    private function renderView(string $view, array $data = [], bool $compress = true): string
    {
        
        if (function_exists('liked_posts_render_blade_view')) {
            return liked_posts_render_blade_view(
                $this->sanitizeViewPath($view),
                $data,
                $compress
            );
        }

        throw new \RuntimeException('liked_posts_render_blade_view() does not exist');
    }

    /**
     * View path sanitizer
     *
     * @param string  $view   The full path
     * @return string $view   The relative path
     */
    private function sanitizeViewPath(string $view): string
    {
        return str_replace(
            ".blade.php",
            "",
            str_replace(MODULARITYLIKEPOSTS_VIEW_PATH, "", $view)
        );
    }
}
