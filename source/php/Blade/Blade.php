<?php

namespace ModularityLikePosts\Blade;

use ComponentLibrary\Init as ComponentLibraryInit;
use HelsingborgStad\BladeService\BladeServiceInterface;

class Blade
{
    private static ?ComponentLibraryInit $componentLibrary = null;
    private ?BladeServiceInterface $bladeEngine = null;

    public function __construct(?ComponentLibraryInit $componentLibrary = null)
    {
        if (self::$componentLibrary === null) {
            self::$componentLibrary = $componentLibrary ?? new ComponentLibraryInit([]);
        }

        $this->bladeEngine = self::$componentLibrary->getEngine();
    }

    public function render($view, $data = [], $compress = true, $viewPaths = [MODULARITYLIKEPOSTS_MODULE_VIEW_PATH])
    {
        $markup = '';
        $data = array_merge($data, array('errorMessage' => false));

        try {
            $markup = $this->bladeEngine->makeView($view, $data, [], $viewPaths)->render();
        } catch (\Throwable $e) {
            $this->bladeEngine->errorHandler($e)->print();
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