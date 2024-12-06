<div class="container like-posts__container" 
    data-js-like-posts 
    data-js-like-posts-post-types="{{$postTypes}}" 
    data-js-like-posts-appearance="{{$appearance}}"
>
    @includeFirst(['appearances.' . $appearance, 'appearances.collection'])
    @includeWhen($shareButton, 'partials.shareButton')
</div>
