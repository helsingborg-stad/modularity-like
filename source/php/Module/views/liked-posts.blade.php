@if (!$hideTitle && !empty($postTitle))
    <div class="liked-posts__header">
        @typography([
            "id"        => "mod-liked-posts" . $ID . "-label",
            "element"   => "h2"
        ])
            {!! $postTitle !!}
        @endtypography
    </div>
@endif
@if($display_as == "collection")
@collection([
    'classList' => ['c-collection--posts', 'o-grid'],
    'attributeList' => ['js-like-container' => '', 'js-display-as' => $display_as, 'js-post-types' => $postTypes, 'js-columns' => $postColumns],
    ])
@endcollection
@else
<div class="o-grid" js-like-container js-display-as="{{$display_as}}" js-post-types="{{$postTypes}}" js-columns="{{$postColumns}}">
    @for ($i = 0; $i < 3; $i++)
        <div style="height:400px;width:100%;" class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded o-grid-4@md"></div>
    @endfor
</div>
@endif

