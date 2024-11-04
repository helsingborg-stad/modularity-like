<?php

// Public functions
use ComponentLibrary\Init as ComponentLibraryInit;

if (!function_exists('liked_posts_render_blade_view')) {
    function liked_posts_render_blade_view($view, $data = [], $compress = true)
    {
        $markup = '';
        $componentLibrary = new ComponentLibraryInit([]);
        $bladeEngine = $componentLibrary->getEngine();
        $viewPaths = [MODULARITYLIKEPOSTS_MODULE_VIEW_PATH, MODULARITYLIKEPOSTS_VIEW_PATH];
        $data = array_merge($data, array('errorMessage' => false));

        try {
            $markup = $bladeEngine->makeView($view, $data, [], $viewPaths)->render();
        } catch (\Throwable $e) {
            $bladeEngine->errorHandler($e)->print();
        }

        if ($compress == true) {
            $replacements = array(
              ["~<!--(.*?)-->~s", ""],
              ["/\r|\n/", ""],
              ["!\s+!", " "]
            );

            foreach ($replacements as $replacement) {
                $markup = preg_replace($replacement[0], $replacement[1], $markup);
            }

            return $markup;
        }

        return $markup;
    }
}
