@collection([
    'classList' => ['o-grid', 'o-grid--horizontal'],
    'attributeList' => [
        'data-js-render-container' => '',
        'js-display-as' => $displayAs,
        'js-columns' => $postColumns,
    ]
])
    <div class="u-preloader u-preloader__opacity--7 u-rounded o-grid--12"
    style="height:170px;width:100%;" data-js-like-preloader></div>
    @notice([
        'message' => [
            'title' => $labels['noPostsFound'],
        ],
        'classList' => [
            'u-display--none'
        ],
        'attributeList' => [
            'data-js-no-posts-notice' => ''
        ]
    ])
    @endnotice
@endcollection