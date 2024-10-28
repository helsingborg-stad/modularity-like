import Like from './front/like';
import { initializeLikedCounter } from "./front/likedCounter";
import Shared from './front/shared';
import Share from './front/share';
import LikeModule from './front/LikeModule';
import { LikedPost } from './front/likedPost';
import { decodeLikedPosts, getLikedPostsFromLocalStorage } from './front/helpers/likeHelpers';

document.addEventListener('DOMContentLoaded', () => {
    initializeLikedCounter();
    new Like();

    document.querySelectorAll('[data-js-like-posts]').forEach((likePostsContainer) => {
        const postTypesToShow = JSON.parse(likePostsContainer.getAttribute('data-js-like-posts-post-types') || '[]');
        const renderContainer = likePostsContainer.querySelector('[data-js-render-container]');
        const noPostsNotice   = likePostsContainer.querySelector('[data-js-no-posts-notice]');
        const preLoaders      = likePostsContainer.querySelectorAll('[data-js-like-preloader]');
        const sharedTitle     = likePostsContainer.querySelector('[data-js-liked-posts-share-title]');
        const sharedExcerpt   = likePostsContainer.querySelector('[data-js-liked-posts-share-excerpt]');
        
        const urlParams = new URLSearchParams(window.location.search);
		const sharedPosts = urlParams.get('liked-posts');

        let postIds: LikedPost[] = [];

        if (sharedPosts) {
            postIds = decodeLikedPosts(sharedPosts);
        } else {
            postIds = getLikedPostsFromLocalStorage();
        }

        if (postTypesToShow && renderContainer && noPostsNotice && preLoaders) {
            if (sharedPosts) {
                new Shared(
                    renderContainer as HTMLElement,
                    urlParams, 
                    sharedTitle as HTMLElement, 
                    sharedExcerpt as HTMLElement

                );
            }

            new LikeModule(
                postIds,
                postTypesToShow,
                renderContainer as HTMLElement,
                noPostsNotice as HTMLElement,
                preLoaders as NodeListOf<HTMLElement>
            );
        }

        new Share(likePostsContainer);
    });
});
