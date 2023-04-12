@card([
    'heading' => '{LIKE_POST_TITLE}',
    'content' => '{LIKE_POST_CONTENT}',
    'link' => '{LIKE_POST_LINK}',
    'image' => '{LIKE_POST_IMAGE}',
    'classList' => ['grid-md-4']
])
@slot('floating')
    @icon([
        'icon' => 'favorite', 
        'classList' => ['is-liked', 'like-icon'], 
        'size' => 'md',
        'attributeList' => [
            'data-like-icon' => '', 
            'data-post-type' => '{LIKE_POST_TYPE}', 
            'data-post-id' => '{LIKE_POST_ID}'
        ],

    ])
    @endicon
@endslot
@endcard