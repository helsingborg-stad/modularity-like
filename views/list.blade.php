@if(!empty($posts))
    @foreach($posts as $post)
        @if(!empty($post))
            @collection__item([
                'link' => $post->getPermalink(),
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
                            'data-post-type' => $post->getPostType(), 
                            'data-post-id' => $post->getId(),
                            'data-blog-id' => $post->getBlogId()
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
                    {!! $post->getTitle() !!}
                @endtypography
            @endcollection__item
        @endif
    @endforeach
@endif