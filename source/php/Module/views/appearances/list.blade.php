@card([])
@include('partials.titles', ['classList' => ['c-card__header']])
    @collection([
        'classList' => ['o-grid', 'o-grid--horizontal'],
        'attributeList' => [
            'data-js-render-container' => '',
        ]
    ])
        @include('partials.preloader')
    @endcollection
@endcard