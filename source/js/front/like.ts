import StorageInterface from "./storage/storageInterface";

const likeIconSelector: string = '[data-like-icon]';
const likedIconClass: string = 'material-symbols--filled';
const postIdAttribute: string = 'data-post-id';
const postTypeAttribute: string = 'data-post-type';

class Like {
    constructor(
        private likeStorage: StorageInterface,
        private button: Element,
        private postId: string,
        private postType: string
    ) {
        this.checkIsLiked();
        this.setListener();
    }

    private setListener() {
        this.button.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation();
            this.likeStorage.set(this.postId, this.postType);
            this.toggleLiked();
            window.dispatchEvent(this.likedPostsUpdatedEvent());
        });
    }

    private toggleLiked() {
		const icons = [...document.querySelectorAll(`[${postIdAttribute}="${this.postId}"]`)];
		
		icons.forEach((icon) => {
			icon.classList.toggle(likedIconClass);
		});
	}

    private checkIsLiked() {
        const isLiked = this.likeStorage.get()[this.postId];

        if (isLiked) {
            this.button.classList.add(likedIconClass);
        } else {
            this.button.classList.remove(likedIconClass);
        }
    }

    likedPostsUpdatedEvent() { 
		return new CustomEvent('likedPostsLengthUpdated', {});
    }
}

export function initializeLikeButtons(likeStorage: StorageInterface) {
    const createLikeInstance = (button: Element) => {
        const postId   = button.getAttribute(postIdAttribute);
        const postType = button.getAttribute(postTypeAttribute)

        if (!postId || !postType) {
            return;
        }

        new Like(likeStorage, button, postId, postType);
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