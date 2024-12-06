<?php

namespace ModularityLikePosts\Api;

interface ParamsConfigInterface {
    public function getHtml(): bool;
    public function getIds(): array;
    public function getAppearance(): string;
}