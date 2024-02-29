import { Components } from "./components";
import { Post } from "./post";

class Render {
	components: Components;
	posts: Post[] | null;

	constructor(posts: Post[] | null, components: Components) {
		this.components = components;
		this.posts = posts;
		if (!this.posts || this.posts.length === 0 || !components) return;

		this.renderComponents();
	}


	private renderComponents() {
		const containers = document.querySelectorAll<HTMLElement>('[js-like-container]');

		if (containers) {
			containers.forEach((container) => {
				const component: string = container.getAttribute('js-display-as') ?? "";
				const filteredPosts = this.filterPosts(JSON.parse(container.getAttribute('js-post-types') || '[]'));
				const postColumns = container.getAttribute('js-columns') ?? 'grid-md-12';
				const emblemUrl: string | false = container.hasAttribute('js-like-emblem-url') ? container.getAttribute('js-like-emblem-url') || false : false;

				let hasPreloaders = true;
				this.handleSharedParams(container);

				filteredPosts &&
					filteredPosts.forEach((post) => {
						const childElement = document.createElement('div');
						childElement.classList.add(postColumns);
						const html = this.components[`${component}`].html
							.replace('{LIKE_POST_TITLE}', post.title?.rendered || '')
							.replace('{LIKE_POST_CONTENT}', this.handleExcerpt(post, component))
							.replace('{LIKE_POST_ID}', post.id.toString())
							.replace('{LIKE_POST_LINK}', post.link)
							.replace('{LIKE_POST_IMAGE}', this.handleImage(post, emblemUrl))
							.replace('{LIKE_POST_TYPE}', post.type)
							.replace('{LIKE_POST_CLASSES}', postColumns);
						childElement.innerHTML = html;
						container.appendChild(childElement);
						if (hasPreloaders) {
							container.querySelectorAll('.liked-posts__preloader').forEach((preloader) => {
								preloader.remove();
								hasPreloaders = false;
							});
						}
					});
			});
		} else {
			this.handlePreloaders(containers);
		}
	}

	private handleSharedParams(container: HTMLElement) {
		const parentContainer = container.closest('.like-posts__container');
		if (!parentContainer) return;
		const urlParams = new URLSearchParams(window.location.search);
		const title = parentContainer.querySelector('[data-js-liked-posts-share-title]');
		const excerpt = parentContainer.querySelector('[data-js-liked-posts-share-excerpt]');

		let listName = urlParams.get('liked-name');
		let listExcerpt = urlParams.get('liked-excerpt');

		if (title && listName) {
			title.textContent = this.controlURLParameters(listName);
			title.classList.remove('u-display--none');
		}

		if (excerpt && listExcerpt) {
			excerpt.textContent = this.controlURLParameters(listExcerpt);
			excerpt.classList.remove('u-display--none');
		}

		if (excerpt && listExcerpt || title && listName) {
			container.classList.add('u-margin__top--3');
		}
	}

	private controlURLParameters(encodedString: string) {
		let string = atob(encodedString);
		string = string.replace(/(<([^>]+)>)/gi, '');
		return string;
	}

	private handleImage(post: Post | false = false, emblemUrl: string | false) {
		if (!post) return '';

		let image = post.image ?? (emblemUrl && emblemUrl.length > 0 ? emblemUrl : '');

		return image;
	}

	private handleExcerpt(post: Post | false, component: string) {
		if (!post) return '';
		let amount;
		let excerpt = post.excerpt?.rendered ? post.excerpt.rendered : post.content?.rendered ? post.content.rendered : '';
		excerpt = excerpt.replace(/<[^>]*>/g, '');
		excerpt = excerpt.replace(/\s+/g, ' ');

		switch (component) {
			case 'collection':
				amount = 15;
				break;
			case 'card':
				amount = 25;
				break;
			default:
				amount = 25;
		}

		excerpt = excerpt.split(' ').splice(0, amount).join(' ');

		let symbol = '...';

		if (excerpt && excerpt.length) {
			if (excerpt.charAt(excerpt.length - 1) === '.') {
				symbol = '..';
			}
		}

		return excerpt ? excerpt + symbol : '';
	}

	private handlePreloaders(containers: NodeListOf<HTMLElement>) {
		containers.forEach((container) => {
			container.querySelectorAll('.liked-posts__preloader').forEach((preloader) => {
				preloader.remove();
			});
		});
	}

	private filterPosts(postTypes: string[] | undefined): Post[] {
		if (!this.posts || !postTypes) {
			return [];
		}

		const filteredPosts = this.posts.filter((post) => postTypes.includes(post.type));
		return filteredPosts;
	}
}
export default Render;
