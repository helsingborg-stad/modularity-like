@foreach($posts as $post)
    @collection__item([
        'link' => $post->permalink,
        'classList' => ['like-posts__collection-item', 'c-collection__item--post', 'u-height--100'],
        'attributeList' => ['data-observe-resizes' => ''],
        'bordered' => true,
    ])
    @slot('floating')
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
                'filled' => true,
            ])
            @endicon
        @endelement
    @endslot
    @slot('before')
        @image([
            'src' => isset($post->images['thumbnail1:1']['src']) ? $post->images['thumbnail1:1']['src'] : $emblem,
            'classList' => ['u-width--100'],
        ])
        @endimage
    @endslot
        @group([
            'direction' => 'vertical'
        ])
        @group([
            'justifyContent' => 'space-between'
        ])
            @typography([
                'element' => 'h2',
                'variant' => 'h3',
                'useHeadingsContext' => false,
            ])
                {!! $post->postTitle !!}
            @endtypography
        @endgroup
        @typography([])
            {!! $post->excerptShorter !!}
        @endtypography

        @endgroup
    @endcollection__item
@endforeach