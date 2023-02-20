@if($display_as == "collection")
@collection([
    'classList' => ['c-collection--posts'],
    'attributeList' => ['js-like-container' => '', 'js-display-as' => $display_as, 'js-post-types' => $postTypes],
])
@endcollection
@else
<div js-like-container js-display-as="{{$display_as}}" js-post-types="{{$postTypes}}"></div>
@endif

