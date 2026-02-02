import Like from "./like";
import LikeInstancesStorage from "../storage/likeInstancesStorage";
import StorageInterface from "../storage/storageInterface";

class LikeFactory {
    private iconWrapperAttribute: string = 'data-js-like-icon-wrapper';
    private likeIconInitializedAttribute: string = 'data-like-icon-initialized'
    private postIdAttribute: string = 'data-post-id';
    private postTypeAttribute: string = 'data-post-type';
    private blogIdAttribute: string = 'data-blog-id';

    constructor(
        private likeStorage: StorageInterface,
        private likeInstancesStorage: LikeInstancesStorage,
        private tooltipLike: string, 
        private tooltipUnlike: string
    ) {}

    public create(likeButton: HTMLElement): Like | undefined {
        if (likeButton.hasAttribute(this.likeIconInitializedAttribute)) {
            return undefined;
        }

        likeButton.setAttribute(this.likeIconInitializedAttribute, 'true');

        const postId   = likeButton.getAttribute(this.postIdAttribute);
        const postType = likeButton.getAttribute(this.postTypeAttribute);
        const blogId   = likeButton.getAttribute(this.blogIdAttribute);
        const wrapper  = likeButton.closest(`[${this.iconWrapperAttribute}]`);

        if (!postId || !postType || !blogId) {
            console.warn('Like button is missing required blogId for likeable post', likeButton);
            return undefined;
        }

        const like = new Like(
            this.likeStorage, 
            this.likeInstancesStorage,
            likeButton,
            wrapper,
            postId, 
            postType, 
            this.tooltipLike, 
            this.tooltipUnlike,
            blogId
        );

        this.likeInstancesStorage.addInstance(
            `${blogId}-${postId}`,
            like
        );

        return like;
    }
}

export default LikeFactory;