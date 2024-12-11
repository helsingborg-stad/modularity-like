@if (!$hideTitle && !empty($postTitle))
    <div class="liked-posts__header {{implode(' ', $classList ?? [])}}">
        @typography([
            'id' => 'mod-liked-posts' . $ID . '-label',
            'element' => 'h2',
            'variant' => $variant ?? 'h2',
            'classList' => [
                'u-margin__bottom--0'
            ],
        ])
            {!! $postTitle !!}
        @endtypography
    </div>
@endif