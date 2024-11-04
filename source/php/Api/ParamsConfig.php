<?php

namespace ModularityLikePosts\Api;

class ParamsConfig implements ParamsConfigInterface
{
    private bool $html          = false;
    private array $ids          = [];

    public function __construct(array $config)
    {
        $this->html = isset($config['html']) ? true : $this->html;
        $this->ids  = isset($config['ids']) ? explode(',', $config['ids']) : [];
    }

    public function getHtml(): bool
    {
        return $this->html;
    }

    public function getIds(): array
    {
        return $this->ids;
    }
}