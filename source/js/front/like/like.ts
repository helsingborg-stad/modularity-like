import StorageInterface from "../storage/storageInterface";
import LikeInstancesStorage from "../storage/likeInstancesStorage";

const likedIconClass: string = 'material-symbols--filled';
const tooltipAttribute: string = 'data-tooltip';

export default class Like {
    private hasTooltip: boolean;
    private key: string;
    constructor(
        private likeStorage: StorageInterface,
        private likeInstancesStorage: LikeInstancesStorage,
        private button: Element,
        private wrapper: Element|null,
        private postId: string,
        private postType: string,
        private tooltipLike: string,
        private tooltipUnlike: string,
        private blogId: string
    ) {
        this.key = `${this.blogId}-${this.postId}`;
        this.hasTooltip = Boolean(this.wrapper && (!!this.tooltipLike || !!this.tooltipUnlike));
        this.updateLikedStatus();
        this.setTooltip();
        this.setListener();
    }

    // Sets the event listener for the like button
    private setListener() {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.likeStorage.set(this.postId, this.postType, this.blogId);
            this.toggleLiked();
            window.dispatchEvent(this.likedPostsUpdatedEvent());
        });
    }

    // Sets the tooltip for the like button
    private setTooltip() {
        if (!this.hasTooltip) {
            return;
        }

        const isLiked = this.likeStorage.get()[this.key];

        if (isLiked) {
            if (this.tooltipUnlike) {
                this.wrapper!.setAttribute(tooltipAttribute, this.tooltipUnlike);
            } else {
                this.wrapper!.removeAttribute(tooltipAttribute);
            }
        } else {
            if (this.tooltipLike) {
                this.wrapper!.setAttribute(tooltipAttribute, this.tooltipLike);
            } else {
                this.wrapper!.removeAttribute(tooltipAttribute);
            }
        }
    }

    // Toggles the like button (liked/not liked) and updates all like buttons with the same postId
    private toggleLiked() {
        this.likeInstancesStorage.getInstances(this.key).forEach((instance) => {
            instance.updateLikedStatus();
            instance.setTooltip();
        });
	}

    // Updates the state of the like button (liked/not liked)
    public updateLikedStatus() {
        const isLiked = this.likeStorage.get()[this.key];
        if (isLiked) {
            this.button.classList.add(likedIconClass);
        } else {
            this.button.classList.remove(likedIconClass);
        }
    }

    // Custom event to update liked posts length
    public likedPostsUpdatedEvent() { 
		return new CustomEvent('likedPostsLengthUpdated', {});
    }
}