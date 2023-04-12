@if($display_as == "collection")
@collection([
    'classList' => ['c-collection--posts'],
    'attributeList' => ['js-like-container' => '', 'js-display-as' => $display_as, 'js-post-types' => $postTypes],
    ])
@endcollection
@else
<div class="o-grid" js-like-container js-display-as="{{$display_as}}" js-post-types="{{$postTypes}}" js-columns="{{$postColumns}}">
    @for ($i = 0; $i < 3; $i++)
        <div style="height:400px;width:100%;" class="liked-posts__preloader u-preloader u-preloader__opacity--7 u-rounded o-grid-4@md"></div>
    @endfor
</div>
@endif

