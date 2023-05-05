    @collection__item([
        'link' => '{LIKE_POST_LINK}',
        'classList' => ['c-collection__item--post', '{LIKE_POST_CLASSES}', 'u-height--auto'],
        'attributeList' => ['data-observe-resizes' => ''],
        'bordered' => true,
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
    @slot('before')
        @image([
            'src' => '{LIKE_POST_IMAGE}' ,
            'classList' => ['u-width--100'],
        ])
        @endimage
    @endslot
        @group([
            'direction' => 'vertical'
        ])
        @group([
            'justifyContent' => 'space-between'
        ])
            @typography([
                'element' => 'h2',
                'variant' => 'h3',
            ])
                {LIKE_POST_TITLE}
            @endtypography
        @endgroup
        @typography([])
            {LIKE_POST_CONTENT}
        @endtypography

        @endgroup
    @endcollection__item