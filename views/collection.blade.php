@if(!empty($posts))
    @foreach($posts as $post)
        @collection__item([
            'link' => $post->getPermalink(),
            'classList' => ['like-posts__collection-item', 'c-collection__item--post', 'u-height--100'],
            'attributeList' => ['data-observe-resizes' => ''],
            'bordered' => true,
        ])
        @slot('floating')
            @element([
                'attributeList' => ['data-js-like-icon-wrapper' => ''],
            ])
                @icon([
                    'icon' => $icon, 
                    'size' => 'md',
                    'attributeList' => [
                        'data-like-icon' => '', 
                        'data-post-type' => $post->getPostType(), 
                        'data-post-id' => $post->getId(),
                        'data-blog-id' => $post->blogId
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
                    {!! $post->getTitle() !!}
                @endtypography
            @endgroup
            @typography([])
                {!! $post->excerptShorter !!}
            @endtypography

            @endgroup
        @endcollection__item
    @endforeach
@endif