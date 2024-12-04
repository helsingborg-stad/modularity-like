import Like from './front/like';
import { initializeLikedCounter } from "./front/likedCounter";
import Shared from './front/shared';
import Share from './front/share';
import LikeModule from './front/LikeModule';
import { LikedPosts, WpApiSettings } from './front/like-posts';
import { decodeLikedPosts } from './front/helpers/likeHelpers';
import UserStorage from './front/storage/userStorage';
import LocalStorage from './front/storage/localStorage';

declare const likedPosts : {
    currentUser: number|string,
    likedPostsMeta: any
};

declare const wpApiSettings: WpApiSettings;

document.addEventListener('DOMContentLoaded', () => {
    const localWpApiSettings = wpApiSettings;
    let likeStorage = likedPosts && likedPosts.currentUser !== '0' && likedPosts.likedPostsMeta && localWpApiSettings ? new UserStorage(localWpApiSettings, likedPosts.currentUser as number, likedPosts.likedPostsMeta) : new LocalStorage();

    initializeLikedCounter(likeStorage);
    new Like(likeStorage);

    document.querySelectorAll('[data-js-like-posts]').forEach((likePostsContainer) => {
        const postTypesToShow   = JSON.parse(likePostsContainer.getAttribute('data-js-like-posts-post-types') || '[]');
        const postAppearance    = likePostsContainer.getAttribute('data-js-like-posts-appearance') || 'collection';
        const renderContainer   = likePostsContainer.querySelector('[data-js-render-container]');
        const noPostsNotice     = likePostsContainer.querySelector('[data-js-no-posts-notice]');
        const preLoaders        = likePostsContainer.querySelectorAll('[data-js-like-preloader]');
        const sharedTitle       = likePostsContainer.querySelector('[data-js-liked-posts-share-title]');
        const sharedExcerpt     = likePostsContainer.querySelector('[data-js-liked-posts-share-excerpt]');
        const shareUrlField     = likePostsContainer.querySelector('[data-js-like-share-url]');
        const shareListField    = likePostsContainer.querySelector('[data-js-like-share-name]');
        const shareExcerptField = likePostsContainer.querySelector('[data-js-like-share-excerpt]');
        const shareButton       = likePostsContainer.querySelector('[data-js-like-share-button]');

        const urlParams = new URLSearchParams(window.location.search);
		const sharedPosts = urlParams.get('liked-posts');
        let postIds: LikedPosts = sharedPosts ? decodeLikedPosts(sharedPosts) : likeStorage.get();

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
                postAppearance,
                renderContainer as HTMLElement,
                noPostsNotice as HTMLElement,
                preLoaders as NodeListOf<HTMLElement>
            );
        }

        if (shareButton && shareUrlField && shareListField && shareExcerptField) {
            new Share(
                likeStorage,
                shareButton as HTMLButtonElement,
                shareUrlField as HTMLInputElement,
                shareListField as HTMLInputElement,
                shareExcerptField as HTMLInputElement
            );
        }
    });
});
