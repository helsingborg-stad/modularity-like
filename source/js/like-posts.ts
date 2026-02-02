import { initializeLikedCounter } from "./front/likedCounter";
import { LikedPosts, WpApiSettings } from './front/like-posts';
import UserStorage from './front/storage/userStorage';
import LocalStorage from './front/storage/localStorage';
import LikeInstancesStorage from "./front/storage/likeInstancesStorage";
import LikedPostsStructurer from "./front/helpers/likedPostsStructurer";
import LikedPostsApiUrlBuilder from "./front/helpers/likedPostsApiUrlBuilder";
import LikeModuleFactory from "./front/module/likeModuleFactory";
import ShareFactory from "./front/module/shareFactory";
import StorageInterface from "./front/storage/storageInterface";
import LikeFactory from "./front/like/likeFactory";

declare const likedPosts : {
    currentUser: number|"0",
    likedPostsMeta: any,
    tooltipLike: string,
    tooltipUnlike: string,
    currentBlogId: string
};

declare const wpApiSettings: WpApiSettings;

document.addEventListener('DOMContentLoaded', () => {
    const likeStorage = getStorage(likedPosts as LikedPosts, wpApiSettings);

    initializeLikedCounter(likeStorage);
    initializeLikeButtons(
        likeStorage, 
        new LikeInstancesStorage(), 
        likedPosts.tooltipLike, 
        likedPosts.tooltipUnlike
    );

    initializeModules(likeStorage, wpApiSettings);
});

function getStorage(likedPosts: LikedPosts, localWpApiSettings: WpApiSettings): StorageInterface {
    return likedPosts && likedPosts.currentUser && likedPosts.currentUser !== '0' && likedPosts.likedPostsMeta && localWpApiSettings ?
        new UserStorage(localWpApiSettings, likedPosts.currentUser as unknown as number, likedPosts.likedPostsMeta) :
        new LocalStorage(localWpApiSettings, likedPosts.currentBlogId);
}


// Initialize like buttons/icons
function initializeLikeButtons(
    likeStorage: StorageInterface,
    likeInstancesStorage: LikeInstancesStorage,
    tooltipLike: string, 
    tooltipUnlike: string
) {
    const likeFactory = new LikeFactory(
        likeStorage,
        likeInstancesStorage,
        tooltipLike,
        tooltipUnlike
    );

    document.querySelectorAll('[data-like-icon]').forEach((button) => {
        likeFactory.create(button as HTMLElement);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                [...mutation.addedNodes].forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
    
                        if (element.matches('[data-like-icon]')) {
                            likeFactory.create(element as HTMLElement);
                        } else {
                            element.querySelectorAll('[data-like-icon]').forEach((button) => {
                                likeFactory.create(button as HTMLElement);
                            });
                        }

                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}

function initializeModules(
    likeStorage: StorageInterface,
    localWpApiSettings: WpApiSettings
): void {

    const urlParams = new URLSearchParams(window.location.search);
    const sharedPosts: string|null = urlParams.get('liked-posts');

    const moduleFactory = new LikeModuleFactory(
        localWpApiSettings,
        likeStorage,
        urlParams,
        sharedPosts
    );

    const shareFactory = new ShareFactory(
        likeStorage,
        new LikedPostsStructurer(),
        new LikedPostsApiUrlBuilder(localWpApiSettings)
    );

    document.querySelectorAll('[data-js-like-posts]').forEach((likePostsContainer) => {
        const likeModule = moduleFactory.create(likePostsContainer as HTMLElement);

        if (!likeModule) {
            console.error('Failed to initialize LikeModule for container:', likePostsContainer);
            return;
        }

        if (likePostsContainer.hasAttribute('data-js-like-posts-share')) {
            shareFactory.create(likePostsContainer as HTMLElement);
        }
    });
}
