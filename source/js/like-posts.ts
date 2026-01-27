import { initializeLikedCounter } from "./front/likedCounter";
import Shared from './front/shared';
import Share from './front/share';
import LikeModule from './front/LikeModule';
import { LikedPostsMeta, LikedPosts, WpApiSettings } from './front/like-posts';
import UserStorage from './front/storage/userStorage';
import LocalStorage from './front/storage/localStorage';
import { initializeLikeButtons } from './front/like';
import LikeInstancesStorage from "./front/storage/likeInstancesStorage";
import LikedPostsStructurer from "./front/helpers/likedPostsStructurer";
import LikedPostsApiUrlBuilder from "./front/helpers/likedPostsApiUrlBuilder";

declare const likedPosts : {
    currentUser: number|string,
    likedPostsMeta: any,
    tooltipLike: string,
    tooltipUnlike: string,
    currentBlogId: string
};

declare const wpApiSettings: WpApiSettings;

document.addEventListener('DOMContentLoaded', () => {
    console.log("HELLO WORLDS!");
    const localWpApiSettings = wpApiSettings;

    const likeStorage = likedPosts && likedPosts.currentUser && likedPosts.currentUser !== '0' && likedPosts.likedPostsMeta && localWpApiSettings ?
        new UserStorage(localWpApiSettings, likedPosts.currentUser as number, likedPosts.likedPostsMeta) :
        new LocalStorage(localWpApiSettings, likedPosts.currentBlogId);

    const tooltipLike: string = likedPosts.tooltipLike;
    const tooltipUnlike: string = likedPosts.tooltipUnlike;

    initializeLikedCounter(likeStorage);
    initializeLikeButtons(
        likeStorage, 
        new LikeInstancesStorage(), 
        tooltipLike, 
        tooltipUnlike
    );

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

        const likedPostsStructurer = new LikedPostsStructurer();
        const likedPostsApiUrlBuilder = new LikedPostsApiUrlBuilder(wpApiSettings);

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
                wpApiSettings,
                likeStorage,
                sharedPosts,
                likedPostsStructurer,
                likedPostsApiUrlBuilder,
                postTypesToShow,
                postAppearance,
                renderContainer as HTMLElement,
                noPostsNotice as HTMLElement,
                preLoaders as NodeListOf<HTMLElement>,
            );
        }

        if (shareButton && shareUrlField && shareListField && shareExcerptField) {
            new Share(
                likeStorage,
                postTypesToShow,
                postAppearance,
                likedPostsStructurer,
                likedPostsApiUrlBuilder,
                shareButton as HTMLButtonElement,
                shareUrlField as HTMLInputElement,
                shareListField as HTMLInputElement,
                shareExcerptField as HTMLInputElement
            );
        }
    });
});
