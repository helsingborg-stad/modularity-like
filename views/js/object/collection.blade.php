    @collection__item([
        'link' => '{LIKE_POST_LINK}',
        'classList' => ['c-collection__item--post', 'u-height--100'],
        'attributeList' => ['data-observe-resizes' => ''],
        'bordered' => true,
])
    @slot('floating')
        @icon([
            'icon' => $icon, 
            'classList' => ['like-icon'], 
            'size' => 'md',
            'attributeList' => [
                'data-like-icon' => '', 
                'data-post-type' => '{LIKE_POST_TYPE}', 
                'data-post-id' => '{LIKE_POST_ID}'
            ],
            'filled' => true,
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
                'useHeadingsContext' => false,
            ])
                {LIKE_POST_TITLE}
            @endtypography
        @endgroup
        @typography([])
            {LIKE_POST_CONTENT}
        @endtypography

        @endgroup
    @endcollection__item