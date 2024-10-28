<?php

namespace ModularityLikePosts\Api;

interface PostsTransformerInterface {
    public function transform(array $posts): mixed;
}