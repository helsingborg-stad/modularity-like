import { getLikedPostLength } from "./helpers/likeHelpers";

type CounterComponent = {
    html: string;
    key: string;
}

class LikedCounter {
    counterElements: (Element | null)[];
    constructor(counterIcons: Element[], counterComponent: CounterComponent) {        
        this.counterElements = this.addCounterToIcon(counterIcons, counterComponent);
        this.updateCounter();
    }

    addCounterToIcon(counterIcons: Element[], counterComponent: CounterComponent) {
        const icons = counterIcons.map((counterIcon: Element) => { 
            counterIcon.innerHTML += counterComponent.html;
            return counterIcon.querySelector('[data-js-like-counter]');
        });
        
        return icons;
    }

    updateCounter() {
        const likedPostsLength = getLikedPostLength();
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
}

export default LikedCounter;

export function initializeLikedCounter(counterComponent: CounterComponent) {
    const counterIcons = document.querySelectorAll('[data-js-like-icon-counter]');
    if (counterIcons.length === 0) { return };

    const likeCounterInstance = new LikedCounter([...counterIcons], counterComponent);
    window.addEventListener('likedPostsLengthUpdated', (e: Event) => {
        likeCounterInstance.updateCounter();
    });
}