import { LikedPosts, WpApiSettings } from "./like-posts";

class LikeModule {
    private displayNoneClass: string = 'u-display--none';
	constructor(
        private wpApiSettings: WpApiSettings,
        private postIds: LikedPosts,
        private postTypesToShow: Array<string>,
        private renderContainer: HTMLElement,
        private noPostsNotice: HTMLElement,
        private preLoaders: NodeListOf<HTMLElement>,

    ) {
        this.handleLikedPosts();
    }

	private handleLikedPosts(): void {
        if (!this.wpApiSettings) {
            console.error('wpApiSettings not found.');
            this.noPostsFound();
            return;
        }

        this.fetchPosts();
	}

    private fetchPosts(): void {
        fetch(`${this.wpApiSettings.root}like/v1/ids=${this.getFilteredPostIds()}?html`)
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to fetch posts');
            }
            return response.json();
        }).then(posts => {
            this.handleFetched(posts);
        }).catch(error => {
            console.error(error);
            this.noPostsFound();
        });
    }

    private handleFetched(posts: string): void {
        if (!posts || typeof posts !== 'string') {
            this.noPostsFound();
            return;
        }

        this.removePreloaders();
        this.renderContainer.innerHTML = posts;
    }

    private removePreloaders() {
        this.preLoaders.forEach((preloader) => {
            preloader.remove();
        });
    }

    private noPostsFound() {
        this.noPostsNotice.classList.remove(this.displayNoneClass);
        this.removePreloaders();
    }

	private getFilteredPostIds(): string[] {
        let filteredPostIds = [];
        for (const likedPost of Object.keys(this.postIds)) {
            if (this.postTypesToShow.includes(this.postIds[likedPost])) {
                filteredPostIds.push(likedPost);
            }
        }

        return filteredPostIds;
	}
}

export default LikeModule;
