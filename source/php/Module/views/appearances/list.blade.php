@card([
    'context' => ['module.posts.list']
])
    @include('partials.title', ['classList' => ['c-card__header'], 'variant' => 'h4'])
    <div class="c-card__content u-margin__top--0">
        @include('partials.sharedContent')
    </div>
    @collection([
        'classList' => ['o-grid', 'o-grid--horizontal', 'u-padding__y--1'],
        'attributeList' => [
            'data-js-render-container' => '',
        ],
        'bordered' => true,
        'sharpTop' => true,
    ])
        @include('partials.preloader', ['classList' => ['u-margin__x--2', 'u-margin__y--2']])
    @endcollection
@endcard
