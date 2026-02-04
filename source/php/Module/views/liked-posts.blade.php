@element([
    'classList' => [
        'like-posts__container'
    ],
    'attributeList' => $attributeList
])
    @includeFirst(['appearances.' . $appearance, 'appearances.collection'])
    @includeWhen($shareButton, 'partials.shareButton')
@endelement
