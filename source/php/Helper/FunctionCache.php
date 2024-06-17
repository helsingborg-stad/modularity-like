<?php

namespace ModularityLikePosts\Helper;

class FunctionCache {
    private static $runtimeCache = [];

    /**
     * Cached function call.
     * 
     * @param callable $callable The function or method to call.
     * @param int|null $ttl The time-to-live for the cache in seconds.
     * @param string $cacheGroup The cache group for wp_cache.
     * @return mixed The result of the function call.
     */
    public static function call(callable $callable, $ttl = null, $cacheGroup = 'default') {
        // Generate a cache key based on the function contents
        $cacheKey = self::generateCacheKey($callable);

        // Check runtime cache first
        if (isset(self::$runtimeCache[$cacheKey])) {
            return self::$runtimeCache[$cacheKey];
        }

        // Check wp_cache
        $cacheResult = wp_cache_get($cacheKey, $cacheGroup);
        if ($cacheResult !== false) {
            self::$runtimeCache[$cacheKey] = $cacheResult;
            return $cacheResult;
        }

        // Call the function
        $result = $callable();

        // Store the result in runtime cache
        self::$runtimeCache[$cacheKey] = $result;

        // Store the result in wp_cache with TTL if provided
        if ($ttl !== null) {
            wp_cache_set($cacheKey, $result, $cacheGroup, $ttl);
        } else {
            wp_cache_set($cacheKey, $result, $cacheGroup);
        }

        return $result;
    }

    /**
     * Generate a unique cache key based on the function contents.
     * 
     * @param callable $callable The function or method to call.
     * @return string The generated cache key.
     */
    private static function generateCacheKey(callable $callable) {
        $reflection = new \ReflectionFunction($callable);
        $file = $reflection->getFileName();
        $startLine = $reflection->getStartLine();
        $endLine = $reflection->getEndLine();
        $functionContents = file($file);
        $code = implode('', array_slice($functionContents, $startLine - 1, $endLine - $startLine + 1));

        return "fc_cache_" . md5($code);
    }
}

