import StorageInterface from "./storage/storageInterface";
import LikeInstancesStorage from "./storage/likeInstancesStorage";

const likeIconSelector: string = '[data-like-icon]';
const likedIconClass: string = 'material-symbols--filled';
const postIdAttribute: string = 'data-post-id';
const postTypeAttribute: string = 'data-post-type';
const tooltipAttribute: string = 'data-tooltip';
const iconWrapperAttribute: string = 'data-js-like-icon-wrapper';

export default class Like {
    private hasTooltip: boolean;
    constructor(
        private likeStorage: StorageInterface,
        private likeInstancesStorage: LikeInstancesStorage,
        private button: Element,
        private wrapper: Element|null,
        private postId: string,
        private postType: string,
        private tooltipLike: string,
        private tooltipUnlike: string
    ) {
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
            this.likeStorage.set(this.postId, this.postType);
            this.toggleLiked();
            window.dispatchEvent(this.likedPostsUpdatedEvent());
        });
    }

    // Sets the tooltip for the like button
    private setTooltip() {
        if (!this.hasTooltip) {
            return;
        }

        const isLiked = this.likeStorage.get()[this.postId];

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
        this.likeInstancesStorage.getInstances(this.postId).forEach((instance) => {
            instance.updateLikedStatus();
            instance.setTooltip();
        });
	}

    // Updates the state of the like button (liked/not liked)
    private updateLikedStatus() {
        const isLiked = this.likeStorage.get()[this.postId];

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

// Initialize like buttons/icons
export function initializeLikeButtons(
    likeStorage: StorageInterface,
    likeInstancesStorage: LikeInstancesStorage,
    tooltipLike: string, 
    tooltipUnlike: string
) {
    const createLikeInstance = (button: Element) => {
        const postId   = button.getAttribute(postIdAttribute);
        const postType = button.getAttribute(postTypeAttribute);

        if (!postId || !postType) {
            return;
        }

        const wrapper = button.closest(`[${iconWrapperAttribute}]`);

        likeInstancesStorage.addInstance(
            postId,
            new Like(
                likeStorage, 
                likeInstancesStorage, 
                button,
                wrapper,
                postId, 
                postType, 
                tooltipLike, 
                tooltipUnlike
            )
        );
    };

    document.querySelectorAll(likeIconSelector).forEach((button) => {
        createLikeInstance(button);
    });

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                [...mutation.addedNodes].forEach((node) => {
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        const element = node as Element;
    
                        if (element.matches(likeIconSelector)) {
                            createLikeInstance(element);
                        }
    
                        element.querySelectorAll(likeIconSelector).forEach((button) => {
                            createLikeInstance(button);
                        });
                    }
                });
            }
        });
    });
    
    observer.observe(document.body, { childList: true, subtree: true });
}