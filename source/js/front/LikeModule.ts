import LikedPostsApiUrlBuilder from "./helpers/likedPostsApiUrlBuilder";
import LikedPostsStructurer from "./helpers/likedPostsStructurer";
import { LikedPostsMeta, LikedPosts, WpApiSettings } from "./like-posts";
import StorageInterface from "./storage/storageInterface";

class LikeModule {
    private displayNoneClass: string = 'u-display--none';
    private likedPosts: LikedPostsMeta;
	constructor(
        private wpApiSettings: WpApiSettings,
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
            const apiUrl = JSON.parse(decodedSharedPosts);

            if (typeof apiUrl === 'string' && apiUrl.length > 0) {
                this.fetchPosts(apiUrl);
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

        const apiUrl = this.likedPostsApiUrlBuilder.build(
            this.likedPosts,
            this.postAppearance,
            this.postTypesToShow
        );

        this.fetchPosts(apiUrl);
	}

    private fetchPosts(apiUrl: string): void {
        fetch(
            apiUrl,
            {
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'X-WP-NONCE': this.wpApiSettings?.nonce ?? '',
                }
            }
        )
            .then(response => {
                if (!response.ok) {
                    throw new Error('Failed to fetch post');
                }
                return response.json();
            })
            .then(postsMarkup => {
                this.handleFetched(postsMarkup);
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
