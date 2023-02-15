@icon([
    'icon' => 'favorite',
    'size' => 'md',
    'classList' => ['u-position--absolute', 'u-level-3', 'is-liked'],
    'attributeList' => ['data-post-id' => '{LIKE_POST_ID}', 'data-like-icon' => '', 'style' => 'color: #cc5249; right: .5rem; top: .5rem; cursor: pointer;'],
])
@endicon
@collection__item([
    'link' => '{LIKE_POST_LINK}',
    'image' => '{LIKE_POST_IMAGE}',
    'classList' => ['c-collection__item--post', 'u-flex-direction--column@xs']
])
    @group([
        'direction' => 'vertical'
    ])
    @typography([
        'element' => 'h2',
        'variant' => 'h3',
    ])
        {LIKE_POST_TITLE}
    @endtypography
    @typography([])
        {LIKE_POST_CONTENT}
    @endtypography

    @endgroup
@endcollection__item
