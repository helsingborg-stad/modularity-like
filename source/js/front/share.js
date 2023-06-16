import { generateEncodedLikedPostsParam } from './helpers/likeHelpers';

class Share {
    constructor(container) {
        this.container = container;

        if (!container) return;
        
        this.init();
    }

    init() {
        const urlParams = new URLSearchParams(window.location.search);

        const encodedLikedPosts = urlParams.get('liked-posts');
        if (!encodedLikedPosts) {
            this.renderShareLink();
        }
    }

    renderShareLink() {
        const url = window.location.href.split('?')[0];
        const encodedLikedPostsParam = generateEncodedLikedPostsParam();

        if (!encodedLikedPostsParam) return;

        const shareLink = `${url}${encodedLikedPostsParam}`;

            const button = this.container.querySelector('button');
            const dialog = this.container.querySelector('dialog');
            const urlField = dialog.querySelector('[data-js-like-share-url]');
            const nameField = dialog.querySelector('[data-js-like-share-name]');
            const excerptField = dialog.querySelector('[data-js-like-share-excerpt]');

            urlField.value = shareLink;

            nameField.addEventListener('input', this.updateShareLink.bind(this, urlField, nameField, excerptField));
            excerptField.addEventListener('input', this.updateShareLink.bind(this, urlField, nameField, excerptField));
            button.classList.remove('u-display--none');
    }

    updateShareLink(urlField, nameField, excerptField) {
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

        urlField.value = url;
    }
}

export function initializeShare() {
    const containers = document.querySelectorAll('.like-posts__container');

    containers.forEach(container => {
        new Share(container);
    });
}

export default Share;