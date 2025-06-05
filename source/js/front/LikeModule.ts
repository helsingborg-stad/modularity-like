import LikedPostsApiUrlBuilder from "./helpers/likedPostsApiUrlBuilder";
import LikedPostsStructurer from "./helpers/likedPostsStructurer";
import { LikedPostsMeta, LikedPosts, WpApiSettings } from "./like-posts";
import StorageInterface from "./storage/storageInterface";

class LikeModule {
    private displayNoneClass: string = 'u-display--none';
    private likedPosts: LikedPostsMeta;
	constructor(
        private likeStorage: StorageInterface,
        private sharedPosts: string|null,
        private likedPostsStructurer: LikedPostsStructurer,
        private likedPostsApiUrlBuilder: LikedPostsApiUrlBuilder,
        private postTypesToShow: Array<string>,
        private postAppearance: string,
        private renderContainer: HTMLElement,
        private noPostsNotice: HTMLElement,
        private preLoaders: NodeListOf<HTMLElement>,

    ) {
        this.likedPosts = this.likeStorage.get();
        if (this.sharedPosts) {
            const decodedSharedPosts = atob(this.sharedPosts);
            const apiUrls = JSON.parse(decodedSharedPosts);

            if (Array.isArray(apiUrls) && apiUrls.length > 0) {
                this.fetchPosts(apiUrls);
            } else {
                console.error('Invalid shared posts data:', this.sharedPosts);
                this.noPostsFound();
            }
        } else {
            this.handleLikedPosts();
        }
    }

	private handleLikedPosts(): void {
        if (Object.keys(this.likedPosts).length <= 0) {
            this.noPostsFound();
            return;
        }

        const apiUrls = this.likedPostsApiUrlBuilder.build(
            this.likedPostsStructurer.structure(this.likedPosts),
            this.postAppearance,
            this.postTypesToShow
        );

        this.fetchPosts(apiUrls);
	}

    private fetchPosts(apiUrls: string[]): void {
        Promise.all(apiUrls.map(url => fetch(url)))
            .then(responses => {
                if (!responses.every(response => response.ok)) {
                    throw new Error('Failed to fetch some posts');
                }

                return Promise.all(responses.map(response => response.json()));
            })
            .then(postsMarkupArray => {
                const combinedMarkup = postsMarkupArray.flat().join('');
                this.handleFetched(combinedMarkup);
            })
            .catch(error => {
                console.error('Fetch error:', error);
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
}

export default LikeModule;
