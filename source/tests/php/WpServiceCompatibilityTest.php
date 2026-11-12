<?php

use Brain\Monkey;
use Brain\Monkey\Functions;
use ModularityLikePosts\Helper\GetOptionFields;
use ModularityLikePosts\LikeIconCounter;
use ModularityLikePosts\Module\LikedPosts;
use PHPUnit\Framework\TestCase;
use WpService\Implementations\NativeWpService;
use WpService\Implementations\WpServiceWithTypecastedReturns;

class WpServiceCompatibilityTest extends TestCase
{
    protected function setUp(): void
    {
        parent::setUp();
        Monkey\setUp();
    }

    protected function tearDown(): void
    {
        $this->addToAssertionCount(\Mockery::getContainer()->mockery_getExpectationCount());
        Monkey\tearDown();
        parent::tearDown();
    }

    /** @dataProvider likedModuleCases */
    public function testLikeCounterPreservesPageIdsForPostMeta(array $metadata, array $expected): void
    {
        $fields = $this->createMock(GetOptionFields::class);
        $fields->method('getLikedPostsPageIds')->willReturn([12 => 12, 42 => 42]);
        $service = new WpServiceWithTypecastedReturns(new NativeWpService());
        $counter = new LikeIconCounter($fields, $service);

        Functions\expect('get_post_meta')->twice()
            ->with(42, 'modularity-modules', false)->andReturn($metadata);
        Functions\expect('update_option')->once()
            ->with('liked_posts_page_ids', $expected, null)->andReturn(true);

        $counter->checkForLikedModule(42, (object) ['ID' => 42]);
    }

    public static function likedModuleCases(): array
    {
        return [
            'module present' => [[['name' => 'mod-liked-posts']], [12 => 12, 42 => 42]],
            'module absent' => [[], [12 => 12]],
        ];
    }

    public function testModuleRegistersLikedPostsMeta(): void
    {
        Functions\when('__')->alias(fn ($text) => $text);
        Functions\expect('register_meta')->once()
            ->with('user', 'likedPosts', \Mockery::on(
                fn ($args) => $args['type'] === 'object'
                    && $args['single'] === true
                    && $args['show_in_rest']['schema']['additionalProperties']['required']
                        === ['postId', 'blogId', 'postType', 'likedAt']
            ), null)->andReturn(true);

        $module = new LikedPosts();
        $module->init();

        self::assertSame('Liked posts', $module->nameSingular);
    }
}
