@if (!$hideTitle && !empty($postTitle))
    <div class="liked-posts__header {{implode(' ', $classList ?? [])}}">
        @typography([
            'id' => 'mod-liked-posts' . $ID . '-label',
            'element' => 'h2',
            'classList' => [
                'u-margin__bottom--0'
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
    'classList' => ['u-display--none', 'u-margin__top--0', 'u-padding__x--2', 'u-padding__y--2'],
])
{LIKED_POSTS_SHARED_TITLE}
@endtypography
@typography([
    'attributeList' => [
        'data-js-liked-posts-share-excerpt' => '',
    ],
    'classList' => ['u-display--none', 'u-margin__top--0', 'u-padding__x--2', 'u-padding__y--2'],
])
{LIKED_POSTS_SHARED_EXCERPT}
@endtypography