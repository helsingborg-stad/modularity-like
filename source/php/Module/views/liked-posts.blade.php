<div class="container like-posts__container">
    @if (!$hideTitle && !empty($postTitle))
        <div class="liked-posts__header">
            @typography([
                'id' => 'mod-liked-posts' . $ID . '-label',
                'element' => 'h2'
            ])
                {!! $postTitle !!}
            @endtypography
        </div>
    @endif
    @typography([
        'element' => !$hideTitle && !empty($postTitle) ? 'h2' : 'h3',
        'attributeList' => [
            'data-js-liked-posts-share-title' => '',
        ],
        'classList' => ['u-display--none'],

    ])
    @endtypography
    @typography([
        'attributeList' => [
            'data-js-liked-posts-share-excerpt' => '',
        ],
        'classList' => ['u-display--none'],
    ])
    @endtypography
    @if ($display_as == 'collection')
        @collection([
            'classList' => ['o-grid', 'o-grid--horizontal'],
            'attributeList' => [
                'js-like-container' => '',
                'js-display-as' => $display_as,
                'js-post-types' => $postTypes,
                'js-columns' => $postColumns,
                'js-like-emblem-url' => $emblem
            ]
        ])
            @for ($i = 0; $i < 4; $i++)
                <div class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded {{ $postColumns }}"
                    style="height:170px;width:100%;"></div>
            @endfor
        @endcollection
    @else
        <div class="o-grid" js-like-container js-display-as="{{ $display_as }}" js-like-emblem-url="{{ $emblem }}"
            js-post-types="{{ $postTypes }}" js-columns="{{ $postColumns }}">
            @for ($i = 0; $i < 4; $i++)
                <div class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded o-grid-4@md"
                    style="height:400px;width:100%;">
                </div>
            @endfor
        </div>
    @endif
    <div class="u-display--flex u-align-items--center u-justify-content--center u-margin__top--4">
        @button([
            'text' => $labels['shareButtonLabel'],
            'color' => 'primary',
            'attributeList' => [
               'data-open' => 'modal-' . $id,
                // 'data-js-copy-target' => 'self',
                // 'data-js-copy-success' => $labels['shareSuccess'],
                // 'data-js-copy-error' => $labels['shareError'],
                // 'data-js-copy-data' => '',

        ],
            'classList' => ['u-margin__right--2', 'u-display--none']
        ])
        @endbutton
    </div>
    @modal([
        'closeButtonText' => $labels['close'],
        'heading' => $labels['shareButtonLabel'],
        'id' => 'modal-' . $id,
    ])
        @field([
            'type' => 'text',
            'name' => 'name',
            'label' =>  $labels['shareLinkName'],
            'classList' => ['u-padding__y--2'],
            'attributeList' => [
                'data-js-like-share-name' => '',
                'maxlength' => '30',
            ]
        ])
        @endfield
        @field([
            'type' => 'text',
            'name' => 'name',
            'label' =>  $labels['shareLinkExcerpt'],
            'classList' => ['u-padding__y--2'],
            'attributeList' => [
                'data-js-like-share-excerpt' => '',
                'maxlength' => '120',
            ]
        ])
        @endfield
        @field([
            'type' => 'text',
            'name' => 'name',
            'label' => $labels['shareLinkLabel'],
            'multiline' => true,
            'classList' => ['u-padding__y--2'],
            'attributeList' => [
                'data-js-like-share-url' => '',
                'style' => 'min-height: 150px',
                'readonly' => ''
            ]
        ])
        @endfield
    @endmodal

</div>
