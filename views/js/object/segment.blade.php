<div class="{LIKE_POST_CLASSES}">
    @segment([
        'layout' => 'card',
        'title' => '{LIKE_POST_TITLE}',
        'meta' => $display_reading_time ? $post->reading_time : false,
        'image' => '{LIKE_POST_IMAGE}',
        'date' => $post->showDate
            ? date_i18n(\Modularity\Helper\Date::getDateFormat('date-time'), strtotime($post->post_date))
            : false,
        'content' => '{LIKE_POST_CONTENT}',
        'buttons' => [['text' => 'Read more', 'href' => '{LIKE_POST_LINK}']],
        'containerAware' => true,
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
    @endsegment
</div>