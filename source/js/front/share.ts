import { generateEncodedLikedPostsParam } from './helpers/likeHelpers';

class Share {
    container: Element;

    constructor(container: Element) {
        this.container = container;
        
        this.init();
    }

    private init() {
        const urlParams = new URLSearchParams(window.location.search);

        const encodedLikedPosts = urlParams.get('liked-posts');
        if (!encodedLikedPosts) {
            this.renderShareLink();
        }
    }

    private renderShareLink() {
        const url = window.location.href.split('?')[0];
        const encodedLikedPostsParam = generateEncodedLikedPostsParam();

        if (!encodedLikedPostsParam) return;

        const shareLink = `${url}${encodedLikedPostsParam}`;

        const button = this.container.querySelector('button') as HTMLButtonElement;
        const dialog = this.container.querySelector('dialog');
        if (!dialog) return;

        const urlField = dialog.querySelector('[data-js-like-share-url]') as HTMLInputElement;
        const nameField = dialog.querySelector('[data-js-like-share-name]') as HTMLInputElement;
        const excerptField = dialog.querySelector('[data-js-like-share-excerpt]') as HTMLInputElement;

        urlField.value = shareLink;
        nameField.addEventListener('input', this.updateShareLink.bind(this, urlField, nameField, excerptField));
        excerptField.addEventListener('input', this.updateShareLink.bind(this, urlField, nameField, excerptField));
        button.classList.remove('u-display--none');
    }

    private updateShareLink(urlField: HTMLInputElement, nameField: HTMLInputElement, excerptField: HTMLInputElement) {
        const newName = btoa(nameField.value);
        const newExcerpt = btoa(excerptField.value);
        const url = new URL(urlField.value);

        if (url) {
            url.searchParams.set('liked-name', newName);
            url.searchParams.set('liked-excerpt', newExcerpt);

            if (!newName) {
                url.searchParams.delete('liked-name');
            }

            if (!newExcerpt) {
                url.searchParams.delete('liked-excerpt');
            }
        }

        urlField.value = url.href;
    }
}

export default Share;