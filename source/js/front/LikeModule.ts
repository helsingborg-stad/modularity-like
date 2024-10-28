import { LikedPost } from "./likedPost";

declare const wpApiSettings: any;

class LikeModule {
	constructor(
        private postIds: LikedPost[],
        private postTypesToShow: Array<string>,
        private renderContainer: HTMLElement,
        private noPostsNotice: HTMLElement,
        private preLoaders: NodeListOf<HTMLElement>,

    ) {
            this.handleLikedPosts();
    }

	private handleLikedPosts(): void {
        if (!wpApiSettings) {
            console.log('wpApiSettings not found');
            return;
        }
		const urlParams = new URLSearchParams(window.location.search);
		const sharedPosts = urlParams.get('liked-posts');

        this.fetchPosts();
	}

    private fetchPosts(): void {
        fetch(`${wpApiSettings.root}like/v1/ids=${this.filterPosts(this.postIds)}?html`)
        .then(response => {
            if (!response.ok) {
                return null;
            }
            return response.json();
        }).then(posts => {
            this.handleFetched(posts);
        }).catch(error => {
            console.log(error);
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
        this.noPostsNotice.querySelector('[data-js-no-posts-notice]')?.classList.remove('u-display--none');
        this.removePreloaders();
    }

	private filterPosts(posts: LikedPost[]): string[] {
        let mappedPosts = posts
        .filter((post: LikedPost) => this.postTypesToShow.includes(post.type))
        .map((post: LikedPost) => post.id);

		return mappedPosts ?? [];
	}
}

export default LikeModule;
