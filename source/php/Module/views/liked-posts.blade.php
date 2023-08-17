<div class="container like-posts__container">
    @if (!$hideTitle && !empty($postTitle))
        <div class="liked-posts__header">
            @typography([
                'id' => 'mod-liked-posts' . $ID . '-label',
                'element' => 'h2',
                'classList' => [
                    'u-margin__bottom--3'
                ],
            ])
                {!! $postTitle !!}
            @endtypography
        </div>
    @endif
{{--     @typography([
        'element' => (!$hideTitle && !empty($postTitle)) ? 'h3' : 'h2',
        'attributeList' => [
            'data-js-liked-posts-share-title' => '',
        ],
        'classList' => ['u-display--none'],

    ])
    @endtypography --}}
    @if (!$hideTitle && !empty($postTitle))
    <h3 class="u-display--none" data-js-liked-posts-share-title></h3>
    @else
    <h2 class="u-display--none" data-js-liked-posts-share-title></h2>
    @endif
    
    <p class="u-display--none" data-js-liked-posts-share-excerpt></p>

    @include('partials.' . $displayAs)
    @includeWhen($shareButton, 'partials.shareButton')
</div>
