import StorageInterface from "./storage/storageInterface";

class LikedCounter {
    counterElements: (Element | null)[];
    constructor(private likeStorage: StorageInterface, counterIcons: Element[]) {       
        this.counterElements = this.addCounterToIcon(counterIcons);
        this.updateCounter();
    }

    addCounterToIcon(counterIcons: Element[]) {
        const icons = counterIcons.map((counterIcon: Element) => { 
            counterIcon.innerHTML += this.getLikeIconMarkup();
            return counterIcon.querySelector('[data-js-like-counter]');
        });
        
        return icons;
    }

    updateCounter() {
        const likedPostsLength = Object.keys(this.likeStorage.get()).length;
        
        this.counterElements.forEach((counterElement: Element | null) => {
            if (counterElement) {
                counterElement.innerHTML = likedPostsLength.toString();
            }

            if (likedPostsLength === 0) {
                counterElement?.classList.add('u-display--none');
            } else {
                counterElement?.classList.remove('u-display--none');
            }
        });
    }

    private getLikeIconMarkup() {
        return '<span class="u-display--none like-counter" data-js-like-counter></span>'
    }
}

export default LikedCounter;

export function initializeLikedCounter(likeStorage: StorageInterface) {
    const counterIcons = document.querySelectorAll('[data-js-like-icon-counter]');
    if (counterIcons.length === 0) { return };

    const likeCounterInstance = new LikedCounter(likeStorage, [...counterIcons]);
    window.addEventListener('likedPostsLengthUpdated', (e: Event) => {
        likeCounterInstance.updateCounter();
    });
}