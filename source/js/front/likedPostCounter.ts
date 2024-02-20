import { getLikedPostLength } from "./helpers/likeHelpers";

class LikedPostCounter {
    private customElement: HTMLElement | null = null;

    constructor() {
        this.init();
    }

    private init(){
            this.setupEventListener();
            this.dispatchLikedPostLength();
    }

    private setupEventListener(){
        window.addEventListener('likedPostsLengthUpdated', (e: Event) => {
            if (e instanceof CustomEvent) {
                this.handleLikedPostsLengthUpdate(e.detail.key);
            }
        })
    }

    public dispatchLikedPostLength(){
        window.dispatchEvent(this.likedPostLengthEvent());
    }

    private likedPostLengthEvent(){
        return new CustomEvent('likedPostsLengthUpdated', {
            detail: {
                key: getLikedPostLength()
            }
        });
    }

    private handleLikedPostsLengthUpdate(length: number){
        const heartIcon = document.querySelector('.c-icon--favorite') as HTMLElement;

        if (length === 0) {
            this.removeCustomElement();
        } else {
            this.createOrUpdateCustomElement(length, heartIcon);
        }
    }

    private createOrUpdateCustomElement(length: number, heartIcon: HTMLElement) {
        if (!this.customElement) {
            this.customElement = document.createElement('span');
            this.customElement.className = 'liked-post-counter';
            heartIcon.insertAdjacentElement('afterend', this.customElement);
        }

        this.customElement.textContent = String(length);
    }

    private removeCustomElement() {
        if (this.customElement) {
            this.customElement.remove();
            this.customElement = null;
        }
    }
}

export default LikedPostCounter;