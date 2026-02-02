import LikedPostsApiUrlBuilder from "../helpers/likedPostsApiUrlBuilder";
import { WpApiSettings } from "../like-posts";
import StorageInterface from "../storage/storageInterface";
import LikeModule from "./likeModule";
import Shared from "./shared";

class LikeModuleFactory {
    constructor(
        private wpApiSettings: WpApiSettings,
        private likeStorage: StorageInterface,
        private urlParams: URLSearchParams,
        private sharedPosts: string|null,
    ) {}

    public create(likePostsContainer: HTMLElement): LikeModule | undefined {
        const [postTypesToShow, postAppearance] = this.extractAttributes(likePostsContainer);
        const [renderContainer, noPostsNotice, preLoaders] = this.extractElements(likePostsContainer);

        const likedPostsApiUrlBuilder = new LikedPostsApiUrlBuilder(this.wpApiSettings);

        if (!postTypesToShow || !renderContainer || !noPostsNotice || !preLoaders) {
            return undefined;
        }

        if (this.sharedPosts) {
            const [title, excerpt] = this.extractSharedElements(likePostsContainer);

            new Shared(
                renderContainer as HTMLElement,
                this.urlParams, 
                title as HTMLElement, 
                excerpt as HTMLElement
            );
        }

        new LikeModule(
            this.wpApiSettings,
            this.likeStorage,
            this.sharedPosts,
            likedPostsApiUrlBuilder,
            postTypesToShow,
            postAppearance,
            renderContainer as HTMLElement,
            noPostsNotice as HTMLElement,
            preLoaders as NodeListOf<HTMLElement>,
        );
    }

    private extractSharedElements(likePostsContainer: HTMLElement): [HTMLElement | null, HTMLElement | null] {
        const title = likePostsContainer.querySelector('[data-js-liked-posts-share-title]');
        const excerpt = likePostsContainer.querySelector('[data-js-liked-posts-share-excerpt]');

        return [title as HTMLElement, excerpt as HTMLElement];
    }

    private extractElements(likePostsContainer: HTMLElement): [HTMLElement | null, HTMLElement | null, NodeListOf<HTMLElement> | null] {
        const renderContainer = likePostsContainer.querySelector('[data-js-render-container]');
        const noPostsNotice = likePostsContainer.querySelector('[data-js-no-posts-notice]');
        const preLoaders = likePostsContainer.querySelectorAll('[data-js-like-preloader]');

        return [renderContainer as HTMLElement, noPostsNotice as HTMLElement, preLoaders as NodeListOf<HTMLElement>];
    }

    private extractAttributes(likePostsContainer: HTMLElement): [Array<string>, string] {
        const postTypesToShow = JSON.parse(likePostsContainer.getAttribute('data-js-like-posts-post-types') || '[]');
        const postAppearance  = likePostsContainer.getAttribute('data-js-like-posts-appearance') || 'collection';

        return [postTypesToShow, postAppearance];
    }
}

export default LikeModuleFactory;