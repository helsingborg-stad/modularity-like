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
];