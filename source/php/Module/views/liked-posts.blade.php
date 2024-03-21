<div class="container like-posts__container">
    @if (!$hideTitle && !empty($postTitle))
        <div class="liked-posts__header">
            @typography([
                'id' => 'mod-liked-posts' . $ID . '-label',
                'element' => 'h2',
                'classList' => [
                    'u-margin__bottom--3'
                ],
            ])
                {!! $postTitle !!}
            @endtypography
        </div>
    @endif
    @typography([
        'element' => (!$hideTitle && !empty($postTitle)) ? 'h3' : 'h2',
        'attributeList' => [
            'data-js-liked-posts-share-title' => '',
        ],
        'classList' => ['u-display--none'],
    ])
    {LIKED_POSTS_SHARED_TITLE}
    @endtypography
    @typography([
        'attributeList' => [
            'data-js-liked-posts-share-excerpt' => '',
        ],
        'classList' => ['u-display--none'],
    ])
    {LIKED_POSTS_SHARED_EXCERPT}
    @endtypography

    @include('partials.' . $displayAs)
    @includeWhen($shareButton, 'partials.shareButton')
</div>
