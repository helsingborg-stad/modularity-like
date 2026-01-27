<?php

use Isolated\Symfony\Component\Finder\Finder;

return [
    'prefix' => 'ModularityLikePosts\\Dependencies',
    'finders' => [
        Finder::create()->files()->in('vendor')->name('*.php'),
    ],
    'expose-classes' => [
        'ModularityLikePosts\\*',
    ],
    'output-dir' => 'vendor-scoped',
    'exclude-namespaces' => [
        'Composer\\',
    ],
    'patchers' => [
        function (string $filePath, string $prefix, string $content): string {
            if (strpos($filePath, 'WpService') !== false) {
                $content = preg_replace('/namespace\\s+' . preg_quote($prefix, '/') . '\\WpService\\/', 'namespace ' . $prefix . '\\WpService\\', $content);
                $content = preg_replace('/use\\s+' . preg_quote($prefix, '/') . '\\WpService\\/', 'use ' . $prefix . '\\WpService\\', $content);
            }
            if (strpos($content, '\\WpService\\') !== false && strpos($content, '\\' . $prefix . '\\WpService\\') === false) {
                $content = str_replace('\\WpService\\', '\\' . $prefix . '\\WpService\\', $content);
            }
            return $content;
        },
    ],
];