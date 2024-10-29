import StorageInterface from './storage/storageInterface';

class Share {
    private sharedParamKey: string = 'liked-posts';
    private displayNoneClass: string = 'u-display--none';

    constructor(
        private likeStorage: StorageInterface, 
        private shareButton: HTMLButtonElement,
        private urlField: HTMLInputElement,
        private nameField: HTMLInputElement,
        private excerptField: HTMLInputElement,
    ) {        
        const urlParams = new URLSearchParams(window.location.search);

        const encodedLikedPosts = urlParams.get(this.sharedParamKey);
        if (!encodedLikedPosts) {
            this.renderShareLink();
        }
    }

    private renderShareLink() {
        const url = window.location.href.split('?')[0];
        const encodedLikedPostsParam = this.generateEncodedLikedPostsParam();

        if (!encodedLikedPostsParam) return;

        const shareLink = `${url}${encodedLikedPostsParam}`;

        this.urlField.value = shareLink;
        this.nameField.addEventListener('input', this.updateShareLink.bind(this, this.urlField, this.nameField, this.excerptField));
        this.excerptField.addEventListener('input', this.updateShareLink.bind(this, this.urlField, this.nameField, this.excerptField));

        this.shareButton.classList.remove(this.displayNoneClass);
    }

    private generateEncodedLikedPostsParam() {
        const likedPosts = this.likeStorage.get();
        if (Object.keys(likedPosts).length == 0) {
            return false;
        }
    
        let compactLikedPosts: { [key: string]: string[] } = {};

        for (const postId in likedPosts) {
            const postType = likedPosts[postId];
            if (!compactLikedPosts[postType]) {
                compactLikedPosts[postType] = [];
            }
            compactLikedPosts[postType].push(postId);
        }
    
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