<div class="u-display--flex u-align-items--center u-justify-content--center u-margin__top--4">
    @button([
        'text' => $labels['shareButtonLabel'],
        'color' => 'primary',
        'attributeList' => [
            'data-open' => 'modal-' . $id,
    ],
        'classList' => ['u-margin__right--2', 'u-display--none']
    ])
    @endbutton
</div>
@modal([
    'closeButtonText' => $labels['close'],
    'heading' => $labels['shareButtonLabel'],
    'id' => 'modal-' . $id,
])
    @field([
        'type' => 'text',
        'name' => 'name',
        'label' =>  $labels['shareLinkName'],
        'classList' => ['u-padding__y--2'],
        'attributeList' => [
            'data-js-like-share-name' => '',
            'maxlength' => '40',
        ]
    ])
    @endfield
    @field([
        'type' => 'text',
        'name' => 'name',
        'label' =>  $labels['shareLinkExcerpt'],
        'classList' => ['u-padding__y--2'],
        'attributeList' => [
            'data-js-like-share-excerpt' => '',
            'maxlength' => '120',
        ]
    ])
    @endfield
    @field([
        'type' => 'text',
        'name' => 'name',
        'label' => $labels['shareLinkLabel'],
        'multiline' => true,
        'classList' => ['u-padding__y--2'],
        'attributeList' => [
            'data-js-like-share-url' => '',
            'style' => 'min-height: 150px',
            'readonly' => ''
        ]
    ])
    @endfield
@endmodal