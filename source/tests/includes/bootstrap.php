<?php

require dirname(__DIR__, 3) . '/vendor/autoload.php';

if (!interface_exists(\Municipio\HooksRegistrar\Hookable::class)) {
    class_alias(TestHookable::class, \Municipio\HooksRegistrar\Hookable::class);
}

if (!class_exists(\Modularity\Module::class)) {
    class_alias(TestModule::class, \Modularity\Module::class);
}

interface TestHookable
{
    public function addHooks(): void;
}

class TestModule
{
    public $nameSingular;
    public $namePlural;
    public $description;
}
