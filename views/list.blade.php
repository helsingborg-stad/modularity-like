@foreach($posts as $post)
    @collection__item([
        'link' => $post->permalink,
        'displayIcon' => false,
        'classList' => ['like-posts__list-item'],
    ])
    @slot('before')
        @element([
            'attributeList' => $tooltip ? ['data-tooltip' => $tooltip] : [],
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
                    'u-padding__y--2',
                    'u-padding__x--2'
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