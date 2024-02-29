import { Components } from "./components";
import { getLikedPostsFromLocalStorage, decodeLikedPosts } from "./helpers/likeHelpers";
import { LikedPost } from "./likedPost";
import { Post } from "./post";
import Render from "./render";

declare const likedPosts: {
	pageUrl: string
}

class GetPosts {
	components: Components;
	posts: Post[] | null;

	constructor(components: Components) {
		this.getPosts();
		this.posts = null;
		this.components = components;
	}

	private getPosts() {
		if (!document.querySelector('[js-like-container]')) {
			return;
		}

		if (this.posts) {
			return this.renderPosts();
		}

		// Get the liked posts from the GET-parameter (if it is set)
		let items: { [key: string]: LikedPost[] } = {};
		const urlParams = new URLSearchParams(window.location.search);
		const encodedLikedPosts = urlParams.get('liked-posts');
		if (encodedLikedPosts) {
			items = this.handleEndpoints(decodeLikedPosts(encodedLikedPosts));
		} else {
			items = this.handleEndpoints();
		}
		const wantedPostTypes = this.getContainersPostTypes();

		let urls: string[] = [];
		if (items) {
			for (const key in items) {
				if (items.hasOwnProperty(key) && wantedPostTypes.includes(key)) {
					urls.push(this.getUrls(key, items[key]));
				}
			}
		}
		if (urls.length > 0) {
			this.fetchPosts(urls);
		}

		if (!this.posts && urls.length <= 0) {
			[...document.querySelectorAll('[data-js-like-preloader]')].forEach(preloader => {
				preloader.remove();
			});
			[...document.querySelectorAll('[data-js-no-posts-notice]')].forEach(notice => {
				notice.classList.remove('u-display--none');
			})
		}
	}

	private fetchPosts(urls: string[]) {
		const requests = urls.map((url) => fetch(url));
		Promise.all(requests)
			.then((responses) => {
				const jsonPromises = responses.map((response) => response.json());
				return Promise.all(jsonPromises);
			})
			.then((data) => {
				const postsArray = [].concat(...data);
				this.posts = postsArray;
				this.renderPosts();
			})
			.catch((error) => {
				console.log(error);
			});
	}

	private getUrls(key: string, ids: LikedPost[]) {
		let idString = '';
		ids.forEach((id, index) => {
			idString += id.id;
			if (index < ids.length - 1) {
				idString += ',';
			}
		});
		const endpoint = `${likedPosts.pageUrl}/wp-json/wp/v2/${key === 'post' ? 'posts' : key}?_embed&include=${idString}`;

		return endpoint;
	}

	private getContainersPostTypes() {
		const containers = document.querySelectorAll('[js-like-container]');
		let arr: string[] = [];
		containers.forEach((container) => {
			if (!container.hasAttribute('js-post-types')) {
				return;
			}
			const postTypes = JSON.parse(container.getAttribute('js-post-types') || '[]') as string[];
			postTypes.forEach((postType) => {
				if (!arr.includes(postType)) {
					arr.push(postType);
				}
			});
		});

		return arr;
	}

	/**
	 * sorts the array of liked posts in local storage based on their type (object parameter)
	 * @returns An object with the keys of the different types of posts and the values being an array
	 * of the posts of that type.
	 */
	private handleEndpoints(posts: LikedPost[] | false = false): { [key: string]: LikedPost[] } {
		if (!posts) {
			posts = getLikedPostsFromLocalStorage();
		}

		const sortedData: { [key: string]: LikedPost[] } = posts.reduce((acc, current) => {
			const typeKey = current.type.toString();
			acc[typeKey] = acc[typeKey] || [];
			acc[typeKey].push(current);
			return acc;
		}, {} as { [key: string]: LikedPost[] });

		return sortedData;
	}

	private getFeaturedImage(imageOb: { source_url?: string, media_details?: { sizes?: { medium?: { source_url?: string } } } }): string | false {
		let image: string | false = false;
		if (imageOb.source_url) {
			image = imageOb.media_details?.sizes?.medium?.source_url ?? imageOb.source_url;
		}

		return image;
	}

	private renderPosts() {
		if (this.posts) {
			const updatedPosts = this.posts.map((post) => {
				if (post._embedded?.['wp:featuredmedia']?.[0]) {
					return { ...post, image: this.getFeaturedImage(post._embedded['wp:featuredmedia'][0]) };
				}
				return post;
			}) as Post[];

			if (updatedPosts && this.components) {
				new Render(updatedPosts, this.components);
			}
		}
	}
}

export default GetPosts;
