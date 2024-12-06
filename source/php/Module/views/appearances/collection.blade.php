@include('partials.title', ['classList' => ['u-margin__bottom--3']])
@include('partials.sharedContent', ['classList' => ['u-margin__bottom--3']])

@collection([
    'classList' => ['o-grid', 'o-grid--horizontal'],
    'attributeList' => [
        'data-js-render-container' => '',
        'js-columns' => $postColumns,
    ]
])
    @include('partials.preloader')
@endcollection