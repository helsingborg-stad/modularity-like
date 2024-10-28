import Like from './front/like';
import { initializeLikedCounter } from "./front/likedCounter";
import Shared from './front/shared';
import Share from './front/share';
import LikeModule from './front/LikeModule';
import { LikedPost, WpApiSettings } from './front/like-posts';
import { decodeLikedPosts } from './front/helpers/likeHelpers';
import UserStorage from './front/storage/userStorage';
import LocalStorage from './front/storage/localStorage';

declare const currentUser : {
    currentUser: {
        ID: number;
    };
};

declare const wpApiSettings: WpApiSettings;

document.addEventListener('DOMContentLoaded', () => {
    const localWpApiSettings = wpApiSettings;
    let likeStorage = currentUser && currentUser.currentUser.ID && localWpApiSettings ? new UserStorage(localWpApiSettings, currentUser.currentUser.ID) : new LocalStorage();

    likeStorage = new LocalStorage();

    initializeLikedCounter(likeStorage);
    new Like(likeStorage);

    document.querySelectorAll('[data-js-like-posts]').forEach((likePostsContainer) => {
        const postTypesToShow = JSON.parse(likePostsContainer.getAttribute('data-js-like-posts-post-types') || '[]');
        const renderContainer = likePostsContainer.querySelector('[data-js-render-container]');
        const noPostsNotice   = likePostsContainer.querySelector('[data-js-no-posts-notice]');
        const preLoaders      = likePostsContainer.querySelectorAll('[data-js-like-preloader]');
        const sharedTitle     = likePostsContainer.querySelector('[data-js-liked-posts-share-title]');
        const sharedExcerpt   = likePostsContainer.querySelector('[data-js-liked-posts-share-excerpt]');

        const urlParams = new URLSearchParams(window.location.search);
		const sharedPosts = urlParams.get('liked-posts');
        let postIds: LikedPost[] = sharedPosts ? decodeLikedPosts(sharedPosts) : likeStorage.get();

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
                localWpApiSettings,
                postIds,
                postTypesToShow,
                renderContainer as HTMLElement,
                noPostsNotice as HTMLElement,
                preLoaders as NodeListOf<HTMLElement>
            );
        }

        new Share(likeStorage, likePostsContainer);
    });
});
