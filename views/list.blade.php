@foreach($posts as $post)
    @collection__item([
        'link' => $post->permalink,
        'displayIcon' => false,
        'classList' => ['like-posts__list-item'],
    ])
    @slot('before')
        @element([
            'attributeList' => ['data-js-like-icon-wrapper' => ''],
        ])
            @icon([
                'icon' => $icon, 
                'size' => 'md',
                'attributeList' => [
                    'data-like-icon' => '', 
                    'data-post-type' => $post->postType, 
                    'data-post-id' => $post->id
                ],
                'classList' => [
                    'like-posts__list-icon',
                ],
                'filled' => true,
            ])
            @endicon
        @endelement
    @endslot
        @typography([
            'element' => 'h2',
            'variant' => 'h4',
            'useHeadingsContext' => false,
        ])
            {!! $post->postTitle !!}
        @endtypography
    @endcollection__item
@endforeach