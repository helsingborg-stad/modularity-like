@foreach($posts as $post)
    @collection__item([
        'link' => $post->permalink,
        'icon' => 'arrow_forward',
        'displayIcon' => true,
    ])
    @slot('floating')
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