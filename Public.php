<?php

// Public functions
use ComponentLibrary\Init as ComponentLibraryInit;

if (!function_exists('liked_posts_render_blade_view')) {
    function liked_posts_render_blade_view($view, $data = [], $compress = true)
    {
        $componentLibrary = new ComponentLibraryInit([]);
        $bladeEngine = $componentLibrary->getEngine();
        $viewPath = MODULARITYLIKEPOSTS_VIEW_PATH;
        $data = array_merge($data, array('errorMessage' => false));

        try {
            $markup = $bladeEngine->makeView($view, $data, [], $viewPath)->render();
        } catch (\Throwable $e) {
            $markup .= '<pre style="border: 3px solid #f00; padding: 10px;">';
            $markup .= '<strong>' . $e->getMessage() . '</strong>';
            $markup .= '<hr style="background: #000; outline: none; border:none; display: block; height: 1px;"/>';
            $markup .= $e->getTraceAsString();
            $markup .= '</pre>';
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
