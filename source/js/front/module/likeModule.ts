import LikedPostsApiUrlBuilder from "../helpers/likedPostsApiUrlBuilder";
import { LikedPostsMeta, LikedPosts, WpApiSettings } from "../like-posts";
import StorageInterface from "../storage/storageInterface";

class LikeModule {
    private displayNoneClass: string = 'u-display--none';
    private likedPosts: LikedPostsMeta;
	constructor(
        private wpApiSettings: WpApiSettings,
        private likeStorage: StorageInterface,
        private sharedPosts: string|null,
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

    /**
     * Handles liked posts for the current user/session.
     */
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

    /**
     * Fetches posts from the API and handles the response.
     * @param apiUrl - The API URL to fetch posts from.
     */
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


    /**
     * Handles the fetched posts markup and updates the DOM.
     * @param posts - The HTML markup for the posts.
     */
    private handleFetched(posts: string): void {
        if (!posts || typeof posts !== 'string') {
            this.noPostsFound();
            return;
        }

        this.removePreloaders();
        this.renderContainer.innerHTML = posts;
    }

    /**
     * Removes all preloader elements from the DOM.
     */
    private removePreloaders() {
        this.preLoaders.forEach((preloader) => {
            preloader.remove();
        });
    }

    /**
     * Handles the case when no posts are found.
     */
    private noPostsFound() {
        this.noPostsNotice.classList.remove(this.displayNoneClass);
        this.removePreloaders();
    }
}

export default LikeModule;
