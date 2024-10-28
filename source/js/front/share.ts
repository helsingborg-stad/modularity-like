import StorageInterface from './storage/storageInterface';

class Share {
    constructor(private likeStorage: StorageInterface, private container: Element) {        
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
        const encodedLikedPostsParam = this.generateEncodedLikedPostsParam();

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

    private generateEncodedLikedPostsParam() {
        const likedPosts = this.likeStorage.get();
        if (likedPosts.length == 0) {
            return false;
        }
    
        const compactLikedPosts = likedPosts.reduce((acc, post) => {
            if (!acc[post.type]) {
                acc[post.type] = [];
            }
            acc[post.type].push(post.id);
            return acc;
        }, {} as { [key: string]: string[] });
    
        const encodedLikedPosts = btoa(JSON.stringify(compactLikedPosts));
    
        return '?liked-posts=' + encodedLikedPosts;
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