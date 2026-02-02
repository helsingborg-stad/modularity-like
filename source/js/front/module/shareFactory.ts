import LikedPostsApiUrlBuilder from "../helpers/likedPostsApiUrlBuilder";
import LikedPostsStructurer from "../helpers/likedPostsStructurer";
import StorageInterface from "../storage/storageInterface";
import Share from "./share";

class ShareFactory {
    constructor(
        private likeStorage: StorageInterface,
        private likedPostsStructurer: LikedPostsStructurer,
        private likedPostsApiUrlBuilder: LikedPostsApiUrlBuilder
    ) {}

    public create(likePostsContainer: HTMLElement): Share|null {
        const postTypesToShow   = JSON.parse(likePostsContainer.getAttribute('data-js-like-posts-post-types') || '[]');
        const postAppearance    = likePostsContainer.getAttribute('data-js-like-posts-appearance') || 'collection';
        const shareUrlField     = likePostsContainer.querySelector('[data-js-like-share-url]');
        const shareListField    = likePostsContainer.querySelector('[data-js-like-share-name]');
        const shareExcerptField = likePostsContainer.querySelector('[data-js-like-share-excerpt]');
        const shareButton       = likePostsContainer.querySelector('[data-js-like-share-button]');

        if (shareButton && shareUrlField && shareListField && shareExcerptField) {
            return new Share(
                this.likeStorage,
                postTypesToShow,
                postAppearance,
                this.likedPostsStructurer,
                this.likedPostsApiUrlBuilder,
                shareButton as HTMLButtonElement,
                shareUrlField as HTMLInputElement,
                shareListField as HTMLInputElement,
                shareExcerptField as HTMLInputElement
            );
        }

        return null;
    }
}

export default ShareFactory;