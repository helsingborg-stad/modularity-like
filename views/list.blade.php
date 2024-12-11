@foreach($posts as $post)
    @collection__item([
        'link' => $post->permalink,
        'icon' => 'arrow_forward',
        'displayIcon' => true,
    ])
    @slot('floating')
        @element([
            'attributeList' => $tooltip ? ['data-tooltip' => $tooltip] : [],
        ])
            @icon([
                'icon' => $icon, 
                'classList' => ['like-icon'], 
                'size' => 'md',
                'attributeList' => [
                    'data-like-icon' => '', 
                    'data-post-type' => $post->postType, 
                    'data-post-id' => $post->id
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
            'classList' => ['u-padding__right--4']
        ])
            {!! $post->postTitle !!}
        @endtypography
    @endcollection__item
@endforeach