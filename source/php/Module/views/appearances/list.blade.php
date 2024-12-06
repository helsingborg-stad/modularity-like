@card([
    'context' => ['module.posts.list']
])
    @include('partials.title', ['classList' => ['c-card__header']])
    <div class="c-card__content">
        @include('partials.sharedContent')
    </div>
    @collection([
        'classList' => ['o-grid', 'o-grid--horizontal'],
        'attributeList' => [
            'data-js-render-container' => '',
        ]
    ])
        @include('partials.preloader')
    @endcollection
@endcard
