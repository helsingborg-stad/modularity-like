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

<!-- temporary placement -->
<div class="liked-posts__meta">
    @link([
        'href' => '#mod-liked-posts' . $ID . '-link',
        'id' => 'mod-liked-posts' . $ID . '-link',
        'classList' => [
            'liked-posts__link',
            'u-text--small',
            'u-text--bold',
            'u-text--uppercase',
            'u-text--color-primary',
            'u-text--color-hover-primary',
            'u-text--hover-underline'
        ]
    ])
    @endlink
</div>
<!-- end temporary placement -->

@if ($display_as == 'collection')
    @collection([
        'classList' => ['c-collection--posts', 'o-grid'],
        'attributeList' => [
            'js-like-container' => '',
            'js-display-as' => $display_as,
            'js-post-types' => $postTypes,
            'js-columns' => $postColumns,
            'js-like-emblem-url' => $emblem
        ]
    ])
    @endcollection
@else
    <div class="o-grid" js-like-container js-display-as="{{ $display_as }}" js-like-emblem-url="{{ $emblem }}"
        js-post-types="{{ $postTypes }}" js-columns="{{ $postColumns }}">
        @for ($i = 0; $i < 3; $i++)
            <div class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded o-grid-4@md"
                style="height:400px;width:100%;"></div>
        @endfor
    </div>
@endif
