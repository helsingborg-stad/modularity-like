import Like from './front/like';
import { initializeLikedCounter } from "./front/likedCounter";
import Share from './front/share';
import RenderPosts from './front/renderPosts';

document.addEventListener('DOMContentLoaded', () => {
    initializeLikedCounter(likedPostsComponents.counterElement);
    const LikeInstance = new Like();

    document.querySelectorAll('[data-js-like-posts]').forEach((likePostsContainer) => {
        const renderPosts = new RenderPosts(likedPostsComponents, likePostsContainer);
        renderPosts.render();
        new Share(likePostsContainer);
    });
});
