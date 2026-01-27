<?php

use Isolated\Symfony\Component\Finder\Finder;

return [
    'prefix' => 'ModularityLikePosts\\Dependencies',

    'finders' => [
        Finder::create()->files()->in('vendor')->name('*.php'),
    ],

    'patchers' => [
        // Add custom patchers here if needed
    ],

    'expose-classes' => [
        'ModularityLikePosts\\*',
    ],

    'exclude-namespaces' => [
        // Add namespaces to exclude from prefixing
    ],

    'exclude-files' => [
        // Add specific files to exclude from prefixing
    ],

    'exclude-classes' => [
        // Add specific classes to exclude from prefixing
    ],

    'exclude-functions' => [
        // Add specific functions to exclude from prefixing
    ],

    'exclude-constants' => [
        // Add specific constants to exclude from prefixing
    ],
];