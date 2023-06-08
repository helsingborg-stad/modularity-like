@collection([
    'classList' => ['o-grid', 'o-grid--horizontal'],
    'attributeList' => [
        'js-like-container' => '',
        'js-display-as' => $displayAs,
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