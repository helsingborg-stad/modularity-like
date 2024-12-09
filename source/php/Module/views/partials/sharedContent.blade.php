@typography([
    'element' => (!$hideTitle && !empty($postTitle)) ? 'h3' : 'h2',
    'attributeList' => [
        'data-js-liked-posts-share-title' => '',
    ],
    'classList' => [
        'u-display--none', 
        'u-margin__top--0', 
        'u-padding__x--2', 
        (!$hideTitle && !empty($postTitle)) ? 'u-padding__y--0' : 'u-padding__y--2'
    ],
])
    {LIKED_POSTS_SHARED_TITLE}
@endtypography
@typography([
    'attributeList' => [
        'data-js-liked-posts-share-excerpt' => '',
    ],
    'classList' => [
        'u-display--none', 
        'u-margin__top--0', 
        'u-padding__x--2', 
        'u-padding__y--2'
    ],
])
    {LIKED_POSTS_SHARED_EXCERPT}
@endtypography