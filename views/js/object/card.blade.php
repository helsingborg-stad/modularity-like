@icon([
    'icon' => 'favorite',
    'size' => 'md',
    'classList' => ['u-position--absolute', 'u-level-3', 'is-liked'],
    'attributeList' => ['data-post-id' => '{LIKE_POST_ID}', 'data-like-icon' => '', 'style' => 'color: #cc5249; right: .5rem; top: .5rem; cursor: pointer;'],
])
@endicon
@card([
    'heading' => '{LIKE_POST_TITLE}',
    'content' => '{LIKE_POST_CONTENT}',
    'link' => '{LIKE_POST_LINK}',
    'image' => '{LIKE_POST_IMAGE}'
])
@endcard