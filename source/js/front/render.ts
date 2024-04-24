import { Components } from "./components";
import { Post } from "./post";

class Render {
	components: Components;
	posts: Post[] | null;

	constructor(posts: Post[] | null, components: Components, private container: HTMLElement) {
		this.components = components;
		this.posts = posts;

		if (!this.posts || this.posts.length === 0 || !components) return;

		this.renderComponents();
	}

	private renderComponents() {
		const containers = this.container.querySelectorAll('[js-like-container]');

		if (containers) {
			containers.forEach((container) => {
				const component: string = container.getAttribute('js-display-as') ?? "";
				const postColumns = container.getAttribute('js-columns') ?? 'grid-md-12';
				const emblemUrl: string | false = container.hasAttribute('js-like-emblem-url') ? container.getAttribute('js-like-emblem-url') || false : false;

				let hasPreloaders = true;
				this.handleSharedParams(container as HTMLElement);

				this.posts &&
					this.posts.forEach((post) => {
						const childElement = document.createElement('div');
						childElement.classList.add(postColumns);
						const html = this.components[`${component}`].html
							.replace('{LIKE_POST_TITLE}', post.postTitle)
							.replace('{LIKE_POST_CONTENT}', post.excerptShorter)
							.replace('{LIKE_POST_ID}', post.id.toString())
							.replace('{LIKE_POST_LINK}', post.permalink)
							.replace('{LIKE_POST_IMAGE}', post.images['thumbnail1:1']?.src ? post.images['thumbnail1:1'].src : (emblemUrl ?? ''))
							.replace('{LIKE_POST_TYPE}', post.postType)
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
		const urlParams = new URLSearchParams(window.location.search);
		const title = this.container.querySelector('[data-js-liked-posts-share-title]');
		const excerpt = this.container.querySelector('[data-js-liked-posts-share-excerpt]');

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

	private handlePreloaders(containers: NodeListOf<HTMLElement>) {
		containers.forEach((container) => {
			container.querySelectorAll('.liked-posts__preloader').forEach((preloader) => {
				preloader.remove();
			});
		});
	}
}
export default Render;
