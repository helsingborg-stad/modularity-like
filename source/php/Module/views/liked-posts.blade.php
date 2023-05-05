<div class="like-posts__container">
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
            @for ($i = 0; $i < 2; $i++)
                <div class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded o-grid-6@md"
                    style="height:170px;width:100%;"></div>
            @endfor
        @endcollection
    @else
        <div class="o-grid" js-like-container js-display-as="{{ $display_as }}" js-like-emblem-url="{{ $emblem }}"
            js-post-types="{{ $postTypes }}" js-columns="{{ $postColumns }}">
            @for ($i = 0; $i < 3; $i++)
                <div class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded o-grid-4@md"
                    style="height:400px;width:100%;">
                </div>
            @endfor
        </div>
    @endif
</div>
